import { OptionValues } from 'commander';
import fs from 'fs';
import fse from 'fs-extra/esm';
import { llmAdapter } from '@ldazrz/llm-adapters'

import Configstore from 'configstore';
import ora from 'ora';
import { checkModel } from './lib/checkModel.js';
import { Format } from './lib/format.js';

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
    if (config.has('openAiKey') && config.get('openAiKey') != '')
        return 'gpt-3.5-turbo';
    if (config.has('googleKey') && config.get('googleKey') != '')
        return 'gemini-1.5-flash';
    if (config.has('anthropicKey') && config.get('anthropicKey') != '')
        return 'claude-3-5-sonnet-20240620';
}

function getProvider() : string{
    const model = getModel();
    if(model.indexOf('gpt')>-1)
        return 'open-ai';
    else if(model.indexOf('gemini')>-1)
        return 'google';
    return '';
}

function getApiKey() : string{
    const model = getModel();
    if(model.indexOf('gpt')>-1)
        return config.get('openAiKey');
    else if(model.indexOf('gemini')>-1)
        return config.get('googleKey');
    return '';
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
        
        const adapter = new llmAdapter({ provider: getProvider(), apiKey: getApiKey() });
        const chatCompletion = await adapter.create({
            system: pattern,
            user: options.text,
            model: getModel(),
            stream: options.stream === true && !options.output,
            frequency_penalty: options.frequency_penalty || 0,
            top_p: options.top_p || 1,
            temperature: options.temperature || 1,
        });

        if ('content' in chatCompletion) {
            if (options.output) {
                try {
                    await fse.ensureFile(options.output);
                    const result = await fs.promises.writeFile(options.output, chatCompletion.content || "");
                    return spinner.succeed(Format.successColor('File saved!'));
                } catch (e: any) {
                    spinner.fail(Format.errorColor(e.toString()));
                }
            } else {
                spinner.stop();
                process.stdout.write(chatCompletion.content || "");
            }
        }else{
            spinner.stop();
            for await (const chunk of chatCompletion) {
                process.stdout.write(chunk.content || '');
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