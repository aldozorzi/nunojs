import chalk from 'chalk';
import logSymbols from 'log-symbols';

export class Format{

    static successColor = chalk.green;
    static errorColor = chalk.red;
    static infoColor = chalk.blue;
    static warningColor = chalk.yellow;
    static debugColor = chalk.magenta;
    

    static success(string:string, ret = false){
        const output = Format.successColor(`${logSymbols.success} ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static error(string:string, ret = false){
        const output = Format.errorColor(`${logSymbols.error} ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static info(string:string, ret = false){
        const output = Format.infoColor(`${logSymbols.info} ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static warning(string:string, ret = false){
        const output = Format.warningColor(`${logSymbols.warning} ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static debug(string:string, ret = false){
        const output = Format.debugColor(`\u1367 ${string}`);
        if(ret) return output;
        console.log(output);
    }
}