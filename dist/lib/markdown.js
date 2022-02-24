"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const textEscape_1 = require("./textEscape");
class Markdown {
    constructor(res = [], buffer = '') {
        this.res = res;
        this.buffer = buffer;
    }
    get length() {
        return this.res.length;
    }
    line(line, escape = false) {
        if (escape) {
            this.buffer += (0, textEscape_1.textEscape)(line);
        }
        else {
            this.buffer += line;
        }
        return this;
    }
    link(anchor, href) {
        this.buffer += `[${anchor}](${href})`;
        return this;
    }
    bold() {
        if (this.buffer.length)
            this.buffer = `**${this.buffer}**`;
        return this;
    }
    italic() {
        if (this.buffer.length)
            this.buffer = `*${this.buffer}*`;
        return this;
    }
    h1() {
        if (this.buffer.length)
            this.buffer = `# ${this.buffer}`;
        return this;
    }
    h2() {
        if (this.buffer.length)
            this.buffer = `## ${this.buffer}`;
        return this;
    }
    h3() {
        if (this.buffer.length)
            this.buffer = `### ${this.buffer}`;
        return this;
    }
    prepend() {
        this.res.unshift(this.buffer);
        this.buffer = '';
        return this;
    }
    append() {
        this.res.push(this.buffer);
        this.buffer = '';
        return this;
    }
    lineBreak() {
        this.res.push('\n');
        return this;
    }
    horizontalRule() {
        this.res.push('---');
        return this;
    }
    export() {
        if (!this.length) {
            return null;
        }
        return `${this.res.join('\n')}\n`;
    }
}
exports.Markdown = Markdown;
