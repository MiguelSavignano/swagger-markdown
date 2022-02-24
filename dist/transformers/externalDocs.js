"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformExternalDocs = void 0;
const markdown_1 = require("../lib/markdown");
const DEFAULT_TEXT = 'Find more info here';
function transformExternalDocs(externalDocs) {
    const md = new markdown_1.Markdown();
    if ('url' in externalDocs) {
        md.link(externalDocs.description || DEFAULT_TEXT, externalDocs.url).append();
    }
    return md.export();
}
exports.transformExternalDocs = transformExternalDocs;
