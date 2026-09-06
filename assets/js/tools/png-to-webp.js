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
    const qualityInput = document.getElementById('webp-quality');
    const qualityVal = document.getElementById('quality-val');
    const cardOrigSize = document.getElementById('card-orig-size');
    const cardWebpSize = document.getElementById('card-webp-size');
    const cardSavingsBadge = document.getElementById('card-savings-badge');
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

    if (qualityInput && qualityVal) {
        qualityInput.addEventListener('input', () => {
            qualityVal.textContent = qualityInput.value + '%';
            updateProcessedImage();
        });
    }

    [widthInput, heightInput, rotateSelect].forEach(el => {
        if (el) el.addEventListener('input', updateProcessedImage);
    });

    function processFile(file) {
        if (file.type !== 'image/png' && !file.name.match(/\.png$/i)) {
            alert('Please upload a valid PNG image.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
            originalPreview.src = evt.target.result;
            const origSizeFormatted = formatBytes(file.size);
            originalInfo.textContent = 'Original PNG: ' + origSizeFormatted;
            cardOrigSize.textContent = origSizeFormatted;
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
        if (!originalPreview.src) return;
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

            // Preserves alpha channel transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
            ctx.restore();

            const quality = qualityInput ? (parseInt(qualityInput.value, 10) / 100) : 0.8;
            const mime = 'image/webp';
            const dataUrl = canvas.toDataURL(mime, quality);
            processedPreview.src = dataUrl;

            const head = 'data:' + mime + ';base64,';
            const webpBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            const webpSizeFormatted = formatBytes(webpBytes);
            processedInfo.textContent = 'WebP Size: ' + webpSizeFormatted;
            cardWebpSize.textContent = webpSizeFormatted;

            // Mathematically accurate size difference calculation
            if (originalFile && originalFile.size > 0) {
                const origBytes = originalFile.size;
                if (webpBytes < origBytes) {
                    const savedPct = ((origBytes - webpBytes) / origBytes * 100).toFixed(1);
                    cardSavingsBadge.textContent = 'Saved: ' + savedPct + '%';
                    cardSavingsBadge.style.background = 'rgba(34,197,94,0.15)';
                    cardSavingsBadge.style.color = '#16a34a';
                } else if (webpBytes > origBytes) {
                    const incPct = ((webpBytes - origBytes) / origBytes * 100).toFixed(1);
                    cardSavingsBadge.textContent = 'Size: +' + incPct + '%';
                    cardSavingsBadge.style.background = 'rgba(234,179,8,0.15)';
                    cardSavingsBadge.style.color = '#ca8a04';
                } else {
                    cardSavingsBadge.textContent = 'Size unchanged (0.0%)';
                    cardSavingsBadge.style.background = 'rgba(100,116,139,0.15)';
                    cardSavingsBadge.style.color = 'var(--text-secondary)';
                }
            }

            downloadBtn.href = dataUrl;
            const baseName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, "") : 'image';
            downloadBtn.download = baseName + '.webp';
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
