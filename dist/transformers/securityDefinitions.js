"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSecurityDefinitions = exports.nameResolver = exports.typeResolver = void 0;
exports.typeResolver = {
    basic: 'Basic',
    apiKey: 'API Key',
    oauth2: 'OAuth 2.0',
};
exports.nameResolver = {
    description: 'Description',
    name: 'Name',
    in: 'In',
    flow: 'Flow',
    authorizationUrl: 'Authorization URL',
    tokenUrl: 'Token URL',
};
const transformSecurityDefinitions = (securityDefinitions) => {
    // Base block
    const res = [];
    Object.keys(securityDefinitions).forEach((type) => {
        res.push(`**${type}**  \n`);
        res.push(`|${securityDefinitions[type].type}|*${exports.typeResolver[securityDefinitions[type].type]}*|`);
        res.push('|---|---|');
        Object.keys(securityDefinitions[type]).forEach((value) => {
            if (value === 'scopes') {
                res.push('|**Scopes**||');
                Object.keys(securityDefinitions[type][value]).forEach((scope) => {
                    res.push(`|${scope}|`
                        + `${securityDefinitions[type][value][scope].replace(/[\r\n]/g, ' ')}|`);
                });
                return;
            }
            if (value !== 'type' && securityDefinitions[type][value].replace) {
                let key = exports.nameResolver[value];
                if (key === undefined) {
                    if (!value.match(/^x-/i)) {
                        return;
                    }
                    key = value;
                }
                res.push(`|${key}|${securityDefinitions[type][value].replace(/[\r\n]/g, ' ')}|`);
            }
        });
        res.push('');
    });
    // Create header
    // Only in case if there is any data
    if (res.length > 0) {
        res.unshift('### Security');
    }
    return res.length ? res.join('\n') : null;
};
exports.transformSecurityDefinitions = transformSecurityDefinitions;
