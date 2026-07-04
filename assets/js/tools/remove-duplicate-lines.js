export function init() {
    const input = document.getElementById('dup-input-text');
    const output = document.getElementById('dup-output-text');
    const preserve = document.getElementById('dup-preserve-order');
    const processBtn = document.getElementById('dup-process-btn');
    const reset = document.getElementById('dup-reset-btn');

    if (!processBtn) return;

    processBtn.addEventListener('click', () => {
        const lines = input.value.split('\n');
        const unique = [...new Set(lines)];
        output.value = unique.join('\n');
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
