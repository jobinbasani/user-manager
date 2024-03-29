#!/usr/bin/env node

require('dotenv').config();

const cdk = require('aws-cdk-lib');
const { UserManagerStack } = require('../lib/user-manager-stack');

const app = new cdk.App();
const stack = new UserManagerStack(app, 'UserManagerStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
cdk.Tags.of(stack).add('app', 'hfxchurch');
