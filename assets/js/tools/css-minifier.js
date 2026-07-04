export function init() {
    const input = document.getElementById('css-input');
    const output = document.getElementById('css-output');
    const mini = document.getElementById('css-minify');
    const beauty = document.getElementById('css-beautify');

    if (!input) return;

    mini.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\/\*[\s\S]*?\*\//g, '');
        val = val.replace(/\s*([{}|:;,])\s*/g, '$1');
        val = val.replace(/\s+/g, ' ');
        output.value = val.trim();
    });

    beauty.addEventListener('click', () => {
        let val = input.value;
        val = val.replace(/\s*([{}|:;,])\s*/g, '$1');
        val = val.replace(/{/g, ' {\n  ');
        val = val.replace(/;/g, ';\n  ');
        val = val.replace(/\n\s*}/g, '\n}\n\n');
        val = val.replace(/  }/g, '}');
        output.value = val.trim();
    });
}
