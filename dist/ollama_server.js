var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import Configstore from 'configstore';
import { Format } from './lib/format.js';
export function ollamaServer(server) {
    return __awaiter(this, void 0, void 0, function* () {
        if (server === true)
            server = '';
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const config = new Configstore(packageJson.name);
        try {
            if (server != '') {
                server = server.replace(/\/$/, "");
                config.set('ollamaServer', server);
            }
            else {
                config.delete('ollamaServer');
            }
            Format.success(server == '' ? 'Ollama server cleared' : `Ollama server model set to ${server}`);
        }
        catch (e) {
            Format.error(e.toString());
        }
    });
}
//# sourceMappingURL=ollama_server.js.map