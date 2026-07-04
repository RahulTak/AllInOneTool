export function init() {
    const dropzone = document.getElementById('b64-dropzone');
    const input = document.getElementById('b64-input');
    const workspace = document.getElementById('b64-workspace');
    const output = document.getElementById('b64-output-text');
    const reset = document.getElementById('b64-btn-reset');
    const copy = document.getElementById('b64-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        if(output.value) {
            navigator.clipboard.writeText(output.value).then(() => alert('Base64 string copied!'));
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            output.value = e.target.result;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}
