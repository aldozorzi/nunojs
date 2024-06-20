import ora from 'ora';
import { Format } from './lib/format.js';
import fs from "fs/promises";
import fse from 'fs-extra/esm';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

export async function updatePatterns() {
    
    const spinner = ora({text:Format.infoColor('Loading patterns...'),color:'blue'}).start();

    const dir = './patterns/_updating_patterns';
    try {
        await fse.ensureDir(dir);

        // [TODO] change url to https://github.com/aldozorzi/fabricjs - using https://github.com/danielmiessler/fabric because public
        // const repoPath = 'https://github.com/aldozorzi/fabricjs';
        const repoPath = 'https://github.com/danielmiessler/fabric';
        const git: SimpleGit = simpleGit();
        await git.clone(repoPath,dir,['-n','--depth=1','--filter=tree:0']);
        git.cwd(dir).raw("sparse-checkout", "set", 'patterns');
        await git.checkout();
        await fse.copy(`${dir}/patterns`,'./patterns',{overwrite:true});
        await fs.rm(dir,{recursive:true})

        spinner.succeed(Format.successColor('Patterns updated!'));
        
      } catch (err) {
        console.error(err);
      }
}

