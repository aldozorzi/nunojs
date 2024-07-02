import inquirer from 'inquirer';
import Configstore from 'configstore';
import { Format } from './lib/format.js';
import fs from 'fs';

export async function initSetup() {
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
          if(value == 'undefined' || value == '') delete answers[key];
        }
        console.log("New after clean");
        console.table(answers);
        config.set({...currentConfig, ...answers});
        Format.success('Setup completed!'); 

      });
}
