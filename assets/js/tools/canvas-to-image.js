export function init() {
    const canvas = document.getElementById('paint-canvas');
    const color = document.getElementById('paint-color');
    const width = document.getElementById('paint-width');
    const clear = document.getElementById('paint-btn-clear');
    const download = document.getElementById('paint-btn-download');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);

    function startDraw(e) {
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e) {
        if (!drawing) return;
        ctx.strokeStyle = color.value;
        ctx.lineWidth = parseInt(width.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDraw() {
        drawing = false;
    }

    clear.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,600,300);
    });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'drawing.png';
        a.click();
    });

    // Init canvas with white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,600,300);
}
