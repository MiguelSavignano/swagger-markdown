"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResponses = void 0;
const schema_1 = require("../models/schema");
const dataTypes_1 = require("./dataTypes");
const textEscape_1 = require("../lib/textEscape");
/**
 * Build responses table
 * @param {object} responses
 * @returns {null|string}
 */
const transformResponses = (responses) => {
    const res = [];
    // Check if schema somewhere
    const schemas = Object.keys(responses).reduce((acc, response) => acc || 'schema' in responses[response], false);
    Object.keys(responses).forEach((responseCode) => {
        const line = [];
        const response = responses[responseCode];
        // Response
        line.push(responseCode);
        // Description
        let description = '';
        if ('description' in response) {
            description += (0, textEscape_1.textEscape)(response.description.replace(/[\r\n]/g, ' '));
        }
        if ('examples' in response) {
            description += Object.entries(response.examples).map(([contentType, example]) => {
                let formattedExample = typeof example === 'string' ? example : JSON.stringify(example, null, '  ');
                formattedExample = formattedExample.replace(/\r?\n/g, '<br>');
                return `<br><br>**Example** (*${contentType}*):<br><pre>${formattedExample}</pre>`;
            }).join('');
        }
        line.push(description);
        // Schema
        if ('schema' in response) {
            const schema = new schema_1.Schema(response.schema);
            line.push((0, dataTypes_1.dataTypeResolver)(schema));
        }
        else if (schemas) {
            line.push('');
        }
        // Combine all together
        res.push(`|${line.map((el) => ` ${el} `).join('|')}|`);
    });
    res.unshift(`| ---- | ----------- |${schemas ? ' ------ |' : ''}`);
    res.unshift(`| Code | Description |${schemas ? ' Schema |' : ''}`);
    res.unshift('##### Responses\n');
    return res.join('\n');
};
exports.transformResponses = transformResponses;
