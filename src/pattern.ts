import { OptionValues } from 'commander';
import fs from 'fs';
import fse from 'fs-extra/esm';
import { llmAdapter } from '@ldazrz/llm-adapters'
import { Config } from '@ldazrz/llm-adapters/types.js'

import Configstore from 'configstore';
import ora from 'ora';
import { checkModel } from './list_models.js';
import { Format } from './lib/format.js';
import { getProvider } from './list_models.js';
import { manageError } from './error_manager.js';
import { options } from './index.js';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
//var options: OptionValues;

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

function getModel() :string {
    if (options.model)
        return options.model;
    else if (config.get('defaultModel'))
        return config.get('defaultModel');
    if (config.has('openAiKey') && config.get('openAiKey') != '')
        return 'gpt-3.5-turbo';
    else if (config.has('googleKey') && config.get('googleKey') != '')
        return 'gemini-1.5-flash';
    else if (config.has('anthropicKey') && config.get('anthropicKey') != '')
        return 'claude-3-5-sonnet-20240620';
    else if (config.has('mistralKey') && config.get('mistralKey') != '')
        return 'mistral-tiny';
    return '';
}

async function getApiKey() : Promise<string>{
    const provider = await getProvider(getModel());
    if(provider == 'open-ai')
        return config.get('openAiKey');
    else if(provider == 'google')
        return config.get('googleKey');
    else if(provider == 'mistral')
        return config.get('mistralKey');
    else if(provider == 'anthropic')
        return config.get('anthropicKey');
    return '';
}

async function loadPattern() {
    const spinner = ora({ text: Format.infoColor(`${getModel()} is working hard...`), color: 'blue' }).start();
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
        
        const provider = await getProvider(getModel());
        let adapterParams:Config = { provider:provider }
        if(provider == 'ollama')
        {
            adapterParams.serverUrl = config.get('ollamaServer');
        }else{
            adapterParams.apiKey = await getApiKey();
        }
        //console.log(adapterParams);
        const adapter = new llmAdapter(adapterParams);
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
                    manageError(e,true);
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
        manageError(e,true);
    }
}

export async function processPattern() {
    //options = opt;
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