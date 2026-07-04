export function init() {
    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');
    const encodeBtn = document.getElementById('b64-encode');
    const decodeBtn = document.getElementById('b64-decode');
    const clearBtn = document.getElementById('b64-clear');
    const download = document.getElementById('b64-download');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        try {
            output.value = btoa(unescape(encodeURIComponent(input.value)));
        } catch(e) {
            alert('Failed to encode.');
        }
    });

    decodeBtn.addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(escape(atob(input.value.trim())));
        } catch(e) {
            alert('Failed to decode.');
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    download.addEventListener('click', () => {
        if(!output.value) return;
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'base64_result.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}
