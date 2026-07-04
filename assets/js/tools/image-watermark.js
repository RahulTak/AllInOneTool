export function init() {
    const dropzone = document.getElementById('wm-dropzone');
    const input = document.getElementById('wm-input');
    const workspace = document.getElementById('wm-workspace');
    const canvas = document.getElementById('wm-canvas');
    const textInput = document.getElementById('wm-text');
    const opacityInput = document.getElementById('wm-opacity');
    const reset = document.getElementById('wm-btn-reset');
    const download = document.getElementById('wm-btn-download');

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

    [textInput, opacityInput].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        ctx.save();
        ctx.globalAlpha = parseInt(opacityInput.value) / 100;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + Math.round(h * 0.08) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw watermark across the diagonal center
        ctx.translate(w/2, h/2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(textInput.value || 'COPYRIGHT', 0, 0);
        ctx.restore();
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'watermarked.png';
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
