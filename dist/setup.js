var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from 'inquirer';
import Configstore from 'configstore';
import { Format } from './lib/format.js';
import fs from 'fs';
export function initSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const questions = [
            {
                type: 'input',
                name: 'openAiKey',
                message: "Paste your OpenAI key (blank to keep previous value): ",
            },
            {
                type: 'input',
                name: 'googleKey',
                message: "Paste your Google key (blank to keep previous value): ",
            },
            {
                type: 'input',
                name: 'YTKey',
                message: "Paste your YouTube key (blank to keep previous value): ",
            },
        ];
        inquirer.prompt(questions).then(answers => {
            const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
            const config = new Configstore(packageJson.name);
            const currentConfig = config.all;
            console.log("Current");
            console.table(currentConfig);
            console.log("New");
            console.table(answers);
            for (const [key, value] of Object.entries(answers)) {
                if (value == 'undefined' || value == '')
                    delete answers[key];
            }
            console.log("New after clean");
            console.table(answers);
            config.set(Object.assign(Object.assign({}, currentConfig), answers));
            Format.success('Setup completed!');
        });
    });
}
//# sourceMappingURL=setup.js.map