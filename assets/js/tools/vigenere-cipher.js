export function init() {
    const input = document.getElementById('vig-input');
    const output = document.getElementById('vig-output');
    const mode = document.getElementById('vig-mode');
    const key = document.getElementById('vig-key');
    const clearBtn = document.getElementById('vig-clear');
    const copyBtn = document.getElementById('vig-copy');

    if (!input) return;

    function runCipher() {
        const text = input.value;
        const kStr = key.value.toLowerCase().replace(/[^a-z]/g, '');
        const op = mode.value;

        if (!kStr || !text) {
            output.value = text;
            return;
        }

        let result = '';
        let keyIdx = 0;

        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            let shift = kStr.charCodeAt(keyIdx % kStr.length) - 97;

            if (op === 'decode') shift = (26 - shift) % 26;

            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
                keyIdx++;
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
                keyIdx++;
            } else {
                result += text.charAt(i);
            }
        }
        output.value = result;
    }

    input.addEventListener('input', runCipher);
    key.addEventListener('input', runCipher);
    mode.addEventListener('change', runCipher);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Vigenere result!'));
    });
}
