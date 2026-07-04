export function init() {
    const dropzone = document.getElementById('word-dropzone');
    const input = document.getElementById('word-input');
    const workspace = document.getElementById('word-workspace');
    const fileName = document.getElementById('word-file-name');
    const fileSize = document.getElementById('word-file-size');
    const reset = document.getElementById('word-btn-reset');

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
        if (!file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
            alert('Please upload a valid Microsoft Word (.doc or .docx) document.');
            input.value = '';
            return;
        }
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
