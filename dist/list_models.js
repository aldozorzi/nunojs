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
import Configstore from 'configstore';
import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
function getModelsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const openai = new OpenAI({
            apiKey: config.get('openAiKey'),
        });
        const list = yield openai.models.list();
        return list;
    });
}
export function getModelsList() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        let result = [];
        const list = yield getModelsData();
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
        return result;
    });
}
export function getModels() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_2, _b, _c;
        const list = yield getModelsData();
        try {
            for (var _d = true, list_2 = __asyncValues(list), list_2_1; list_2_1 = yield list_2.next(), _a = list_2_1.done, !_a; _d = true) {
                _c = list_2_1.value;
                _d = false;
                const model = _c;
                if (model.id.indexOf('gpt') > -1)
                    process.stdout.write(`${model.id}\n`);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = list_2.return)) yield _b.call(list_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
//# sourceMappingURL=list_models.js.map