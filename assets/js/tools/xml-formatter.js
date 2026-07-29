export function init() {
    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');
    const errorMsg = document.getElementById('xml-error-msg');
    const beauty = document.getElementById('xml-beautify');
    const mini = document.getElementById('xml-minify');
    const reset = document.getElementById('xml-reset');
    const copy = document.getElementById('xml-copy');
    const download = document.getElementById('xml-download');
    const actionRow = document.getElementById('xml-action-row');

    if (!input) return;

    function formatXMLNode(node, indent = 0) {
        const padding = '  '.repeat(indent);
        if (node.nodeType === 3) {
            const text = node.nodeValue.trim();
            return text ? padding + text + '\n' : '';
        }
        if (node.nodeType === 1) {
            let xml = padding + '<' + node.nodeName;
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                xml += ' ' + attr.name + '="' + attr.value + '"';
            }
            if (node.childNodes.length === 0) {
                return xml + ' />\n';
            }
            let hasChildElements = false;
            let childrenXml = '';
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                if (child.nodeType === 1) {
                    hasChildElements = true;
                }
                childrenXml += formatXMLNode(child, indent + 1);
            }
            if (hasChildElements) {
                return xml + '>\n' + childrenXml + padding + '</' + node.nodeName + '>\n';
            } else {
                const textContent = node.textContent.trim();
                return xml + '>' + textContent + '</' + node.nodeName + '>\n';
            }
        }
        return '';
    }

    beauty.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(val, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            output.value = '';
            errorMsg.textContent = '❌ XML Syntax Error: ' + parseError.textContent;
            errorMsg.style.display = 'block';
            actionRow.style.display = 'none';
            return;
        }
        errorMsg.style.display = 'none';
        
        let result = '';
        for (let i = 0; i < doc.childNodes.length; i++) {
            const child = doc.childNodes[i];
            if (child.nodeType === 1) {
                result += formatXMLNode(child, 0);
            } else if (child.nodeType === 8) {
                result += '<!--' + child.nodeValue + '-->\n';
            } else if (child.nodeType === 10) {
                result += '<!DOCTYPE ' + child.name + '>\n';
            }
        }
        output.value = result.trim();
        actionRow.style.display = 'flex';
    });

    mini.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(val, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            output.value = '';
            errorMsg.textContent = '❌ XML Syntax Error: ' + parseError.textContent;
            errorMsg.style.display = 'block';
            actionRow.style.display = 'none';
            return;
        }
        errorMsg.style.display = 'none';
        
        let minified = val.replace(/\s*<(\/?[\w\-\:]+)([^>]*)>\s*/g, '<$1$2>');
        output.value = minified.trim();
        actionRow.style.display = 'flex';
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied XML to clipboard!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.xml';
        a.click();
        URL.revokeObjectURL(url);
    });
}
