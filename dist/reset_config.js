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
import inquirer from 'inquirer';
import { Format } from './lib/format.js';
export function resetConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const questions = [
            {
                type: 'input',
                name: 'confirm',
                message: 'Are you sure you want to clear your config? All data will be lost and you will have to launch --setup to use NunoJS again: (y/n)',
                default: 'n'
            }
        ];
        inquirer.prompt(questions).then(answers => {
            if (answers.confirm == 'y') {
                const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                const config = new Configstore(packageJson.name);
                config.clear();
                Format.success('Config cleared!');
            }
        });
    });
}
//# sourceMappingURL=reset_config.js.map