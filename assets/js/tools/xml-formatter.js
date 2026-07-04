export function init() {
    const input = document.getElementById('xml-input');
    const output = document.getElementById('xml-output');
    const beauty = document.getElementById('xml-beautify');
    const mini = document.getElementById('xml-minify');

    if (!input) return;

    beauty.addEventListener('click', () => {
        let val = input.value.trim();
        let formatted = '';
        let reg = /(>)(<)(\/*)/g;
        val = val.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        val.split('\r\n').forEach(line => {
            let indent = 0;
            if (line.match(/<\/\w/)) {
                pad--;
            } else if (line.match(/<\w[^>]*>/) && !line.match(/<\w[^>]*\/>/) && !line.match(/<\w[^>]*>.*<\/\w>/)) {
                indent = 1;
            }
            formatted += '  '.repeat(Math.max(0, pad)) + line + '\n';
            pad += indent;
        });
        output.value = formatted.trim();
    });

    mini.addEventListener('click', () => {
        output.value = input.value.replace(/\s*<(\/*\w+)([^>]*)>\s*/g, '<$1$2>');
    });
}
