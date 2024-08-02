import * as SwaggerParser from '@apidevtools/swagger-parser';
import * as fs from 'fs';

const distDir: string = `${__dirname}/../dist/handler`
const baseScriptFilePath: string = `${__dirname}/handler.py`

async function buildHandler(): Promise<void> {
    const openApi: any = await SwaggerParser.dereference('./openapi.yaml')
    Object.entries(openApi.paths).forEach(([ path ]) => {
        Object.entries(openApi.paths[path]).forEach(async([ method ]) => {
            const funcName: string = openApi.paths[path][method]["operationId"] || "";
            const copyFileDir: string = `${distDir}/${funcName}`;
            fs.readdir(copyFileDir, async function(err, list) {
                if (err) {
                    await fs.promises.mkdir(copyFileDir, {recursive: true});
                }
            })
            const copyFilePath = `${copyFileDir}/index.py`
            if (!fs.existsSync(copyFilePath)) {
                await fs.promises.copyFile(baseScriptFilePath, copyFilePath)
            }
        })
    })
}
buildHandler();