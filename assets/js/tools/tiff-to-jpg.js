export function init() {
    const dropzone = document.getElementById('tiff-dropzone');
    const input = document.getElementById('tiff-input');
    const workspace = document.getElementById('tiff-workspace');
    const canvas = document.getElementById('tiff-canvas');
    const reset = document.getElementById('tiff-btn-reset');
    const convert = document.getElementById('tiff-btn-convert');

    if (!input) return;
    let img = new Image();

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    convert.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/jpeg');
        a.download = 'converted_tiff.jpg';
        a.click();
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                draw();
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    }
}
