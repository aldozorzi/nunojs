import fs from 'fs';
import Configstore from 'configstore';
import { checkModel } from './lib/checkModel.js';
import { Format } from './lib/format.js';

export async function ollamaServer(server:string)
{
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const config = new Configstore(packageJson.name);
    try{
        server = server.replace(/\/$/, "");
        config.set('ollamaServer',server);
        Format.success(`Ollama server model set to ${server}`);
    }catch (e:any)
    {
        Format.error(e.toString());
    }
        

}