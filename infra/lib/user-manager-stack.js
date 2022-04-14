const {
  Stack,
  Duration,
} = require('aws-cdk-lib');
const {
  CloudFrontWebDistribution, OriginAccessIdentity,
  OriginProtocolPolicy, CloudFrontAllowedMethods,
} = require('aws-cdk-lib/aws-cloudfront');
const {
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} = require('aws-cdk-lib/aws-iam');
const { Table, BillingMode, AttributeType } = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const cdk = require('aws-cdk-lib');
const { OpenIdConnectProvider } = require('aws-cdk-lib/aws-eks');
const { GoFunction } = require('@aws-cdk/aws-lambda-go-alpha');
const { LambdaRestApi } = require('aws-cdk-lib/aws-apigateway');
const {
  UserPool,
  StringAttribute,
  AccountRecovery,
  ClientAttributes,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} = require('aws-cdk-lib/aws-cognito');

class UserManagerStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'usermanager', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const bucketName = new cdk.CfnOutput(this, 'WebAppBucketName', {
      value: s3Bucket.bucketName,
      description: 'S3 Bucket that holds the web application',
    });

    const userTable = new Table(this, id, {
      tableName: 'UserDetails',
      billingMode: BillingMode.PROVISIONED,
      partitionKey: {
        name: 'email',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'rec_type',
        type: AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'familyIndex',
      partitionKey: {
        name: 'family_id',
        type: AttributeType.STRING,
      },
    });

    const userPool = new UserPool(this, 'userpool', {
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
        isAdmin: new StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: true,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
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

    const clientReadAttributes = new ClientAttributes()
      .withStandardAttributes(standardCognitoAttributes)
      .withCustomAttributes(...['isAdmin']);

    const clientWriteAttributes = new ClientAttributes()
      .withStandardAttributes({
        ...standardCognitoAttributes,
        emailVerified: false,
        phoneNumberVerified: false,
      });

    const userPoolClient = new UserPoolClient(this, 'user-manager-userpool-client', {
      userPool,
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [
          'http://localhost:3000/callback',
        ],
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
      ],
      readAttributes: clientReadAttributes,
      writeAttributes: clientWriteAttributes,
    });

    const domain = userPool.addDomain('user-pool-domain', {
      cognitoDomain: {
        domainPrefix: 'user-manager',
      },
    });

    const signInUrl = new cdk.CfnOutput(this, 'CognitoSignInURL', {
      // eslint-disable-next-line max-len
      value: `${domain.baseUrl()}/oauth2/authorize?client_id=${userPoolClient.userPoolClientId}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=openid&response_type=token`,
      description: 'Sign in URL',
    });

    const jwksUrl = new cdk.CfnOutput(this, 'CognitoJWKS', {
      value: `https://cognito-idp.${Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}/.well-known/jwks.json`,
      description: 'Cognito JWKS URL',
    });

    const userManagerLambda = new GoFunction(this, 'userManagerLambda', {
      entry: `${__dirname}/../../api/lambdas/user_manager`,
      timeout: Duration.seconds(10),
      environment: {
        USERMANAGER_JWKS_URL: `https://cognito-idp.${Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}/.well-known/jwks.json`,
      },
    });

    userManagerLambda.addToRolePolicy(new PolicyStatement({
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

    const userManagerLambdaName = new cdk.CfnOutput(this, 'UserManagerLambda', {
      value: userManagerLambda.functionName,
      description: 'UserManager Lambda Function Name',
    });

    const userManagerApiGateway = new LambdaRestApi(this, 'userManagerApiGateway', {
      handler: userManagerLambda,
      proxy: true,
    });

    const userManagerApiGatewayUrl = new cdk.CfnOutput(this, 'UserManagerApiGatewayURL', {
      value: userManagerApiGateway.url,
      description: 'userManager ApiGateway URL',
    });

    const cloudFrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for User Manager website.',
    });

    const apiEndPointDomainName = cdk.Fn.parseDomainName(userManagerApiGateway.url);

    const distribution = new CloudFrontWebDistribution(this, 'UserManagerCDN', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3Bucket,
            originAccessIdentity: cloudFrontOAI,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
        {
          customOriginSource: {
            domainName: apiEndPointDomainName,
            originProtocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
          },
          behaviors: [
            {
              pathPattern: '/api/*',
              allowedMethods: CloudFrontAllowedMethods.ALL,
            },
          ],
        },
      ],
      defaultRootObject: 'main/index.html',
    });

    const cdnUrl = new cdk.CfnOutput(this, 'CdnUrl', {
      value: `https://${distribution.distributionDomainName}/`,
      description: 'Cloudfront URL',
    });

    const cdnId = new cdk.CfnOutput(this, 'CdnId', {
      value: distribution.distributionId,
      description: 'Cloudfront Distribution ID',
    });

    const cloudfrontS3Access = new PolicyStatement({
      actions: [
        's3:GetBucket*',
        's3:GetObject*',
        's3:List*',
      ],
      resources: [
        s3Bucket.bucketArn,
        `${s3Bucket.bucketArn}/*`,
      ],
    });

    cloudfrontS3Access.addCanonicalUserPrincipal(
      cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
    );

    s3Bucket.addToResourcePolicy(cloudfrontS3Access);

    const githubProvider = new OpenIdConnectProvider(this, 'githubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
    });

    const githubRole = new Role(this, 'githubDeployRole', {
      assumedBy: new WebIdentityPrincipal(githubProvider.openIdConnectProviderArn, {
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

    githubRole.addToPolicy(new PolicyStatement({
      actions: [
        's3:*',
      ],
      resources: [
        s3Bucket.bucketArn,
        `${s3Bucket.bucketArn}/*`,
      ],
    }));

    githubRole.addToPolicy(new PolicyStatement({
      actions: [
        'cloudformation:DescribeStacks',
      ],
      resources: [
        '*',
      ],
    }));

    githubRole.addToPolicy(new PolicyStatement({
      actions: [
        'cloudfront:CreateInvalidation',
      ],
      resources: [
        `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${distribution.distributionId}`,
      ],
    }));

    githubRole.addToPolicy(new PolicyStatement({
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
