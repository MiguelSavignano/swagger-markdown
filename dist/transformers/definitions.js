"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDefinition = exports.processDefinition = void 0;
const dataTypes_1 = require("./dataTypes");
const schema_1 = require("../models/schema");
const textEscape_1 = require("../lib/textEscape");
/**
 * If Property field is present parse them.
 * @param name of the definition
 * @param definition definition object
 */
function parseProperties(name, definition) {
    const required = 'required' in definition ? definition.required : [];
    const res = [];
    Object.keys(definition.properties).forEach((propName) => {
        const prop = definition.properties[propName];
        const typeCell = (0, dataTypes_1.dataTypeResolver)(new schema_1.Schema(prop));
        const descriptionParts = [];
        if ('description' in prop) {
            descriptionParts.push((0, textEscape_1.textEscape)(prop.description.replace(/[\r\n]/g, ' ')));
        }
        if ('enum' in prop) {
            const enumValues = prop.enum
                .map((val) => `\`${JSON.stringify(val)}\``)
                .join(', ');
            descriptionParts.push(`_Enum:_ ${enumValues}`);
        }
        if ('example' in prop) {
            descriptionParts.push(`_Example:_ \`${JSON.stringify(prop.example)}\``);
        }
        const descriptionCell = descriptionParts.join('<br>');
        const requiredCell = required.includes(propName) ? 'Yes' : 'No';
        res.push(`| ${propName} | ${typeCell} | ${descriptionCell} | ${requiredCell} |`);
    });
    return res;
}
/**
 * Parse allOf definition
 * @param name of the definition
 * @param definition definition object
 */
const parsePrimitive = (name, definition) => {
    const res = [];
    const typeCell = 'type' in definition ? definition.type : '';
    const descriptionCell = ('description' in definition ? definition.description : '').replace(/[\r\n]/g, ' ');
    const requiredCell = '';
    res.push(`| ${name} | ${typeCell} | ${descriptionCell} | ${requiredCell} |`);
    return res;
};
/**
 * @param {type} name
 * @param {type} definition
 * @return {type} Description
 */
const processDefinition = (name, definition) => {
    let res = [];
    let parsedDef = [];
    res.push('');
    res.push(`#### ${name}`);
    res.push('');
    if (definition.description) {
        res.push(definition.description);
        res.push('');
    }
    res.push('| Name | Type | Description | Required |');
    res.push('| ---- | ---- | ----------- | -------- |');
    if ('properties' in definition) {
        parsedDef = parseProperties(name, definition);
    }
    else {
        parsedDef = parsePrimitive(name, definition);
    }
    res = res.concat(parsedDef);
    if (definition.example) {
        const formattedExample = typeof definition.example === 'string'
            ? definition.example
            : JSON.stringify(definition.example, null, '  ');
        res.push('');
        res.push('**Example**');
        res.push(`<pre>${formattedExample}</pre>`);
    }
    return res.length ? res.join('\n') : null;
};
exports.processDefinition = processDefinition;
/**
 * @param {type} definitions
 * @return {type} Description
 */
const transformDefinition = (definitions) => {
    const res = [];
    Object.keys(definitions).forEach((definitionName) => {
        let definition = definitions[definitionName];
        if (definition['allOf']) {
            definition = definition['allOf'].reduce((acc, value) => ({...acc, ...value }));
        }
        return res.push((0, exports.processDefinition)(definitionName, definition));
    });
    if (res.length > 0) {
        res.unshift('### Models\n');
        return res.join('\n');
    }
    return null;
};
exports.transformDefinition = transformDefinition;
