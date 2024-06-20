var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fse from 'fs-extra/esm';
import { Format } from "./lib/format.js";
export function mergePatterns() {
    return __awaiter(this, void 0, void 0, function* () {
        const source_dir = './custom_patterns/';
        const dest_dir = './patterns/';
        yield fse.copy(source_dir, dest_dir, { overwrite: true });
        Format.success(`Patterns copied from ${source_dir} to ${dest_dir}`);
    });
}
//# sourceMappingURL=merge.js.map