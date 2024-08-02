import * as SwaggerParser from '@apidevtools/swagger-parser';

const distDir: string = `${__dirname}/../dist/handler`
const baseScriptFilePath: string = `${__dirname}/handler.py`

async function preBuildHandler(): Promise<void> {
    var noOperationIdLlist: string[] = []
    const openApi: any = await SwaggerParser.dereference('./openapi.yaml')
    Object.entries(openApi.paths).forEach(([ path ]) => {
        Object.entries(openApi.paths[path]).forEach(async([ method ]) => {
            if ("operationId" in openApi.paths[path][method]) {
                return;
            } else {
                noOperationIdLlist.push(`${path}/${method} doesn't have operationId`);
            }
        })
    })

    if (noOperationIdLlist.length > 0) {
        console.log(noOperationIdLlist.join("\n"));
        throw new Error("operationId is not defined");
    }

    console.log("Pre build check passed")
}
preBuildHandler();