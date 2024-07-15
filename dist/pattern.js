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
import { manageError } from './error_manager.js';
import { getOptions, setOptions } from './options.js';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
const spinner = ora({ text: Format.infoColor(`${getModel()} is working hard...`), color: 'blue' });
//var options: OptionValues;
function loadPipedText() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        let options = getOptions();
        const t = setTimeout(() => {
            process.stdin.removeAllListeners().end().destroy();
            buildPattern();
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
        setOptions(options);
        clearTimeout(t);
        buildPattern();
    });
}
function getModel() {
    const options = getOptions();
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
function getPatternFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions();
        let patternFile = `./patterns/${options.pattern}/system.md`;
        const customPatternFile = `./custom_patterns/${options.pattern}/system.md`;
        const patternFileExists = yield fse.pathExists(patternFile);
        const customPatternFileExists = yield fse.pathExists(customPatternFile);
        if (!patternFileExists && !customPatternFileExists)
            return false;
        else if (customPatternFileExists)
            patternFile = customPatternFile;
        return patternFile;
    });
}
function getUserFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions();
        let userFile = `./patterns/${options.pattern}/user.md`;
        const customUserFile = `./custom_patterns/${options.pattern}/user.md`;
        const userFileExists = yield fse.pathExists(userFile);
        const customUserFileExists = yield fse.pathExists(customUserFile);
        if (!userFileExists && !customUserFileExists)
            return false;
        else if (customUserFileExists)
            userFile = customUserFile;
        return userFile;
    });
}
function buildAdapter(system) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions();
        const provider = yield getProvider(getModel());
        let adapterParams = { provider: provider };
        if (provider == 'ollama') {
            adapterParams.serverUrl = config.get('ollamaServer');
        }
        else {
            adapterParams.apiKey = yield getApiKey();
        }
        const adapter = new llmAdapter(adapterParams);
        const chatCompletion = yield adapter.create({
            system: system,
            user: options.text,
            model: getModel(),
            stream: options.stream === true && !options.output,
            frequency_penalty: options.frequency_penalty || 0,
            top_p: options.top_p || 1,
            temperature: options.temperature || 1,
        });
        manageResponse(chatCompletion);
    });
}
function manageResponse(chatCompletion) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, chatCompletion_1, chatCompletion_1_1;
        var _b, e_2, _c, _d;
        const options = getOptions();
        if ('content' in chatCompletion) {
            if (options.output) {
                try {
                    yield fse.ensureFile(options.output);
                    const result = yield fs.promises.writeFile(options.output, chatCompletion.content || "");
                    return spinner.succeed(Format.successColor('File saved!'));
                }
                catch (e) {
                    spinner.fail(Format.errorColor(e.toString()));
                    manageError(e, true);
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
                for (_a = true, chatCompletion_1 = __asyncValues(chatCompletion); chatCompletion_1_1 = yield chatCompletion_1.next(), _b = chatCompletion_1_1.done, !_b; _a = true) {
                    _d = chatCompletion_1_1.value;
                    _a = false;
                    const chunk = _d;
                    process.stdout.write(chunk.content || '');
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = chatCompletion_1.return)) yield _c.call(chatCompletion_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    });
}
function buildPattern() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions();
        spinner.start();
        try {
            let patternFile = yield getPatternFile();
            let userFile = yield getUserFile();
            if (!patternFile)
                return spinner.fail(Format.errorColor(`Pattern "${options.pattern}" doesn't exists`));
            if ((!options.text || options.text == "")) {
                if (userFile)
                    options.text = yield fs.promises.readFile(userFile, 'utf8');
            }
            const pattern = yield fs.promises.readFile(patternFile, 'utf8');
            buildAdapter(pattern);
        }
        catch (e) {
            spinner.fail(Format.errorColor(e.toString()));
            manageError(e, true);
        }
    });
}
export function processPattern() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = getOptions();
        //options = opt;
        if (options.model && !(yield checkModel(options.model)))
            return Format.error('Model not valid: select a model available in --list_models');
        const provider = yield getProvider(getModel());
        if (provider == 'open-ai' && !config.get('openAiKey'))
            return Format.error('OpenAI key not set. Set your OpenAI key with nunojs --setup');
        else if (provider == 'google' && !config.get('googleKey'))
            return Format.error('Google key not set. Set your OpenAI key with nunojs --setup');
        else if (provider == 'mistral' && !config.get('mistralKey'))
            return Format.error('Mistral key not set. Set your OpenAI key with nunojs --setup');
        else if (provider == 'anthropic' && !config.get('anthropicKey'))
            return Format.error('Anthropic key not set. Set your OpenAI key with nunojs --setup');
        if (!options.text) {
            loadPipedText();
        }
        else {
            buildPattern();
        }
    });
}
//# sourceMappingURL=pattern.js.map