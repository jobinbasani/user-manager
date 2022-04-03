const { Stack } = require('aws-cdk-lib');
const { CloudFrontWebDistribution, OriginAccessIdentity } = require('aws-cdk-lib/aws-cloudfront');
const {
  PolicyStatement,
  Group,
} = require('aws-cdk-lib/aws-iam');
const { Table, BillingMode, AttributeType } = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const cdk = require('aws-cdk-lib');

class InfraStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 'usermanager', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const bucketName = new cdk.CfnOutput(this, 'BucketName', {
      value: s3Bucket.bucketName,
      description: 'Bucket name',
    });

    const cloudFrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for User Manager website.',
    });

    const distribution = new CloudFrontWebDistribution(this, 'UserManagerCDN', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3Bucket,
            originAccessIdentity: cloudFrontOAI,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    const cdnUrl = new cdk.CfnOutput(this, 'CdnUrl', {
      value: `https://${distribution.distributionDomainName}/`,
      description: 'Cloudfront URL',
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

    const s3WebUpdateGroup = new Group(this, 'S3UserManagerWebUpdateGroup');

    s3WebUpdateGroup.addToPolicy(new PolicyStatement({
      actions: [
        's3:*',
      ],
      resources: [
        s3Bucket.bucketArn,
        `${s3Bucket.bucketArn}/*`,
      ],
    }));

    const s3WebUpdateGroupName = new cdk.CfnOutput(this, 'S3 Web update group', {
      value: s3WebUpdateGroup.groupName,
      description: 'S3 Web update group',
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
  }
}

module.exports = { InfraStack };
