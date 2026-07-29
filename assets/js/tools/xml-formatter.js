export function init() {
    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');
    const errorMsg = document.getElementById('xml-error-msg');
    const indentSel = document.getElementById('xml-indent');
    const beauty = document.getElementById('xml-beautify');
    const mini = document.getElementById('xml-minify');
    const clearBtn = document.getElementById('xml-clear');
    const reset = document.getElementById('xml-reset');
    const copy = document.getElementById('xml-copy');
    const download = document.getElementById('xml-download');
    const actionRow = document.getElementById('xml-action-row');

    if (!input) return;

    function preprocessInput(val) {
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            try {
                return JSON.parse(val);
            } catch (e) {
                return val.slice(1, -1)
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\t/g, '\t')
                    .replace(/\\\\/g, '\\');
            }
        }
        if (val.startsWith("'") && val.endsWith("'")) {
            return val.slice(1, -1)
                .replace(/\\'/g, "'")
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');
        }
        return val;
    }

    function formatXml(doc, indentString) {
        function escapeXmlText(str) {
            return str.replace(/[<>&'"]/g, c => {
                switch (c) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case "'": return '&apos;';
                    case '"': return '&quot;';
                    default: return c;
                }
            });
        }
        function serialize(node, depth = 0) {
            const indent = indentString.repeat(depth);
            if (node.nodeType === 1) {
                let res = indent + '<' + node.tagName;
                for (let i = 0; i < node.attributes.length; i++) {
                    const attr = node.attributes[i];
                    res += ' ' + attr.name + '="' + escapeXmlText(attr.value) + '"';
                }
                if (node.childNodes.length === 0) {
                    return res + ' />';
                }
                const hasElements = Array.from(node.childNodes).some(c => c.nodeType === 1);
                if (!hasElements) {
                    let text = '';
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const child = node.childNodes[i];
                        if (child.nodeType === 3) {
                            text += escapeXmlText(child.nodeValue);
                        } else if (child.nodeType === 4) {
                            text += '<![CDATA[' + child.nodeValue + ']]>';
                        } else if (child.nodeType === 8) {
                            text += '<!--' + child.nodeValue + '-->';
                        }
                    }
                    text = text.trim();
                    if (text.includes('\n') || text.length > 80) {
                        return res + '>\n' + indent + indentString + text + '\n' + indent + '</' + node.tagName + '>';
                    }
                    return res + '>' + text + '</' + node.tagName + '>';
                }
                res += '>\n';
                for (let i = 0; i < node.childNodes.length; i++) {
                    const childStr = serialize(node.childNodes[i], depth + 1);
                    if (childStr) res += childStr + '\n';
                }
                res += indent + '</' + node.tagName + '>';
                return res;
            } else if (node.nodeType === 3) {
                const val = node.nodeValue.trim();
                return val ? indent + escapeXmlText(val) : '';
            } else if (node.nodeType === 4) {
                return indent + '<![CDATA[' + node.nodeValue + ']]>';
            } else if (node.nodeType === 8) {
                return indent + '<!--' + node.nodeValue + '-->';
            } else if (node.nodeType === 7) {
                return indent + '<?' + node.target + ' ' + node.data + '?>';
            } else if (node.nodeType === 10) {
                return indent + '<!DOCTYPE ' + node.name + '>';
            }
            return '';
        }
        let result = '';
        for (let i = 0; i < doc.childNodes.length; i++) {
            const str = serialize(doc.childNodes[i], 0);
            if (str) result += str + '\n';
        }
        return result.trim();
    }

    function minifyXml(doc) {
        function escapeXmlText(str) {
            return str.replace(/[<>&'"]/g, c => {
                switch (c) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case "'": return '&apos;';
                    case '"': return '&quot;';
                    default: return c;
                }
            });
        }
        function serialize(node) {
            if (node.nodeType === 1) {
                let res = '<' + node.tagName;
                for (let i = 0; i < node.attributes.length; i++) {
                    const attr = node.attributes[i];
                    res += ' ' + attr.name + '="' + escapeXmlText(attr.value) + '"';
                }
                if (node.childNodes.length === 0) {
                    return res + ' />';
                }
                res += '>';
                for (let i = 0; i < node.childNodes.length; i++) {
                    res += serialize(node.childNodes[i]);
                }
                res += '</' + node.tagName + '>';
                return res;
            } else if (node.nodeType === 3) {
                return escapeXmlText(node.nodeValue.trim());
            } else if (node.nodeType === 4) {
                return '<![CDATA[' + node.nodeValue + ']]>';
            } else if (node.nodeType === 7) {
                return '<?' + node.target + ' ' + node.data + '?>';
            } else if (node.nodeType === 10) {
                return '<!DOCTYPE ' + node.name + '>';
            }
            return '';
        }
        let result = '';
        for (let i = 0; i < doc.childNodes.length; i++) {
            result += serialize(doc.childNodes[i]);
        }
        return result.trim();
    }

    beauty.addEventListener('click', () => {
        let val = input.value.trim();
        if (!val) return;
        val = preprocessInput(val);
        const parser = new DOMParser();
        const doc = parser.parseFromString(val, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            output.value = '';
            let errorText = parseError.textContent || 'XML parsing error';
            errorText = errorText.replace(/\bhttps?:\/\/\S+\b/g, '');
            errorMsg.textContent = '❌ XML Syntax Error: ' + errorText.trim();
            errorMsg.style.display = 'block';
            actionRow.style.display = 'none';
            return;
        }
        errorMsg.style.display = 'none';
        
        const spaces = parseInt(indentSel.value, 10) || 2;
        const indentString = ' '.repeat(spaces);
        
        const declMatch = val.match(/^\s*(<\?xml[^>]*\?>)/i);
        const decl = declMatch ? declMatch[1] + '\n' : '';
        
        output.value = decl + formatXml(doc, indentString);
        actionRow.style.display = 'flex';
    });

    mini.addEventListener('click', () => {
        let val = input.value.trim();
        if (!val) return;
        val = preprocessInput(val);
        const parser = new DOMParser();
        const doc = parser.parseFromString(val, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            output.value = '';
            let errorText = parseError.textContent || 'XML parsing error';
            errorText = errorText.replace(/\bhttps?:\/\/\S+\b/g, '');
            errorMsg.textContent = '❌ XML Syntax Error: ' + errorText.trim();
            errorMsg.style.display = 'block';
            actionRow.style.display = 'none';
            return;
        }
        errorMsg.style.display = 'none';
        
        const declMatch = val.match(/^\s*(<\?xml[^>]*\?>)/i);
        const decl = declMatch ? declMatch[1] : '';
        
        output.value = decl + minifyXml(doc);
        actionRow.style.display = 'flex';
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        indentSel.value = '2';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => alert('Copied XML to clipboard!'));
    });

    download.addEventListener('click', () => {
        if (!output.value) return;
        const blob = new Blob([output.value], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.xml';
        a.click();
        URL.revokeObjectURL(url);
    });
}
