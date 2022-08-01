const cdk = require('aws-cdk-lib');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const iam = require('aws-cdk-lib/aws-iam');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const cognito = require('aws-cdk-lib/aws-cognito');
const lambda = require('aws-cdk-lib/aws-lambda');
const cloudfrontOrigins = require('aws-cdk-lib/aws-cloudfront-origins');
const s3Deploy = require('aws-cdk-lib/aws-s3-deployment');
const { OpenIdConnectProvider } = require('aws-cdk-lib/aws-eks');
const { GoFunction } = require('@aws-cdk/aws-lambda-go-alpha');

class UserManagerStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const userTableName = 'UserManagerData';
    const familyIndexName = 'familyIndex';
    const emailIndexName = 'emailIndex';
    const searchIndexName = 'searchIndex';
    const ttlAttribute = 'expDate';

    const userTable = new dynamodb.Table(this, id, {
      tableName: userTableName,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'recType',
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: ttlAttribute,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: familyIndexName,
      partitionKey: {
        name: 'familyId',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: emailIndexName,
      partitionKey: {
        name: 'emailId',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: ['familyId'],
    });

    userTable.addGlobalSecondaryIndex({
      indexName: searchIndexName,
      partitionKey: {
        name: 'search',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    });

    const userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: 'user-manager-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        approved_user: new cognito.BooleanAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const standardCognitoAttributes = {
      givenName: true,
      familyName: true,
      email: true,
      emailVerified: true,
      birthdate: true,
      gender: true,
      middleName: true,
      fullname: true,
      phoneNumber: true,
      phoneNumberVerified: true,
      profilePicture: true,
      preferredUsername: true,
      lastUpdateTime: true,
    };

    const clientReadAttributes = new cognito.ClientAttributes()
      .withStandardAttributes(standardCognitoAttributes)
      .withCustomAttributes(...['approved_user']);

    const clientWriteAttributes = new cognito.ClientAttributes()
      .withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      });

    const domain = userPool.addDomain('user-pool-domain', {
      cognitoDomain: {
        domainPrefix: 'user-manager',
      },
    });

    new cognito.CfnUserPoolGroup(this, 'AdminsGroup', {
      groupName: 'admin',
      userPoolId: userPool.userPoolId,
      description: 'Members of this group can perform all actions',
    });

    const jwksUrl = new cdk.CfnOutput(this, 'CognitoJWKS', {
      value: `https://cognito-idp.${cdk.Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}/.well-known/jwks.json`,
      description: 'Cognito JWKS URL',
    });

    const userManagerLambda = new GoFunction(this, 'userManagerAPIFunction', {
      description: 'User Manager REST API Lambda',
      functionName: 'userManagerAPIFunction',
      entry: `${__dirname}/../../api/lambdas/user_manager`,
      timeout: cdk.Duration.seconds(10),
      environment: {
        USERMANAGER_JWKS_URL: `https://cognito-idp.${cdk.Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}/.well-known/jwks.json`,
        USERMANAGER_USER_POOL_ID: userPool.userPoolId,
        USERMANAGER_TABLE_NAME: userTable.tableName,
        USERMANAGER_FAMILY_INDEX_NAME: familyIndexName,
        USERMANAGER_EMAIL_INDEX_NAME: emailIndexName,
        USERMANAGER_SEARCH_INDEX_NAME: searchIndexName,
      },
    });

    userManagerLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'dynamodb:PartiQLSelect',
        'dynamodb:PartiQLInsert',
        'dynamodb:PartiQLDelete',
        'dynamodb:PartiQLUpdate',
        'dynamodb:PutItem',
      ],
      resources: [
        userTable.tableArn,
        `${userTable.tableArn}/index/*`,
      ],
    }));

    userManagerLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:ListUsers',
        'cognito-idp:ListUsersInGroup',
        'cognito-idp:AdminAddUserToGroup',
        'cognito-idp:AdminRemoveUserFromGroup',
      ],
      resources: [
        userPool.userPoolArn,
      ],
    }));

    const userManagerLambdaUrl = userManagerLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      },
    });

    new cdk.CfnOutput(this, 'UserManagerLambdaUrl', {
      value: userManagerLambdaUrl.url,
      description: 'UserManager Lambda Function URL',
    });

    new cdk.CfnOutput(this, 'UserManagerLambda', {
      value: userManagerLambda.functionName,
      description: 'UserManager Lambda Function Name',
    });

    const postSignupLambda = new GoFunction(this, 'postSignupFunction', {
      description: 'Post sign up trigger',
      functionName: 'postSignupFunction',
      entry: `${__dirname}/../../api/lambdas/post_signup`,
      timeout: cdk.Duration.seconds(10),
      environment: {
        USERMANAGER_TABLE_NAME: userTable.tableName,
        USERMANAGER_EMAIL_INDEX_NAME: emailIndexName,
        USERMANAGER_APPROVED_USER_ATTRIBUTE: 'custom:approved_user',
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            'dynamodb:PartiQLSelect',
            'dynamodb:PartiQLInsert',
            'dynamodb:PartiQLDelete',
          ],
          resources: [
            userTable.tableArn,
            `${userTable.tableArn}/index/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:AdminUpdateUserAttributes',
          ],
          resources: [
            `arn:aws:cognito-idp:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:userpool/*`,
          ],
        }),
      ],
    });

    userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, postSignupLambda);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for User Manager website.',
    });

    const apiEndPointDomainName = cdk.Fn.parseDomainName(userManagerLambdaUrl.url);

    const userManagerS3Bucket = new s3.Bucket(this, 'user_manager', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3Deploy.BucketDeployment(this, 'DeployErrorPage', {
      sources: [s3Deploy.Source.data('onerror.html', `
      <!DOCTYPE html>
      <html>
          <head>
              <title>Redirecting</title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <script type="text/javascript">
              function redirect() {
                  window.location.replace(window.location.origin);
              }
              window.onload = redirect;
              </script>
          </head>
          <body>
          
          </body>
      </html>
      `)],
      destinationBucket: userManagerS3Bucket,
      destinationKeyPrefix: 'errorpage',
    });

    const bucketName = new cdk.CfnOutput(this, 'WebAppBucketName', {
      value: userManagerS3Bucket.bucketName,
      description: 'S3 Bucket that holds the web application',
    });

    const userManagerOAI = new cloudfront.OriginAccessIdentity(this, 'UserManagerOAI', {
      comment: 'OAI for User Manager website.',
    });

    userManagerS3Bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
      ],
      resources: [userManagerS3Bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(userManagerOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    const spaUrlRewriteFn = new cloudfront.Function(this, 'SPA_URL_Rewrite', {
      functionName: 'webAppUrlRewriteFunction',
      code: cloudfront.FunctionCode.fromInline(`
          function handler(event) {
              var request = event.request;
              var uri = request.uri;
              
              if (uri.length == 0){
                  var response = {
                      statusCode: 302,
                      statusDescription: 'Found',
                      headers:
                          { "location": { "value": uri+'/' } }
                  }
                  return response;
              }
              if ((uri.match(/\\//g) || []).length == 1){
                if (uri.endsWith('/')) {
                  request.uri += 'main/index.html';
                }else{
                  request.uri = '/main'+uri;
                }
              }
              // Check whether the URI is missing a file name.
              else if (uri.endsWith('/')) {
                  request.uri += 'index.html';
              }else if (uri.startsWith('/static')){
                  request.uri = '/main'+uri;
              }
              // Check whether the URI is missing a file extension.
              else if (!uri.includes('.')) {
                  var response = {
                      statusCode: 302,
                      statusDescription: 'Found',
                      headers:
                          { "location": { "value": uri+'/' } }
                  }
                  return response;
              }
          
              return request;
          }
      `),
    });

    const cloudfrontDistribution = new cloudfront.Distribution(this, 'UserManagerCDNDist', {
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(userManagerS3Bucket, {
          originAccessIdentity: userManagerOAI,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [{
          function: spaUrlRewriteFn,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      errorResponses: [
        {
          responsePagePath: '/errorpage/onerror.html',
          httpStatus: 403,
        },
      ],
    });

    const cachePolicy = new cloudfront.CachePolicy(this, 'UserManagerApiCachePolicy', {
      cachePolicyName: 'UserManagerAPI_CachePolicy',
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.seconds(1),
      defaultTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingGzip: true,
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization', 'Origin'),
    });

    const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'UserManagerAPICORSRequestPolicy', {
      originRequestPolicyName: 'UserManagerAPICORSRequestPolicy',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList('Origin'),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
    });

    cloudfrontDistribution.addBehavior('/api/*',
      new cloudfrontOrigins.HttpOrigin(apiEndPointDomainName, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      }),
      {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: {
          cachePolicyId: cachePolicy.cachePolicyId,
        },
        originRequestPolicy: {
          originRequestPolicyId: originRequestPolicy.originRequestPolicyId,
        },
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      });

    const userPoolClient = new cognito.UserPoolClient(this, 'user-manager-userpool-client', {
      userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [
          'http://localhost:3000/index.html',
          `https://${cloudfrontDistribution.distributionDomainName}/main/index.html`,
        ],
        logoutUrls: [
          'http://localhost:3000/',
          `https://${cloudfrontDistribution.distributionDomainName}/main/index.html`,
        ],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });

    new cdk.CfnOutput(this, 'CognitoSignInURL', {
      // eslint-disable-next-line max-len
      value: `${domain.baseUrl()}/oauth2/authorize?client_id=${userPoolClient.userPoolClientId}&scope=aws.cognito.signin.user.admin+openid&response_type=token&redirect_uri=`,
      description: 'Sign in URL',
    });

    new cdk.CfnOutput(this, 'CognitoSignUpURL', {
      // eslint-disable-next-line max-len
      value: `${domain.baseUrl()}/signup?client_id=${userPoolClient.userPoolClientId}&scope=aws.cognito.signin.user.admin+openid&response_type=token&redirect_uri=`,
      description: 'Signup URL',
    });

    new cdk.CfnOutput(this, 'CognitoLogoutURL', {
      value: `${domain.baseUrl()}/logout?client_id=${userPoolClient.userPoolClientId}&logout_uri=`,
      description: 'Logout URL',
    });

    const callbackUrlPath = new cdk.CfnOutput(this, 'CallbackUrlPath', {
      value: '/index.html',
      description: 'Cognito callback URL path',
    });

    const cdnUrl = new cdk.CfnOutput(this, 'CdnUrl', {
      value: `https://${cloudfrontDistribution.distributionDomainName}/`,
      description: 'Cloudfront URL',
    });

    const cdnId = new cdk.CfnOutput(this, 'CdnId', {
      value: cloudfrontDistribution.distributionId,
      description: 'Cloudfront Distribution ID',
    });

    const githubProvider = new OpenIdConnectProvider(this, 'githubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
    });

    const githubRole = new iam.Role(this, 'githubDeployRole', {
      assumedBy: new iam.WebIdentityPrincipal(githubProvider.openIdConnectProviderArn, {
        'ForAllValues:StringEquals': {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        'ForAllValues:StringLike': {
          'token.actions.githubusercontent.com:sub': 'repo:jobinbasani/user-manager:*',
        },
      }),
      roleName: 'GithubDeployRole',
      description: 'This role is used by Github actions',
    });

    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:*',
      ],
      resources: [
        userManagerS3Bucket.bucketArn,
        `${userManagerS3Bucket.bucketArn}/*`,
      ],
    }));

    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'cloudformation:DescribeStacks',
      ],
      resources: [
        '*',
      ],
    }));

    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'cloudfront:CreateInvalidation',
      ],
      resources: [
        `arn:aws:cloudfront::${cdk.Stack.of(this).account}:distribution/${cloudfrontDistribution.distributionId}`,
      ],
    }));

    githubRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'lambda:UpdateFunctionCode',
      ],
      resources: [
        userManagerLambda.functionArn,
      ],
    }));

    const githubDeployRoleName = new cdk.CfnOutput(this, 'GithubDeployRoleARN', {
      value: githubRole.roleArn,
      description: 'Role ARN to be assumed by Github',
    });
  }
}

module.exports = { UserManagerStack };
