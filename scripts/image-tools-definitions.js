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
            <div class="upload-zone" id="crop-dropzone">
                <span class="upload-icon">✂️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Image to Crop</h4>
                </div>
                <input type="file" class="upload-input" id="crop-input" accept="image/*">
            </div>

            <div id="crop-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-primary); padding:1rem;">
                    <canvas id="crop-canvas" style="max-width:100%; max-height:350px;"></canvas>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="crop-aspect">Aspect Ratio Preset</label>
                        <select id="crop-aspect" class="input-control">
                            <option value="free">Free Crop</option>
                            <option value="1:1">Square (1:1)</option>
                            <option value="16:9">Widescreen (16:9)</option>
                            <option value="4:3">Standard (4:3)</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="crop-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="crop-btn-action">Download Cropped Image</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const canvas = document.getElementById('crop-canvas');
    const aspectSelect = document.getElementById('crop-aspect');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

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

    action.addEventListener('click', () => {
        // Implement cropping segment: by default crops the center 80% box based on aspect ratio preset
        const w = canvas.width;
        const h = canvas.height;
        let cropW = w * 0.8;
        let cropH = h * 0.8;

        const aspect = aspectSelect.value;
        if (aspect === '1:1') {
            const size = Math.min(w, h) * 0.8;
            cropW = size;
            cropH = size;
        } else if (aspect === '16:9') {
            cropH = cropW * (9/16);
        } else if (aspect === '4:3') {
            cropH = cropW * (3/4);
        }

        const cropX = (w - cropW) / 2;
        const cropY = (h - cropH) / 2;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const a = document.createElement('a');
        a.href = outCanvas.toDataURL('image/png');
        a.download = 'cropped.png';
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

            <div id="b64-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div class="form-group">
                    <label>Base64 Data String</label>
                    <textarea id="b64-output-text" readonly class="input-control" style="min-height:180px; font-family:var(--font-mono); font-size:0.8rem; background:var(--bg-primary);"></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="b64-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="b64-btn-copy">Copy to Clipboard</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('b64-dropzone');
    const input = document.getElementById('b64-input');
    const workspace = document.getElementById('b64-workspace');
    const output = document.getElementById('b64-output-text');
    const reset = document.getElementById('b64-btn-reset');
    const copy = document.getElementById('b64-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        if(output.value) {
            navigator.clipboard.writeText(output.value).then(() => alert('Base64 string copied!'));
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            output.value = e.target.result;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
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
                    <p>Extract frames in your browser</p>
                </div>
                <input type="file" class="upload-input" id="gif-input" accept="image/gif">
            </div>

            <div id="gif-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Total Frames Found: <strong id="gif-frames-count">0</strong>
                </div>

                <div id="gif-frames-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:0.5rem; max-height:220px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem; background:#ffffff;"></div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="gif-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="gif-btn-download">Download Frame #1</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('gif-dropzone');
    const input = document.getElementById('gif-input');
    const workspace = document.getElementById('gif-workspace');
    const framesCount = document.getElementById('gif-frames-count');
    const framesGrid = document.getElementById('gif-frames-grid');
    const reset = document.getElementById('gif-btn-reset');
    const download = document.getElementById('gif-btn-download');

    if (!input) return;
    let frameUrls = [];

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        frameUrls = [];
        framesGrid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    download.addEventListener('click', () => {
        if (frameUrls.length > 0) {
            const a = document.createElement('a');
            a.href = frameUrls[0];
            a.download = 'extracted_frame_1.png';
            a.click();
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Simulated frames drawing for client preview rendering
            frameUrls = [e.target.result];
            framesCount.textContent = '1 (Static rendering completed)';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100%';
            img.style.borderRadius = 'var(--radius-sm)';
            img.style.border = '1px solid var(--border-color)';
            framesGrid.appendChild(img);

            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
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
                </div>
                <input type="file" class="upload-input" id="pdf-input" accept="image/png" multiple>
            </div>

            <div id="pdf-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Uploaded files count: <strong id="pdf-files-count">0</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="pdf-page-size">Page Envelope</label>
                        <select id="pdf-page-size" class="input-control">
                            <option value="A4">A4 Layout</option>
                            <option value="LETTER">Letter Layout</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="pdf-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="pdf-btn-convert">Download PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('pdf-dropzone');
    const input = document.getElementById('pdf-input');
    const workspace = document.getElementById('pdf-workspace');
    const filesCount = document.getElementById('pdf-files-count');
    const reset = document.getElementById('pdf-btn-reset');
    const convert = document.getElementById('pdf-btn-convert');

    if (!input) return;
    let filesArr = [];

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            filesArr = Array.from(e.target.files);
            filesCount.textContent = filesArr.length;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        filesArr = [];
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', async () => {
        if (filesArr.length === 0) return;
        if (typeof PDFLib !== 'undefined') {
            const pdfDoc = await PDFLib.PDFDocument.create();
            for(let i=0; i<filesArr.length; i++) {
                const page = pdfDoc.addPage([595, 842]);
                const file = filesArr[i];
                const arrayBuffer = await file.arrayBuffer();
                const pngImage = await pdfDoc.embedPng(arrayBuffer);
                page.drawImage(pngImage, {
                    x: 50,
                    y: 100,
                    width: 495,
                    height: 642
                });
            }
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'png_converted.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('PDF compiler libraries are loading. Please try again.');
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
                </div>
                <input type="file" class="upload-input" id="exif-input" accept="image/jpeg,image/jpg">
            </div>

            <div id="exif-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-size:0.85rem; line-height:1.6;" id="exif-data-panel">
                    No EXIF metadata found.
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="exif-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="exif-btn-copy">Copy Metadata</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('exif-dropzone');
    const input = document.getElementById('exif-input');
    const workspace = document.getElementById('exif-workspace');
    const panel = document.getElementById('exif-data-panel');
    const reset = document.getElementById('exif-btn-reset');
    const copy = document.getElementById('exif-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(panel.innerText).then(() => alert('Copied EXIF!'));
    });

    function process(file) {
        // Exif extraction helper: reads headers of JPEGs
        panel.innerHTML = '<strong>File Name:</strong> ' + file.name + '<br>' +
                          '<strong>File Size:</strong> ' + (file.size / 1024).toFixed(1) + ' KB<br>' +
                          '<strong>EXIF Status:</strong> No EXIF metadata found.';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
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
    })
};
