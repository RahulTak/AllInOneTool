export function init() {
    const dropzone = document.getElementById('svg-dropzone');
    const input = document.getElementById('svg-input');
    const workspace = document.getElementById('svg-workspace');
    const preview = document.getElementById('svg-preview-container');
    const bgSelect = document.getElementById('svg-bg-select');
    const infoDims = document.getElementById('svg-info-dims');
    const infoSize = document.getElementById('svg-info-size');
    const reset = document.getElementById('svg-btn-reset');
    const convert = document.getElementById('svg-btn-convert');

    if (!input) return;
    let svgText = '';
    let svgWidth = 300;
    let svgHeight = 300;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        svgText = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        const ctx = canvas.getContext('2d');

        if (bgSelect.value === 'white') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, svgWidth, svgHeight);
        }

        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'vector_convert.png';
            a.click();
        };
    });

    function process(file) {
        if (!file.name.toLowerCase().endsWith('.svg')) {
            alert('Please upload an SVG file only.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            svgText = e.target.result;
            preview.innerHTML = svgText;
            const svgElement = preview.querySelector('svg');
            if (svgElement) {
                svgWidth = parseFloat(svgElement.getAttribute('width')) || svgElement.viewBox.baseVal.width || 300;
                svgHeight = parseFloat(svgElement.getAttribute('height')) || svgElement.viewBox.baseVal.height || 300;
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                infoDims.textContent = Math.round(svgWidth) + ' x ' + Math.round(svgHeight) + ' px';
            } else {
                infoDims.textContent = 'Auto';
            }
            infoSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsText(file);
    }
}
