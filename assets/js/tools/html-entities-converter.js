export function init() {
    const input = document.getElementById('ent-input');
    const output = document.getElementById('ent-output');
    const typeSelect = document.getElementById('ent-type');
    const encodeBtn = document.getElementById('ent-btn-encode');
    const decodeBtn = document.getElementById('ent-btn-decode');
    const clearBtn = document.getElementById('ent-btn-clear');
    const resetBtn = document.getElementById('ent-btn-reset');
    const copyBtn = document.getElementById('ent-btn-copy');

    if (!input || !output) return;

    function encode() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        const mode = typeSelect.value;

        if (mode === 'named') {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '\u00A0': '&nbsp;',
                '©': '&copy;',
                '®': '&reg;',
                '™': '&trade;',
                '€': '&euro;',
                '£': '&pound;',
                '¥': '&yen;',
                '§': '&sect;'
            };
            output.value = text.replace(/[&<>"'\u00A0©®™€£¥§]/g, m => map[m] || m);
        } else if (mode === 'numeric') {
            output.value = text.replace(/[&<>"'\u00A0-\uFFFF]/g, m => '&#' + m.charCodeAt(0) + ';');
        } else if (mode === 'hex') {
            output.value = text.replace(/[&<>"'\u00A0-\uFFFF]/g, m => '&#x' + m.charCodeAt(0).toString(16).toUpperCase() + ';');
        }
    }

    function decode() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        // Decode entities using browser DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        output.value = doc.body.textContent || '';
    }

    encodeBtn.addEventListener('click', encode);
    decodeBtn.addEventListener('click', decode);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '<Hello & "World" 2026>';
        encode();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });
}
