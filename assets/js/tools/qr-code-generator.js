export function init() {
    const input = document.getElementById('qr-data');
    const canvas = document.getElementById('qr-canvas');
    const download = document.getElementById('download-qr');

    if (!input || !canvas) return;

    function renderQR() {
        if (typeof QRious !== 'undefined') {
            const qr = new QRious({
                element: canvas,
                value: input.value || 'AllInOneTool',
                size: 200,
                level: 'H'
            });
            download.href = canvas.toDataURL('image/png');
        } else {
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(20, 20, 160, 160);
            ctx.fillStyle = '#000000';
            ctx.fillRect(40, 40, 50, 50);
            ctx.fillRect(110, 40, 50, 50);
            ctx.fillRect(40, 110, 50, 50);
        }
    }

    input.addEventListener('input', renderQR);
    setTimeout(renderQR, 500);
}
