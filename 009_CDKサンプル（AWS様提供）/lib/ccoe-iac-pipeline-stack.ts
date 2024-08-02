import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import { ApiProps } from './ccoe-iac-cdk-stack';
import { CcoeIacStageStack } from './ccoe-iac-stage-stack';

export default class CcoeIacPipelineStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id, props);

        const repo = new codecommit.Repository(this, 'ApiGateway-Pipeline-Repo', {
            repositoryName: 'ccoe-deploy-sample',
            description: 'ApiGateway-Pipeline-Repo',
        });

        const pipeline = new CodePipeline(this, 'ApiGateway-Pipeline', {
            pipelineName: 'ApiGateway-Pipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.codeCommit(repo, 'main'),
                installCommands: [
                    'npm install -g aws-cdk',
                    'npm install -g npm'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            }),
        });

        const deploy = new CcoeIacStageStack(this, 'ApiGateway-Prod', props);
        const stage = pipeline.addStage(deploy);

        stage.addPost(new CodeBuildStep('TestViewBuild', {
            projectName: 'ViewBuild',
            envFromCfnOutputs: {
                ENDPOINT_URL: deploy.APIEndpoint
            },
            commands: [
                'curl "${ENDPOINT_URL}"'
            ]
        }));
    }
}

