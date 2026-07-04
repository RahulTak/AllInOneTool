export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const canvas = document.getElementById('crop-canvas');
    const aspectSelect = document.getElementById('crop-aspect');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

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
        if(!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    action.addEventListener('click', () => {
        // Implement cropping segment: by default crops the center 80% box based on aspect ratio preset
        const w = canvas.width;
        const h = canvas.height;
        let cropW = w * 0.8;
        let cropH = h * 0.8;

        const aspect = aspectSelect.value;
        if (aspect === '1:1') {
            const size = Math.min(w, h) * 0.8;
            cropW = size;
            cropH = size;
        } else if (aspect === '16:9') {
            cropH = cropW * (9/16);
        } else if (aspect === '4:3') {
            cropH = cropW * (3/4);
        }

        const cropX = (w - cropW) / 2;
        const cropY = (h - cropH) / 2;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const a = document.createElement('a');
        a.href = outCanvas.toDataURL('image/png');
        a.download = 'cropped.png';
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
