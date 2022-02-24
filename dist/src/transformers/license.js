"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformLicense = void 0;
const markdown_1 = require("../lib/markdown");
/**
 * http://swagger.io/specification/#licenseObject
 * License object transformer
 */
function transformLicense(license) {
    const md = new markdown_1.Markdown();
    if ('url' in license || 'name' in license) {
        md.line('License:').bold().line(' ');
        if ('url' in license && 'name' in license) {
            md.link(license.name, license.url);
        }
        else {
            md.line(license.name || license.url);
        }
        md.append();
    }
    return md.export();
}
exports.transformLicense = transformLicense;
