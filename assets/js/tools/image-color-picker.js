export function init() {
    const dropzone = document.getElementById('picker-dropzone');
    const input = document.getElementById('picker-input');
    const workspace = document.getElementById('picker-workspace');
    const canvas = document.getElementById('picker-canvas');
    const preview = document.getElementById('picker-preview');
    const hexOutput = document.getElementById('picker-hex');
    const rgbOutput = document.getElementById('picker-rgb');
    const hslOutput = document.getElementById('picker-hsl');
    const reset = document.getElementById('picker-btn-reset');

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

    function draw() {
        if(!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    canvas.addEventListener('mousemove', pick);
    canvas.addEventListener('click', pick);

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    function pick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / rect.width * canvas.width);
        const y = Math.floor((e.clientY - rect.top) / rect.height * canvas.height);

        const ctx = canvas.getContext('2d');
        try {
            const p = ctx.getImageData(x, y, 1, 1).data;
            const r = p[0], g = p[1], b = p[2];
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            const rgbStr = 'rgb(' + r + ',' + g + ',' + b + ')';
            const hsl = rgbToHsl(r, g, b);
            const hslStr = 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)';

            preview.style.backgroundColor = hex;
            hexOutput.value = hex;
            rgbOutput.value = rgbStr;
            hslOutput.value = hslStr;
        } catch(e) {}
    }

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
