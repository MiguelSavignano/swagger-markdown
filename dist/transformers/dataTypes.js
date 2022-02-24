"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataTypeResolver = void 0;
const anchor_1 = require("../lib/anchor");
const resolver = {
    integer: {
        int32: 'integer',
        int64: 'long',
    },
    number: {
        float: 'float',
        double: 'double',
    },
    string: {
        byte: 'byte',
        binary: 'binary',
        date: 'date',
        'date-time': 'dateTime',
        password: 'password',
    },
};
/**
 * Transform data types into common names
 * @param {Schema} schema
 * @return {String}
 */
const dataTypeResolver = (schema) => {
    if (schema.getAllOf()) {
        return schema.getAllOf()
            .map((subSchema) => (0, exports.dataTypeResolver)(subSchema))
            .filter((type) => type !== '')
            .join(' & ');
    }
    if (schema.getReference()) {
        const name = schema.getReference().match(/\/([^/]*)$/i)[1];
        const link = (0, anchor_1.anchor)(name);
        return `[${name}](#${link})`;
    }
    if (schema.getType() in resolver) {
        if (schema.getFormat()) {
            return schema.getFormat() in resolver[schema.getType()]
                ? resolver[schema.getType()][schema.getFormat()]
                : `${schema.getType()} (${schema.getFormat()})`;
        }
        return schema.getType();
    }
    if (schema.getFormat()) {
        return `${schema.getType()} (${schema.getFormat()})`;
    }
    if (schema.getType() === 'array') {
        const subType = (0, exports.dataTypeResolver)(schema.getItems());
        return `[ ${subType} ]`;
    }
    if (schema.getType()) {
        return schema.getType();
    }
    return '';
};
exports.dataTypeResolver = dataTypeResolver;
