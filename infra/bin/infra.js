#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { UserManagerStack } = require('../lib/user-manager-stack');

const app = new cdk.App();
const stack = new UserManagerStack(app, 'UserManagerStack');
cdk.Tags.of(stack).add('app', 'hfxchurch');
