"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformParameters = void 0;
const dataTypes_1 = require("./dataTypes");
const schema_1 = require("../models/schema");
const textEscape_1 = require("../lib/textEscape");
const transformParameters = (parameters, pathParameters) => {
    const res = [];
    res.push('##### Parameters\n');
    res.push('| Name | Located in | Description | Required | Schema |');
    res.push('| ---- | ---------- | ----------- | -------- | ---- |');
    [].concat(pathParameters, parameters).forEach((keys) => {
        if (keys) {
            const line = [];
            // Name first
            line.push(keys.name || '');
            // Scope (in)
            line.push(keys.in || '');
            // description
            if ('description' in keys) {
                line.push((0, textEscape_1.textEscape)(keys.description.replace(/[\r\n]/g, ' ')));
            }
            else {
                line.push('');
            }
            line.push(keys.required ? 'Yes' : 'No');
            // Prepare schema to be transformed
            let schema = null;
            if ('schema' in keys) {
                schema = new schema_1.Schema(keys.schema);
            }
            else {
                schema = new schema_1.Schema();
                schema.setType('type' in keys ? keys.type : null);
                schema.setFormat('format' in keys ? keys.format : null);
                schema.setReference('$ref' in keys ? keys.$ref : null);
                schema.setItems('items' in keys ? keys.items : null);
            }
            line.push((0, dataTypes_1.dataTypeResolver)(schema));
            // Add spaces and glue using pipeline
            const glued = line.map((el) => ` ${el} `).join('|');
            res.push(`|${glued}|`);
        }
    });
    return res.join('\n');
};
exports.transformParameters = transformParameters;
