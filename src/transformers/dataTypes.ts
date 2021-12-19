import { anchor } from '../lib/anchor';
import { SchemaInterface } from '../models/schema';

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
export const dataTypeResolver = (schema: SchemaInterface) => {
  if (schema.getAllOf()) {
    return schema.getAllOf()
      .map((subSchema) => dataTypeResolver(subSchema))
      .filter((type) => type !== '')
      .join(' & ');
  }
  if (schema.getReference()) {
    const name = schema.getReference().match(/\/([^/]*)$/i)[1];
    const link = anchor(name);
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
    const subType = dataTypeResolver(schema.getItems());
    return `[ ${subType} ]`;
  }
  if (schema.getType()) {
    return schema.getType();
  }
  return '';
};
