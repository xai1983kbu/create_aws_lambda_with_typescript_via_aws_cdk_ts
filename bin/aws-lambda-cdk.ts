#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsLambdaCdkStack } from '../lib/aws-lambda-cdk-stack';

const app = new cdk.App();
new AwsLambdaCdkStack(app, 'AwsLambdaCdkStack');
