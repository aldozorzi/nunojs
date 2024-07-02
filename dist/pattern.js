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
import { Format } from './lib/format.js';
import OpenAI from 'openai';
import Configstore from 'configstore';
import ora from 'ora';
import { checkModel } from './lib/checkModel.js';
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
    if (config.has('googleKey') && config.get('googleKey') != '')
        return 'gemini-1.5-flash-latest';
    if (config.has('anthropicKey') && config.get('anthropicKey') != '')
        return 'claude-3-5-sonnet-20240620';
}
function loadPattern() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        var _d, _e;
        /*if (!options.text || options.text == "")
            return Format.error("Input text not set. Use --text or use piped form (\"text\" | nunojs [...] ) to set input text.");*/
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
            const openai = new OpenAI({
                apiKey: config.get('openAiKey'),
            });
            let msgs = [{ role: 'system', content: pattern }];
            if (options.text && options.text != "") {
                msgs.push({ role: 'user', content: options.text });
            }
            const chatCompletion = yield openai.chat.completions.create({
                messages: msgs,
                model: getModel(),
                stream: options.stream === true && !options.output,
                frequency_penalty: options.frequency_penalty || 0,
                top_p: options.top_p || 1,
                temperature: options.temperature || 1,
            });
            if ('choices' in chatCompletion) {
                if (options.output) {
                    try {
                        yield fse.ensureFile(options.output);
                        const result = yield fs.promises.writeFile(options.output, chatCompletion.choices[0].message.content || "");
                        return spinner.succeed(Format.successColor('File saved!'));
                    }
                    catch (e) {
                        spinner.fail(Format.errorColor(e.toString()));
                    }
                }
                else {
                    spinner.stop();
                    process.stdout.write(chatCompletion.choices[0].message.content || "");
                }
            }
            else {
                spinner.stop();
                try {
                    for (var _f = true, chatCompletion_1 = __asyncValues(chatCompletion), chatCompletion_1_1; chatCompletion_1_1 = yield chatCompletion_1.next(), _a = chatCompletion_1_1.done, !_a; _f = true) {
                        _c = chatCompletion_1_1.value;
                        _f = false;
                        const chunk = _c;
                        process.stdout.write(((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || '');
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = chatCompletion_1.return)) yield _b.call(chatCompletion_1);
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