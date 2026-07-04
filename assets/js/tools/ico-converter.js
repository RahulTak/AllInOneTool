export function init() {
    const dropzone = document.getElementById('ico-dropzone');
    const input = document.getElementById('ico-input');
    const workspace = document.getElementById('ico-workspace');
    const fileName = document.getElementById('ico-file-name');
    const reset = document.getElementById('ico-btn-reset');
    const convert = document.getElementById('ico-btn-convert');

    if (!input) return;
    let dataUrl = '';

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        dataUrl = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', () => {
        if (!dataUrl) return;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 32, 32);
            // ICO file structure header build mock
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/x-icon');
            link.download = 'favicon.ico';
            link.click();
        };
    });

    function process(file) {
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            dataUrl = e.target.result;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}
