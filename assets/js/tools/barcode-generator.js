export function init() {
    const barType = document.getElementById('bar-type');
    const barVal = document.getElementById('bar-value');
    const canvas = document.getElementById('bar-canvas');
    const reset = document.getElementById('bar-reset');
    const download = document.getElementById('bar-download');

    if (!canvas) return;

    function render() {
        const type = barType.value;
        const val = barVal.value || '12345678';

        if (typeof JsBarcode !== 'undefined') {
            try {
                JsBarcode(canvas, val, {
                    format: type,
                    lineColor: '#000000',
                    background: '#ffffff',
                    width: 2,
                    height: 80,
                    displayValue: true
                });
            } catch(e) {
                drawFallback();
            }
        } else {
            drawFallback();
        }
    }

    function drawFallback() {
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 120;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 120);
        ctx.fillStyle = '#000000';
        let x = 30;
        while(x < 270) {
            const w = Math.floor(Math.random() * 3) + 1;
            ctx.fillRect(x, 15, w, 70);
            x += w + Math.floor(Math.random() * 4) + 1;
        }
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(barVal.value || '12345678', 150, 105);
    }

    [barType, barVal].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        barType.selectedIndex = 0;
        barVal.value = '12345678';
        render();
    });

    download.addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'barcode.png';
        a.click();
    });

    render();
}
