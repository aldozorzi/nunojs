import { Format } from "./lib/format.js";
import { getOptions } from './options.js';

const forceDebug = false;
const options = getOptions();
export function manageError(e:any, hideOutput:boolean = false){
    if (options.debug || forceDebug){
        throw e;
    }
    if(!hideOutput) Format.error(e.toString());
    process.exit();
}