export function init() {
    const dropzone = document.getElementById('b64-dropzone');
    const input = document.getElementById('b64-input');
    const loader = document.getElementById('b64-loader');
    const statusText = document.getElementById('b64-status');
    const workspace = document.getElementById('b64-workspace');
    const output = document.getElementById('b64-output-text');
    const previewImg = document.getElementById('b64-preview-img');
    const reset = document.getElementById('b64-btn-reset');
    const copy = document.getElementById('b64-btn-copy');
    const download = document.getElementById('b64-btn-download');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        previewImg.src = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        if(output.value) {
            navigator.clipboard.writeText(output.value).then(() => alert('Base64 string copied!'));
        }
    });

    function process(file) {
        dropzone.style.display = 'none';
        loader.style.display = 'flex';
        statusText.textContent = 'Converting image to Base64...';

        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const b64Data = e.target.result;
                output.value = b64Data;
                previewImg.src = b64Data;

                const blob = new Blob([b64Data], { type: 'text/plain' });
                download.href = URL.createObjectURL(blob);
                download.download = 'base64_data.txt';

                loader.style.display = 'none';
                workspace.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }, 150);
    }
}
