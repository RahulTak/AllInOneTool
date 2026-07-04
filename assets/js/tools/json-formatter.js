export function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const beauty = document.getElementById('json-beautify');
    const mini = document.getElementById('json-minify');

    if (!input) return;

    beauty.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 4);
        } catch(e) {
            alert('Invalid JSON: ' + e.message);
        }
    });

    mini.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed);
        } catch(e) {
            alert('Invalid JSON: ' + e.message);
        }
    });
}
