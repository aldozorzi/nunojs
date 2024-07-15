import ora from 'ora';
import { Format } from './lib/format.js';
import fs from "fs/promises";
import fse from 'fs-extra/esm';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { manageError } from './error_manager.js';

export async function updatePatterns() {

    const filter = [
      'show_fabric_options_markmap'
    ];
    
    const spinner = ora({text:Format.infoColor('Loading patterns...'),color:'cyan'}).start();

    const dir = './patterns/_updating_patterns';
    try {
        await fse.ensureDir(dir);
        const repoPath = 'https://github.com/aldozorzi/nunojs';
        const git: SimpleGit = simpleGit();
        await git.clone(repoPath,dir,['-n','--depth=1','--filter=tree:0']);
        git.cwd(dir).raw("sparse-checkout", "set", 'patterns');
        await git.checkout();
        await fse.copy(`${dir}/patterns`,'./patterns',{overwrite:true});
        await fs.rm(dir,{recursive:true})

        for (let each in filter)
          {
            let dirToRemove = filter[each];
            if(await fse.pathExists(`./patterns/${dirToRemove}`))
              await fs.rm(`./patterns/${dirToRemove}`,{recursive:true});
          }


        spinner.succeed(Format.successColor('Patterns updated!'));
        
      } catch (e:any) {
        manageError(e);
      }
}

