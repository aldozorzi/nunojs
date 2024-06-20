import { OptionValues } from 'commander';
import fs from 'fs';
import fse from 'fs-extra/esm';
import { Format } from './lib/format.js';
import OpenAI from 'openai';
import Configstore from 'configstore';

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
    // [TODO] validate model against a list or something like that
    if (options.model)
        return options.model;
    else if (config.get('defaultModel'))
        return config.get('defaultModel');
    return 'gpt-3.5-turbo';
}

async function loadPattern() {
    if (!options.text || options.text == "")
        return Format.error("Input text not set. Use --text or use piped form (\"text\" | fabricjs [...] ) to set input text.");
    try {
        const patternFile = `./patterns/${options.pattern}/system.md`;
        const fileExists = await fse.pathExists(patternFile);
        if (!fileExists)
            return Format.error(`Pattern "${options.pattern}" doesn't exists`);
        const pattern = await fs.promises.readFile(patternFile, 'utf8');
        const openai = new OpenAI({
            apiKey: config.get('openAiKey'),
        });

        const chatCompletion = await openai.chat.completions.create({
            messages:
                [
                    { role: 'system', content: pattern },
                    { role: 'user', content: options.text }
                ],
            model: getModel(),
            stream: options.stream === true && !options.output,
        });
        if ('choices' in chatCompletion) {
            if (options.output) {
                try{
                    await fse.ensureFile(options.output);
                    const result = await fs.promises.writeFile(options.output,chatCompletion.choices[0].message.content || "");
                    Format.success('File saved!');
                }catch (e: any) {
                    Format.error(e.toString());
                }
                
            } else {
                process.stdout.write(chatCompletion.choices[0].message.content || "");
            }

        }
        else {
            for await (const chunk of chatCompletion) {
                process.stdout.write(chunk.choices[0]?.delta?.content || '');
            }
        }
    } catch (e: any) {
        Format.error(e.toString());
    }
}

export async function processPattern(opt: OptionValues) {
    options = opt;
    if (!config.get('openAiKey'))
        return Format.error('OpenAI key not set. Set your OpenAI key with fabricjs --setup');
    if (!options.text) {
        loadPipedText();
    }
    else {
        loadPattern();
    }

}