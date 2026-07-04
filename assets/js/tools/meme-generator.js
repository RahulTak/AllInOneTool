export function init() {
    const dropzone = document.getElementById('meme-dropzone');
    const input = document.getElementById('meme-input');
    const workspace = document.getElementById('meme-workspace');
    const canvas = document.getElementById('meme-canvas');
    const topText = document.getElementById('meme-top');
    const bottomText = document.getElementById('meme-bottom');
    const reset = document.getElementById('meme-btn-reset');
    const download = document.getElementById('meme-btn-download');

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

    [topText, bottomText].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.round(w * 0.015);
        ctx.font = 'bold ' + Math.round(h * 0.1) + 'px Impact, sans-serif';
        ctx.textAlign = 'center';

        // Draw Top Text
        ctx.textBaseline = 'top';
        ctx.strokeText(topText.value.toUpperCase(), w/2, h * 0.05);
        ctx.fillText(topText.value.toUpperCase(), w/2, h * 0.05);

        // Draw Bottom Text
        ctx.textBaseline = 'bottom';
        ctx.strokeText(bottomText.value.toUpperCase(), w/2, h * 0.95);
        ctx.fillText(bottomText.value.toUpperCase(), w/2, h * 0.95);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'meme.png';
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
