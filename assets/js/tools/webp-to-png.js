export function init() {
    const uploadZone = document.getElementById('img-upload-zone');
    const fileInput = document.getElementById('img-file-input');
    const workspace = document.getElementById('image-workspace');
    const originalPreview = document.getElementById('original-preview');
    const processedPreview = document.getElementById('processed-preview');
    const originalInfo = document.getElementById('original-info');
    const processedInfo = document.getElementById('processed-info');
    const widthInput = document.getElementById('size-width');
    const heightInput = document.getElementById('size-height');
    const rotateSelect = document.getElementById('rotate-select');
    const formatSelect = document.getElementById('format-select');
    const downloadBtn = document.getElementById('download-processed');
    const resetBtn = document.getElementById('reset-image');

    let originalFile = null;
    let canvas = document.createElement('canvas');

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
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
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            processFile(files[0]);
        }
    });

    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        originalFile = null;
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    });

    [widthInput, heightInput, rotateSelect, formatSelect].forEach(el => {
        if (el) el.addEventListener('input', updateProcessedImage);
    });

    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Unsupported format. Please select an image file.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
            originalPreview.src = evt.target.result;
            originalInfo.textContent = 'Size: ' + formatBytes(file.size);
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';

            const img = new Image();
            img.src = evt.target.result;
            img.onload = () => {
                widthInput.value = img.naturalWidth;
                heightInput.value = img.naturalHeight;
                updateProcessedImage();
            };
        };
        reader.readAsDataURL(file);
    }

    function updateProcessedImage() {
        const img = new Image();
        img.src = originalPreview.src;
        img.onload = function() {
            const ctx = canvas.getContext('2d');
            const targetW = parseInt(widthInput.value) || img.naturalWidth;
            const targetH = parseInt(heightInput.value) || img.naturalHeight;
            const angle = parseInt(rotateSelect.value) || 0;

            if (angle === 90 || angle === 270) {
                canvas.width = targetH;
                canvas.height = targetW;
            } else {
                canvas.width = targetW;
                canvas.height = targetH;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
            ctx.restore();

            if (window.location.pathname.includes('grayscale-filter')) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                ctx.putImageData(imgData, 0, 0);
            }

            const mime = formatSelect.value;
            const dataUrl = canvas.toDataURL(mime, 0.85);
            processedPreview.src = dataUrl;

            const head = 'data:' + mime + ';base64,';
            const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            processedInfo.textContent = 'Size: ' + formatBytes(sizeInBytes);

            downloadBtn.href = dataUrl;
            downloadBtn.download = 'processed_' + originalFile.name.replace(/\.[^/.]+$/, "") + '.' + mime.split('/')[1];
        };
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
