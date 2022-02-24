"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformContact = void 0;
const markdown_1 = require("../lib/markdown");
/**
 * http://swagger.io/specification/#contactObject
 * Contact info transformer
 */
function transformContact(contact) {
    const md = new markdown_1.Markdown();
    if (Object.keys(contact).some((item) => ['name', 'url', 'email'].includes(item))) {
        md.line('Contact information:').bold().append();
        if ('name' in contact) {
            md.line(contact.name, true).append();
        }
        if ('url' in contact) {
            md.line(contact.url).append();
        }
        if ('email' in contact) {
            md.line(contact.email).append();
        }
    }
    return md.export();
}
exports.transformContact = transformContact;
