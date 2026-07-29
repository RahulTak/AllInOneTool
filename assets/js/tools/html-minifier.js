export function init() {
    const input = document.getElementById('html-input');
    const output = document.getElementById('html-output');
    const minifyBtn = document.getElementById('html-minify');
    const resetBtn = document.getElementById('html-reset');
    const copyBtn = document.getElementById('html-copy');
    const downloadBtn = document.getElementById('html-download');
    const actionRow = document.getElementById('html-action-row');

    if (!minifyBtn) return;

    minifyBtn.addEventListener('click', () => {
        let val = input.value;
        if (!val.trim()) return;

        val = val.replace(/<!--[\s\S]*?-->/g, '');

        const placeholders = [];
        const regex = /(<(pre|code|script|style|textarea)[^>]*>[\s\S]*?<\/\2>)/gi;
        val = val.replace(regex, (match) => {
            placeholders.push(match);
            return '___PLACEHOLDER_' + (placeholders.length - 1) + '___';
        });

        val = val.replace(/\s+/g, ' ');
        val = val.replace(/>\s+</g, '><');
        val = val.replace(/\s+</g, '<');
        val = val.replace(/>\s+/g, '>');

        val = val.replace(/___PLACEHOLDER_(\d+)___/g, (match, idx) => {
            return placeholders[parseInt(idx)];
        });

        output.value = val.trim();
        actionRow.style.display = 'flex';
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        actionRow.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied HTML!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minified.html';
        a.click();
        URL.revokeObjectURL(url);
    });
}
