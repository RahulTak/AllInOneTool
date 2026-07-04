export function init() {
    const text = document.getElementById('tti-text');
    const font = document.getElementById('tti-font');
    const size = document.getElementById('tti-size');
    const colorFg = document.getElementById('tti-color-fg');
    const colorBg = document.getElementById('tti-color-bg');
    const canvas = document.getElementById('tti-canvas');
    const reset = document.getElementById('tti-btn-reset');
    const download = document.getElementById('tti-btn-download');

    if (!canvas) return;

    function render() {
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 200;

        ctx.fillStyle = colorBg.value;
        ctx.fillRect(0,0,600,200);

        ctx.fillStyle = colorFg.value;
        ctx.font = 'bold ' + size.value + 'px ' + font.value;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.value || 'Hello', 300, 100);
    }

    [text, font, size, colorFg, colorBg].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        text.value = 'AllInOneTool';
        font.selectedIndex = 0;
        size.value = '48';
        colorFg.value = '#ffffff';
        colorBg.value = '#6366f1';
        render();
    });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'text_banner.png';
        a.click();
    });

    render();
}
