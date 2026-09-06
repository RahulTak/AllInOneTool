export function init() {
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
