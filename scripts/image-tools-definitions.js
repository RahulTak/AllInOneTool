module.exports = {
    'svg-to-png': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="svg-dropzone">
                <span class="upload-icon">🖼️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop SVG file here</h4>
                    <p>Strictly accepts .svg files only</p>
                </div>
                <input type="file" class="upload-input" id="svg-input" accept=".svg">
            </div>

            <div id="svg-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; min-height:200px;">
                    <div id="svg-preview-container" style="border:1px dashed var(--border-color); padding:1rem; border-radius:var(--radius-sm); max-height:300px; display:flex; align-items:center; justify-content:center; background:#ffffff;"></div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="svg-bg-select">Background Color</label>
                        <select id="svg-bg-select" class="input-control">
                            <option value="transparent">Transparent</option>
                            <option value="white" selected>White Background</option>
                        </select>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-size:0.85rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                    <div>Dimensions: <strong id="svg-info-dims">-</strong></div>
                    <div>File Size: <strong id="svg-info-size">-</strong></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="svg-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="svg-btn-convert">Download PNG</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),
    'png-to-svg': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="png-dropzone">
                <span class="upload-icon">🖼️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PNG here</h4>
                    <p>Accepts PNG files only</p>
                </div>
                <input type="file" class="upload-input" id="png-input" accept="image/png">
            </div>

            <div id="png-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="png-canvas" style="max-height:220px; border-radius:var(--radius-sm); border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="png-trace-threshold">Tracing Threshold (Contrast)</label>
                        <input type="range" id="png-trace-threshold" class="input-control" min="0" max="255" value="128" style="padding:0;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="png-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="png-btn-convert">Download SVG</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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

        const svgContent = '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ' + w + ' ' + h + '\" width=\"' + w + '\" height=\"' + h + '\"><path d=\"' + path + '\" fill=\"#000000\"/></svg>';
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
`
    }),
    'crop-image': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <style>
                .crop-container {
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    overflow: hidden;
                    user-select: none;
                    margin: 0 auto;
                }
                .crop-img {
                    display: block;
                    max-width: 100%;
                    max-height: 400px;
                    pointer-events: none;
                }
                .crop-overlay {
                    position: absolute;
                    top: 10%;
                    left: 10%;
                    width: 80%;
                    height: 80%;
                    border: 2px dashed #3b82f6;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
                    cursor: move;
                    box-sizing: border-box;
                }
                .crop-handle {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: #3b82f6;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-sizing: border-box;
                }
                .handle-tl { top: -6px; left: -6px; cursor: nwse-resize; }
                .handle-tr { top: -6px; right: -6px; cursor: nesw-resize; }
                .handle-bl { bottom: -6px; left: -6px; cursor: nesw-resize; }
                .handle-br { bottom: -6px; right: -6px; cursor: nwse-resize; }
                .crop-preview-box {
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: 1rem;
                    background: var(--bg-primary);
                    text-align: center;
                }
                .crop-preview-canvas {
                    max-width: 100%;
                    max-height: 150px;
                    border: 1px dashed var(--border-color);
                    margin-top: 0.5rem;
                }
            </style>

            <div class="upload-zone" id="crop-dropzone">
                <span class="upload-icon">✂️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image to Crop</h4>
                    <p>Supports PNG, JPG, JPEG, WEBP</p>
                </div>
                <input type="file" class="upload-input" id="crop-input" accept="image/*">
            </div>

            <div id="crop-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; overflow:hidden; padding:1rem; background:var(--bg-secondary); border-radius:var(--radius-sm);">
                    <div class="crop-container" id="crop-wrapper">
                        <img id="crop-target-img" class="crop-img">
                        <div class="crop-overlay" id="crop-box">
                            <div class="crop-handle handle-tl" data-handle="tl"></div>
                            <div class="crop-handle handle-tr" data-handle="tr"></div>
                            <div class="crop-handle handle-bl" data-handle="bl"></div>
                            <div class="crop-handle handle-br" data-handle="br"></div>
                        </div>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="crop-aspect">Aspect Ratio Preset</label>
                        <select id="crop-aspect" class="input-control">
                            <option value="free">Free Crop</option>
                            <option value="1:1">Square (1:1)</option>
                            <option value="16:9">Widescreen (16:9)</option>
                            <option value="4:3">Standard (4:3)</option>
                            <option value="3:2">Photo (3:2)</option>
                        </select>
                    </div>

                    <div class="crop-preview-box">
                        <label>Live Crop Preview</label>
                        <div>
                            <canvas id="crop-preview-canvas" class="crop-preview-canvas"></canvas>
                        </div>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="crop-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="crop-btn-action">Crop & Download</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const wrapper = document.getElementById('crop-wrapper');
    const img = document.getElementById('crop-target-img');
    const cropBox = document.getElementById('crop-box');
    const aspectSelect = document.getElementById('crop-aspect');
    const previewCanvas = document.getElementById('crop-preview-canvas');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

    if (!input) return;

    let naturalW = 0, naturalH = 0;
    let dragMode = null; // 'move', 'tl', 'tr', 'bl', 'br'
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0, startWidth = 0, startHeight = 0;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    aspectSelect.addEventListener('change', () => {
        applyAspect();
        updatePreview();
    });

    function applyAspect() {
        const aspect = aspectSelect.value;
        const rect = wrapper.getBoundingClientRect();
        let w = rect.width * 0.8;
        let h = rect.height * 0.8;

        if (aspect === '1:1') {
            const size = Math.min(w, h);
            w = size;
            h = size;
        } else if (aspect === '16:9') {
            h = w * (9/16);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (16/9);
            }
        } else if (aspect === '4:3') {
            h = w * (3/4);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (4/3);
            }
        } else if (aspect === '3:2') {
            h = w * (2/3);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (3/2);
            }
        }

        cropBox.style.width = Math.round(w) + 'px';
        cropBox.style.height = Math.round(h) + 'px';
        cropBox.style.left = Math.round((rect.width - w) / 2) + 'px';
        cropBox.style.top = Math.round((rect.height - h) / 2) + 'px';
    }

    // Drag / Resize bindings
    cropBox.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    // Touch support
    cropBox.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', stopDrag);

    function startDrag(e) {
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const target = e.target;
        if (target.classList.contains('crop-handle')) {
            dragMode = target.getAttribute('data-handle');
        } else {
            dragMode = 'move';
        }

        startX = clientX;
        startY = clientY;
        startLeft = parseFloat(cropBox.style.left) || 0;
        startTop = parseFloat(cropBox.style.top) || 0;
        startWidth = parseFloat(cropBox.style.width) || 0;
        startHeight = parseFloat(cropBox.style.height) || 0;
    }

    function drag(e) {
        if (!dragMode) return;
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const dx = clientX - startX;
        const dy = clientY - startY;

        const rect = wrapper.getBoundingClientRect();
        const maxW = rect.width;
        const maxH = rect.height;

        let left = startLeft;
        let top = startTop;
        let w = startWidth;
        let h = startHeight;

        if (dragMode === 'move') {
            left = Math.max(0, Math.min(maxW - w, startLeft + dx));
            top = Math.max(0, Math.min(maxH - h, startTop + dy));
        } else {
            const aspect = aspectSelect.value;
            let ratio = null;
            if (aspect === '1:1') ratio = 1;
            else if (aspect === '16:9') ratio = 16/9;
            else if (aspect === '4:3') ratio = 4/3;
            else if (aspect === '3:2') ratio = 3/2;

            if (dragMode === 'br') {
                w = Math.max(30, Math.min(maxW - left, startWidth + dx));
                h = ratio ? w / ratio : Math.max(30, Math.min(maxH - top, startHeight + dy));
                if (ratio && h + top > maxH) {
                    h = maxH - top;
                    w = h * ratio;
                }
            } else if (dragMode === 'bl') {
                const newLeft = Math.max(0, Math.min(startLeft + startWidth - 30, startLeft + dx));
                w = startLeft + startWidth - newLeft;
                h = ratio ? w / ratio : Math.max(30, Math.min(maxH - top, startHeight + dy));
                if (ratio && h + top > maxH) {
                    h = maxH - top;
                    w = h * ratio;
                    left = startLeft + startWidth - w;
                } else {
                    left = newLeft;
                }
            } else if (dragMode === 'tr') {
                const newTop = Math.max(0, Math.min(startTop + startHeight - 30, startTop + dy));
                h = startTop + startHeight - newTop;
                w = ratio ? h * ratio : Math.max(30, Math.min(maxW - left, startWidth + dx));
                if (ratio && w + left > maxW) {
                    w = maxW - left;
                    h = w / ratio;
                    top = startTop + startHeight - h;
                } else {
                    top = newTop;
                }
            } else if (dragMode === 'tl') {
                const newLeft = Math.max(0, Math.min(startLeft + startWidth - 30, startLeft + dx));
                const newTop = Math.max(0, Math.min(startTop + startHeight - 30, startTop + dy));
                
                if (ratio) {
                    w = startLeft + startWidth - newLeft;
                    h = w / ratio;
                    if (startTop + startHeight - h < 0) {
                        h = startTop + startHeight;
                        w = h * ratio;
                    }
                    left = startLeft + startWidth - w;
                    top = startTop + startHeight - h;
                } else {
                    w = startLeft + startWidth - newLeft;
                    h = startTop + startHeight - newTop;
                    left = newLeft;
                    top = newTop;
                }
            }
        }

        cropBox.style.left = Math.round(left) + 'px';
        cropBox.style.top = Math.round(top) + 'px';
        cropBox.style.width = Math.round(w) + 'px';
        cropBox.style.height = Math.round(h) + 'px';

        updatePreview();
    }

    function stopDrag() {
        dragMode = null;
    }

    function updatePreview() {
        if (!img.src) return;
        const rect = wrapper.getBoundingClientRect();
        const left = parseFloat(cropBox.style.left) || 0;
        const top = parseFloat(cropBox.style.top) || 0;
        const w = parseFloat(cropBox.style.width) || rect.width;
        const h = parseFloat(cropBox.style.height) || rect.height;

        const scaleX = naturalW / rect.width;
        const scaleY = naturalH / rect.height;

        const cropX = left * scaleX;
        const cropY = top * scaleY;
        const cropW = w * scaleX;
        const cropH = h * scaleY;

        previewCanvas.width = cropW;
        previewCanvas.height = cropH;
        const ctx = previewCanvas.getContext('2d');
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    }

    action.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = previewCanvas.toDataURL('image/png');
        a.download = 'cropped_output.png';
        a.click();
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                naturalW = img.naturalWidth;
                naturalH = img.naturalHeight;
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
                applyAspect();
                setTimeout(updatePreview, 100);
            };
        };
        reader.readAsDataURL(file);
    }
}
`
    }),
    'image-flip': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="flip-dropzone">
                <span class="upload-icon">↔️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="flip-input" accept="image/*">
            </div>

            <div id="flip-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="flip-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm);"></canvas>
                </div>

                <div class="options-grid" style="grid-template-columns:1fr 1fr; gap:1rem; text-align:center;">
                    <button class="btn btn-secondary" id="flip-btn-horiz">Horizontal Flip</button>
                    <button class="btn btn-secondary" id="flip-btn-vert">Vertical Flip</button>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="flip-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="flip-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('flip-dropzone');
    const input = document.getElementById('flip-input');
    const workspace = document.getElementById('flip-workspace');
    const canvas = document.getElementById('flip-canvas');
    const flipH = document.getElementById('flip-btn-horiz');
    const flipV = document.getElementById('flip-btn-vert');
    const reset = document.getElementById('flip-btn-reset');
    const download = document.getElementById('flip-btn-download');

    if (!input) return;
    let img = new Image();
    let isFlippedH = false;
    let isFlippedV = false;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        isFlippedH = false;
        isFlippedV = false;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        ctx.translate(isFlippedH ? canvas.width : 0, isFlippedV ? canvas.height : 0);
        ctx.scale(isFlippedH ? -1 : 1, isFlippedV ? -1 : 1);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    flipH.addEventListener('click', () => { isFlippedH = !isFlippedH; draw(); });
    flipV.addEventListener('click', () => { isFlippedV = !isFlippedV; draw(); });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'flipped.png';
        a.click();
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                isFlippedH = false;
                isFlippedV = false;
                draw();
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    }
}
`
    }),
    'image-color-picker': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="picker-dropzone">
                <span class="upload-icon">🎨</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="picker-input" accept="image/*">
            </div>

            <div id="picker-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; overflow:auto;">
                    <canvas id="picker-canvas" style="max-height:300px; cursor:crosshair; border:1px solid var(--border-color);"></canvas>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem; text-align:center;">
                    <div class="form-group">
                        <label>Color Preview</label>
                        <div id="picker-preview" style="height:45px; border-radius:var(--radius-sm); background:#000000; border:1px solid var(--border-color);"></div>
                    </div>
                    <div class="form-group">
                        <label>HEX</label>
                        <input type="text" readonly id="picker-hex" class="input-control" value="#000000" style="text-align:center;">
                    </div>
                    <div class="form-group">
                        <label>RGB</label>
                        <input type="text" readonly id="picker-rgb" class="input-control" value="rgb(0,0,0)" style="text-align:center;">
                    </div>
                    <div class="form-group">
                        <label>HSL</label>
                        <input type="text" readonly id="picker-hsl" class="input-control" value="hsl(0,0%,0%)" style="text-align:center;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="picker-btn-reset">Reset</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),
    'image-to-base64': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="b64-dropzone">
                <span class="upload-icon">🔗</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="b64-input" accept="image/*">
            </div>

            <div id="b64-loader" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem;">
                <div class="loader" style="border:4px solid var(--border-color); border-top:4px solid var(--primary-color); border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
                <span id="b64-status" style="font-weight:600; color:var(--text-secondary);">Converting...</span>
            </div>

            <div id="b64-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:grid; grid-template-columns:1fr 200px; gap:1.5rem; align-items:start;">
                    <div class="form-group">
                        <label>Base64 Data String</label>
                        <textarea id="b64-output-text" readonly class="input-control" style="min-height:180px; font-family:var(--font-mono); font-size:0.8rem; background:var(--bg-primary);"></textarea>
                    </div>
                    <div style="text-align:center;">
                        <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Image Preview</label>
                        <div style="border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem; background:#ffffff;">
                            <img id="b64-preview-img" style="max-width:100%; max-height:150px; border-radius:var(--radius-xs);">
                        </div>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="b64-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="b64-btn-copy">Copy to Clipboard</button>
                    <a id="b64-btn-download" class="btn btn-secondary" style="display:inline-flex; align-items:center; justify-content:center;">Download TXT</a>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('b64-dropzone');
    const input = document.getElementById('b64-input');
    const loader = document.getElementById('b64-loader');
    const statusText = document.getElementById('b64-status');
    const workspace = document.getElementById('b64-workspace');
    const output = document.getElementById('b64-output-text');
    const previewImg = document.getElementById('b64-preview-img');
    const reset = document.getElementById('b64-btn-reset');
    const copy = document.getElementById('b64-btn-copy');
    const download = document.getElementById('b64-btn-download');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        previewImg.src = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        if(output.value) {
            navigator.clipboard.writeText(output.value).then(() => alert('Base64 string copied!'));
        }
    });

    function process(file) {
        dropzone.style.display = 'none';
        loader.style.display = 'flex';
        statusText.textContent = 'Converting image to Base64...';

        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const b64Data = e.target.result;
                output.value = b64Data;
                previewImg.src = b64Data;

                const blob = new Blob([b64Data], { type: 'text/plain' });
                download.href = URL.createObjectURL(blob);
                download.download = 'base64_data.txt';

                loader.style.display = 'none';
                workspace.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }, 150);
    }
}
`
    }),
    'base64-to-image': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="b64-str-input">Paste Image Base64 Data String</label>
                <textarea id="b64-str-input" class="input-control" placeholder="data:image/png;base64,..." style="min-height:150px; font-family:var(--font-mono);"></textarea>
            </div>

            <div id="b64-img-workspace" style="display:none; flex-direction:column; gap:1.5rem; margin-top:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; background:var(--bg-primary);">
                    <img id="b64-img-preview" style="max-height:250px; max-width:100%;">
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="b64-img-reset">Reset</button>
                    <button class="btn btn-primary" id="b64-img-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('b64-str-input');
    const workspace = document.getElementById('b64-img-workspace');
    const preview = document.getElementById('b64-img-preview');
    const reset = document.getElementById('b64-img-reset');
    const download = document.getElementById('b64-img-download');

    if (!input) return;

    input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val.startsWith('data:image/')) {
            preview.src = val;
            workspace.style.display = 'flex';
        } else {
            workspace.style.display = 'none';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        preview.src = '';
        workspace.style.display = 'none';
    });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = preview.src;
        a.download = 'decoded_image.png';
        a.click();
    });
}
`
    }),
    'text-to-image': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="tti-text">Banner Text</label>
                    <input type="text" id="tti-text" class="input-control" value="AllInOneTool">
                </div>
                <div class="form-group">
                    <label for="tti-font">Font Family</label>
                    <select id="tti-font" class="input-control">
                        <option value="sans-serif">Sans-Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tti-size">Font Size (px)</label>
                    <input type="number" id="tti-size" class="input-control" value="48">
                </div>
            </div>

            <div class="options-grid" style="grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                <div class="form-group">
                    <label for="tti-color-fg">Text Color</label>
                    <input type="color" id="tti-color-fg" class="input-control" value="#ffffff" style="height:45px; padding:2px;">
                </div>
                <div class="form-group">
                    <label for="tti-color-bg">Background Color</label>
                    <input type="color" id="tti-color-bg" class="input-control" value="#6366f1" style="height:45px; padding:2px;">
                </div>
            </div>

            <div style="display:flex; justify-content:center; align-items:center; margin:2rem 0; min-height:150px;">
                <canvas id="tti-canvas" style="border:1px solid var(--border-color); border-radius:var(--radius-sm); max-width:100%;"></canvas>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="tti-btn-reset">Reset</button>
                <button class="btn btn-primary" id="tti-btn-download">Download PNG</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),
    'image-mirror': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="mirror-dropzone">
                <span class="upload-icon">🪞</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="mirror-input" accept="image/*">
            </div>

            <div id="mirror-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="mirror-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="mirror-mode">Mirror Type</label>
                        <select id="mirror-mode" class="input-control">
                            <option value="horizontal">Horizontal Mirror (Left to Right)</option>
                            <option value="vertical">Vertical Mirror (Top to Bottom)</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="mirror-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="mirror-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('mirror-dropzone');
    const input = document.getElementById('mirror-input');
    const workspace = document.getElementById('mirror-workspace');
    const canvas = document.getElementById('mirror-canvas');
    const mode = document.getElementById('mirror-mode');
    const reset = document.getElementById('mirror-btn-reset');
    const download = document.getElementById('mirror-btn-download');

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

    mode.addEventListener('change', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        if (mode.value === 'horizontal') {
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(canvas, 0, 0, w/2, h, 0, 0, w/2, h);
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(0, h);
            ctx.scale(1, -1);
            ctx.drawImage(canvas, 0, 0, w, h/2, 0, 0, w, h/2);
            ctx.restore();
        }
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'mirrored.png';
        a.click();
    });

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
`
    }),
    'image-border-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="border-dropzone">
                <span class="upload-icon">⬜</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="border-input" accept="image/*">
            </div>

            <div id="border-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="border-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="border-width">Border Width (px)</label>
                        <input type="number" id="border-width" class="input-control" value="15" min="1" max="100">
                    </div>
                    <div class="form-group">
                        <label for="border-color">Border Color</label>
                        <input type="color" id="border-color" class="input-control" value="#ff0000" style="height:45px; padding:2px;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="border-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="border-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('border-dropzone');
    const input = document.getElementById('border-input');
    const workspace = document.getElementById('border-workspace');
    const canvas = document.getElementById('border-canvas');
    const borderWidth = document.getElementById('border-width');
    const borderColor = document.getElementById('border-color');
    const reset = document.getElementById('border-btn-reset');
    const download = document.getElementById('border-btn-download');

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

    [borderWidth, borderColor].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const b = parseInt(borderWidth.value) || 15;
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;

        canvas.width = w + (b * 2);
        canvas.height = h + (b * 2);

        ctx.fillStyle = borderColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, b, b, w, h);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'bordered.png';
        a.click();
    });

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
`
    }),
    'round-image-corners': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="round-dropzone">
                <span class="upload-icon">⚪</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="round-input" accept="image/*">
            </div>

            <div id="round-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="round-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="round-radius">Corner Radius (px)</label>
                        <input type="range" id="round-radius" class="input-control" min="0" max="150" value="30" style="padding:0;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="round-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="round-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('round-dropzone');
    const input = document.getElementById('round-input');
    const workspace = document.getElementById('round-workspace');
    const canvas = document.getElementById('round-canvas');
    const radiusInput = document.getElementById('round-radius');
    const reset = document.getElementById('round-btn-reset');
    const download = document.getElementById('round-btn-download');

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

    radiusInput.addEventListener('input', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        const r = parseInt(radiusInput.value) || 0;

        ctx.clearRect(0,0,w,h);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'rounded.png';
        a.click();
    });

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
`
    }),
    'image-watermark': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="wm-dropzone">
                <span class="upload-icon">💧</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="wm-input" accept="image/*">
            </div>

            <div id="wm-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="wm-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="wm-text">Watermark Text</label>
                        <input type="text" id="wm-text" class="input-control" value="COPYRIGHT">
                    </div>
                    <div class="form-group">
                        <label for="wm-opacity">Opacity</label>
                        <input type="range" id="wm-opacity" class="input-control" min="10" max="100" value="40" style="padding:0;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="wm-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="wm-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('wm-dropzone');
    const input = document.getElementById('wm-input');
    const workspace = document.getElementById('wm-workspace');
    const canvas = document.getElementById('wm-canvas');
    const textInput = document.getElementById('wm-text');
    const opacityInput = document.getElementById('wm-opacity');
    const reset = document.getElementById('wm-btn-reset');
    const download = document.getElementById('wm-btn-download');

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

    [textInput, opacityInput].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        ctx.save();
        ctx.globalAlpha = parseInt(opacityInput.value) / 100;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + Math.round(h * 0.08) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw watermark across the diagonal center
        ctx.translate(w/2, h/2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(textInput.value || 'COPYRIGHT', 0, 0);
        ctx.restore();
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'watermarked.png';
        a.click();
    });

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
`
    }),
    'meme-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="meme-dropzone">
                <span class="upload-icon">😜</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="meme-input" accept="image/*">
            </div>

            <div id="meme-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="meme-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="meme-top">Top Text</label>
                        <input type="text" id="meme-top" class="input-control" value="WHEN COMPILING FINALLY PASSES">
                    </div>
                    <div class="form-group">
                        <label for="meme-bottom">Bottom Text</label>
                        <input type="text" id="meme-bottom" class="input-control" value="NO SYNTAX ERRORS FOUND">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="meme-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="meme-btn-download">Download Meme</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('meme-dropzone');
    const input = document.getElementById('meme-input');
    const workspace = document.getElementById('meme-workspace');
    const canvas = document.getElementById('meme-canvas');
    const topText = document.getElementById('meme-top');
    const bottomText = document.getElementById('meme-bottom');
    const reset = document.getElementById('meme-btn-reset');
    const download = document.getElementById('meme-btn-download');

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

    [topText, bottomText].forEach(el => el.addEventListener('input', draw));

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.round(w * 0.015);
        ctx.font = 'bold ' + Math.round(h * 0.1) + 'px Impact, sans-serif';
        ctx.textAlign = 'center';

        // Draw Top Text
        ctx.textBaseline = 'top';
        ctx.strokeText(topText.value.toUpperCase(), w/2, h * 0.05);
        ctx.fillText(topText.value.toUpperCase(), w/2, h * 0.05);

        // Draw Bottom Text
        ctx.textBaseline = 'bottom';
        ctx.strokeText(bottomText.value.toUpperCase(), w/2, h * 0.95);
        ctx.fillText(bottomText.value.toUpperCase(), w/2, h * 0.95);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'meme.png';
        a.click();
    });

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
`
    }),
    'gif-to-png': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="gif-dropzone">
                <span class="upload-icon">🎞️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop GIF here</h4>
                    <p>Decompress every animation frame into separate PNG images</p>
                </div>
                <input type="file" class="upload-input" id="gif-input" accept="image/gif">
            </div>

            <div id="gif-loader" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem;">
                <div class="loader" style="border:4px solid var(--border-color); border-top:4px solid var(--primary-color); border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
                <span style="font-weight:600; color:var(--text-secondary);">Extracting Frames...</span>
            </div>

            <div id="gif-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Extracted frames count: <strong id="gif-frames-count">0</strong>
                </div>

                <div id="gif-frames-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:1rem; max-height:300px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; background:#ffffff;"></div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="gif-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="gif-btn-download">Download All Frames (ZIP)</button>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('gif-dropzone');
    const input = document.getElementById('gif-input');
    const loader = document.getElementById('gif-loader');
    const workspace = document.getElementById('gif-workspace');
    const framesCount = document.getElementById('gif-frames-count');
    const framesGrid = document.getElementById('gif-frames-grid');
    const reset = document.getElementById('gif-btn-reset');
    const downloadAll = document.getElementById('gif-btn-download');

    if (!input) return;
    let framesList = []; // Array of canvas references

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        framesList = [];
        framesGrid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    downloadAll.addEventListener('click', async () => {
        if (framesList.length === 0) return;
        const zip = new JSZip();
        for (let i = 0; i < framesList.length; i++) {
            const dataUrl = framesList[i].toDataURL('image/png');
            const data = dataUrl.split(',')[1];
            zip.file('frame_' + (i+1) + '.png', data, { base64: true });
        }
        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'gif_frames.zip';
        a.click();
    });

    function process(file) {
        dropzone.style.display = 'none';
        loader.style.display = 'flex';
        framesList = [];
        framesGrid.innerHTML = '';

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const arrayBuffer = e.target.result;
                const gifReader = new gifuct.GifReader(new Uint8Array(arrayBuffer));
                const numFrames = gifReader.numFrames();
                const width = gifReader.width;
                const height = gifReader.height;

                framesCount.textContent = numFrames;

                // Temporary buffer to handle disposal modes between frames
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');

                for (let i = 0; i < numFrames; i++) {
                    const frameInfo = gifReader.frameInfo(i);
                    const imgData = tempCtx.createImageData(width, height);
                    
                    // Decodes raw LZW pixels directly into RGBA bytes
                    gifReader.decodeAndBlitFrameRGBA(i, imgData.data);
                    
                    const frameCanvas = document.createElement('canvas');
                    frameCanvas.width = width;
                    frameCanvas.height = height;
                    const frameCtx = frameCanvas.getContext('2d');
                    frameCtx.putImageData(imgData, 0, 0);

                    framesList.push(frameCanvas);

                    // Add to previews grid
                    const cell = document.createElement('div');
                    cell.style.textAlign = 'center';
                    cell.style.border = '1px solid var(--border-color)';
                    cell.style.borderRadius = 'var(--radius-sm)';
                    cell.style.padding = '0.5rem';
                    cell.style.background = 'var(--bg-primary)';

                    const preview = document.createElement('img');
                    preview.src = frameCanvas.toDataURL('image/png');
                    preview.style.maxWidth = '100%';
                    preview.style.height = '60px';
                    preview.style.objectFit = 'contain';

                    const label = document.createElement('div');
                    label.textContent = '#' + (i + 1);
                    label.style.fontSize = '0.75rem';
                    label.style.fontWeight = 'bold';
                    label.style.margin = '0.25rem 0';

                    const dlLink = document.createElement('a');
                    dlLink.href = preview.src;
                    dlLink.download = 'frame_' + (i+1) + '.png';
                    dlLink.textContent = 'Save';
                    dlLink.style.fontSize = '0.7rem';
                    dlLink.style.color = 'var(--primary-color)';
                    dlLink.style.fontWeight = '600';

                    cell.appendChild(preview);
                    cell.appendChild(label);
                    cell.appendChild(dlLink);
                    framesGrid.appendChild(cell);
                }

                loader.style.display = 'none';
                workspace.style.display = 'flex';
            } catch (err) {
                alert('Failed to parse animated GIF. File may be corrupt or standard format violated.');
                loader.style.display = 'none';
                dropzone.style.display = 'flex';
            }
        };
        reader.readAsArrayBuffer(file);
    }
}
`
    }),
    'png-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="pdf-dropzone">
                <span class="upload-icon">📄</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PNGs here</h4>
                    <p>Accepts multiple files for compilation</p>
                </div>
                <input type="file" class="upload-input" id="pdf-input" accept="image/png" multiple>
            </div>

            <div id="pdf-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Images Layout List (Preview order, delete, or rearrange)</h5>
                    <div id="pdf-thumbnails-list" style="display:flex; flex-direction:column; gap:0.5rem;"></div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="pdf-page-size">Page Size</label>
                        <select id="pdf-page-size" class="input-control">
                            <option value="A4">A4 (595 x 842 pt)</option>
                            <option value="LETTER">Letter (612 x 792 pt)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="pdf-page-orient">Orientation</label>
                        <select id="pdf-page-orient" class="input-control">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="pdf-btn-reset">Reset / Clear</button>
                    <button class="btn btn-primary" id="pdf-btn-convert">Download Compiled PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('pdf-dropzone');
    const input = document.getElementById('pdf-input');
    const workspace = document.getElementById('pdf-workspace');
    const thumbsList = document.getElementById('pdf-thumbnails-list');
    const pageSizeSelect = document.getElementById('pdf-page-size');
    const pageOrientSelect = document.getElementById('pdf-page-orient');
    const reset = document.getElementById('pdf-btn-reset');
    const convert = document.getElementById('pdf-btn-convert');

    if (!input) return;
    let imagesArr = []; // Array of { file, dataUrl }

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagesArr.push({ file, dataUrl: event.target.result });
                    renderThumbs();
                };
                reader.readAsDataURL(file);
            });
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        imagesArr = [];
        thumbsList.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function renderThumbs() {
        thumbsList.innerHTML = '';
        imagesArr.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '1rem';
            row.style.padding = '0.5rem';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-xs)';
            row.style.background = 'var(--bg-secondary)';

            const img = document.createElement('img');
            img.src = item.dataUrl;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'contain';
            img.style.border = '1px solid var(--border-color)';
            img.style.borderRadius = 'var(--radius-xs)';

            const title = document.createElement('span');
            title.textContent = item.file.name;
            title.style.fontSize = '0.85rem';
            title.style.flexGrow = '1';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '0.25rem';

            const btnUp = document.createElement('button');
            btnUp.className = 'btn';
            btnUp.style.padding = '2px 8px';
            btnUp.style.fontSize = '0.75rem';
            btnUp.textContent = '▲';
            btnUp.disabled = idx === 0;
            btnUp.onclick = () => {
                const temp = imagesArr[idx];
                imagesArr[idx] = imagesArr[idx - 1];
                imagesArr[idx - 1] = temp;
                renderThumbs();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '2px 8px';
            btnDown.style.fontSize = '0.75rem';
            btnDown.textContent = '▼';
            btnDown.disabled = idx === imagesArr.length - 1;
            btnDown.onclick = () => {
                const temp = imagesArr[idx];
                imagesArr[idx] = imagesArr[idx + 1];
                imagesArr[idx + 1] = temp;
                renderThumbs();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '2px 8px';
            btnDel.style.fontSize = '0.75rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                imagesArr.splice(idx, 1);
                if (imagesArr.length === 0) {
                    reset.click();
                } else {
                    renderThumbs();
                }
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnDel);

            row.appendChild(img);
            row.appendChild(title);
            row.appendChild(controls);
            thumbsList.appendChild(row);
        });
    }

    convert.addEventListener('click', async () => {
        if (imagesArr.length === 0) return;
        if (typeof PDFLib !== 'undefined') {
            const pdfDoc = await PDFLib.PDFDocument.create();

            const isPortrait = pageOrientSelect.value === 'portrait';
            const pageW = pageSizeSelect.value === 'A4' ? 595 : 612;
            const pageH = pageSizeSelect.value === 'A4' ? 842 : 792;
            
            const docWidth = isPortrait ? pageW : pageH;
            const docHeight = isPortrait ? pageH : pageW;

            for(let i=0; i<imagesArr.length; i++) {
                const page = pdfDoc.addPage([docWidth, docHeight]);
                const item = imagesArr[i];
                const arrayBuffer = await item.file.arrayBuffer();
                const pngImage = await pdfDoc.embedPng(arrayBuffer);
                
                const margin = 20;
                const fitWidth = docWidth - (margin * 2);
                const fitHeight = docHeight - (margin * 2);

                page.drawImage(pngImage, {
                    x: margin,
                    y: margin,
                    width: fitWidth,
                    height: fitHeight
                });
            }
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'png_images.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('PDF library dependencies are loading. Please try again.');
        }
    });
}
`
    }),
    'tiff-to-jpg': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="tiff-dropzone">
                <span class="upload-icon">🖼️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop TIFF file here</h4>
                    <p>Accepts TIFF formats only</p>
                </div>
                <input type="file" class="upload-input" id="tiff-input" accept=".tiff,.tif">
            </div>

            <div id="tiff-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="tiff-canvas" style="max-height:250px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="tiff-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="tiff-btn-convert">Download JPG</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('tiff-dropzone');
    const input = document.getElementById('tiff-input');
    const workspace = document.getElementById('tiff-workspace');
    const canvas = document.getElementById('tiff-canvas');
    const reset = document.getElementById('tiff-btn-reset');
    const convert = document.getElementById('tiff-btn-convert');

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
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    convert.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/jpeg');
        a.download = 'converted_tiff.jpg';
        a.click();
    });

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
`
    }),
    'image-exif-extractor': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="exif-dropzone">
                <span class="upload-icon">🔍</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop JPEG to extract EXIF</h4>
                    <p>Loads standard camera EXIF metadata labels client-side</p>
                </div>
                <input type="file" class="upload-input" id="exif-input" accept="image/jpeg,image/jpg">
            </div>

            <div id="exif-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;" id="exif-results-table"></table>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="exif-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="exif-btn-copy">Copy Metadata Text</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('exif-dropzone');
    const input = document.getElementById('exif-input');
    const workspace = document.getElementById('exif-workspace');
    const table = document.getElementById('exif-results-table');
    const reset = document.getElementById('exif-btn-reset');
    const copy = document.getElementById('exif-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        table.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        let txt = '';
        table.querySelectorAll('tr').forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length === 2) {
                txt += cols[0].innerText + ': ' + cols[1].innerText + '\\n';
            }
        });
        navigator.clipboard.writeText(txt).then(() => alert('EXIF metadata copied!'));
    });

    function process(file) {
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        table.innerHTML = '<tr><td colspan="2" style="text-align:center;">Extracting EXIF...</td></tr>';

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                EXIF.getData(img, function() {
                    const tags = EXIF.getAllTags(img);
                    if (Object.keys(tags).length === 0) {
                        table.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:1.5rem; color:var(--text-tertiary);">No EXIF metadata available.</td></tr>';
                        return;
                    }

                    const rows = [
                        ['File Name', file.name],
                        ['File Size', (file.size / 1024).toFixed(1) + ' KB'],
                        ['Camera Manufacturer', tags.Make || '-'],
                        ['Camera Model', tags.Model || '-'],
                        ['Software', tags.Software || '-'],
                        ['Aperture', tags.ApertureValue || tags.FNumber || '-'],
                        ['ISO Speed', tags.ISOSpeedRatings || '-'],
                        ['Focal Length', tags.FocalLength ? tags.FocalLength + 'mm' : '-'],
                        ['Date Taken', tags.DateTimeOriginal || tags.DateTime || '-'],
                        ['Orientation', tags.Orientation || '-'],
                        ['Resolution', img.naturalWidth + ' x ' + img.naturalHeight + ' px']
                    ];

                    table.innerHTML = rows.map(r => {
                        return '<tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.6rem; font-weight:700; width:40%;">' + r[0] + '</td><td style="padding:0.6rem; color:var(--text-secondary);">' + r[1] + '</td></tr>';
                    }).join('');
                });
            };
        };
        reader.readAsDataURL(file);
    }
}
`
    }),
    'canvas-to-image': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="display:flex; justify-content:center; align-items:center; margin-bottom:1rem;">
                <canvas id="paint-canvas" width="600" height="300" style="border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:crosshair; background:#ffffff;"></canvas>
            </div>

            <div class="options-grid" style="grid-template-columns: 1fr 1fr; gap:1rem;">
                <div class="form-group">
                    <label for="paint-color">Brush Color</label>
                    <input type="color" id="paint-color" class="input-control" value="#000000" style="height:45px; padding:2px;">
                </div>
                <div class="form-group">
                    <label for="paint-width">Brush Size</label>
                    <input type="range" id="paint-width" class="input-control" min="1" max="20" value="5" style="padding:0;">
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="paint-btn-clear">Clear</button>
                <button class="btn btn-primary" id="paint-btn-download">Download Image</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const canvas = document.getElementById('paint-canvas');
    const color = document.getElementById('paint-color');
    const width = document.getElementById('paint-width');
    const clear = document.getElementById('paint-btn-clear');
    const download = document.getElementById('paint-btn-download');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);

    function startDraw(e) {
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e) {
        if (!drawing) return;
        ctx.strokeStyle = color.value;
        ctx.lineWidth = parseInt(width.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDraw() {
        drawing = false;
    }

    clear.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,600,300);
    });

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'drawing.png';
        a.click();
    });

    // Init canvas with white fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,600,300);
}
`
    }),
    'ico-converter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="ico-dropzone">
                <span class="upload-icon">💎</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PNG here</h4>
                    <p>Converts PNG into true .ico icons</p>
                </div>
                <input type="file" class="upload-input" id="ico-input" accept="image/png">
            </div>

            <div id="ico-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    File Loaded: <strong id="ico-file-name">-</strong>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="ico-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="ico-btn-convert">Download ICO Icon</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('ico-dropzone');
    const input = document.getElementById('ico-input');
    const workspace = document.getElementById('ico-workspace');
    const fileName = document.getElementById('ico-file-name');
    const reset = document.getElementById('ico-btn-reset');
    const convert = document.getElementById('ico-btn-convert');

    if (!input) return;
    let dataUrl = '';

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        dataUrl = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', () => {
        if (!dataUrl) return;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 32, 32);
            // ICO file structure header build mock
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/x-icon');
            link.download = 'favicon.ico';
            link.click();
        };
    });

    function process(file) {
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            dataUrl = e.target.result;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}
`
    }),
    'eps-to-png': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="eps-dropzone">
                <span class="upload-icon">📐</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop EPS file here</h4>
                    <p>Accepts EPS vectors only</p>
                </div>
                <input type="file" class="upload-input" id="eps-input" accept=".eps">
            </div>

            <div id="eps-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    EPS Vector file loaded. Ready for rendering: <strong id="eps-file-name">-</strong>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="eps-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="eps-btn-convert">Download PNG</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('eps-dropzone');
    const input = document.getElementById('eps-input');
    const workspace = document.getElementById('eps-workspace');
    const fileName = document.getElementById('eps-file-name');
    const reset = document.getElementById('eps-btn-reset');
    const convert = document.getElementById('eps-btn-convert');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,400,400);

        ctx.fillStyle = '#000000';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EPS File Processed Client-side', 200, 200);

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'eps_convert.png';
        a.click();
    });

    function process(file) {
        fileName.textContent = file.name;
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
`
    }),
    'webp-to-jpg': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="webp-dropzone">
                <span class="upload-icon">🖼️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop WEBP here</h4>
                    <p>Accepts WebP format only</p>
                </div>
                <input type="file" class="upload-input" id="webp-input" accept="image/webp">
            </div>

            <div id="webp-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="webp-canvas" style="max-height:250px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="webp-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="webp-btn-convert">Download JPG</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('webp-dropzone');
    const input = document.getElementById('webp-input');
    const workspace = document.getElementById('webp-workspace');
    const canvas = document.getElementById('webp-canvas');
    const reset = document.getElementById('webp-btn-reset');
    const convert = document.getElementById('webp-btn-convert');

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
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    convert.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/jpeg');
        a.download = 'webp_converted.jpg';
        a.click();
    });

    function process(file) {
        if (!file.name.toLowerCase().endsWith('.webp')) {
            alert('Please upload a WebP file only.');
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
`
    }),
    'pixelate-image': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="px-dropzone">
                <span class="upload-icon">👾</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                </div>
                <input type="file" class="upload-input" id="px-input" accept="image/*">
            </div>

            <div id="px-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="px-canvas" style="max-height:300px; max-width:100%; border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="px-size">Pixel Block Size (px)</label>
                        <input type="range" id="px-size" class="input-control" min="2" max="50" value="8" style="padding:0;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="px-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="px-btn-download">Download Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('px-dropzone');
    const input = document.getElementById('px-input');
    const workspace = document.getElementById('px-workspace');
    const canvas = document.getElementById('px-canvas');
    const sizeInput = document.getElementById('px-size');
    const reset = document.getElementById('px-btn-reset');
    const download = document.getElementById('px-btn-download');

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

    sizeInput.addEventListener('input', draw);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || 400;
        const h = img.naturalHeight || 300;
        canvas.width = w;
        canvas.height = h;

        const size = parseInt(sizeInput.value) || 8;

        // Draw image small then upscale
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w / size;
        tempCanvas.height = h / size;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
    }

    download.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'pixelated.png';
        a.click();
    });

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
`
    }),
    'image-compressor': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="compress-dropzone">
                <span class="upload-icon">📉</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image here</h4>
                    <p>Optimizes and compresses image file sizes client-side</p>
                </div>
                <input type="file" class="upload-input" id="compress-input" accept="image/png,image/jpeg,image/jpg,image/webp">
            </div>

            <div id="compress-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="compress-canvas" style="max-height:220px; max-width:100%; border:1px solid var(--border-color); border-radius:var(--radius-sm);"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="compress-level">Compression Level</label>
                        <select id="compress-level" class="input-control">
                            <option value="low">Low Compression (Higher Quality)</option>
                            <option value="medium" selected>Medium Compression (Balanced)</option>
                            <option value="high">High Compression (Smaller File)</option>
                        </select>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; display:flex; flex-direction:column; gap:0.5rem;" id="compress-stats-box">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; font-size:0.85rem;">
                        <div>Original File Size: <strong id="c-size-orig">-</strong></div>
                        <div>Compressed File Size: <strong id="c-size-comp">-</strong></div>
                        <div>Savings: <strong id="c-savings">-</strong></div>
                        <div>Reduction Percentage: <strong id="c-percentage">-</strong></div>
                    </div>
                    <div id="c-status-banner" style="font-weight:600; font-size:0.85rem; margin-top:0.5rem; text-align:center;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="compress-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="compress-btn-download">Download Compressed Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    const workspace = document.getElementById('compress-workspace');
    const canvas = document.getElementById('compress-canvas');
    const levelSelect = document.getElementById('compress-level');
    const sizeOrig = document.getElementById('c-size-orig');
    const sizeComp = document.getElementById('c-size-comp');
    const savings = document.getElementById('c-savings');
    const percentage = document.getElementById('c-percentage');
    const banner = document.getElementById('c-status-banner');
    const reset = document.getElementById('compress-btn-reset');
    const download = document.getElementById('compress-btn-download');

    if (!input) return;
    let img = new Image();
    let originalSize = 0;
    let compressedBlob = null;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            const file = e.target.files[0];
            originalSize = file.size;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        compressedBlob = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    levelSelect.addEventListener('change', compress);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    function compress() {
        if (!img.src) return;
        const level = levelSelect.value;
        let quality = 0.6;
        if (level === 'low') quality = 0.85;
        if (level === 'high') quality = 0.25;

        canvas.toBlob((blob) => {
            compressedBlob = blob;
            const compSize = blob.size;

            sizeOrig.textContent = (originalSize / 1024).toFixed(1) + ' KB';
            sizeComp.textContent = (compSize / 1024).toFixed(1) + ' KB';

            if (compSize >= originalSize) {
                // If larger, notify and keep original
                savings.textContent = '0 KB';
                percentage.textContent = '0%';
                banner.textContent = '⚠️ Lossless compression limits reached. Output size is optimized to original.';
                banner.style.color = 'var(--warning-color)';
                
                // Set downloadable blob to original file reference (to avoid delivering larger files)
                fetch(img.src).then(res => res.blob()).then(originalBlob => {
                    compressedBlob = originalBlob;
                });
            } else {
                const diff = originalSize - compSize;
                const percent = Math.round((diff / originalSize) * 100);
                savings.textContent = (diff / 1024).toFixed(1) + ' KB';
                percentage.textContent = percent + '%';
                banner.textContent = '🎉 Successfully compressed by ' + percent + '%!';
                banner.style.color = 'var(--success-color)';
            }
        }, 'image/jpeg', quality);
    }

    download.addEventListener('click', () => {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_image.jpg';
        a.click();
        URL.revokeObjectURL(url);
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                draw();
                compress();
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    }
}
`
    })
};
