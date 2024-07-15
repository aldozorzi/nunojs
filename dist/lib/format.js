import chalk from 'chalk';
import logSymbols from 'log-symbols';
export class Format {
    static success(string, ret = false) {
        const output = Format.successColor(`${logSymbols.success} ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static error(string, ret = false) {
        const output = Format.errorColor(`${logSymbols.error} ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static info(string, ret = false) {
        const output = Format.infoColor(`${logSymbols.info} ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static warning(string, ret = false) {
        const output = Format.warningColor(`${logSymbols.warning} ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static debug(string, ret = false) {
        const output = Format.debugColor(`\u1367 ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
}
Format.successColor = chalk.green;
Format.errorColor = chalk.red;
Format.infoColor = chalk.cyan;
Format.warningColor = chalk.yellow;
Format.debugColor = chalk.magenta;
//# sourceMappingURL=format.js.map