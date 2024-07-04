import fs from 'fs';
import Configstore from 'configstore';
import inquirer from 'inquirer';
import { Format } from './lib/format.js';

export async function resetConfig() {
    const questions = [
        {
            type: 'input',
            name: 'confirm',
            message: 'Are you sure you want to clear your config? All data will be lost and you will have to launch --setup to use NunoJS again: (y/n)',
            default: 'n'
        }];
    inquirer.prompt(questions).then(answers => {
        if (answers.confirm == 'y') {
            const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
            const config = new Configstore(packageJson.name);
            config.clear();
            Format.success('Config cleared!');
        }
    });


}