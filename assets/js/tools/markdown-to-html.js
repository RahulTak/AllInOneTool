export function init() {
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
        let lines = md.split('\n');
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
            res = res.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">');
            // Links: [text](url)
            res = res.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
            // Inline code: `code`
            res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
            // Bold + Italic: ***text***
            res = res.replace(/\*\*\*([^\*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
            // Bold: **text** or __text__
            res = res.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
            res = res.replace(/__([^_]+)__/g, '<strong>$1</strong>');
            // Italic: *text* or _text_
            res = res.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
            res = res.replace(/_([^_]+)_/g, '<em>$1</em>');
            // Strikethrough: ~~text~~
            res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');
            return res;
        }

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Fenced code block
            if (line.trim().startsWith('```')) {
                if (inCode) {
                    html.push('<pre><code>' + escapeHtml(codeBlock.join('\n')) + '</code></pre>');
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
            const isUl = /^\s*[-*+]\s+(.*)/.test(line);
            const isOl = /^\s*\d+\.\s+(.*)/.test(line);
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
            const hMatch = line.match(/^(#{1,6})\s+(.*)/);
            if (hMatch) {
                const level = hMatch[1].length;
                html.push('<h' + level + '>' + parseInlines(hMatch[2]) + '</h' + level + '>');
                continue;
            }

            // Horizontal rule
            if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
                html.push('<hr>');
                continue;
            }

            // Blockquote
            if (line.startsWith('>')) {
                html.push('<blockquote>' + parseInlines(line.replace(/^>\s?/, '')) + '</blockquote>');
                continue;
            }

            // Unordered List
            if (isUl) {
                const text = line.replace(/^\s*[-*+]\s+/, '');
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
                const text = line.replace(/^\s*\d+\.\s+/, '');
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
            html.push('<pre><code>' + escapeHtml(codeBlock.join('\n')) + '</code></pre>');
        }
        if (inList) {
            html.push('</' + listType + '>');
        }
        if (inTable && tableRows.length > 0) {
            html.push(renderTable(tableRows, parseInlines));
        }

        return html.join('\n');
    }

    function renderTable(rows, parseInlines) {
        if (rows.length === 0) return '';
        let res = '<table>\n';
        let hasHeader = false;

        rows.forEach((row, idx) => {
            const cells = row.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
            if (cells.every(c => /^[-:]+$/.test(c))) {
                hasHeader = true;
                return;
            }
            res += '  <tr>\n';
            cells.forEach(cell => {
                const tag = (idx === 0 && !hasHeader) ? 'th' : 'td';
                res += '    <' + tag + '>' + parseInlines(cell) + '</' + tag + '>\n';
            });
            res += '  </tr>\n';
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
        input.value = `# Hello World

This is **bold** and *italic* text.

- Item One
- Item Two
- Item Three

> Great things in business are never done by one person.

Visit [Google](https://google.com) to search.`;
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
