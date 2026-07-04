export function init() {
    const input = document.getElementById('js-input');
    const output = document.getElementById('js-output');
    const mini = document.getElementById('js-minify');
    const beauty = document.getElementById('js-beautify');

    if (!input) return;

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\/\*[\s\S]*?\*\//g, '');
        val = val.replace(/\/\/[^\n]*\n/g, '');
        val = val.replace(/\s*([{}|:;,()=+\-*/])\s*/g, '$1');
        val = val.replace(/\s+/g, ' ');
        output.value = val.trim();
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        let pad = 0;
        let formatted = '';
        val.split('\n').forEach(line => {
            let trimmed = line.trim();
            if (trimmed.match(/}/)) pad--;
            formatted += '  '.repeat(Math.max(0, pad)) + trimmed + '\n';
            if (trimmed.match(/{/)) pad++;
        });
        output.value = formatted.trim();
    });
}
