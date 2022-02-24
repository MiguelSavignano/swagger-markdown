"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFile = exports.transfromSwagger = exports.partiallyDereference = void 0;
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const fs_1 = __importDefault(require("fs"));
const markdownlint_1 = __importDefault(require("markdownlint"));
const markdownlint_rule_helpers_1 = __importDefault(require("markdownlint-rule-helpers"));
const info_1 = require("./transformers/info");
const path_1 = require("./transformers/path");
const securityDefinitions_1 = require("./transformers/securityDefinitions");
const externalDocs_1 = require("./transformers/externalDocs");
const definitions_1 = require("./transformers/definitions");
const _markdownlint_json_1 = __importDefault(require("../.markdownlint.json"));
// replace all $refs except model definitions as these have their own section in the doc
function partiallyDereference(node, $refs) {
    if (typeof node !== 'object')
        return node;
    const obj = {};
    // Issue related to babel (I beleive) as it won't build it when just spreading
    // eslint-disable-next-line prefer-object-spread
    const nodeAsObject = Object.assign({}, node);
    Object.entries(nodeAsObject).forEach((pair) => {
        const [key, value] = pair;
        if (Array.isArray(value)) {
            obj[key] = value.map((item) => partiallyDereference(item, $refs));
        }
        else if (key === '$ref' && !value.startsWith('#/definitions/')) {
            partiallyDereference($refs.get(value), $refs);
        }
        else {
            obj[key] = partiallyDereference(value, $refs);
        }
    });
    return obj;
}
exports.partiallyDereference = partiallyDereference;
function transfromSwagger(inputDoc, options = {}) {
    const document = [];
    // Collect parameters
    const parameters = 'parameters' in inputDoc ? inputDoc.parameters : {};
    // Process info
    if (!options.skipInfo && 'info' in inputDoc) {
        document.push((0, info_1.transformInfo)(inputDoc.info));
    }
    if ('externalDocs' in inputDoc) {
        document.push((0, externalDocs_1.transformExternalDocs)(inputDoc.externalDocs));
    }
    // Security definitions
    if ('securityDefinitions' in inputDoc) {
        document.push((0, securityDefinitions_1.transformSecurityDefinitions)(inputDoc.securityDefinitions));
    }
    else if (inputDoc.components && inputDoc.components.securitySchemas) {
        document.push((0, securityDefinitions_1.transformSecurityDefinitions)(inputDoc.components.securityDefinitions));
    }
    // Process Paths
    if ('paths' in inputDoc) {
        Object.keys(inputDoc.paths).forEach((path) => document.push((0, path_1.transformPath)(path, inputDoc.paths[path], parameters)));
    }
    // Models (definitions)
    if ('definitions' in inputDoc) {
        document.push((0, definitions_1.transformDefinition)(inputDoc.definitions));
    }
    else if (inputDoc.components && inputDoc.components.schemas) {
        document.push((0, definitions_1.transformDefinition)(inputDoc.components.schemas));
    }
    // Glue all pieces down
    const plainDocument = document.join('\n');
    // Fix markdown issues
    const fixOptions = {
        resultVersion: 3,
        strings: { plainDocument },
        config: _markdownlint_json_1.default,
    };
    const fixResults = markdownlint_1.default.sync(fixOptions);
    const fixes = fixResults.plainDocument.filter((error) => error.fixInfo);
    if (fixes.length > 0) {
        return markdownlint_rule_helpers_1.default.applyFixes(plainDocument, fixes);
    }
    return plainDocument;
}
exports.transfromSwagger = transfromSwagger;
function transformFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerParser = new swagger_parser_1.default();
        const $refs = yield swaggerParser.resolve(options.input);
        // return SwaggerParser.resolve(options.input).then(() => {
        const dereferencedSwagger = partiallyDereference(swaggerParser.api, $refs);
        const markdown = transfromSwagger(dereferencedSwagger, options);
        if (options.output) {
            fs_1.default.writeFileSync(options.output, markdown);
        }
        return markdown;
        // });
    });
}
exports.transformFile = transformFile;
