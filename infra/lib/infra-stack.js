const { Stack } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cdk = require('aws-cdk-lib');

class InfraStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
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

    const bucketArn = new cdk.CfnOutput(this, 'BucketArn', {
      value: s3Bucket.bucketArn,
      description: 'Bucket ARN',
    });
  }
}

module.exports = { InfraStack };
