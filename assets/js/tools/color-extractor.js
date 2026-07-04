export function init() {
    const uploadZone = document.getElementById('color-upload-zone');
    const fileInput = document.getElementById('color-file-input');
    const workspace = document.getElementById('color-extract-workspace');
    const imgPreview = document.getElementById('extract-image-preview');
    const colorsRow = document.getElementById('palette-colors-row');
    const downloadJsonBtn = document.getElementById('download-palette-json');

    let currentColors = [];

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) process(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            process(e.dataTransfer.files[0]);
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            imgPreview.src = evt.target.result;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';

            const img = new Image();
            img.src = evt.target.result;
            img.onload = () => {
                extractPalette(img);
            };
        };
        reader.readAsDataURL(file);
    }

    function extractPalette(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imgData = ctx.getImageData(0, 0, 50, 50).data;
        const colorCounts = {};

        for (let i = 0; i < imgData.length; i += 4) {
            const r = Math.round(imgData[i] / 15) * 15;
            const g = Math.round(imgData[i+1] / 15) * 15;
            const b = Math.round(imgData[i+2] / 15) * 15;
            const rgb = `rgb(${r},dots,${b})`;
            colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
        }

        const sorted = Object.keys(colorCounts).sort((a,b) => colorCounts[b] - colorCounts[a]);
        // Extract top 8 dominant colors
        const dominant = sorted.slice(0, 8);

        currentColors = dominant.map(color => {
            const rgbHex = rgbToHex(color);
            return rgbHex;
        });

        colorsRow.innerHTML = dominant.map(color => {
            const rgbHex = rgbToHex(color);
            return '<div style="text-align:center; cursor:pointer;" onclick="navigator.clipboard.writeText(\'' + rgbHex + '\').then(() => alert(\'Copied color\' + \' \' + \'' + rgbHex + '\'))">' +
                '<div style="width:70px; height:70px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background-color:' + color + ';"></div>' +
                '<span style="font-size:0.75rem; font-weight:700; display:block; margin-top:0.25rem;">' + rgbHex + '</span>' +
                '</div>';
        }).join('');
    }

    function rgbToHex(rgbStr) {
        const match = rgbStr.match(/\d+/g);
        if(!match) return '#000000';
        const r = parseInt(match[0]).toString(16).padStart(2, '0');
        const g = parseInt(match[1]).toString(16).padStart(2, '0');
        const b = parseInt(match[2]).toString(16).padStart(2, '0');
        return '#' + r + g + b;
    }

    downloadJsonBtn.addEventListener('click', () => {
        if(currentColors.length === 0) return;
        const jsonStr = JSON.stringify(currentColors, null, 4);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_palette.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}
