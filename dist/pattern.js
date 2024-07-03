var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import fs from 'fs';
import fse from 'fs-extra/esm';
import { llmAdapter } from '@ldazrz/llm-adapters';
import Configstore from 'configstore';
import ora from 'ora';
import { checkModel } from './list_models.js';
import { Format } from './lib/format.js';
import { getProvider } from './list_models.js';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
var options;
function loadPipedText() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const t = setTimeout(() => {
            process.stdin.removeAllListeners().end().destroy();
            loadPattern();
        }, 100);
        options.text = '';
        try {
            for (var _d = true, _e = __asyncValues(process.stdin), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                options.text += chunk;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        clearTimeout(t);
        loadPattern();
    });
}
function getModel() {
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
function getApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = yield getProvider(getModel());
        if (provider == 'open-ai')
            return config.get('openAiKey');
        else if (provider == 'google')
            return config.get('googleKey');
        else if (provider == 'mistral')
            return config.get('mistralKey');
        else if (provider == 'anthropic')
            return config.get('anthropicKey');
        return '';
    });
}
function loadPattern() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        const spinner = ora({ text: Format.infoColor('AI is working hard...'), color: 'blue' }).start();
        try {
            let patternFile = `./patterns/${options.pattern}/system.md`;
            let userFile = `./patterns/${options.pattern}/user.md`;
            const customPatternFile = `./custom_patterns/${options.pattern}/system.md`;
            const customUserFile = `./custom_patterns/${options.pattern}/user.md`;
            const fileExists = yield fse.pathExists(patternFile);
            const userFileExists = yield fse.pathExists(userFile);
            const customFileExists = yield fse.pathExists(customPatternFile);
            const customUserFileExists = yield fse.pathExists(customUserFile);
            if (!fileExists && !customFileExists)
                return spinner.fail(Format.errorColor(`Pattern "${options.pattern}" doesn't exists`));
            else if (customFileExists)
                patternFile = customPatternFile;
            if ((!options.text || options.text == "")) {
                if (fileExists && userFileExists)
                    options.text = yield fs.promises.readFile(userFile, 'utf8');
                else if (customFileExists && customUserFileExists)
                    options.text = yield fs.promises.readFile(customUserFile, 'utf8');
            }
            const pattern = yield fs.promises.readFile(patternFile, 'utf8');
            const provider = yield getProvider(getModel());
            let adapterParams = { provider: provider };
            if (provider == 'ollama') {
                adapterParams.serverUrl = config.get('ollamaServer');
            }
            else {
                adapterParams.apiKey = yield getApiKey();
            }
            //console.log(adapterParams);
            const adapter = new llmAdapter(adapterParams);
            const chatCompletion = yield adapter.create({
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
                        yield fse.ensureFile(options.output);
                        const result = yield fs.promises.writeFile(options.output, chatCompletion.content || "");
                        return spinner.succeed(Format.successColor('File saved!'));
                    }
                    catch (e) {
                        spinner.fail(Format.errorColor(e.toString()));
                    }
                }
                else {
                    spinner.stop();
                    process.stdout.write(chatCompletion.content || "");
                }
            }
            else {
                spinner.stop();
                try {
                    for (var _d = true, chatCompletion_1 = __asyncValues(chatCompletion), chatCompletion_1_1; chatCompletion_1_1 = yield chatCompletion_1.next(), _a = chatCompletion_1_1.done, !_a; _d = true) {
                        _c = chatCompletion_1_1.value;
                        _d = false;
                        const chunk = _c;
                        process.stdout.write(chunk.content || '');
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = chatCompletion_1.return)) yield _b.call(chatCompletion_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e) {
            spinner.fail(Format.errorColor(e.toString()));
        }
    });
}
export function processPattern(opt) {
    return __awaiter(this, void 0, void 0, function* () {
        options = opt;
        if (!config.get('openAiKey'))
            return Format.error('OpenAI key not set. Set your OpenAI key with nunojs --setup');
        if (options.model && !(yield checkModel(options.model)))
            return Format.error('Model not valid: select a model available in --list_models');
        if (!options.text) {
            loadPipedText();
        }
        else {
            loadPattern();
        }
    });
}
//# sourceMappingURL=pattern.js.map