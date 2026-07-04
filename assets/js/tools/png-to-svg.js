export function init() {
    const dropzone = document.getElementById('png-dropzone');
    const input = document.getElementById('png-input');
    const workspace = document.getElementById('png-workspace');
    const canvas = document.getElementById('png-canvas');
    const thresholdInput = document.getElementById('png-trace-threshold');
    const reset = document.getElementById('png-btn-reset');
    const convert = document.getElementById('png-btn-convert');

    if (!input) return;
    let img = new Image();

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    thresholdInput.addEventListener('input', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    convert.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const threshold = parseInt(thresholdInput.value);

        // Simple Edge/Contour tracing to build SVG path segments
        let path = '';
        for (let y = 1; y < h - 1; y += 2) {
            for (let x = 1; x < w - 1; x += 2) {
                const idx = (y * w + x) * 4;
                const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
                if (brightness < threshold && data[idx+3] > 50) {
                    path += ' M' + x + ',' + y + ' h2 v2 h-2 z';
                }
            }
        }

        const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"><path d="' + path + '" fill="#000000"/></svg>';
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'traced_vector.svg';
        a.click();
        URL.revokeObjectURL(url);
    });

    function process(file) {
        if (!file.name.toLowerCase().endsWith('.png')) {
            alert('Please upload a PNG image only.');
            return;
        }

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
