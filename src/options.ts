import { OptionValues } from "commander";

var options: OptionValues = {};
export function setOptions(opt:OptionValues) {
    options = opt
}
export function getOptions(): OptionValues {
    return options;
}