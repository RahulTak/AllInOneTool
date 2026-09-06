export function init() {
    const input = document.getElementById('rlb-input');
    const output = document.getElementById('rlb-output');
    const mode = document.getElementById('rlb-mode');
    const clearBtn = document.getElementById('rlb-btn-clear');
    const resetBtn = document.getElementById('rlb-btn-reset');
    const copyBtn = document.getElementById('rlb-btn-copy');

    if (!input || !output) return;

    function process() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        if (mode.value === 'all') {
            // Replace any newline (\r\n, \r, \n) with a space, then collapse multiple spaces to a single space
            output.value = text.replace(/\r\n|\r|\n/g, ' ').replace(/[ \t]+/g, ' ').trim();
        } else {
            // Preserve paragraph breaks: split by 2 or more newlines
            const paragraphs = text.split(/(?:\r\n|\r|\n){2,}/);
            const cleaned = paragraphs.map(p => {
                return p.replace(/\r\n|\r|\n/g, ' ').replace(/[ \t]+/g, ' ').trim();
            }).filter(p => p.length > 0);
            output.value = cleaned.join('\n\n');
        }
    }

    input.addEventListener('input', process);
    mode.addEventListener('change', process);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = `Hello
World
This
is
a
test.`;
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
