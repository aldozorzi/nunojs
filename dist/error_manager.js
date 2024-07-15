import { Format } from "./lib/format.js";
import { getOptions } from './options.js';
const forceDebug = false;
const options = getOptions();
export function manageError(e, hideOutput = false) {
    if (options.debug || forceDebug) {
        throw e;
    }
    if (!hideOutput)
        Format.error(e.toString());
    process.exit();
}
//# sourceMappingURL=error_manager.js.map