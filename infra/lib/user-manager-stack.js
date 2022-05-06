const cdk = require('aws-cdk-lib');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const iam = require('aws-cdk-lib/aws-iam');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const cognito = require('aws-cdk-lib/aws-cognito');
const lambda = require('aws-cdk-lib/aws-lambda');
const { OpenIdConnectProvider } = require('aws-cdk-lib/aws-eks');
const { GoFunction } = require('@aws-cdk/aws-lambda-go-alpha');
const {
  S3Origin,
  HttpOrigin,
} = require('aws-cdk-lib/aws-cloudfront-origins');

class UserManagerStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const userTable = new dynamodb.Table(this, id, {
      tableName: 'UserDetails',
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 2,
      writeCapacity: 2,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'familyIndex',
      partitionKey: {
        name: 'family_id',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
      readCapacity: 2,
      writeCapacity: 2,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'emailIndex',
      partitionKey: {
        name: 'email_id',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
      readCapacity: 2,
      writeCapacity: 2,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'subIndex',
      partitionKey: {
        name: 'sub',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
      readCapacity: 2,
      writeCapacity: 2,
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

    const userManagerLambda = new GoFunction(this, 'userManagerLambda', {
      entry: `${__dirname}/../../api/lambdas/user_manager`,
      timeout: cdk.Duration.seconds(10),
      environment: {
        USERMANAGER_JWKS_URL: `https://cognito-idp.${cdk.Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}/.well-known/jwks.json`,
        USERMANAGER_USER_POOL_ID: userPool.userPoolId,
        USERMANAGER_TABLE_NAME: userTable.tableName,
      },
    });

    userManagerLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:Query',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:BatchGetItem',
        'dynamodb:BatchWriteItem',
        'dynamodb:ConditionCheckItem',
      ],
      resources: [
        userTable.tableArn,
      ],
    }));

    userManagerLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:ListUsers',
      ],
      resources: [
        userPool.userPoolArn,
      ],
    }));

    const userManagerLambdaUrl = userManagerLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Origin',
          'Accept',
          'X-Requested-With',
          'Content-Type',
          'Access-Control-Request-Method',
          'Access-Control-Request-Headers',
        ],
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
              
              // Check whether the URI is missing a file name.
              if (uri.endsWith('/')) {
                  request.uri += 'index.html';
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
        origin: new S3Origin(userManagerS3Bucket, {
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
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
    });

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'UserManagerAPICORSResponseHeadersPolicy', {
      responseHeadersPolicyName: 'UserManagerAPICORSResponseHeadersPolicy',
      corsBehavior: {
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ['*'],
        accessControlAllowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'HEAD', 'OPTIONS'],
        accessControlAllowOrigins: ['*'],
        originOverride: true,
      },
    });

    cloudfrontDistribution.addBehavior('/api/*',
      new HttpOrigin(apiEndPointDomainName, {
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
        responseHeadersPolicy: {
          responseHeadersPolicyId: responseHeadersPolicy.responseHeadersPolicyId,
        },
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      });

    const userPoolClient = new cognito.UserPoolClient(this, 'user-manager-userpool-client', {
      userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [
          'http://localhost:3000/callback',
          'http://localhost:3000/index.html',
          `https://${cloudfrontDistribution.distributionDomainName}/main/index.html`,
          `https://${cloudfrontDistribution.distributionDomainName}/front-end/index.html`,
          `https://${cloudfrontDistribution.distributionDomainName}/login-path/index.html`,
        ],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });

    const signInUrl = new cdk.CfnOutput(this, 'CognitoSignInURL', {
      // eslint-disable-next-line max-len
      value: `${domain.baseUrl()}/oauth2/authorize?client_id=${userPoolClient.userPoolClientId}&scope=aws.cognito.signin.user.admin+openid&response_type=token&redirect_uri=`,
      description: 'Sign in URL',
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
