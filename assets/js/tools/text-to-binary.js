export function init() {
    const input = document.getElementById('ttb-input');
    const output = document.getElementById('ttb-output');
    const sepSelect = document.getElementById('ttb-sep');
    const stats = document.getElementById('ttb-stats');
    const clearBtn = document.getElementById('ttb-btn-clear');
    const resetBtn = document.getElementById('ttb-btn-reset');
    const copyBtn = document.getElementById('ttb-btn-copy');

    if (!input || !output) return;

    function convert() {
        const text = input.value;
        if (!text) {
            output.value = '';
            stats.textContent = '0 characters, 0 bytes, 0 bits';
            return;
        }

        // Encode as UTF-8 bytes to properly support Unicode characters
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const sep = sepSelect.value;

        const binArray = Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0'));

        let result = '';
        if (sep === 'space') {
            result = binArray.join(' ');
        } else if (sep === 'none') {
            result = binArray.join('');
        } else if (sep === 'comma') {
            result = binArray.join(', ');
        } else if (sep === 'prefix') {
            result = binArray.map(b => '0b' + b).join(', ');
        }

        output.value = result;
        const totalBits = bytes.length * 8;
        stats.textContent = text.length + ' characters, ' + bytes.length + ' bytes, ' + totalBits + ' bits';
    }

    input.addEventListener('input', convert);
    sepSelect.addEventListener('change', convert);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        stats.textContent = '0 characters, 0 bytes, 0 bits';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'Hello';
        convert();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) convert();
}
