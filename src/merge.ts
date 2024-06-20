import fse from 'fs-extra/esm';
import { Format } from "./lib/format.js";

export async function mergePatterns() {
    const source_dir = './custom_patterns/';
    const dest_dir = './patterns/';
    await fse.copy(source_dir,dest_dir,{overwrite:true});
    Format.success(`Patterns copied from ${source_dir} to ${dest_dir}`);
}