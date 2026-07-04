export function init() {
    const input = document.getElementById('caesar-input');
    const output = document.getElementById('caesar-output');
    const mode = document.getElementById('caesar-mode');
    const shift = document.getElementById('caesar-shift');
    const clearBtn = document.getElementById('caesar-clear');
    const copyBtn = document.getElementById('caesar-copy');

    if (!input) return;

    function runCipher() {
        const text = input.value;
        let sVal = parseInt(shift.value) || 3;
        const op = mode.value;

        if (op === 'decode') sVal = (26 - sVal) % 26;

        let result = '';
        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + sVal) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + sVal) % 26) + 97);
            } else {
                result += text.charAt(i);
            }
        }
        output.value = result;
    }

    input.addEventListener('input', runCipher);
    shift.addEventListener('input', runCipher);
    mode.addEventListener('change', runCipher);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Caesar result!'));
    });
}
