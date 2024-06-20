import inquirer from 'inquirer';
import Configstore from 'configstore';
import { Format } from './lib/format.js';
import fs from 'fs';

export async function initSetup() {
    const questions = [
        {
          type: 'input',
          name: 'openAiKey',
          message: "Paste your openAI key: ",
        },
        {
            type: 'input',
            name: 'YTKey',
            message: "Paste your YouTube key: ",
          },
      ];
      inquirer.prompt(questions).then(answers => {
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const config = new Configstore(packageJson.name);
        config.set(answers);
        Format.success('Setup completed!');
      });
}
