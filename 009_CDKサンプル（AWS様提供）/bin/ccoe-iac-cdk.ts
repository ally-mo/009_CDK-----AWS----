#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as SwaggerParser from '@apidevtools/swagger-parser';
import CcoeIacPipelineStack from '../lib/ccoe-iac-pipeline-stack';

async function createApp(): Promise<cdk.App> {
  const app = new cdk.App();
  const openApi: any = await SwaggerParser.dereference('./openapi.yaml')
  new CcoeIacPipelineStack(app, 'CcoeIacPipelineStack', {
    openApi: openApi
  });
  return app;
}
createApp();