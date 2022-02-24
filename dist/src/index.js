"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const package_json_1 = __importDefault(require("../package.json"));
const convert_1 = require("./convert");
const parser = new argparse_1.ArgumentParser({
    description: package_json_1.default.name,
    add_help: true,
});
parser.add_argument('-v', '--version', {
    action: 'version',
    version: package_json_1.default.version,
});
parser.add_argument('-i', '--input', {
    required: true,
    help: 'Path to the swagger yaml file',
    metavar: '',
    dest: 'input',
});
parser.add_argument('-o', '--output', {
    help: 'Path to the resulting md file',
    metavar: '',
    dest: 'output',
});
parser.add_argument('--skip-info', {
    action: 'store_true',
    help: 'Skip the title, description, version etc, whatever is in the info block.',
    dest: 'skipInfo',
});
const args = parser.parse_args();
if (args.input) {
    if (!args.output) {
        args.output = args.input.replace(/(yaml|yml|json)$/i, 'md');
    }
    (0, convert_1.transformFile)(args).catch((err) => console.error(err));
}
