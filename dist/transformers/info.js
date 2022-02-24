"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformInfo = void 0;
const contact_1 = require("./contact");
const license_1 = require("./license");
const textEscape_1 = require("../lib/textEscape");
// import { Markdown } from '../lib/markdown';
/**
 * http://swagger.io/specification/#infoObject
 * Prepare page header
 * Leave description with no changes
 * @param {Object} info
 * @returns {String}
 */
function transformInfo(info) {
    const res = [];
    if (info !== null && typeof info === 'object') {
        if ('title' in info) {
            res.push(`# ${info.title}`);
        }
        if ('description' in info) {
            res.push(`${(0, textEscape_1.textEscape)(info.description)}\n`);
        }
        if ('version' in info) {
            res.push(`## Version: ${info.version}\n`);
        }
        if ('termsOfService' in info) {
            res.push(`### Terms of service\n${(0, textEscape_1.textEscape)(info.termsOfService)}\n`);
        }
        if ('contact' in info) {
            res.push((0, contact_1.transformContact)(info.contact));
        }
        if ('license' in info) {
            res.push((0, license_1.transformLicense)(info.license));
        }
    }
    return res.length ? res.join('\n') : null;
}
exports.transformInfo = transformInfo;
