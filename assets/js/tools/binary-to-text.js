export function init() {
    const input = document.getElementById('btt-input');
    const output = document.getElementById('btt-output');
    const errBox = document.getElementById('btt-error');
    const stats = document.getElementById('btt-stats');
    const clearBtn = document.getElementById('btt-btn-clear');
    const resetBtn = document.getElementById('btt-btn-reset');
    const copyBtn = document.getElementById('btt-btn-copy');

    if (!input || !output) return;

    function decodeBinary() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const raw = input.value.trim();
        if (!raw) {
            output.value = '';
            stats.textContent = '0 bytes processed';
            return;
        }

        // Clean prefixes like 0b, commas, brackets
        let cleaned = raw.replace(/0b/gi, '').replace(/[,;\[\]]/g, ' ').trim();

        // Split by whitespace
        let tokens = cleaned.split(/\s+/).filter(t => t.length > 0);

        // If continuous string without spaces, chunk by 8
        if (tokens.length === 1 && tokens[0].length > 8) {
            const str = tokens[0];
            tokens = [];
            for (let i = 0; i < str.length; i += 8) {
                tokens.push(str.slice(i, i + 8));
            }
        }

        // Validate all tokens
        const bytes = [];
        for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            if (!/^[01]+$/.test(tok)) {
                errBox.textContent = 'Invalid binary at token #' + (i + 1) + ' ("' + tok + '"). Only 0 and 1 digits are allowed.';
                errBox.style.display = 'block';
                return;
            }
            if (tok.length !== 8) {
                errBox.textContent = 'Invalid byte length at token #' + (i + 1) + ' ("' + tok + '"). Each binary byte must be exactly 8 bits.';
                errBox.style.display = 'block';
                return;
            }
            bytes.push(parseInt(tok, 2));
        }

        try {
            const u8 = new Uint8Array(bytes);
            const decoder = new TextDecoder('utf-8', { fatal: true });
            output.value = decoder.decode(u8);
            stats.textContent = bytes.length + ' bytes decoded (' + (bytes.length * 8) + ' bits)';
        } catch (e) {
            errBox.textContent = 'UTF-8 Decoding Error: The binary sequence does not represent a valid UTF-8 character string.';
            errBox.style.display = 'block';
        }
    }

    input.addEventListener('input', decodeBinary);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errBox.style.display = 'none';
        stats.textContent = '0 bytes processed';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '01001000 01100101 01101100 01101100 01101111';
        decodeBinary();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) decodeBinary();
}
