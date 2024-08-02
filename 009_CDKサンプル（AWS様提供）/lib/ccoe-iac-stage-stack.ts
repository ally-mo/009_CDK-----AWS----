import { Stage } from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { CcoeIacCdkStack, ApiProps } from "./ccoe-iac-cdk-stack";

export class CcoeIacStageStack extends Stage {
    public readonly APIEndpoint: CfnOutput;
    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id, props);
        const app = new CcoeIacCdkStack(this, 'Dev', props);
        this.APIEndpoint = app.APIEndpoint;
    }
}