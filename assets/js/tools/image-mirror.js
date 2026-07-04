export function init() {
    const dropzone = document.getElementById('mirror-dropzone');
    const input = document.getElementById('mirror-input');
    const workspace = document.getElementById('mirror-workspace');
    const canvas = document.getElementById('mirror-canvas');
    const mode = document.getElementById('mirror-mode');
    const reset = document.getElementById('mirror-btn-reset');
    const download = document.getElementById('mirror-btn-download');

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

    mode.addEventListener('change', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        if (mode.value === 'horizontal') {
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(canvas, 0, 0, w/2, h, 0, 0, w/2, h);
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(0, h);
            ctx.scale(1, -1);
            ctx.drawImage(canvas, 0, 0, w, h/2, 0, 0, w, h/2);
            ctx.restore();
        }
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'mirrored.png';
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
