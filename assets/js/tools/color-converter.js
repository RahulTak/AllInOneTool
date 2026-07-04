export function init() {
    const hex = document.getElementById('color-hex');
    const rgb = document.getElementById('color-rgb');
    const hsl = document.getElementById('color-hsl');
    const picker = document.getElementById('picker-color');
    const preview = document.getElementById('color-preview-block');

    if (!hex) return;

    function updateColors(hexVal) {
        if (!hexVal.startsWith('#')) hexVal = '#' + hexVal;
        if (hexVal.length !== 7) return;

        hex.value = hexVal;
        picker.value = hexVal;
        preview.style.backgroundColor = hexVal;

        const r = parseInt(hexVal.slice(1, 3), 16);
        const g = parseInt(hexVal.slice(3, 5), 16);
        const b = parseInt(hexVal.slice(5, 7), 16);
        rgb.value = `rgb(${r}, ${g}, ${b})`;

        let rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        let max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let hVal = 0, sVal = 0, lVal = (max + min) / 2;

        if (max !== min) {
            let d = max - min;
            sVal = lVal > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case rNorm: hVal = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                case gNorm: hVal = (bNorm - rNorm) / d + 2; break;
                case bNorm: hVal = (rNorm - gNorm) / d + 4; break;
            }
            hVal /= 6;
        }
        hsl.value = `hsl(${Math.round(hVal * 360)}, ${Math.round(sVal * 100)}%, ${Math.round(lVal * 100)}%)`;
    }

    hex.addEventListener('input', () => updateColors(hex.value));
    picker.addEventListener('input', () => updateColors(picker.value));
}
