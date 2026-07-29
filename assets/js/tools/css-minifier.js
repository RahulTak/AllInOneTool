export function init() {
    const input = document.getElementById('css-input');
    const output = document.getElementById('css-output');
    const mini = document.getElementById('css-minify');
    const beauty = document.getElementById('css-beautify');
    const reset = document.getElementById('css-reset');
    const copy = document.getElementById('css-copy');
    const download = document.getElementById('css-download');
    const actionRow = document.getElementById('css-action-row');

    if (!input) return;

    function showResult(val) {
        output.value = val;
        actionRow.style.display = 'flex';
    }

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\/\*[\s\S]*?\*\//g, '');
        val = val.replace(/\s*([{}|:;,])\s*/g, '$1');
        val = val.replace(/\s+/g, ' ');
        showResult(val.trim());
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\\n/g, '\n');
        val = val.replace(/\s*([{}|:;,])\s*/g, '$1');
        val = val.replace(/{/g, ' {\n  ');
        val = val.replace(/;/g, ';\n  ');
        val = val.replace(/\n\s*}/g, '\n}\n\n');
        val = val.replace(/  }/g, '}');
        showResult(val.trim());
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied CSS to clipboard!'));
    });

    download.addEventListener('click', () => {
        const isMin = output.value.length < input.value.length;
        const filename = isMin ? 'minified.css' : 'beautified.css';
        const blob = new Blob([output.value], { type: 'text/css;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });
}
