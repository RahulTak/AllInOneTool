module.exports = {
    'jpg-to-png': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="img-upload-zone">
                <span class="upload-icon">📁</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop JPG/JPEG Image here</h4>
                    <p>Supports JPG and JPEG files up to 20MB</p>
                </div>
                <input type="file" class="upload-input" id="img-file-input" accept="image/jpeg,.jpg,.jpeg">
            </div>

            <div id="image-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                <div class="tool-panels">
                    <div class="form-group">
                        <label>Original Preview (JPG/JPEG)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="original-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="original-info"></p>
                    </div>
                    <div class="form-group">
                        <label>Converted Output (PNG)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="processed-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="processed-info"></p>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group" id="opt-size-group">
                        <label for="size-width">Resize Dimensions (Optional)</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" id="size-width" placeholder="Width" class="input-control">
                            <span>×</span>
                            <input type="number" id="size-height" placeholder="Height" class="input-control">
                        </div>
                    </div>
                    <div class="form-group" id="opt-rotation-group">
                        <label for="rotate-select">Rotate Angle</label>
                        <select id="rotate-select" class="input-control">
                            <option value="0" selected>0°</option>
                            <option value="90">90° Clockwise</option>
                            <option value="180">180° Half Turn</option>
                            <option value="270">270° Counter-Clockwise</option>
                        </select>
                    </div>
                    <div class="form-group" id="opt-format-group">
                        <label for="format-select">Export Format</label>
                        <select id="format-select" class="input-control" disabled style="background:var(--bg-secondary); cursor:not-allowed; opacity:0.9;">
                            <option value="image/png" selected>PNG</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="reset-image">Reset</button>
                    <a class="btn btn-primary" id="download-processed" href="#" download="image.png">Download PNG</a>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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

    [widthInput, heightInput, rotateSelect].forEach(el => {
        if (el) el.addEventListener('input', updateProcessedImage);
    });

    function processFile(file) {
        if (!file.type.match(/^image\\/(jpeg|jpg)$/) && !file.name.match(/\\.(jpe?g)$/i)) {
            alert('Please upload a valid JPG or JPEG image.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
            originalPreview.src = evt.target.result;
            originalInfo.textContent = 'Original: ' + formatBytes(file.size);
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
            ctx.restore();

            const mime = 'image/png';
            const dataUrl = canvas.toDataURL(mime);
            processedPreview.src = dataUrl;

            const head = 'data:' + mime + ';base64,';
            const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            processedInfo.textContent = 'PNG Size: ' + formatBytes(sizeInBytes);

            downloadBtn.href = dataUrl;
            const baseName = originalFile ? originalFile.name.replace(/\\.[^/.]+$/, "") : 'image';
            downloadBtn.download = baseName + '.png';
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
`
    }),

    'webp-to-png': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="img-upload-zone">
                <span class="upload-icon">📁</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop WebP Image here</h4>
                    <p>Supports WebP files up to 20MB</p>
                </div>
                <input type="file" class="upload-input" id="img-file-input" accept="image/webp,.webp">
            </div>

            <div id="image-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                <div class="tool-panels">
                    <div class="form-group">
                        <label>Original Preview (WebP)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="original-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="original-info"></p>
                    </div>
                    <div class="form-group">
                        <label>Converted Output (PNG)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="processed-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="processed-info"></p>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group" id="opt-size-group">
                        <label for="size-width">Resize Dimensions (Optional)</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" id="size-width" placeholder="Width" class="input-control">
                            <span>×</span>
                            <input type="number" id="size-height" placeholder="Height" class="input-control">
                        </div>
                    </div>
                    <div class="form-group" id="opt-rotation-group">
                        <label for="rotate-select">Rotate Angle</label>
                        <select id="rotate-select" class="input-control">
                            <option value="0" selected>0°</option>
                            <option value="90">90° Clockwise</option>
                            <option value="180">180° Half Turn</option>
                            <option value="270">270° Counter-Clockwise</option>
                        </select>
                    </div>
                    <div class="form-group" id="opt-format-group">
                        <label for="format-select">Export Format</label>
                        <select id="format-select" class="input-control" disabled style="background:var(--bg-secondary); cursor:not-allowed; opacity:0.9;">
                            <option value="image/png" selected>PNG</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="reset-image">Reset</button>
                    <a class="btn btn-primary" id="download-processed" href="#" download="image.png">Download PNG</a>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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

    [widthInput, heightInput, rotateSelect].forEach(el => {
        if (el) el.addEventListener('input', updateProcessedImage);
    });

    function processFile(file) {
        if (file.type !== 'image/webp' && !file.name.match(/\\.webp$/i)) {
            alert('Please upload a valid WebP image.');
            return;
        }

        originalFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
            originalPreview.src = evt.target.result;
            originalInfo.textContent = 'Original: ' + formatBytes(file.size);
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
            ctx.restore();

            const mime = 'image/png';
            const dataUrl = canvas.toDataURL(mime);
            processedPreview.src = dataUrl;

            const head = 'data:' + mime + ';base64,';
            const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            processedInfo.textContent = 'PNG Size: ' + formatBytes(sizeInBytes);

            downloadBtn.href = dataUrl;
            const baseName = originalFile ? originalFile.name.replace(/\\.[^/.]+$/, "") : 'image';
            downloadBtn.download = baseName + '.png';
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
`
    }),

    'png-to-webp': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="img-upload-zone">
                <span class="upload-icon">📁</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PNG Image here</h4>
                    <p>Supports PNG files up to 20MB (transparency preserved)</p>
                </div>
                <input type="file" class="upload-input" id="img-file-input" accept="image/png,.png">
            </div>

            <div id="image-workspace" style="display: none; flex-direction: column; gap: 1.5rem;">
                <div class="tool-panels">
                    <div class="form-group">
                        <label>Original Preview (PNG)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="original-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="original-info"></p>
                    </div>
                    <div class="form-group">
                        <label>Web-Optimized Output (WebP)</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                            <img id="processed-preview" style="max-height: 300px; object-fit: contain;">
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;" id="processed-info"></p>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group" id="opt-size-group">
                        <label for="size-width">Resize Dimensions (Optional)</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="number" id="size-width" placeholder="Width" class="input-control">
                            <span>×</span>
                            <input type="number" id="size-height" placeholder="Height" class="input-control">
                        </div>
                    </div>
                    <div class="form-group" id="opt-rotation-group">
                        <label for="rotate-select">Rotate Angle</label>
                        <select id="rotate-select" class="input-control">
                            <option value="0" selected>0°</option>
                            <option value="90">90° Clockwise</option>
                            <option value="180">180° Half Turn</option>
                            <option value="270">270° Counter-Clockwise</option>
                        </select>
                    </div>
                    <div class="form-group" id="opt-format-group">
                        <label for="format-select">Export Format</label>
                        <select id="format-select" class="input-control" disabled style="background:var(--bg-secondary); cursor:not-allowed; opacity:0.9;">
                            <option value="image/webp" selected>WEBP</option>
                        </select>
                    </div>
                    <div class="form-group" id="opt-quality-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <label for="webp-quality" style="margin-bottom:0;">WebP Quality</label>
                            <span id="quality-val" style="font-weight: 600; font-family: var(--font-mono); color: var(--primary-color);">80%</span>
                        </div>
                        <input type="range" id="webp-quality" class="input-control" min="50" max="100" step="5" value="80" style="padding:0; accent-color:var(--primary-color); cursor:pointer;">
                        <small style="font-size: 0.75rem; color: var(--text-secondary);">Balanced web compression (80% recommended)</small>
                    </div>
                </div>

                <div id="size-comparison-card" style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; align-items: center;">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Original PNG Size</span>
                        <strong id="card-orig-size" style="font-size: 1.1rem; color: var(--text-primary);">-</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Optimized WebP Size</span>
                        <strong id="card-webp-size" style="font-size: 1.1rem; color: var(--text-primary);">-</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-secondary); display: block;">Efficiency</span>
                        <span id="card-savings-badge" style="display: inline-block; font-size: 0.85rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); background: rgba(34,197,94,0.15); color: #16a34a;">-</span>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="reset-image">Reset</button>
                    <a class="btn btn-primary" id="download-processed" href="#" download="image.webp">Download WebP</a>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
        if (file.type !== 'image/png' && !file.name.match(/\\.png$/i)) {
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
            const baseName = originalFile ? originalFile.name.replace(/\\.[^/.]+$/, "") : 'image';
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
`
    })
};
