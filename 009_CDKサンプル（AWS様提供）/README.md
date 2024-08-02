# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   openapiの内容を読んでsrc/handler.pyをdist/handler/{関数名}のディレクトリを作りコピー
* `npm run watch`   watch for changes and compile(未使用)
* `npm run test`    perform the jest unit tests（テスト実装前）
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## 使い方
* openapi.yamlにAPI定義を作成し、所定（現状階層TOP）を作成
* `npm run build` を実行することで、openapi.yamlに記載されたAPIに該当するLambdaを作成（作成されるLambdaはdummyなので、必要に応じて実装が必要）
* `npx cdk deploy` で環境へデプロイ

## CICD
* `npx cdk deploy` を行うことで、AWS CodePipeline が作成されるので、以降は 対象リポジトリへプロジェクトをGIT PUSHするだけでdeployが実行される
