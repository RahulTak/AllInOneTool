export function init() {
    const dropzone = document.getElementById('px-dropzone');
    const input = document.getElementById('px-input');
    const workspace = document.getElementById('px-workspace');
    const canvas = document.getElementById('px-canvas');
    const sizeInput = document.getElementById('px-size');
    const reset = document.getElementById('px-btn-reset');
    const download = document.getElementById('px-btn-download');

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

    sizeInput.addEventListener('input', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        const size = parseInt(sizeInput.value) || 8;

        // Draw image small then upscale
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w / size;
        tempCanvas.height = h / size;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'pixelated.png';
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
