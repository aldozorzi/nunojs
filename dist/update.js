var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ora from 'ora';
import { Format } from './lib/format.js';
import fs from "fs/promises";
import fse from 'fs-extra/esm';
import { simpleGit } from 'simple-git';
export function updatePatterns() {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = [
            'show_fabric_options_markmap'
        ];
        const spinner = ora({ text: Format.infoColor('Loading patterns...'), color: 'blue' }).start();
        const dir = './patterns/_updating_patterns';
        try {
            yield fse.ensureDir(dir);
            // [TODO] change url to https://github.com/aldozorzi/fabricjs - using https://github.com/danielmiessler/fabric because public
            // const repoPath = 'https://github.com/aldozorzi/fabricjs';
            const repoPath = 'https://github.com/danielmiessler/fabric';
            const git = simpleGit();
            yield git.clone(repoPath, dir, ['-n', '--depth=1', '--filter=tree:0']);
            git.cwd(dir).raw("sparse-checkout", "set", 'patterns');
            yield git.checkout();
            yield fse.copy(`${dir}/patterns`, './patterns', { overwrite: true });
            yield fs.rm(dir, { recursive: true });
            for (let each in filter) {
                let dirToRemove = filter[each];
                yield fs.rm(`./patterns/${dirToRemove}`, { recursive: true });
            }
            spinner.succeed(Format.successColor('Patterns updated!'));
        }
        catch (err) {
            console.error(err);
        }
    });
}
//# sourceMappingURL=update.js.map