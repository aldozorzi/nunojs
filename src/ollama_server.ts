import fs from 'fs';
import Configstore from 'configstore';
import { Format } from './lib/format.js';

export async function ollamaServer(server: string | true) {
    if(server === true) server = '';
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const config = new Configstore(packageJson.name);
    try {
        
        if (server != '' ){
            server = server.replace(/\/$/, "");
            config.set('ollamaServer', server);
        }
        else{
            config.delete('ollamaServer');
        }
        
        Format.success(server == '' ? 'Ollama server cleared' : `Ollama server model set to ${server}`);
    } catch (e: any) {
        Format.error(e.toString());
    }


}