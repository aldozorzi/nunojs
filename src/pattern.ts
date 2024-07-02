import { OptionValues } from 'commander';
import fs from 'fs';
import fse from 'fs-extra/esm';
import { Format } from './lib/format.js';
import OpenAI from 'openai';

import Configstore from 'configstore';
import ora from 'ora';
import { checkModel } from './lib/checkModel.js';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
var options: OptionValues;

async function loadPipedText() {
    const t = setTimeout(() => {
        process.stdin.removeAllListeners().end().destroy();
        loadPattern();
    }, 100);
    options.text = '';
    for await (const chunk of process.stdin) {
        options.text += chunk;
    }
    clearTimeout(t);
    loadPattern();
}

function getModel() {
    if (options.model)
        return options.model;
    else if (config.get('defaultModel'))
        return config.get('defaultModel');
    return 'gpt-3.5-turbo';
}

async function loadPattern() {

    /*if (!options.text || options.text == "")
        return Format.error("Input text not set. Use --text or use piped form (\"text\" | nunojs [...] ) to set input text.");*/
    const spinner = ora({ text: Format.infoColor('AI is working hard...'), color: 'blue' }).start();
    try {
        let patternFile = `./patterns/${options.pattern}/system.md`;
        let userFile = `./patterns/${options.pattern}/user.md`;
        const customPatternFile = `./custom_patterns/${options.pattern}/system.md`;
        const customUserFile = `./custom_patterns/${options.pattern}/user.md`;

        const fileExists = await fse.pathExists(patternFile);
        const userFileExists = await fse.pathExists(userFile);
        const customFileExists = await fse.pathExists(customPatternFile);
        const customUserFileExists = await fse.pathExists(customUserFile);

        if (!fileExists && !customFileExists)
            return spinner.fail(Format.errorColor(`Pattern "${options.pattern}" doesn't exists`));
        else if (customFileExists)
            patternFile = customPatternFile;

        if ((!options.text || options.text == "")) {
            if (fileExists && userFileExists)
                options.text = await fs.promises.readFile(userFile, 'utf8');
            else if (customFileExists && customUserFileExists)
                options.text = await fs.promises.readFile(customUserFile, 'utf8');
        }

        const pattern = await fs.promises.readFile(patternFile, 'utf8');
        const openai = new OpenAI({
            apiKey: config.get('openAiKey'),
        });
        
        let msgs: Message[] = [{ role: 'system', content: pattern }];

        if(options.text && options.text != "")
            {
                msgs.push({ role: 'user', content: options.text })
            }
        
        

        const chatCompletion = await openai.chat.completions.create({
            messages: msgs,
            model: getModel(),
            stream: options.stream === true && !options.output,
            frequency_penalty: options.frequency_penalty || 0,
            top_p : options.top_p || 1,
            temperature: options.temperature || 1,
        });
        if ('choices' in chatCompletion) {
            if (options.output) {
                try {
                    await fse.ensureFile(options.output);
                    const result = await fs.promises.writeFile(options.output, chatCompletion.choices[0].message.content || "");
                    return spinner.succeed(Format.successColor('File saved!'));
                } catch (e: any) {
                    spinner.fail(Format.errorColor(e.toString()));
                }

            } else {
                spinner.stop();
                process.stdout.write(chatCompletion.choices[0].message.content || "");
            }

        }
        else {
            spinner.stop();
            for await (const chunk of chatCompletion) {
                process.stdout.write(chunk.choices[0]?.delta?.content || '');
            }
        }
    } catch (e: any) {
        spinner.fail(Format.errorColor(e.toString()));
    }
}

export async function processPattern(opt: OptionValues) {
    options = opt;
    if (!config.get('openAiKey'))
        return Format.error('OpenAI key not set. Set your OpenAI key with nunojs --setup');
    if (options.model && !await checkModel(options.model))
        return Format.error('Model not valid: select a model available in --list_models');
    if (!options.text) {
        loadPipedText();
    }
    else {
        loadPattern();
    }

}