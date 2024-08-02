import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CfnApi, CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface ApiProps extends cdk.StackProps {
  openApi: any
}

interface IntegrationSetting {
  readonly type: string
  readonly httpMethod: string
  readonly uri: string
  readonly payloadFormatVersion: string
}

export class CcoeIacCdkStack extends cdk.Stack {
  public readonly APIEndpoint: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const api = new CfnApi(this, 'httpApi', {
      body: props.openApi
    })

    new CfnStage(this, 'api-dev', {
      apiId: api.ref,
      stageName: '$default',
      autoDeploy: true,
    })

    Object.entries(props.openApi.paths).forEach(([ path ]) => {
      Object.entries(props.openApi.paths[path]).forEach(([ method ]) => {
        
        const funcName: string = props.openApi.paths[path][method]["operationId"] || cdk.Names.uniqueResourceName

        const myFunction = new Function(this, funcName, {
          code: Code.fromAsset(`dist/handler/${funcName}`),
          handler: 'index.handler',
          runtime: Runtime.PYTHON_3_12
        })
    
        const integrationSetting: IntegrationSetting = {
          type: 'AWS_PROXY',
          httpMethod: 'POST',
          uri: myFunction.functionArn,
          payloadFormatVersion: '2.0'
        }

        props.openApi.paths[path][method]['x-amazon-apigateway-integration'] = integrationSetting

        myFunction.addPermission(
          'myFunctionPermission',
          {
            principal: new ServicePrincipal('apigateway.amazonaws.com'),
            action: 'lambda:InvokeFunction',
            sourceArn: `arn:aws:execute-api:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:${api.ref}/*/*/*`
          }
        )
      })
    })

    this.APIEndpoint = new cdk.CfnOutput(this, 'HTTP API Url', {
      value: api.attrApiEndpoint ?? 'Something went wrong with the deploy',
      exportName: 'HttpEndpoint'
    })
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CcoeIacCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
