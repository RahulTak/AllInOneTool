export function init() {
    const input = document.getElementById('htm-input');
    const output = document.getElementById('htm-output');
    const clearBtn = document.getElementById('htm-btn-clear');
    const resetBtn = document.getElementById('htm-btn-reset');
    const copyBtn = document.getElementById('htm-btn-copy');
    const downloadBtn = document.getElementById('htm-btn-download');

    if (!input || !output) return;

    function htmlToMarkdown(html) {
        if (!html || !html.trim()) return '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tag = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes).map(processNode).join('');

            switch (tag) {
                case 'h1': return '\n\n# ' + children.trim() + '\n\n';
                case 'h2': return '\n\n## ' + children.trim() + '\n\n';
                case 'h3': return '\n\n### ' + children.trim() + '\n\n';
                case 'h4': return '\n\n#### ' + children.trim() + '\n\n';
                case 'h5': return '\n\n##### ' + children.trim() + '\n\n';
                case 'h6': return '\n\n###### ' + children.trim() + '\n\n';
                case 'p': return '\n\n' + children.trim() + '\n\n';
                case 'strong':
                case 'b': return '**' + children + '**';
                case 'em':
                case 'i': return '*' + children + '*';
                case 'u': return '<u>' + children + '</u>';
                case 's':
                case 'del':
                case 'strike': return '~~' + children + '~~';
                case 'a': {
                    const href = node.getAttribute('href') || '';
                    return '[' + (children.trim() || href) + '](' + href + ')';
                }
                case 'img': {
                    const alt = node.getAttribute('alt') || 'Image';
                    const src = node.getAttribute('src') || '';
                    return '![' + alt + '](' + src + ')';
                }
                case 'blockquote': {
                    const lines = children.trim().split('\n');
                    return '\n\n' + lines.map(l => '> ' + l).join('\n') + '\n\n';
                }
                case 'pre': {
                    const codeNode = node.querySelector('code');
                    const codeText = codeNode ? codeNode.textContent : node.textContent;
                    return '\n\n```\n' + codeText.replace(/^\n+|\n+$/g, '') + '\n```\n\n';
                }
                case 'code': {
                    if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'pre') {
                        return node.textContent;
                    }
                    return '`' + children + '`';
                }
                case 'hr': return '\n\n---\n\n';
                case 'br': return '\n';
                case 'ul': {
                    const items = Array.from(node.children)
                        .filter(c => c.tagName.toLowerCase() === 'li')
                        .map(li => '- ' + Array.from(li.childNodes).map(processNode).join('').trim());
                    return '\n\n' + items.join('\n') + '\n\n';
                }
                case 'ol': {
                    const items = Array.from(node.children)
                        .filter(c => c.tagName.toLowerCase() === 'li')
                        .map((li, idx) => (idx + 1) + '. ' + Array.from(li.childNodes).map(processNode).join('').trim());
                    return '\n\n' + items.join('\n') + '\n\n';
                }
                case 'table': {
                    const rows = Array.from(node.querySelectorAll('tr'));
                    if (rows.length === 0) return '';
                    let mdTable = '\n\n';
                    let colCount = 0;
                    rows.forEach((tr, rIdx) => {
                        const cells = Array.from(tr.querySelectorAll('th, td'));
                        if (rIdx === 0) {
                            colCount = cells.length;
                            mdTable += '| ' + cells.map(c => c.textContent.trim()).join(' | ') + ' |\n';
                            mdTable += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n';
                        } else {
                            mdTable += '| ' + cells.map(c => c.textContent.trim()).join(' | ') + ' |\n';
                        }
                    });
                    return mdTable + '\n\n';
                }
                case 'script':
                case 'style': return '';
                default: return children;
            }
        }

        let result = processNode(doc.body);
        result = result.replace(/\n{3,}/g, '\n\n').trim();
        return result;
    }

    function update() {
        output.value = htmlToMarkdown(input.value);
    }

    input.addEventListener('input', update);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = `<h1>Hello World</h1>
<p>This is <strong>important</strong> text with an <em>italic</em> note.</p>
<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>
<blockquote>Quality is not an act, it is a habit.</blockquote>
<p>Visit <a href="https://example.com">Example Site</a> or check our docs.</p>`;
        update();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    downloadBtn.addEventListener('click', () => {
        if (!output.value) return;
        const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.md';
        a.click();
        URL.revokeObjectURL(url);
    });

    if (input.value) update();
}
