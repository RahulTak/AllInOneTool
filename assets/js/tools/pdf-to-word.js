export function init() {
    const dropzone = document.getElementById('pdfword-dropzone');
    const input = document.getElementById('pdfword-input');
    const workspace = document.getElementById('pdfword-workspace');
    const fileName = document.getElementById('pdfword-file-name');
    const fileSize = document.getElementById('pdfword-file-size');
    const reset = document.getElementById('pdfword-btn-reset');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function process(file) {
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
