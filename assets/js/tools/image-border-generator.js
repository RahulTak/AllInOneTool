export function init() {
    const dropzone = document.getElementById('border-dropzone');
    const input = document.getElementById('border-input');
    const workspace = document.getElementById('border-workspace');
    const canvas = document.getElementById('border-canvas');
    const borderWidth = document.getElementById('border-width');
    const borderColor = document.getElementById('border-color');
    const reset = document.getElementById('border-btn-reset');
    const download = document.getElementById('border-btn-download');

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

    [borderWidth, borderColor].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const b = parseInt(borderWidth.value) || 15;
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;

        canvas.width = w + (b * 2);
        canvas.height = h + (b * 2);

        ctx.fillStyle = borderColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, b, b, w, h);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'bordered.png';
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
