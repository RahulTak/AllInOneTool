export function init() {
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
            const tokens = text.split(/(\s+)/);
            output.value = tokens.reverse().join('');
        } else if (selectedMode === 'each-word') {
            // Reverse characters within each individual word
            const tokens = text.split(/(\s+)/);
            output.value = tokens.map(token => {
                if (/^\s+$/.test(token)) return token;
                return [...token].reverse().join('');
            }).join('');
        } else if (selectedMode === 'lines') {
            // Reverse lines
            output.value = text.split(/\r?\n/).reverse().join('\n');
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
