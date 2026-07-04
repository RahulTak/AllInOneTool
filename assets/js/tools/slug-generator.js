export function init() {
    const input = document.getElementById('text-input');
    const output = document.getElementById('text-output');
    const processBtn = document.getElementById('process-text');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');

    if (!processBtn) return;

    processBtn.addEventListener('click', () => {
        const text = input.value;
        output.textContent = text.toUpperCase();
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent || '').then(() => {
            alert('Copied!');
        });
    });
}
