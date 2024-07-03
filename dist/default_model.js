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
import { checkModel } from './list_models.js';
import { Format } from './lib/format.js';
export function defaultModel(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const config = new Configstore(packageJson.name);
        if (yield checkModel(model)) {
            config.set('defaultModel', model);
            Format.success(`Default model set to ${model}`);
        }
        else
            Format.error('Model not valid: select a model available in --list_models');
    });
}
//# sourceMappingURL=default_model.js.map