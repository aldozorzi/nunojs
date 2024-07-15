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
import OpenAI from "openai";
import MistralClient from '@mistralai/mistralai';
import Configstore from 'configstore';
import fs from 'fs';
import fetch from 'node-fetch';
import { Format } from "./lib/format.js";
import { Cache } from 'file-system-cache';
import { manageError } from "./error_manager.js";
import { getOptions } from './options.js';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
let showWarning = true;
const cache = new Cache({
    ttl: 3600
});
const options = getOptions();
function writeWarning(text) {
    if (showWarning && options.debug)
        Format.warning(text);
}
function getOpenAIModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        if (!config.has('openAiKey') || config.get('openAiKey') == '') {
            return [];
        }
        if (!(yield cache.get('openAIModels'))) {
            try {
                const openai = new OpenAI({
                    apiKey: config.get('openAiKey'),
                });
                const list = yield openai.models.list();
                let result = [];
                try {
                    for (var _d = true, list_1 = __asyncValues(list), list_1_1; list_1_1 = yield list_1.next(), _a = list_1_1.done, !_a; _d = true) {
                        _c = list_1_1.value;
                        _d = false;
                        const model = _c;
                        if (model.id.indexOf('gpt') > -1)
                            result.push(model.id);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = list_1.return)) yield _b.call(list_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                yield cache.set('openAIModels', result);
            }
            catch (e) {
                writeWarning('Retrieving models from OpenAI failed');
                return [];
            }
        }
        return yield cache.get('openAIModels');
    });
}
function getGoogleModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.has('googleKey') || config.get('googleKey') == '') {
            return [];
        }
        if (!(yield cache.get('googleModels'))) {
            try {
                const response = yield fetch('https://generativelanguage.googleapis.com/v1/models', { headers: { 'x-goog-api-key': config.get('googleKey') } });
                if (!response.ok) {
                    const data = yield response.json();
                    const message = `Error ${response.status} - ${data.error.message}`;
                    throw new Error(message);
                }
                const data = yield response.json();
                let result = [];
                for (let key in data.models) {
                    const model = data.models[key];
                    if (model.name.indexOf('gemini') > -1)
                        result.push(model.name.replace('models/', ''));
                }
                yield cache.set('googleModels', result);
            }
            catch (e) {
                writeWarning('Retrieving models from Google failed');
                return [];
            }
        }
        return yield cache.get('googleModels');
    });
}
function getOllamaModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.has('ollamaServer') || config.get('ollamaServer') == '') {
            return [];
        }
        if (!(yield cache.get('ollamaModels'))) {
            try {
                const response = yield fetch(`${config.get('ollamaServer')}/api/tags`);
                if (!response.ok) {
                    const data = yield response.json();
                    const message = `Error ${response.status} - ${data.error.message}`;
                    throw new Error(message);
                }
                const data = yield response.json();
                let result = [];
                for (let key in data.models) {
                    const model = data.models[key];
                    result.push(model.name);
                }
                yield cache.set('ollamaModels', result);
            }
            catch (e) {
                writeWarning('Retrieving models from Ollama failed');
                return [];
            }
        }
        return yield cache.get('ollamaModels');
    });
}
function getMistralModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.has('mistralKey') || config.get('mistralKey') == '') {
            return [];
        }
        if (!(yield cache.get('mistralModels'))) {
            try {
                const client = new MistralClient(config.get('mistralKey'));
                const list = yield client.listModels();
                //console.log(list.data);
                let result = [];
                for (let key in list.data) {
                    const model = list.data[key];
                    //console.log(model)
                    result.push(model.id);
                }
                yield cache.set('mistralModels', result);
            }
            catch (e) {
                writeWarning('Retrieving models from Mistral failed');
                return [];
            }
        }
        return yield cache.get('mistralModels');
    });
}
function getAnthropicModelsData() {
    if (!config.has('anthropicKey') || config.get('anthropicKey') == '') {
        return [];
    }
    return [
        'claude-3-5-sonnet-20240620',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
    ];
}
function getModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const openAIdata = yield getOpenAIModelsData();
        const googleData = yield getGoogleModelsData();
        const ollamaData = yield getOllamaModelsData();
        const mistralData = yield getMistralModelsData();
        const anthropicData = yield getAnthropicModelsData();
        return [...openAIdata, ...googleData, ...ollamaData, ...mistralData, ...anthropicData];
    });
}
export function getModelsList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            showWarning = false;
            const list = yield getModelsData();
            return list;
        }
        catch (e) {
            manageError(e);
        }
    });
}
export function getModels() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            showWarning = true;
            const list = yield getModelsData();
            if (list.length == 0) {
                Format.warning('No models found, please set at least an API key using nunojs --setup');
            }
            else {
                process.stdout.write(list.join('\r\n'));
            }
        }
        catch (e) {
            manageError(e);
        }
    });
}
export function checkModel(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const modelsList = yield getModelsList();
        return modelsList && modelsList.includes(model);
    });
}
export function getProvider(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const openAiData = yield getOpenAIModelsData();
        const googleAiData = yield getGoogleModelsData();
        const ollamaData = yield getOllamaModelsData();
        const mistralData = yield getMistralModelsData();
        const anthropiclData = getAnthropicModelsData();
        if (openAiData.indexOf(model) > -1) {
            return 'open-ai';
        }
        else if (googleAiData.indexOf(model) > -1) {
            return 'google';
        }
        else if (anthropiclData.indexOf(model) > -1) {
            return 'anthropic';
        }
        else if (ollamaData.indexOf(model) > -1) {
            return 'ollama';
        }
        else if (mistralData.indexOf(model) > -1) {
            return 'mistral';
        }
        //console.log('model is there:',(model in await getMistralModelsData()))
        return 'open-ai';
    });
}
//# sourceMappingURL=list_models.js.map