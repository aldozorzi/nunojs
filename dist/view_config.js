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
export function viewConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const config = new Configstore(packageJson.name);
        for (let key in config.all) {
            process.stdout.write(`${Format.infoColor(key)}: ${config.get(key)}\n`);
        }
    });
}
//# sourceMappingURL=view_config.js.map