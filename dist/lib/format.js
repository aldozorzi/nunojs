import chalk from 'chalk';
export class Format {
    static success(string, ret = false) {
        const output = Format.successColor(`\u2713 ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static error(string, ret = false) {
        const output = Format.errorColor(`\u26D4 ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static info(string, ret = false) {
        const output = Format.infoColor(`\u2139 ${string}`);
        if (ret)
            return output;
        console.log(output);
    }
    static warning(string, ret = false) {
        const output = Format.warningColor(`\u26a0 ${string}`);
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
Format.infoColor = chalk.blue;
Format.warningColor = chalk.yellow;
Format.debugColor = chalk.magenta;
//# sourceMappingURL=format.js.map