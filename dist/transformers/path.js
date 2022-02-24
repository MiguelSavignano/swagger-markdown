"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPath = void 0;
const pathResponses_1 = require("./pathResponses");
const pathParameters_1 = require("./pathParameters");
const security_1 = require("./security");
const textEscape_1 = require("../lib/textEscape");
/**
 * Allowed methods
 * @type {string[]}
 */
const ALLOWED_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options'];
const transformPath = (path, data, parameters) => {
    const res = [];
    let pathParameters = null;
    if (!path || !data) {
        return null;
    }
    // Make path as a header
    res.push(`### ${path}\n`);
    // Check if parameter for path are in the place
    if ('parameters' in data) {
        pathParameters = data.parameters;
    }
    // Go further method by methods
    Object.keys(data).forEach((method) => {
        if (ALLOWED_METHODS.includes(method)) {
            // Set method as a subheader
            res.push(`#### ${method.toUpperCase()}`);
            const pathInfo = data[method];
            // Set summary
            if ('summary' in pathInfo) {
                res.push(`##### Summary:\n\n${(0, textEscape_1.textEscape)(pathInfo.summary)}\n`);
            }
            // Set description
            if ('description' in pathInfo) {
                res.push(`##### Description:\n\n${(0, textEscape_1.textEscape)(pathInfo.description)}\n`);
            }
            // Build parameters
            if ('parameters' in pathInfo || pathParameters) {
                // This won't work
                // res.push(`${transformParameters(pathInfo.parameters, pathParameters, parameters)}\n`);
                res.push(`${(0, pathParameters_1.transformParameters)(pathInfo.parameters, pathParameters)}\n`);
            }
            // Build responses
            if ('responses' in pathInfo) {
                res.push(`${(0, pathResponses_1.transformResponses)(pathInfo.responses)}\n`);
            }
            // Build security
            if ('security' in pathInfo) {
                res.push(`${(0, security_1.transformSecurity)(pathInfo.security)}\n`);
            }
        }
    });
    return res.length ? res.join('\n') : null;
};
exports.transformPath = transformPath;
