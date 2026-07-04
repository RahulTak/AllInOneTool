export function init() {
    const input = document.getElementById('b64-str-input');
    const workspace = document.getElementById('b64-img-workspace');
    const preview = document.getElementById('b64-img-preview');
    const reset = document.getElementById('b64-img-reset');
    const download = document.getElementById('b64-img-download');

    if (!input) return;

    input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val.startsWith('data:image/')) {
            preview.src = val;
            workspace.style.display = 'flex';
        } else {
            workspace.style.display = 'none';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        preview.src = '';
        workspace.style.display = 'none';
    });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = preview.src;
        a.download = 'decoded_image.png';
        a.click();
    });
}
