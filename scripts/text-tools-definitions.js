module.exports = {
    // 1. HTML to Markdown
    'html-to-markdown': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="htm-input">HTML Input</label>
                    <textarea id="htm-input" class="input-control" placeholder="Paste HTML code here... e.g. <h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>" style="min-height: 350px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="htm-output">Markdown Output</label>
                    <textarea id="htm-output" class="input-control" readonly placeholder="Markdown will appear here..." style="min-height: 350px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="htm-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="htm-btn-reset">Reset Example</button>
                <button class="btn btn-secondary" id="htm-btn-download">Download .md</button>
                <button class="btn btn-primary" id="htm-btn-copy">Copy Markdown</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
                case 'h1': return '\\n\\n# ' + children.trim() + '\\n\\n';
                case 'h2': return '\\n\\n## ' + children.trim() + '\\n\\n';
                case 'h3': return '\\n\\n### ' + children.trim() + '\\n\\n';
                case 'h4': return '\\n\\n#### ' + children.trim() + '\\n\\n';
                case 'h5': return '\\n\\n##### ' + children.trim() + '\\n\\n';
                case 'h6': return '\\n\\n###### ' + children.trim() + '\\n\\n';
                case 'p': return '\\n\\n' + children.trim() + '\\n\\n';
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
                    const lines = children.trim().split('\\n');
                    return '\\n\\n' + lines.map(l => '> ' + l).join('\\n') + '\\n\\n';
                }
                case 'pre': {
                    const codeNode = node.querySelector('code');
                    const codeText = codeNode ? codeNode.textContent : node.textContent;
                    return '\\n\\n\`\`\`\\n' + codeText.replace(/^\\n+|\\n+$/g, '') + '\\n\`\`\`\\n\\n';
                }
                case 'code': {
                    if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'pre') {
                        return node.textContent;
                    }
                    return '\`' + children + '\`';
                }
                case 'hr': return '\\n\\n---\\n\\n';
                case 'br': return '\\n';
                case 'ul': {
                    const items = Array.from(node.children)
                        .filter(c => c.tagName.toLowerCase() === 'li')
                        .map(li => '- ' + Array.from(li.childNodes).map(processNode).join('').trim());
                    return '\\n\\n' + items.join('\\n') + '\\n\\n';
                }
                case 'ol': {
                    const items = Array.from(node.children)
                        .filter(c => c.tagName.toLowerCase() === 'li')
                        .map((li, idx) => (idx + 1) + '. ' + Array.from(li.childNodes).map(processNode).join('').trim());
                    return '\\n\\n' + items.join('\\n') + '\\n\\n';
                }
                case 'table': {
                    const rows = Array.from(node.querySelectorAll('tr'));
                    if (rows.length === 0) return '';
                    let mdTable = '\\n\\n';
                    let colCount = 0;
                    rows.forEach((tr, rIdx) => {
                        const cells = Array.from(tr.querySelectorAll('th, td'));
                        if (rIdx === 0) {
                            colCount = cells.length;
                            mdTable += '| ' + cells.map(c => c.textContent.trim()).join(' | ') + ' |\\n';
                            mdTable += '| ' + Array(colCount).fill('---').join(' | ') + ' |\\n';
                        } else {
                            mdTable += '| ' + cells.map(c => c.textContent.trim()).join(' | ') + ' |\\n';
                        }
                    });
                    return mdTable + '\\n\\n';
                }
                case 'script':
                case 'style': return '';
                default: return children;
            }
        }

        let result = processNode(doc.body);
        result = result.replace(/\\n{3,}/g, '\\n\\n').trim();
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
        input.value = \`<h1>Hello World</h1>
<p>This is <strong>important</strong> text with an <em>italic</em> note.</p>
<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>
<blockquote>Quality is not an act, it is a habit.</blockquote>
<p>Visit <a href="https://example.com">Example Site</a> or check our docs.</p>\`;
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
`
    }),

    // 2. Markdown to HTML
    'markdown-to-html': () => ({
        workspaceHTML: `
        <div class="tool-workspace" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="mth-input">Markdown Input</label>
                    <textarea id="mth-input" class="input-control" placeholder="Type Markdown here... e.g. # Hello World" style="min-height: 350px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="mth-output-code">Generated HTML Code</label>
                    <textarea id="mth-output-code" class="input-control" readonly placeholder="HTML code will appear here..." style="min-height: 350px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="form-group">
                <label>Live HTML Preview</label>
                <div id="mth-preview" style="min-height: 180px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.25rem; overflow-y: auto; background: var(--bg-primary);"></div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="mth-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="mth-btn-reset">Reset Example</button>
                <button class="btn btn-secondary" id="mth-btn-download">Download HTML</button>
                <button class="btn btn-primary" id="mth-btn-copy">Copy HTML Code</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('mth-input');
    const outputCode = document.getElementById('mth-output-code');
    const preview = document.getElementById('mth-preview');
    const clearBtn = document.getElementById('mth-btn-clear');
    const resetBtn = document.getElementById('mth-btn-reset');
    const copyBtn = document.getElementById('mth-btn-copy');
    const downloadBtn = document.getElementById('mth-btn-download');

    if (!input || !outputCode) return;

    function parseMarkdown(md) {
        if (!md) return '';
        let lines = md.split('\\n');
        let html = [];
        let inCode = false;
        let codeBlock = [];
        let inList = false;
        let listType = '';
        let inTable = false;
        let tableRows = [];

        function escapeHtml(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function parseInlines(text) {
            let res = escapeHtml(text);
            // Images: ![alt](url)
            res = res.replace(/!\\[([^\\]]*)\\]\\(([^\\)]+)\\)/g, '<img src="$2" alt="$1">');
            // Links: [text](url)
            res = res.replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, '<a href="$2">$1</a>');
            // Inline code: \`code\`
            res = res.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
            // Bold + Italic: ***text***
            res = res.replace(/\\*\\*\\*([^\\*]+)\\*\\*\\*/g, '<strong><em>$1</em></strong>');
            // Bold: **text** or __text__
            res = res.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
            res = res.replace(/__([^_]+)__/g, '<strong>$1</strong>');
            // Italic: *text* or _text_
            res = res.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
            res = res.replace(/_([^_]+)_/g, '<em>$1</em>');
            // Strikethrough: ~~text~~
            res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');
            return res;
        }

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Fenced code block
            if (line.trim().startsWith('\`\`\`')) {
                if (inCode) {
                    html.push('<pre><code>' + escapeHtml(codeBlock.join('\\n')) + '</code></pre>');
                    codeBlock = [];
                    inCode = false;
                } else {
                    inCode = true;
                }
                continue;
            }
            if (inCode) {
                codeBlock.push(line);
                continue;
            }

            // Close list if line is not a list item
            const isUl = /^\\s*[-*+]\\s+(.*)/.test(line);
            const isOl = /^\\s*\\d+\\.\\s+(.*)/.test(line);
            if (!isUl && !isOl && inList) {
                html.push('</' + listType + '>');
                inList = false;
            }

            // Table detection
            const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');
            if (isTableLine) {
                inTable = true;
                tableRows.push(line.trim());
                continue;
            } else if (inTable) {
                // Flush table
                html.push(renderTable(tableRows, parseInlines));
                tableRows = [];
                inTable = false;
            }

            // Empty line
            if (!line.trim()) {
                continue;
            }

            // Headings
            const hMatch = line.match(/^(#{1,6})\\s+(.*)/);
            if (hMatch) {
                const level = hMatch[1].length;
                html.push('<h' + level + '>' + parseInlines(hMatch[2]) + '</h' + level + '>');
                continue;
            }

            // Horizontal rule
            if (/^(\\-{3,}|\\*{3,}|_{3,})$/.test(line.trim())) {
                html.push('<hr>');
                continue;
            }

            // Blockquote
            if (line.startsWith('>')) {
                html.push('<blockquote>' + parseInlines(line.replace(/^>\\s?/, '')) + '</blockquote>');
                continue;
            }

            // Unordered List
            if (isUl) {
                const text = line.replace(/^\\s*[-*+]\\s+/, '');
                if (!inList || listType !== 'ul') {
                    if (inList) html.push('</' + listType + '>');
                    html.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                html.push('<li>' + parseInlines(text) + '</li>');
                continue;
            }

            // Ordered List
            if (isOl) {
                const text = line.replace(/^\\s*\\d+\\.\\s+/, '');
                if (!inList || listType !== 'ol') {
                    if (inList) html.push('</' + listType + '>');
                    html.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                html.push('<li>' + parseInlines(text) + '</li>');
                continue;
            }

            // Paragraph
            html.push('<p>' + parseInlines(line) + '</p>');
        }

        if (inCode) {
            html.push('<pre><code>' + escapeHtml(codeBlock.join('\\n')) + '</code></pre>');
        }
        if (inList) {
            html.push('</' + listType + '>');
        }
        if (inTable && tableRows.length > 0) {
            html.push(renderTable(tableRows, parseInlines));
        }

        return html.join('\\n');
    }

    function renderTable(rows, parseInlines) {
        if (rows.length === 0) return '';
        let res = '<table>\\n';
        let hasHeader = false;

        rows.forEach((row, idx) => {
            const cells = row.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
            if (cells.every(c => /^[-:]+$/.test(c))) {
                hasHeader = true;
                return;
            }
            res += '  <tr>\\n';
            cells.forEach(cell => {
                const tag = (idx === 0 && !hasHeader) ? 'th' : 'td';
                res += '    <' + tag + '>' + parseInlines(cell) + '</' + tag + '>\\n';
            });
            res += '  </tr>\\n';
        });

        res += '</table>';
        return res;
    }

    function update() {
        const parsed = parseMarkdown(input.value);
        outputCode.value = parsed;
        preview.innerHTML = parsed;
    }

    input.addEventListener('input', update);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        outputCode.value = '';
        preview.innerHTML = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = \`# Hello World

This is **bold** and *italic* text.

- Item One
- Item Two
- Item Three

> Great things in business are never done by one person.

Visit [Google](https://google.com) to search.\`;
        update();
    });

    copyBtn.addEventListener('click', () => {
        if (!outputCode.value) return;
        navigator.clipboard.writeText(outputCode.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    downloadBtn.addEventListener('click', () => {
        if (!outputCode.value) return;
        const blob = new Blob([outputCode.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    if (input.value) update();
}
`
    }),

    // 3. Remove Line Breaks
    'remove-line-breaks': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="rlb-mode">Line Break Removal Mode</label>
                    <select id="rlb-mode" class="input-control">
                        <option value="all" selected>Remove all line breaks (single space)</option>
                        <option value="paragraphs">Preserve paragraph breaks (double newlines)</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="rlb-input">Original Text</label>
                    <textarea id="rlb-input" class="input-control" placeholder="Paste text containing line breaks here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="rlb-output">Cleaned Text (No Line Breaks)</label>
                    <textarea id="rlb-output" class="input-control" readonly placeholder="Cleaned text will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="rlb-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="rlb-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="rlb-btn-copy">Copy Result</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('rlb-input');
    const output = document.getElementById('rlb-output');
    const mode = document.getElementById('rlb-mode');
    const clearBtn = document.getElementById('rlb-btn-clear');
    const resetBtn = document.getElementById('rlb-btn-reset');
    const copyBtn = document.getElementById('rlb-btn-copy');

    if (!input || !output) return;

    function process() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        if (mode.value === 'all') {
            // Replace any newline (\\r\\n, \\r, \\n) with a space, then collapse multiple spaces to a single space
            output.value = text.replace(/\\r\\n|\\r|\\n/g, ' ').replace(/[ \\t]+/g, ' ').trim();
        } else {
            // Preserve paragraph breaks: split by 2 or more newlines
            const paragraphs = text.split(/(?:\\r\\n|\\r|\\n){2,}/);
            const cleaned = paragraphs.map(p => {
                return p.replace(/\\r\\n|\\r|\\n/g, ' ').replace(/[ \\t]+/g, ' ').trim();
            }).filter(p => p.length > 0);
            output.value = cleaned.join('\\n\\n');
        }
    }

    input.addEventListener('input', process);
    mode.addEventListener('change', process);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = \`Hello
World
This
is
a
test.\`;
        process();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) process();
}
`
    }),

    // 4. Text Reverser
    'text-reverser': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="rev-mode">Reversal Mode</label>
                    <select id="rev-mode" class="input-control">
                        <option value="chars" selected>Reverse Characters (e.g. Hello World → dlroW olleH)</option>
                        <option value="words">Reverse Words (e.g. Hello World → World Hello)</option>
                        <option value="each-word">Reverse Each Word (e.g. Hello World → olleH dlroW)</option>
                        <option value="lines">Reverse Lines (first line becomes last)</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="rev-input">Input Text</label>
                    <textarea id="rev-input" class="input-control" placeholder="Type or paste text to reverse..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="rev-output">Reversed Output</label>
                    <textarea id="rev-output" class="input-control" readonly placeholder="Reversed text will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="rev-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="rev-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="rev-btn-copy">Copy Result</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('rev-input');
    const output = document.getElementById('rev-output');
    const mode = document.getElementById('rev-mode');
    const clearBtn = document.getElementById('rev-btn-clear');
    const resetBtn = document.getElementById('rev-btn-reset');
    const copyBtn = document.getElementById('rev-btn-copy');

    if (!input || !output) return;

    function reverseText() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        const selectedMode = mode.value;

        if (selectedMode === 'chars') {
            // Unicode safe character reversal via spread operator
            output.value = [...text].reverse().join('');
        } else if (selectedMode === 'words') {
            // Reverse word order while preserving whitespace tokens
            const tokens = text.split(/(\\s+)/);
            output.value = tokens.reverse().join('');
        } else if (selectedMode === 'each-word') {
            // Reverse characters within each individual word
            const tokens = text.split(/(\\s+)/);
            output.value = tokens.map(token => {
                if (/^\\s+$/.test(token)) return token;
                return [...token].reverse().join('');
            }).join('');
        } else if (selectedMode === 'lines') {
            // Reverse lines
            output.value = text.split(/\\r?\\n/).reverse().join('\\n');
        }
    }

    input.addEventListener('input', reverseText);
    mode.addEventListener('change', reverseText);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'Hello World';
        reverseText();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) reverseText();
}
`
    }),

    // 5. Find and Replace
    'find-and-replace': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                    <label for="far-find">Find Text</label>
                    <input type="text" id="far-find" class="input-control" placeholder="Search string...">
                </div>
                <div class="form-group">
                    <label for="far-replace">Replace With</label>
                    <input type="text" id="far-replace" class="input-control" placeholder="Replacement string...">
                </div>
            </div>

            <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; align-items: center;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                    <input type="checkbox" id="far-case"> Case Sensitive
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                    <input type="checkbox" id="far-whole"> Whole Words Only
                </label>
                <span id="far-count-badge" style="font-size: 0.85rem; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-secondary); margin-left: auto;">0 matches</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="far-input">Original Text</label>
                    <textarea id="far-input" class="input-control" placeholder="Paste source text here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="far-output">Modified Result</label>
                    <textarea id="far-output" class="input-control" readonly placeholder="Result will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="far-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="far-btn-reset">Reset Example</button>
                <button class="btn btn-secondary" id="far-btn-first">Replace First</button>
                <button class="btn btn-primary" id="far-btn-all">Replace All</button>
                <button class="btn btn-secondary" id="far-btn-copy">Copy Result</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('far-input');
    const findInput = document.getElementById('far-find');
    const replaceInput = document.getElementById('far-replace');
    const caseCheckbox = document.getElementById('far-case');
    const wholeCheckbox = document.getElementById('far-whole');
    const countBadge = document.getElementById('far-count-badge');
    const output = document.getElementById('far-output');
    const btnAll = document.getElementById('far-btn-all');
    const btnFirst = document.getElementById('far-btn-first');
    const clearBtn = document.getElementById('far-btn-clear');
    const resetBtn = document.getElementById('far-btn-reset');
    const copyBtn = document.getElementById('far-btn-copy');

    if (!input || !output) return;

    function escapeRegex(str) {
        return str.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    }

    function buildRegex(isGlobal) {
        const query = findInput.value;
        if (!query) return null;

        let pattern = escapeRegex(query);
        if (wholeCheckbox.checked) {
            pattern = '\\\\b' + pattern + '\\\\b';
        }

        let flags = isGlobal ? 'g' : '';
        if (!caseCheckbox.checked) flags += 'i';

        return new RegExp(pattern, flags);
    }

    function updateMatchCount() {
        const text = input.value;
        const re = buildRegex(true);
        if (!re || !text) {
            countBadge.textContent = '0 matches';
            return;
        }
        const matches = text.match(re);
        const count = matches ? matches.length : 0;
        countBadge.textContent = count + (count === 1 ? ' match' : ' matches');
    }

    function performReplace(replaceAll) {
        const text = input.value;
        const rep = replaceInput.value || '';
        const re = buildRegex(replaceAll);

        if (!re || !text) {
            output.value = text;
            countBadge.textContent = '0 replacements';
            return;
        }

        const matches = text.match(buildRegex(true));
        const totalMatches = matches ? matches.length : 0;

        output.value = text.replace(re, rep);

        if (replaceAll) {
            countBadge.textContent = totalMatches + (totalMatches === 1 ? ' replacement made' : ' replacements made');
        } else {
            const count = totalMatches > 0 ? 1 : 0;
            countBadge.textContent = count + ' replacement made';
        }
    }

    btnAll.addEventListener('click', () => performReplace(true));
    btnFirst.addEventListener('click', () => performReplace(false));

    [input, findInput, caseCheckbox, wholeCheckbox].forEach(el => {
        el.addEventListener('input', updateMatchCount);
        el.addEventListener('change', updateMatchCount);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        findInput.value = '';
        replaceInput.value = '';
        output.value = '';
        countBadge.textContent = '0 matches';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = \`Hello Rahul.
Hello John.
Hello Sarah.\`;
        findInput.value = 'Hello';
        replaceInput.value = 'Hi';
        caseCheckbox.checked = false;
        wholeCheckbox.checked = false;
        updateMatchCount();
        performReplace(true);
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    updateMatchCount();
}
`
    }),

    // 6. HTML Entities Converter
    'html-entities-converter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="ent-type">Entity Format</label>
                    <select id="ent-type" class="input-control">
                        <option value="named" selected>Named HTML Entities (e.g. &amp;, &lt;, &gt;, &quot;, &#39;)</option>
                        <option value="numeric">Decimal Numeric Entities (e.g. &amp;#38;, &amp;#60;, &amp;#62;)</option>
                        <option value="hex">Hexadecimal Entities (e.g. &amp;#x26;, &amp;#x3C;)</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="ent-input">Source Content</label>
                    <textarea id="ent-input" class="input-control" placeholder="Enter text or HTML entities to convert..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="ent-output">Converted Output</label>
                    <textarea id="ent-output" class="input-control" readonly placeholder="Output will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="ent-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="ent-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="ent-btn-encode">Encode Characters</button>
                <button class="btn btn-primary" id="ent-btn-decode">Decode Entities</button>
                <button class="btn btn-secondary" id="ent-btn-copy">Copy Output</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('ent-input');
    const output = document.getElementById('ent-output');
    const typeSelect = document.getElementById('ent-type');
    const encodeBtn = document.getElementById('ent-btn-encode');
    const decodeBtn = document.getElementById('ent-btn-decode');
    const clearBtn = document.getElementById('ent-btn-clear');
    const resetBtn = document.getElementById('ent-btn-reset');
    const copyBtn = document.getElementById('ent-btn-copy');

    if (!input || !output) return;

    function encode() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        const mode = typeSelect.value;

        if (mode === 'named') {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '\\u00A0': '&nbsp;',
                '©': '&copy;',
                '®': '&reg;',
                '™': '&trade;',
                '€': '&euro;',
                '£': '&pound;',
                '¥': '&yen;',
                '§': '&sect;'
            };
            output.value = text.replace(/[&<>"'\\u00A0©®™€£¥§]/g, m => map[m] || m);
        } else if (mode === 'numeric') {
            output.value = text.replace(/[&<>"'\\u00A0-\\uFFFF]/g, m => '&#' + m.charCodeAt(0) + ';');
        } else if (mode === 'hex') {
            output.value = text.replace(/[&<>"'\\u00A0-\\uFFFF]/g, m => '&#x' + m.charCodeAt(0).toString(16).toUpperCase() + ';');
        }
    }

    function decode() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        // Decode entities using browser DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        output.value = doc.body.textContent || '';
    }

    encodeBtn.addEventListener('click', encode);
    decodeBtn.addEventListener('click', decode);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '<Hello & "World" 2026>';
        encode();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });
}
`
    }),

    // 7. ROT13 Cipher Toggler
    'rot13-cipher': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="rot-input">Input Text</label>
                    <textarea id="rot-input" class="input-control" placeholder="Type or paste text to cipher/decipher..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="rot-output">ROT13 Output (Toggle)</label>
                    <textarea id="rot-output" class="input-control" readonly placeholder="Cipher result will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="rot-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="rot-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="rot-btn-toggle">Apply / Toggle ROT13</button>
                <button class="btn btn-secondary" id="rot-btn-copy">Copy Output</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('rot-input');
    const output = document.getElementById('rot-output');
    const toggleBtn = document.getElementById('rot-btn-toggle');
    const clearBtn = document.getElementById('rot-btn-clear');
    const resetBtn = document.getElementById('rot-btn-reset');
    const copyBtn = document.getElementById('rot-btn-copy');

    if (!input || !output) return;

    function rot13(str) {
        return str.replace(/[a-zA-Z]/g, (c) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
    }

    function process() {
        output.value = rot13(input.value);
    }

    input.addEventListener('input', process);
    toggleBtn.addEventListener('click', process);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'Hello World 123!';
        process();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) process();
}
`
    }),

    // 8. Email Address Obfuscator
    'obfuscate-email': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="obf-mode">Obfuscation Format</label>
                    <select id="obf-mode" class="input-control">
                        <option value="readable" selected>Human Readable: user [at] example [dot] com</option>
                        <option value="entities">HTML Decimal Entities: &amp;#117;&amp;#115;&amp;#101;&amp;#114;...</option>
                        <option value="mailto">URL-Encoded mailto Link: &lt;a href="mailto:%75..."&gt;</option>
                        <option value="js">JavaScript Concatenation Snippet</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="obf-input">Input Email(s) or Text</label>
                    <textarea id="obf-input" class="input-control" placeholder="Enter email address... e.g. hello@example.com" style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="obf-output">Obfuscated Anti-Scrape Output</label>
                    <textarea id="obf-output" class="input-control" readonly placeholder="Obfuscated address will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="obf-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="obf-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="obf-btn-copy">Copy Result</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('obf-input');
    const output = document.getElementById('obf-output');
    const mode = document.getElementById('obf-mode');
    const clearBtn = document.getElementById('obf-btn-clear');
    const resetBtn = document.getElementById('obf-btn-reset');
    const copyBtn = document.getElementById('obf-btn-copy');

    if (!input || !output) return;

    function obfuscateEmail(email, selectedMode) {
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const [user, domain] = parts;

        switch (selectedMode) {
            case 'readable':
                return user + ' [at] ' + domain.replace(/\\./g, ' [dot] ');
            case 'entities':
                return email.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('');
            case 'mailto': {
                const encodedMailto = encodeURIComponent(email);
                return '<a href="mailto:' + encodedMailto + '">' + email.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('') + '</a>';
            }
            case 'js': {
                const half1 = user;
                const half2 = domain;
                return '<script>document.write(\\\'' + half1 + '\\\'+\\\'@\\\'+\\\'' + half2 + '\\\');<\\\\/script>';
            }
            default:
                return email;
        }
    }

    function process() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        const selectedMode = mode.value;
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g;

        if (emailRegex.test(text)) {
            output.value = text.replace(emailRegex, (match) => obfuscateEmail(match, selectedMode));
        } else if (text.includes('@')) {
            output.value = obfuscateEmail(text.trim(), selectedMode);
        } else {
            output.value = text;
        }
    }

    input.addEventListener('input', process);
    mode.addEventListener('change', process);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'hello@example.com';
        process();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) process();
}
`
    }),

    // 9. Text to Binary Converter
    'text-to-binary': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="ttb-sep">Byte Delimiter</label>
                    <select id="ttb-sep" class="input-control">
                        <option value="space" selected>Space Separated (e.g. 01001000 01100101)</option>
                        <option value="none">None (Continuous binary)</option>
                        <option value="comma">Comma Separated</option>
                        <option value="prefix">0b Prefix (e.g. 0b01001000, 0b01100101)</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="ttb-input">Input Text (ASCII &amp; UTF-8)</label>
                    <textarea id="ttb-input" class="input-control" placeholder="Type text here to convert into binary bytes..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="ttb-output">8-Bit Binary Output</label>
                    <textarea id="ttb-output" class="input-control" readonly placeholder="Binary byte sequence will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div id="ttb-info" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                Stats: <strong id="ttb-stats">0 characters, 0 bytes, 0 bits</strong>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="ttb-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="ttb-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="ttb-btn-copy">Copy Binary</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('ttb-input');
    const output = document.getElementById('ttb-output');
    const sepSelect = document.getElementById('ttb-sep');
    const stats = document.getElementById('ttb-stats');
    const clearBtn = document.getElementById('ttb-btn-clear');
    const resetBtn = document.getElementById('ttb-btn-reset');
    const copyBtn = document.getElementById('ttb-btn-copy');

    if (!input || !output) return;

    function convert() {
        const text = input.value;
        if (!text) {
            output.value = '';
            stats.textContent = '0 characters, 0 bytes, 0 bits';
            return;
        }

        // Encode as UTF-8 bytes to properly support Unicode characters
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const sep = sepSelect.value;

        const binArray = Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0'));

        let result = '';
        if (sep === 'space') {
            result = binArray.join(' ');
        } else if (sep === 'none') {
            result = binArray.join('');
        } else if (sep === 'comma') {
            result = binArray.join(', ');
        } else if (sep === 'prefix') {
            result = binArray.map(b => '0b' + b).join(', ');
        }

        output.value = result;
        const totalBits = bytes.length * 8;
        stats.textContent = text.length + ' characters, ' + bytes.length + ' bytes, ' + totalBits + ' bits';
    }

    input.addEventListener('input', convert);
    sepSelect.addEventListener('change', convert);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        stats.textContent = '0 characters, 0 bytes, 0 bits';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'Hello';
        convert();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) convert();
}
`
    }),

    // 10. Binary to Text Converter
    'binary-to-text': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="btt-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.08); border:1px solid var(--error-color); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-bottom:1rem; font-size:0.9rem;"></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group">
                    <label for="btt-input">Binary Input (8-bit bytes)</label>
                    <textarea id="btt-input" class="input-control" placeholder="Enter binary numbers... e.g. 01001000 01100101 01101100 01101100 01101111" style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
                </div>
                <div class="form-group">
                    <label for="btt-output">Decoded Text Output</label>
                    <textarea id="btt-output" class="input-control" readonly placeholder="Decoded text will appear here..." style="min-height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; background: var(--bg-primary);"></textarea>
                </div>
            </div>

            <div id="btt-info" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                Stats: <strong id="btt-stats">0 bytes processed</strong>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="btt-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="btt-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="btt-btn-copy">Copy Text</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('btt-input');
    const output = document.getElementById('btt-output');
    const errBox = document.getElementById('btt-error');
    const stats = document.getElementById('btt-stats');
    const clearBtn = document.getElementById('btt-btn-clear');
    const resetBtn = document.getElementById('btt-btn-reset');
    const copyBtn = document.getElementById('btt-btn-copy');

    if (!input || !output) return;

    function decodeBinary() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const raw = input.value.trim();
        if (!raw) {
            output.value = '';
            stats.textContent = '0 bytes processed';
            return;
        }

        // Clean prefixes like 0b, commas, brackets
        let cleaned = raw.replace(/0b/gi, '').replace(/[,;\\[\\]]/g, ' ').trim();

        // Split by whitespace
        let tokens = cleaned.split(/\\s+/).filter(t => t.length > 0);

        // If continuous string without spaces, chunk by 8
        if (tokens.length === 1 && tokens[0].length > 8) {
            const str = tokens[0];
            tokens = [];
            for (let i = 0; i < str.length; i += 8) {
                tokens.push(str.slice(i, i + 8));
            }
        }

        // Validate all tokens
        const bytes = [];
        for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            if (!/^[01]+$/.test(tok)) {
                errBox.textContent = 'Invalid binary at token #' + (i + 1) + ' ("' + tok + '"). Only 0 and 1 digits are allowed.';
                errBox.style.display = 'block';
                return;
            }
            if (tok.length !== 8) {
                errBox.textContent = 'Invalid byte length at token #' + (i + 1) + ' ("' + tok + '"). Each binary byte must be exactly 8 bits.';
                errBox.style.display = 'block';
                return;
            }
            bytes.push(parseInt(tok, 2));
        }

        try {
            const u8 = new Uint8Array(bytes);
            const decoder = new TextDecoder('utf-8', { fatal: true });
            output.value = decoder.decode(u8);
            stats.textContent = bytes.length + ' bytes decoded (' + (bytes.length * 8) + ' bits)';
        } catch (e) {
            errBox.textContent = 'UTF-8 Decoding Error: The binary sequence does not represent a valid UTF-8 character string.';
            errBox.style.display = 'block';
        }
    }

    input.addEventListener('input', decodeBinary);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errBox.style.display = 'none';
        stats.textContent = '0 bytes processed';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '01001000 01100101 01101100 01101100 01101111';
        decodeBinary();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) decodeBinary();
}
`
    }),

    // 11. Word Frequency Analyzer
    'word-frequency-counter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="wfc-input">Text Content to Analyze</label>
                <textarea id="wfc-input" class="input-control" placeholder="Type or paste paragraphs here to analyze word occurrences and frequencies..." style="min-height: 180px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;"></textarea>
            </div>

            <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label for="wfc-sort">Sort Frequency Table By</label>
                    <select id="wfc-sort" class="input-control">
                        <option value="freq-desc" selected>Frequency (High to Low)</option>
                        <option value="freq-asc">Frequency (Low to High)</option>
                        <option value="alpha-asc">Alphabetical (A to Z)</option>
                        <option value="alpha-desc">Alphabetical (Z to A)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="wfc-min-len">Minimum Word Length</label>
                    <input type="number" id="wfc-min-len" class="input-control" value="1" min="1" max="20">
                </div>
                <div class="form-group" style="display: flex; align-items: flex-end; padding-bottom: 0.5rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" id="wfc-stop-words"> Ignore Stop Words (the, a, is...)
                    </label>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Total Words</span>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--primary-color); margin-top: 0.25rem;" id="wfc-total-words">0</h3>
                </div>
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Unique Words</span>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;" id="wfc-unique-words">0</h3>
                </div>
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Total Characters</span>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;" id="wfc-total-chars">0</h3>
                </div>
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem;">
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Top Word</span>
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--primary-color); margin-top: 0.25rem;" id="wfc-top-word">-</h3>
                </div>
            </div>

            <div class="form-group">
                <label>Word Frequency Distribution</label>
                <div style="max-height: 320px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-primary);">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                        <thead style="background: var(--bg-secondary); position: sticky; top: 0;">
                            <tr>
                                <th style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color);">Word</th>
                                <th style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); width: 100px;">Count</th>
                                <th style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); width: 120px;">Percentage</th>
                                <th style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); width: 160px;">Density</th>
                            </tr>
                        </thead>
                        <tbody id="wfc-table-body">
                            <tr>
                                <td colspan="4" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No words analyzed yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="wfc-btn-clear">Clear</button>
                <button class="btn btn-secondary" id="wfc-btn-reset">Reset Example</button>
                <button class="btn btn-primary" id="wfc-btn-copy">Copy Frequency Table</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('wfc-input');
    const sortSelect = document.getElementById('wfc-sort');
    const minLenInput = document.getElementById('wfc-min-len');
    const stopWordsCheckbox = document.getElementById('wfc-stop-words');
    const totalWordsEl = document.getElementById('wfc-total-words');
    const uniqueWordsEl = document.getElementById('wfc-unique-words');
    const totalCharsEl = document.getElementById('wfc-total-chars');
    const topWordEl = document.getElementById('wfc-top-word');
    const tableBody = document.getElementById('wfc-table-body');
    const clearBtn = document.getElementById('wfc-btn-clear');
    const resetBtn = document.getElementById('wfc-btn-reset');
    const copyBtn = document.getElementById('wfc-btn-copy');

    if (!input || !tableBody) return;

    const STOP_WORDS = new Set([
        'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
        'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
        'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
        'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
        'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
        'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over',
        'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
        'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
        'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
        'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
    ]);

    let lastCalculatedData = [];

    function analyze() {
        const text = input.value;
        if (!text.trim()) {
            totalWordsEl.textContent = '0';
            uniqueWordsEl.textContent = '0';
            totalCharsEl.textContent = '0';
            topWordEl.textContent = '-';
            tableBody.innerHTML = '<tr><td colspan="4" style="padding:2rem; text-align:center; color:var(--text-secondary);">No words analyzed yet</td></tr>';
            lastCalculatedData = [];
            return;
        }

        totalCharsEl.textContent = text.length.toLocaleString();

        // Extract words, lowercased, removing standalone numbers and punctuation
        const rawTokens = text.toLowerCase().match(/[\\p{L}\\p{N}'-]+/gu) || [];
        const minLen = parseInt(minLenInput.value, 10) || 1;
        const ignoreStop = stopWordsCheckbox.checked;

        const filteredWords = [];
        rawTokens.forEach(raw => {
            const cleaned = raw.replace(/^['"-]+|['"-]+$/g, '');
            if (cleaned.length >= minLen && (!ignoreStop || !STOP_WORDS.has(cleaned))) {
                filteredWords.push(cleaned);
            }
        });

        const totalFiltered = filteredWords.length;
        totalWordsEl.textContent = totalFiltered.toLocaleString();

        if (totalFiltered === 0) {
            uniqueWordsEl.textContent = '0';
            topWordEl.textContent = '-';
            tableBody.innerHTML = '<tr><td colspan="4" style="padding:2rem; text-align:center; color:var(--text-secondary);">No words match the current filter criteria</td></tr>';
            lastCalculatedData = [];
            return;
        }

        const counts = {};
        filteredWords.forEach(w => {
            counts[w] = (counts[w] || 0) + 1;
        });

        const uniqueKeys = Object.keys(counts);
        uniqueWordsEl.textContent = uniqueKeys.length.toLocaleString();

        let entries = uniqueKeys.map(word => ({
            word: word,
            count: counts[word],
            percentage: ((counts[word] / totalFiltered) * 100).toFixed(1)
        }));

        const sortMode = sortSelect.value;
        if (sortMode === 'freq-desc') {
            entries.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
        } else if (sortMode === 'freq-asc') {
            entries.sort((a, b) => a.count - b.count || a.word.localeCompare(b.word));
        } else if (sortMode === 'alpha-asc') {
            entries.sort((a, b) => a.word.localeCompare(b.word));
        } else if (sortMode === 'alpha-desc') {
            entries.sort((a, b) => b.word.localeCompare(a.word));
        }

        topWordEl.textContent = entries.length > 0 ? entries[0].word + ' (' + entries[0].count + ')' : '-';
        lastCalculatedData = entries;

        let rowsHtml = '';
        entries.forEach(e => {
            rowsHtml += \`
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem 1rem; font-weight: 600; font-family: var(--font-mono);">\${e.word}</td>
                <td style="padding: 0.6rem 1rem;">\${e.count}</td>
                <td style="padding: 0.6rem 1rem;">\${e.percentage}%</td>
                <td style="padding: 0.6rem 1rem;">
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); height: 8px; width: 100%; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: \${Math.min(100, e.percentage * 2)}%;"></div>
                    </div>
                </td>
            </tr>\`;
        });

        tableBody.innerHTML = rowsHtml;
    }

    [input, sortSelect, minLenInput, stopWordsCheckbox].forEach(el => {
        el.addEventListener('input', analyze);
        el.addEventListener('change', analyze);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        analyze();
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = \`Hello world.
Hello everyone.
HELLO to the entire world!\`;
        analyze();
    });

    copyBtn.addEventListener('click', () => {
        if (!lastCalculatedData || lastCalculatedData.length === 0) return;
        let textTable = 'Word\\tCount\\tPercentage\\n';
        lastCalculatedData.forEach(item => {
            textTable += item.word + '\\t' + item.count + '\\t' + item.percentage + '%\\n';
        });
        navigator.clipboard.writeText(textTable).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) analyze();
}
`
    })
};
