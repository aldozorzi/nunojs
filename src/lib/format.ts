import chalk from 'chalk';

export class Format{

    static successColor = chalk.green;
    static errorColor = chalk.red;
    static infoColor = chalk.blue;
    static warningColor = chalk.yellow;
    static debugColor = chalk.magenta;
    

    static success(string:string, ret = false){
        const output = Format.successColor(`\u2713 ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static error(string:string, ret = false){
        const output = Format.errorColor(`\u26D4 ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static info(string:string, ret = false){
        const output = Format.infoColor(`\u2139 ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static warning(string:string, ret = false){
        const output = Format.warningColor(`\u26a0 ${string}`);
        if(ret) return output;
        console.log(output);
    }
    static debug(string:string, ret = false){
        const output = Format.debugColor(`\u1367 ${string}`);
        if(ret) return output;
        console.log(output);
    }
}