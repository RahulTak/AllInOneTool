export function init() {
    const dropzone = document.getElementById('flip-dropzone');
    const input = document.getElementById('flip-input');
    const workspace = document.getElementById('flip-workspace');
    const canvas = document.getElementById('flip-canvas');
    const flipH = document.getElementById('flip-btn-horiz');
    const flipV = document.getElementById('flip-btn-vert');
    const reset = document.getElementById('flip-btn-reset');
    const download = document.getElementById('flip-btn-download');

    if (!input) return;
    let img = new Image();
    let isFlippedH = false;
    let isFlippedV = false;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        isFlippedH = false;
        isFlippedV = false;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        ctx.translate(isFlippedH ? canvas.width : 0, isFlippedV ? canvas.height : 0);
        ctx.scale(isFlippedH ? -1 : 1, isFlippedV ? -1 : 1);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    flipH.addEventListener('click', () => { isFlippedH = !isFlippedH; draw(); });
    flipV.addEventListener('click', () => { isFlippedV = !isFlippedV; draw(); });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'flipped.png';
        a.click();
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                isFlippedH = false;
                isFlippedV = false;
                draw();
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    }
}
