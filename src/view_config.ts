import fs from 'fs';
import Configstore from 'configstore';
import { Format } from './lib/format.js';

export async function viewConfig() {

    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const config = new Configstore(packageJson.name);
    
    for (let key in config.all){
        process.stdout.write(`${Format.infoColor(key)}: ${config.get(key)}\n`);
    }


}