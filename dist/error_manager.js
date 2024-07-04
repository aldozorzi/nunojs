import { Format } from "./lib/format.js";
import { options } from "./index.js";
const forceDebug = false;
export function manageError(e, hideOutput = false) {
    if (options.debug || forceDebug) {
        throw e;
    }
    if (!hideOutput)
        Format.error(e.toString());
    process.exit();
}
//# sourceMappingURL=error_manager.js.map