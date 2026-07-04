export function init() {
    const fg = document.getElementById('color-fg');
    const bg = document.getElementById('color-bg');
    const pfg = document.getElementById('picker-fg');
    const pbg = document.getElementById('picker-bg');
    const preview = document.getElementById('contrast-preview');
    const ratioEl = document.getElementById('contrast-ratio');
    const aaNorm = document.getElementById('wcag-aa-normal');
    const aaaNorm = document.getElementById('wcag-aaa-normal');
    const aaLarge = document.getElementById('wcag-aa-large');

    if (!fg) return;

    function update() {
        const fgColor = fg.value;
        const bgColor = bg.value;
        preview.style.color = fgColor;
        preview.style.backgroundColor = bgColor;

        const getLuminance = (hex) => {
            let c = hex.substring(1);
            if(c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            const r = parseInt(c.substring(0, 2), 16) / 255;
            const g = parseInt(c.substring(2, 4), 16) / 255;
            const b = parseInt(c.substring(4, 6), 16) / 255;
            const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        };

        try {
            const l1 = getLuminance(fgColor);
            const l2 = getLuminance(bgColor);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

            ratioEl.textContent = ratio.toFixed(1) + ':1';

            const setStatus = (el, pass) => {
                el.textContent = pass ? 'PASS' : 'FAIL';
                el.style.backgroundColor = pass ? 'var(--success-bg)' : 'var(--error-bg)';
                el.style.color = pass ? 'var(--success-color)' : 'var(--error-color)';
            };

            setStatus(aaNorm, ratio >= 4.5);
            setStatus(aaaNorm, ratio >= 7.0);
            setStatus(aaLarge, ratio >= 3.0);
        } catch(e) {}
    }

    [fg, bg].forEach(input => input.addEventListener('input', () => {
        if(input === fg) pfg.value = fg.value;
        if(input === bg) pbg.value = bg.value;
        update();
    }));

    [pfg, pbg].forEach(picker => picker.addEventListener('input', () => {
        if(picker === pfg) fg.value = pfg.value;
        if(picker === pbg) bg.value = pbg.value;
        update();
    }));

    update();
}
