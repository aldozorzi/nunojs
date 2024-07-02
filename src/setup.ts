import inquirer from 'inquirer';
import Configstore from 'configstore';
import { Format } from './lib/format.js';
import fs from 'fs';

export async function initSetup() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const config = new Configstore(packageJson.name);
  const currentConfig = config.all;


  const questions = [
    {
      type: 'input',
      name: 'openAiKey',
      message: `Paste your OpenAI key${config.has('openAiKey') ? ' (blank to keep previous value)':''}: `,
    },
    {
      type: 'input',
      name: 'googleKey',
      message: `Paste your Google key${config.has('googleKey') ? ' (blank to keep previous value)':''}: `,
    },
    {
      type: 'input',
      name: 'anthropicKey',
      message: `Paste your Anthropic key${config.has('anthropicKey') ? ' (blank to keep previous value)':''}: `,
    },
    {
      type: 'input',
      name: 'YTKey',
      message: `Paste your YouTube key${config.has('YTKey') ? ' (blank to keep previous value)':''}: `,
    },
  ];
  inquirer.prompt(questions).then(answers => {

  
    for (const [key, value] of Object.entries(answers)) {
      if (value == 'undefined' || value == '') delete answers[key];
    }
    
    config.set({ ...currentConfig, ...answers });
    Format.success('Setup completed!');

  });
}
