export function init() {
    const input = document.getElementById('js-input');
    const output = document.getElementById('js-output');
    const mini = document.getElementById('js-minify');
    const beauty = document.getElementById('js-beautify');
    const reset = document.getElementById('js-reset');
    const copy = document.getElementById('js-copy');
    const download = document.getElementById('js-download');
    const actionRow = document.getElementById('js-action-row');

    if (!input) return;

    function showResult(val) {
        output.value = val;
        actionRow.style.display = 'flex';
    }

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\/\*[\s\S]*?\*\//g, '');
        val = val.replace(/\/\/[^\n]*\n/g, '');
        val = val.replace(/\s*([{}|:;,()=+\-*/])\s*/g, '$1');
        val = val.replace(/\s+/g, ' ');
        showResult(val.trim());
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\\n/g, '\n');
        let pad = 0;
        let formatted = '';
        val.split('\n').forEach(line => {
            let trimmed = line.trim();
            if (trimmed.match(/}/)) pad--;
            formatted += '  '.repeat(Math.max(0, pad)) + trimmed + '\n';
            if (trimmed.match(/{/)) pad++;
        });
        showResult(formatted.trim());
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied JS to clipboard!'));
    });

    download.addEventListener('click', () => {
        const isMin = output.value.length < input.value.length;
        const filename = isMin ? 'minified.js' : 'beautified.js';
        const blob = new Blob([output.value], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });
}
