export function init() {
    const input = document.getElementById('url-input');
    const output = document.getElementById('url-output');
    const encodeBtn = document.getElementById('url-encode');
    const decodeBtn = document.getElementById('url-decode');
    const reset = document.getElementById('url-reset');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        output.value = encodeURIComponent(input.value);
    });

    decodeBtn.addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(input.value);
        } catch(e) {
            alert('Failed to decode.');
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
