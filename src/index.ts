#! /usr/bin/env node

import fs from 'fs';
import { Format } from "./lib/format.js";

import { Command, OptionValues } from "commander";
import { processPattern } from "./pattern.js";
import { initSetup } from "./setup.js";
import { updatePatterns } from "./update.js";
import { getList } from "./list.js";
import { getModels } from './list_models.js';
import { defaultModel } from './default_model.js';


const program = new Command();

program
    .version("1.0.0")
    .description("A JS framework for augmenting humans AI.");

program.option("-p, --pattern <pattern-name>", "Set the pattern (prompt) to use")
    .option("-t, --text <text>", "Text to analyze")
    .option("-o, --output <text>", "Save the result to a file")
    .option("-s, --stream", "Use this option if you want to see the results in realtime. NOTE: you can't pipe the output into another command, or use with --output")
    .option("-l, --list", "List available patterns")
    .option("--temp <temperature>", "Set the temperature for the model. Default is 0")
    .option("--top_p <top_p>", "Set the top_p for the model. Default is 1")
    .option("--frequency_penalty <frequency_penalty >", "sets the presence penalty for the model. Default is 0.1")
    .option("-u, --update", "Update patterns (git > 2.24 required)")
    .option("--setup", "Set up your FabricJS instance")
    .option("--list_models", "List all available models")
    .option("-m, --model <model>", "Set the model to use")
    .option("--default_model <model>", "Set the default model to use")
    //.option("--remote_ollama_server <server>", "The URL of the remote ollamaserver to use. ONLY USE THIS if you are using a local ollama server in a non-default location or port");

const dir = fs.readdirSync('./patterns');
const custom_dir = fs.readdirSync('./custom_patterns');

let patternCommand:string = '';
let patternArg:string = '';

function addCommand(pattern : string){
    program
        .command(pattern,{hidden:true})
        .argument('[text]')
        .description(`alias for --template '${pattern}'`)
        .action((arg)=>{
            patternCommand = pattern || '';
            patternArg = arg || '';
        });
}

try{
    dir.map((pattern) => {
        addCommand(pattern);
    });
    custom_dir.map((pattern) => {
        addCommand(pattern);
    });
    program
    .command('no_command',{hidden:true, isDefault:true})
    .action(()=>{});

}catch(e:any){
    Format.error(e.toString());
}

program.parse(process.argv);
const options: OptionValues = program.opts();


if(patternCommand != ''){
    options.pattern = patternCommand;
    options.text = patternArg;
}

if (Object.keys(options).length == 0) {
    Format.warning('No parsed args');
    program.help()
}

loadModule();

function loadModule() {
    if (options.setup) {
        initSetup();
    }
    else if (options.update) {
        updatePatterns();
    }
    else if (options.list) {
        getList();
    }
    else if (options.list_models) {
        getModels();
    }
    else if (options.default_model) {
        defaultModel(options.default_model);
    }
    else if (options.remote_ollama_server) {

    }
    else if (options.pattern) {
        processPattern(options);
    }
    else {
        Format.error('missing command [--pattern, --setup, --update, --list_models, --default_model, --remoteOllamaServer, --merge]');
    }
}