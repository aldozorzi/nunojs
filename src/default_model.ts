import fs from 'fs';
import Configstore from 'configstore';
import { checkModel } from './lib/checkModel.js';
import { Format } from './lib/format.js';

export async function defaultModel(model:string)
{
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const config = new Configstore(packageJson.name);
    if(await checkModel(model))
        {
            config.set('defaultModel',model);
            Format.success(`Default model set to ${model}`);
        }
        
    else 
        Format.error('Model not valid: select a model available in --list_models');
}