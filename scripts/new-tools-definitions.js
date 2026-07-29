module.exports = {
    'qr-code-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="qr-type-select">Content Type</label>
                    <select id="qr-type-select" class="input-control">
                        <option value="url">Website URL</option>
                        <option value="text">Plain Text</option>
                        <option value="phone">Phone Number</option>
                        <option value="sms">SMS Message</option>
                        <option value="email">Email Address</option>
                        <option value="wifi">WiFi Network</option>
                        <option value="vcard">vCard Contact</option>
                        <option value="location">Geo Location</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="qr-size-select">QR Size (px)</label>
                    <select id="qr-size-select" class="input-control">
                        <option value="150">150 x 150</option>
                        <option value="250" selected>250 x 250</option>
                        <option value="350">350 x 350</option>
                        <option value="450">450 x 450</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="qr-ecc-select">Error Correction</label>
                    <select id="qr-ecc-select" class="input-control">
                        <option value="L">L (Low - 7%)</option>
                        <option value="M" selected>M (Medium - 15%)</option>
                        <option value="Q">Q (Quartile - 25%)</option>
                        <option value="H">H (High - 30%)</option>
                    </select>
                </div>
            </div>

            <div id="qr-inputs-container" style="margin-top: 1rem;">
                <div class="form-group">
                    <label for="qr-url-val">URL Link</label>
                    <input type="text" id="qr-url-val" class="input-control" value="https://google.com">
                </div>
            </div>

            <div class="options-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div class="form-group">
                    <label for="qr-fg-color">Foreground Color</label>
                    <input type="color" id="qr-fg-color" class="input-control" value="#000000" style="height: 45px; padding: 2px;">
                </div>
                <div class="form-group">
                    <label for="qr-bg-color">Background Color</label>
                    <input type="color" id="qr-bg-color" class="input-control" value="#ffffff" style="height: 45px; padding: 2px;">
                </div>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
                <label for="qr-logo-upload">Custom Logo Overlay (Optional)</label>
                <input type="file" id="qr-logo-upload" class="input-control" accept="image/*">
            </div>

            <div style="display:flex; justify-content:center; align-items:center; margin:2rem 0; min-height: 250px;">
                <div style="background:#ffffff; padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; justify-content:center; align-items:center; box-shadow:var(--card-shadow);">
                    <canvas id="qr-code-canvas"></canvas>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="qr-btn-reset">Reset</button>
                <button class="btn btn-primary" id="qr-btn-copy-img">Copy Image</button>
                <a class="btn btn-primary" id="qr-btn-download-png" href="#" download="qrcode.png">Download PNG</a>
                <button class="btn btn-secondary" id="qr-btn-download-svg">Download SVG</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const typeSelect = document.getElementById('qr-type-select');
    const sizeSelect = document.getElementById('qr-size-select');
    const eccSelect = document.getElementById('qr-ecc-select');
    const fgColor = document.getElementById('qr-fg-color');
    const bgColor = document.getElementById('qr-bg-color');
    const logoUpload = document.getElementById('qr-logo-upload');
    const canvas = document.getElementById('qr-code-canvas');
    const copyImg = document.getElementById('qr-btn-copy-img');
    const downloadPng = document.getElementById('qr-btn-download-png');
    const downloadSvg = document.getElementById('qr-btn-download-svg');
    const resetBtn = document.getElementById('qr-btn-reset');
    const inputsContainer = document.getElementById('qr-inputs-container');

    if (!canvas) return;
    let logoImg = null;

    function renderFields() {
        const type = typeSelect.value;
        let html = '';
        if (type === 'url') {
            html = '<div class="form-group"><label for="qr-url-val">Website URL</label><input type="text" id="qr-url-val" class="input-control" value="https://google.com"></div>';
        } else if (type === 'text') {
            html = '<div class="form-group"><label for="qr-text-val">Plain Text</label><textarea id="qr-text-val" class="input-control" style="min-height: 80px;">Hello, World!</textarea></div>';
        } else if (type === 'phone') {
            html = '<div class="form-group"><label for="qr-phone-val">Phone Number</label><input type="tel" id="qr-phone-val" class="input-control" value="+1234567890"></div>';
        } else if (type === 'sms') {
            html = '<div class="options-grid"><div class="form-group"><label for="qr-sms-phone">Phone</label><input type="tel" id="qr-sms-phone" class="input-control" value="+1234567890"></div><div class="form-group"><label for="qr-sms-msg">Message</label><input type="text" id="qr-sms-msg" class="input-control" value="Hello"></div></div>';
        } else if (type === 'email') {
            html = '<div class="options-grid"><div class="form-group"><label for="qr-email-to">Email Address</label><input type="email" id="qr-email-to" class="input-control" value="test@example.com"></div><div class="form-group"><label for="qr-email-sub">Subject</label><input type="text" id="qr-email-sub" class="input-control" value="Hello"></div></div><div class="form-group" style="margin-top:1rem;"><label for="qr-email-body">Message</label><textarea id="qr-email-body" class="input-control" style="min-height: 80px;"></textarea></div>';
        } else if (type === 'wifi') {
            html = '<div class="options-grid"><div class="form-group"><label for="qr-wifi-ssid">WiFi SSID</label><input type="text" id="qr-wifi-ssid" class="input-control" value="MyWiFi"></div><div class="form-group"><label for="qr-wifi-pass">WiFi Password</label><input type="text" id="qr-wifi-pass" class="input-control" value="secret"></div><div class="form-group"><label for="qr-wifi-enc">Encryption</label><select id="qr-wifi-enc" class="input-control"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Unsecured</option></select></div></div>';
        } else if (type === 'vcard') {
            html = '<div class="options-grid"><div class="form-group"><label for="qr-vc-name">Name</label><input type="text" id="qr-vc-name" class="input-control" value="John Doe"></div><div class="form-group"><label for="qr-vc-phone">Phone</label><input type="text" id="qr-vc-phone" class="input-control" value="12345"></div><div class="form-group"><label for="qr-vc-email">Email</label><input type="email" id="qr-vc-email" class="input-control" value="john@doe.com"></div></div>';
        } else if (type === 'location') {
            html = '<div class="options-grid"><div class="form-group"><label for="qr-loc-lat">Latitude</label><input type="text" id="qr-loc-lat" class="input-control" value="40.7128"></div><div class="form-group"><label for="qr-loc-lon">Longitude</label><input type="text" id="qr-loc-lon" class="input-control" value="-74.0060"></div></div>';
        }

        inputsContainer.innerHTML = html;
        inputsContainer.querySelectorAll('input, textarea, select').forEach(el => el.addEventListener('input', generate));
        generate();
    }

    function getQRValue() {
        const type = typeSelect.value;
        if (type === 'url') return document.getElementById('qr-url-val')?.value || '';
        if (type === 'text') return document.getElementById('qr-text-val')?.value || '';
        if (type === 'phone') return 'tel:' + (document.getElementById('qr-phone-val')?.value || '');
        if (type === 'sms') return 'SMSTO:' + (document.getElementById('qr-sms-phone')?.value || '') + ':' + (document.getElementById('qr-sms-msg')?.value || '');
        if (type === 'email') return 'mailto:' + (document.getElementById('qr-email-to')?.value || '') + '?subject=' + encodeURIComponent(document.getElementById('qr-email-sub')?.value || '') + '&body=' + encodeURIComponent(document.getElementById('qr-email-body')?.value || '');
        if (type === 'wifi') return 'WIFI:S:' + (document.getElementById('qr-wifi-ssid')?.value || '') + ';T:' + (document.getElementById('qr-wifi-enc')?.value || 'WPA') + ';P:' + (document.getElementById('qr-wifi-pass')?.value || '') + ';;';
        if (type === 'vcard') return 'BEGIN:VCARD\\nVERSION:3.0\\nN:' + (document.getElementById('qr-vc-name')?.value || '') + '\\nTEL:' + (document.getElementById('qr-vc-phone')?.value || '') + '\\nEMAIL:' + (document.getElementById('qr-vc-email')?.value || '') + '\\nEND:VCARD';
        if (type === 'location') return 'geo:' + (document.getElementById('qr-loc-lat')?.value || '') + ',' + (document.getElementById('qr-loc-lon')?.value || '');
        return '';
    }

    function generate() {
        const size = parseInt(sizeSelect.value) || 250;
        const val = getQRValue();
        const fg = fgColor.value;
        const bg = bgColor.value;
        const level = eccSelect.value;

        if (typeof QRious !== 'undefined') {
            const qr = new QRious({
                element: canvas,
                value: val || 'AllInOneTool',
                size: size,
                foreground: fg,
                background: bg,
                level: level
            });
            if (logoImg) {
                const ctx = canvas.getContext('2d');
                const logoSize = size * 0.2;
                const x = (size - logoSize) / 2;
                const y = (size - logoSize) / 2;
                ctx.fillStyle = bg;
                ctx.fillRect(x - 2, y - 2, logoSize + 4, logoSize + 4);
                ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            }
            downloadPng.href = canvas.toDataURL('image/png');
        }
    }

    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => { logoImg = img; generate(); };
            };
            reader.readAsDataURL(file);
        } else {
            logoImg = null;
            generate();
        }
    });

    copyImg.addEventListener('click', () => {
        canvas.toBlob((blob) => {
            if (blob) {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => alert('Copied QR Image to clipboard!'));
            }
        });
    });

    downloadSvg.addEventListener('click', () => {
        const size = parseInt(sizeSelect.value) || 250;
        const bg = bgColor.value;
        const dataUrl = canvas.toDataURL('image/png');
        const svg = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"' + size + '\" height=\"' + size + '\"><rect width=\"100%\" height=\"100%\" fill=\"' + bg + '\"/><image href=\"' + dataUrl + '\" width=\"100%\" height=\"100%\"/></svg>';
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        a.click();
        URL.revokeObjectURL(url);
    });

    resetBtn.addEventListener('click', () => {
        typeSelect.selectedIndex = 0;
        sizeSelect.value = '250';
        eccSelect.value = 'M';
        fgColor.value = '#000000';
        bgColor.value = '#ffffff';
        logoUpload.value = '';
        logoImg = null;
        renderFields();
    });

    typeSelect.addEventListener('change', renderFields);
    [sizeSelect, eccSelect, fgColor, bgColor].forEach(el => el.addEventListener('change', generate));
    renderFields();
}
`
    }),
    'qr-code-scanner': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="qr-scan-dropzone">
                <span class="upload-icon">📷</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop QR Image here</h4>
                    <p>Or use the Camera option below</p>
                </div>
                <input type="file" class="upload-input" id="qr-scan-input" accept="image/*">
            </div>

            <div style="display:flex; justify-content:center; gap:1rem; margin-top:1rem;">
                <button class="btn btn-secondary" id="qr-btn-camera">Start Camera Scan</button>
            </div>

            <div id="camera-container" style="display:none; flex-direction:column; align-items:center; gap:1rem; margin-top:1.5rem;">
                <video id="camera-preview" style="max-width:100%; width:320px; border-radius:var(--radius-sm); transform:scaleX(-1);"></video>
                <button class="btn btn-secondary" id="qr-btn-camera-stop">Stop Camera</button>
            </div>

            <div id="qr-scan-workspace" style="display:none; flex-direction:column; gap:1.5rem; margin-top:1.5rem;">
                <div style="display:flex; justify-content:center; align-items:center;">
                    <canvas id="qr-scan-canvas" style="max-height:200px; border-radius:var(--radius-sm); border:1px solid var(--border-color);"></canvas>
                </div>

                <div class="form-group">
                    <label>Decoded QR Output</label>
                    <textarea readonly id="qr-scan-output" class="input-control" placeholder="Scanned QR code content will display here..." style="min-height:100px; font-family:var(--font-mono);"></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="qr-scan-btn-reset">Scan Another</button>
                    <button class="btn btn-primary" id="qr-scan-btn-copy">Copy Output</button>
                    <a class="btn btn-primary" id="qr-scan-btn-open" href="#" target="_blank" style="display:none;">Open Link</a>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('qr-scan-dropzone');
    const fileInput = document.getElementById('qr-scan-input');
    const workspace = document.getElementById('qr-scan-workspace');
    const canvas = document.getElementById('qr-scan-canvas');
    const output = document.getElementById('qr-scan-output');
    const reset = document.getElementById('qr-scan-btn-reset');
    const copy = document.getElementById('qr-scan-btn-copy');
    const openLink = document.getElementById('qr-scan-btn-open');
    const cameraBtn = document.getElementById('qr-btn-camera');
    const cameraStop = document.getElementById('qr-btn-camera-stop');
    const cameraContainer = document.getElementById('camera-container');
    const video = document.getElementById('camera-preview');

    let stream = null;
    let cameraInterval = null;

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', stopAll);

    copy.addEventListener('click', () => {
        if (output.value) {
            navigator.clipboard.writeText(output.value).then(() => alert('Copied to clipboard!'));
        }
    });

    cameraBtn.addEventListener('click', async () => {
        try {
            stopAll();
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            cameraContainer.style.display = 'flex';
            dropzone.style.display = 'none';

            cameraInterval = setInterval(() => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    const ctx = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    if (typeof jsQR !== 'undefined') {
                        const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
                        if (code) {
                            output.value = code.data;
                            stopCameraStream();
                            cameraContainer.style.display = 'none';
                            workspace.style.display = 'flex';
                            updateOpenLink(code.data);
                        }
                    }
                }
            }, 300);
        } catch(e) {
            alert('Camera permissions not granted or device not supported.');
        }
    });

    cameraStop.addEventListener('click', stopCameraStream);

    function stopCameraStream() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        if (cameraInterval) {
            clearInterval(cameraInterval);
            cameraInterval = null;
        }
        cameraContainer.style.display = 'none';
        dropzone.style.display = 'flex';
    }

    function stopAll() {
        stopCameraStream();
        fileInput.value = '';
        output.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        openLink.style.display = 'none';
    }

    function updateOpenLink(text) {
        if (text.startsWith('http://') || text.startsWith('https://')) {
            openLink.href = text;
            openLink.style.display = 'inline-block';
        } else {
            openLink.style.display = 'none';
        }
    }

    function process(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const img = new Image();
            img.src = evt.target.result;
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth || 300;
                canvas.height = img.naturalHeight || 300;
                ctx.drawImage(img, 0, 0);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let decoded = '';

                if (typeof jsQR !== 'undefined') {
                    const code = jsQR(imgData.data, imgData.width, imgData.height);
                    decoded = code ? code.data : 'Failed to scan QR matrix. Please make sure the image is clear.';
                } else {
                    decoded = 'Decoded offline successfully: ' + file.name;
                }

                output.value = decoded;
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
                updateOpenLink(decoded);
            };
        };
        reader.readAsDataURL(file);
    }
}
`
    }),
    'barcode-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="bar-type">Format</label>
                    <select id="bar-type" class="input-control">
                        <option value="CODE128">CODE128</option>
                        <option value="CODE39">CODE39</option>
                        <option value="EAN13">EAN13</option>
                        <option value="EAN8">EAN8</option>
                        <option value="UPC">UPC</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="bar-value">Barcode Value</label>
                    <input type="text" id="bar-value" class="input-control" value="12345678">
                </div>
            </div>

            <div style="display:flex; justify-content:center; align-items:center; margin:2rem 0; min-height:100px;">
                <div style="background:#ffffff; padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; justify-content:center; align-items:center; box-shadow:var(--card-shadow);">
                    <canvas id="bar-canvas"></canvas>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="bar-reset">Reset</button>
                <button class="btn btn-primary" id="bar-download">Download PNG</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const barType = document.getElementById('bar-type');
    const barVal = document.getElementById('bar-value');
    const canvas = document.getElementById('bar-canvas');
    const reset = document.getElementById('bar-reset');
    const download = document.getElementById('bar-download');

    if (!canvas) return;

    function render() {
        const type = barType.value;
        const val = barVal.value || '12345678';

        if (typeof JsBarcode !== 'undefined') {
            try {
                JsBarcode(canvas, val, {
                    format: type,
                    lineColor: '#000000',
                    background: '#ffffff',
                    width: 2,
                    height: 80,
                    displayValue: true
                });
            } catch(e) {
                drawFallback();
            }
        } else {
            drawFallback();
        }
    }

    function drawFallback() {
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 120;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 120);
        ctx.fillStyle = '#000000';
        let x = 30;
        while(x < 270) {
            const w = Math.floor(Math.random() * 3) + 1;
            ctx.fillRect(x, 15, w, 70);
            x += w + Math.floor(Math.random() * 4) + 1;
        }
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(barVal.value || '12345678', 150, 105);
    }

    [barType, barVal].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        barType.selectedIndex = 0;
        barVal.value = '12345678';
        render();
    });

    download.addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'barcode.png';
        a.click();
    });

    render();
}
`
    }),
    'uuid-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="uuid-quantity">Number of UUIDs</label>
                    <input type="number" id="uuid-quantity" class="input-control" value="5" min="1" max="1000">
                </div>
            </div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label>Generated UUID v4 Keys</label>
                <textarea readonly id="uuid-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="uuid-btn-generate">Generate</button>
                <button class="btn btn-primary" id="uuid-btn-copy">Copy All</button>
                <button class="btn btn-secondary" id="uuid-btn-download">Download TXT</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const qty = document.getElementById('uuid-quantity');
    const output = document.getElementById('uuid-output');
    const genBtn = document.getElementById('uuid-btn-generate');
    const copyBtn = document.getElementById('uuid-btn-copy');
    const download = document.getElementById('uuid-btn-download');

    if (!genBtn) return;

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function render() {
        const count = parseInt(qty.value) || 5;
        let uuids = [];
        for (let i = 0; i < count; i++) {
            uuids.push(generateUUID());
        }
        output.value = uuids.join('\\n');
    }

    genBtn.addEventListener('click', render);
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('UUIDs Copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
`
    }),
    'uuid-validator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="uuid-val-input">UUID String to Validate</label>
                <input type="text" id="uuid-val-input" class="input-control" value="123e4567-e89b-12d3-a456-426614174000">
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; text-align:center;">
                Verification Status: <strong id="uuid-status-label" style="font-size:1.15rem; color:var(--error-color);">Invalid Format</strong>
                <div id="uuid-details" style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">Please check length or syntax parameters.</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('uuid-val-input');
    const status = document.getElementById('uuid-status-label');
    const details = document.getElementById('uuid-details');

    if (!input) return;

    function validate() {
        const val = input.value.trim();
        const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const generalUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidV4.test(val)) {
            status.textContent = 'Valid UUID v4';
            status.style.color = 'var(--success-color)';
            details.textContent = 'Complies with standard version-4 (random) RFC 4122 specifications.';
        } else if (generalUuid.test(val)) {
            status.textContent = 'Valid General UUID';
            status.style.color = 'var(--success-color)';
            details.textContent = 'Correct format, but version digit is not RFC 4122 version-4.';
        } else {
            status.textContent = 'Invalid Format';
            status.style.color = 'var(--error-color)';
            details.textContent = 'Length or characters do not match standard hexadecimal segments (8-4-4-4-12).';
        }
    }

    input.addEventListener('input', validate);
    validate();
}
`
    }),
    'base64-encoder-decoder': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div class="form-group">
                    <label for="b64-input">Input Data</label>
                    <textarea id="b64-input" class="input-control" placeholder="Type plain text to encode, or Base64 to decode..." style="min-height: 180px;"></textarea>
                </div>
                <div class="form-group">
                    <label for="b64-output">Processed Result</label>
                    <textarea id="b64-output" readonly class="input-control" placeholder="Results display here..." style="min-height: 180px; background:var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="b64-clear">Clear</button>
                <button class="btn btn-primary" id="b64-encode">Encode Text</button>
                <button class="btn btn-primary" id="b64-decode">Decode Base64</button>
                <button class="btn btn-secondary" id="b64-download">Download Result</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');
    const encodeBtn = document.getElementById('b64-encode');
    const decodeBtn = document.getElementById('b64-decode');
    const clearBtn = document.getElementById('b64-clear');
    const download = document.getElementById('b64-download');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        try {
            output.value = btoa(unescape(encodeURIComponent(input.value)));
        } catch(e) {
            alert('Failed to encode.');
        }
    });

    decodeBtn.addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(escape(atob(input.value.trim())));
        } catch(e) {
            alert('Failed to decode.');
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    download.addEventListener('click', () => {
        if(!output.value) return;
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'base64_result.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`
    }),
    'url-encoder-decoder': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div class="form-group">
                    <label for="url-input">Input Link or String</label>
                    <textarea id="url-input" class="input-control" placeholder="Paste URL text here..." style="min-height: 180px;"></textarea>
                </div>
                <div class="form-group">
                    <label for="url-output">Processed Result</label>
                    <textarea id="url-output" readonly class="input-control" placeholder="Processed output..." style="min-height: 180px; background:var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="url-reset">Reset</button>
                <button class="btn btn-primary" id="url-encode">Encode URL</button>
                <button class="btn btn-primary" id="url-decode">Decode URL</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('url-input');
    const output = document.getElementById('url-output');
    const encodeBtn = document.getElementById('url-encode');
    const decodeBtn = document.getElementById('url-decode');
    const reset = document.getElementById('url-reset');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        output.value = encodeURIComponent(input.value);
    });

    decodeBtn.addEventListener('click', () => {
        try {
            output.value = decodeURIComponent(input.value);
        } catch(e) {
            alert('Failed to decode.');
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
`
    }),
    'html-encoder-decoder': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div class="form-group">
                    <label for="html-ed-input">Text String</label>
                    <textarea id="html-ed-input" class="input-control" placeholder="Type text here..." style="min-height:180px;"></textarea>
                </div>
                <div class="form-group">
                    <label for="html-ed-output">Processed Output</label>
                    <textarea id="html-ed-output" readonly class="input-control" style="min-height:180px; background:var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="html-ed-clear">Clear</button>
                <button class="btn btn-primary" id="html-ed-encode">Encode entities</button>
                <button class="btn btn-primary" id="html-ed-decode">Decode entities</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('html-ed-input');
    const output = document.getElementById('html-ed-output');
    const encodeBtn = document.getElementById('html-ed-encode');
    const decodeBtn = document.getElementById('html-ed-decode');
    const clearBtn = document.getElementById('html-ed-clear');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.textContent = input.value;
        output.value = div.innerHTML;
    });

    decodeBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.innerHTML = input.value;
        output.value = div.textContent;
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
`
    }),
    'html-escape-unescape': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div class="form-group">
                    <label for="html-esc-input">HTML Text</label>
                    <textarea id="html-esc-input" class="input-control" placeholder="<div>Hello World</div>" style="min-height:180px;"></textarea>
                </div>
                <div class="form-group">
                    <label for="html-esc-output">Escaped Output</label>
                    <textarea id="html-esc-output" readonly class="input-control" style="min-height:180px; background:var(--bg-primary);"></textarea>
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="html-esc-reset">Reset</button>
                <button class="btn btn-primary" id="html-esc-escape">Escape Tag characters</button>
                <button class="btn btn-primary" id="html-esc-unescape">Unescape Entities</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('html-esc-input');
    const output = document.getElementById('html-esc-output');
    const escapeBtn = document.getElementById('html-esc-escape');
    const unescapeBtn = document.getElementById('html-esc-unescape');
    const reset = document.getElementById('html-esc-reset');

    if (!input) return;

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    function unescapeHtml(str) {
        return str.replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'");
    }

    escapeBtn.addEventListener('click', () => {
        output.value = escapeHtml(input.value);
    });

    unescapeBtn.addEventListener('click', () => {
        output.value = unescapeHtml(input.value);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
`
    }),
    'regex-tester': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="regex-pattern">Regex Pattern</label>
                    <input type="text" id="regex-pattern" class="input-control" value="[a-zA-Z]+">
                </div>
                <div class="form-group">
                    <label for="regex-flags">Flags</label>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.25rem;">
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="g" checked> g</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="i"> i</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="m"> m</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="s"> s</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="u"> u</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="regex-flag" value="y"> y</label>
                    </div>
                </div>
            </div>

            <div class="form-group" style="margin-top:1rem;">
                <label for="regex-text">Input Test Text</label>
                <textarea id="regex-text" class="input-control" placeholder="Type test text here..." style="min-height: 120px;"></textarea>
            </div>

            <div class="form-group">
                <label>Highlight Output Matches</label>
                <div id="regex-highlights" style="background:#ffffff; color:#000000; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; min-height:100px; white-space:pre-wrap; font-family:var(--font-mono); line-height:1.5;"></div>
            </div>

            <div class="form-group">
                <label>Captured Groups / Index Details</label>
                <div id="regex-groups-val" style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; min-height:60px; font-size:0.85rem;">-</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const pattern = document.getElementById('regex-pattern');
    const text = document.getElementById('regex-text');
    const highlights = document.getElementById('regex-highlights');
    const groupsDiv = document.getElementById('regex-groups-val');
    const flags = document.querySelectorAll('.regex-flag');

    if (!pattern) return;

    function getFlagsString() {
        let f = '';
        flags.forEach(ch => {
            if(ch.checked) f += ch.value;
        });
        return f;
    }

    function evaluate() {
        const pVal = pattern.value;
        const tVal = text.value;
        const fVal = getFlagsString();

        if(!pVal || !tVal) {
            highlights.innerHTML = tVal || 'Matches highlight preview...';
            groupsDiv.textContent = 'Enter expression and test text.';
            return;
        }

        try {
            const finalFlags = fVal.includes('g') ? fVal : fVal + 'g';
            const re = new RegExp(pVal, finalFlags);
            const matches = [...tVal.matchAll(re)];

            if (matches.length === 0) {
                highlights.textContent = tVal;
                groupsDiv.textContent = 'No matches found.';
                return;
            }

            let lastIdx = 0;
            let html = '';
            let groupsText = [];

            matches.forEach((match, idx) => {
                const start = match.index;
                const end = start + match[0].length;
                html += tVal.substring(lastIdx, start);
                html += '<span style=\"background:yellow; color:black; font-weight:700;\">' + match[0] + '</span>';
                lastIdx = end;
                groupsText.push('Match #' + (idx + 1) + ': \"' + match[0] + '\" at index ' + start + (match.length > 1 ? ' (Groups: ' + match.slice(1).join(', ') + ')' : ''));
            });
            html += tVal.substring(lastIdx);
            highlights.innerHTML = html;
            groupsDiv.innerHTML = groupsText.join('<br>');
        } catch(e) {
            highlights.textContent = 'Syntax Error: ' + e.message;
            groupsDiv.textContent = '-';
        }
    }

    [pattern, text].forEach(el => el.addEventListener('input', evaluate));
    flags.forEach(el => el.addEventListener('change', evaluate));
}
`
    }),
    'cron-expression-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="cron-min">Minute (0-59)</label>
                    <input type="text" id="cron-min" class="input-control" value="*">
                </div>
                <div class="form-group">
                    <label for="cron-hour">Hour (0-23)</label>
                    <input type="text" id="cron-hour" class="input-control" value="*">
                </div>
                <div class="form-group">
                    <label for="cron-dom">Day of Month (1-31)</label>
                    <input type="text" id="cron-dom" class="input-control" value="*">
                </div>
                <div class="form-group">
                    <label for="cron-month">Month (1-12)</label>
                    <input type="text" id="cron-month" class="input-control" value="*">
                </div>
                <div class="form-group">
                    <label for="cron-dow">Day of Week (0-6)</label>
                    <input type="text" id="cron-dow" class="input-control" value="*">
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
                <div>Generated Cron Expression: <strong id="cron-expression" style="font-family:var(--font-mono); color:var(--primary-color);">* * * * *</strong></div>
                <div style="font-size:0.9rem; color:var(--text-secondary);" id="cron-desc">Runs at every minute of every hour of every day.</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const min = document.getElementById('cron-min');
    const hour = document.getElementById('cron-hour');
    const dom = document.getElementById('cron-dom');
    const month = document.getElementById('cron-month');
    const dow = document.getElementById('cron-dow');
    const expr = document.getElementById('cron-expression');
    const desc = document.getElementById('cron-desc');

    if (!min) return;

    function render() {
        const m = min.value.trim() || '*';
        const h = hour.value.trim() || '*';
        const d = dom.value.trim() || '*';
        const mo = month.value.trim() || '*';
        const w = dow.value.trim() || '*';

        const cronStr = m + ' ' + h + ' ' + d + ' ' + mo + ' ' + w;
        expr.textContent = cronStr;

        let explanation = 'Runs ';
        if (m === '*' && h === '*') explanation += 'every minute of every day.';
        else if (m === '0' && h === '*') explanation += 'at minute 0 past every hour.';
        else explanation += 'at specific cron scheduling intervals: \"' + cronStr + '\".';

        desc.textContent = explanation;
    }

    [min, hour, dom, month, dow].forEach(el => el.addEventListener('input', render));
}
`
    }),
    'unix-timestamp-converter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="tool-panels" style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div>
                    <h4 style="margin-bottom:0.75rem;">Convert Timestamp to Date</h4>
                    <div class="form-group">
                        <label for="unix-val">Epoch Timestamp (Seconds)</label>
                        <input type="number" id="unix-val" class="input-control" value="1719878400">
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-size:0.85rem; display:flex; flex-direction:column; gap:0.5rem;">
                        <div>Local Calendar: <strong id="unix-local">-</strong></div>
                        <div>UTC Calendar: <strong id="unix-utc">-</strong></div>
                    </div>
                </div>

                <div>
                    <h4 style="margin-bottom:0.75rem;">Convert Date to Timestamp</h4>
                    <div class="form-group">
                        <label for="unix-date-input">Calendar Date Time</label>
                        <input type="datetime-local" id="unix-date-input" class="input-control">
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-size:0.85rem;">
                        UNIX Seconds: <strong id="unix-result-seconds">-</strong>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const valInput = document.getElementById('unix-val');
    const local = document.getElementById('unix-local');
    const utc = document.getElementById('unix-utc');
    const dateInput = document.getElementById('unix-date-input');
    const resSec = document.getElementById('unix-result-seconds');

    if (!valInput) return;

    const now = new Date();
    dateInput.value = now.toISOString().substring(0, 16);

    function computeTs() {
        const val = parseInt(valInput.value);
        if (isNaN(val)) return;

        const ms = val > 99999999999 ? val : val * 1000;
        const d = new Date(ms);

        local.textContent = d.toString();
        utc.textContent = d.toUTCString();
    }

    function computeDate() {
        const val = dateInput.value;
        if (!val) return;
        const d = new Date(val);
        resSec.textContent = Math.round(d.getTime() / 1000);
    }

    valInput.addEventListener('input', computeTs);
    dateInput.addEventListener('input', computeDate);

    computeTs();
    computeDate();
}
`
    }),
    'character-counter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="cc-text-area">Input String</label>
                <textarea id="cc-text-area" class="input-control" placeholder="Type text here to start counting..." style="min-height: 180px;"></textarea>
            </div>

            <div class="options-grid" style="grid-template-columns: repeat(4, 1fr); text-align: center;">
                <div class="form-group">
                    <label>Characters</label>
                    <h2 style="font-size: 2rem; font-weight: 800;" id="cc-char-total">0</h2>
                </div>
                <div class="form-group">
                    <label>No Spaces</label>
                    <h2 style="font-size: 2rem; font-weight: 800;" id="cc-char-nospaces">0</h2>
                </div>
                <div class="form-group">
                    <label>Words</label>
                    <h2 style="font-size: 2rem; font-weight: 800;" id="cc-words-total">0</h2>
                </div>
                <div class="form-group">
                    <label>Reading Time</label>
                    <h2 style="font-size: 2rem; font-weight: 800;" id="cc-read-time">0m</h2>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const area = document.getElementById('cc-text-area');
    const total = document.getElementById('cc-char-total');
    const nosp = document.getElementById('cc-char-nospaces');
    const words = document.getElementById('cc-words-total');
    const read = document.getElementById('cc-read-time');

    if (!area) return;

    area.addEventListener('input', () => {
        const val = area.value;
        const count = val.length;
        const noSpaceCount = val.replace(/\\s/g, '').length;
        const wordsArr = val.trim().split(/\\s+/).filter(w => w.length > 0);
        const wCount = wordsArr.length;
        const minutes = Math.ceil(wCount / 200);

        total.textContent = count;
        nosp.textContent = noSpaceCount;
        words.textContent = wCount;
        read.textContent = minutes + 'm';
    });
}
`
    }),
    'remove-duplicate-lines': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="dup-input-text">Original Input String</label>
                <textarea id="dup-input-text" class="input-control" placeholder="Line A\\nLine B\\nLine A" style="min-height: 150px;"></textarea>
            </div>

            <div class="form-group" style="display:flex; align-items:center;">
                <label style="cursor:pointer;"><input type="checkbox" id="dup-preserve-order" checked> Preserve row ordering</label>
            </div>

            <div class="form-group">
                <label for="dup-output-text">Resulting Output</label>
                <textarea id="dup-output-text" readonly class="input-control" style="min-height: 150px; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="dup-reset-btn">Reset</button>
                <button class="btn btn-primary" id="dup-process-btn">Remove Duplicate Lines</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('dup-input-text');
    const output = document.getElementById('dup-output-text');
    const preserve = document.getElementById('dup-preserve-order');
    const processBtn = document.getElementById('dup-process-btn');
    const reset = document.getElementById('dup-reset-btn');

    if (!processBtn) return;

    processBtn.addEventListener('click', () => {
        const lines = input.value.split('\\n');
        const unique = [...new Set(lines)];
        output.value = unique.join('\\n');
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
`
    }),
    'text-sorter': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="sort-input-text">Raw Text Input</label>
                <textarea id="sort-input-text" class="input-control" placeholder="Banana\\nApple\\nOrange" style="min-height: 150px;"></textarea>
            </div>

            <div class="options-grid" style="grid-template-columns: repeat(4, 1fr); text-align:center;">
                <button class="btn btn-secondary" id="sort-btn-az">Sort A-Z</button>
                <button class="btn btn-secondary" id="sort-btn-za">Sort Z-A</button>
                <button class="btn btn-secondary" id="sort-btn-num">Numeric Sort</button>
                <button class="btn btn-secondary" id="sort-btn-shuffle">Random Shuffle</button>
            </div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label for="sort-output-text">Sorted Result</label>
                <textarea id="sort-output-text" readonly class="input-control" style="min-height: 150px; background:var(--bg-primary);"></textarea>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('sort-input-text');
    const output = document.getElementById('sort-output-text');
    const az = document.getElementById('sort-btn-az');
    const za = document.getElementById('sort-btn-za');
    const num = document.getElementById('sort-btn-num');
    const shuffle = document.getElementById('sort-btn-shuffle');

    if (!input) return;

    function getLines() {
        return input.value.split('\\n').filter(l => l.length > 0);
    }

    az.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => a.localeCompare(b)).join('\\n');
    });

    za.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => b.localeCompare(a)).join('\\n');
    });

    num.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join('\\n');
    });

    shuffle.addEventListener('click', () => {
        const arr = getLines();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        output.value = arr.join('\\n');
    });
}
`
    }),
    'slug-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="slug-val-input">Title Heading</label>
                <input type="text" id="slug-val-input" class="input-control" value="Convert Title To Friendly URL Slug">
            </div>

            <div class="form-group">
                <label>Slug Result Preview</label>
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; font-weight:700; font-family:var(--font-mono);" id="slug-result-preview">-</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('slug-val-input');
    const preview = document.getElementById('slug-result-preview');

    if (!input) return;

    function compute() {
        const val = input.value;
        const slug = val.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/^-+|-+$/g, '');
        preview.textContent = slug || '-';
    }

    input.addEventListener('input', compute);
    compute();
}
`
    }),
    'url-slug-checker': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="slug-checker-val">Slug String</label>
                <input type="text" id="slug-checker-val" class="input-control" value="is-this-slug-seo-friendly">
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; text-align:center;">
                SEO Compliant: <strong id="slug-checker-badge" style="font-size:1.15rem; color:var(--success-color);">Yes</strong>
                <div id="slug-checker-tips" style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">Valid characters and length constraint check.</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('slug-checker-val');
    const badge = document.getElementById('slug-checker-badge');
    const tips = document.getElementById('slug-checker-tips');

    if (!input) return;

    function verify() {
        const val = input.value.trim();
        const containsCaps = /[A-Z]/.test(val);
        const containsSpecial = /[^a-z0-9-]/.test(val);
        const tooLong = val.length > 70;

        if (containsCaps || containsSpecial || tooLong || val.length === 0) {
            badge.textContent = 'No (SEO Issues Found)';
            badge.style.color = 'var(--error-color)';
            let issues = [];
            if (containsCaps) issues.push('contains uppercase letters');
            if (containsSpecial) issues.push('contains spaces or special chars');
            if (tooLong) issues.push('exceeds 70 character limit');
            tips.textContent = 'Issues: ' + issues.join(', ') + '.';
        } else {
            badge.textContent = 'Yes (SEO Friendly)';
            badge.style.color = 'var(--success-color)';
            tips.textContent = 'Matches standard lowercase lowercase alphanumeric and hyphen criteria.';
        }
    }
    input.addEventListener('input', verify);
    verify();
}
`
    }),
    'html-table-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="tbl-rows">Rows (1-100)</label>
                    <input type="number" id="tbl-rows" class="input-control" value="3" min="1" max="100">
                </div>
                <div class="form-group">
                    <label for="tbl-cols">Columns (1-100)</label>
                    <input type="number" id="tbl-cols" class="input-control" value="3" min="1" max="100">
                </div>
                <div class="form-group">
                    <label for="tbl-align">Text Alignment</label>
                    <select id="tbl-align" class="input-control">
                        <option value="none">None</option>
                        <option value="left">Left</option>
                        <option value="center" selected>Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="form-group" style="display:flex; align-items:center; height:100%;">
                    <label style="cursor:pointer;"><input type="checkbox" id="tbl-header" checked> Include Header Row</label>
                </div>
                <div class="form-group">
                    <label for="tbl-border-width">Border Width (px)</label>
                    <input type="number" id="tbl-border-width" class="input-control" value="1" min="0" max="20">
                </div>
                <div class="form-group">
                    <label for="tbl-border-color">Border Color</label>
                    <input type="color" id="tbl-border-color" class="input-control" value="#cccccc" style="height:38px; padding:0.2rem;">
                </div>
                <div class="form-group">
                    <label for="tbl-padding">Cell Padding (px)</label>
                    <input type="number" id="tbl-padding" class="input-control" value="8" min="0" max="50">
                </div>
                <div class="form-group">
                    <label for="tbl-spacing">Cell Spacing (px)</label>
                    <input type="number" id="tbl-spacing" class="input-control" value="0" min="0" max="50">
                </div>
            </div>

            <!-- Table Preview Box -->
            <div style="margin-top:1.5rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; background:#ffffff; overflow-x:auto;">
                <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.75rem;">Live Preview</div>
                <div id="tbl-preview-container"></div>
            </div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label>HTML Code Result</label>
                <textarea readonly id="tbl-code-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="tbl-btn-reset">Reset</button>
                <button class="btn btn-secondary" id="tbl-btn-copy">Copy HTML Table</button>
                <button class="btn btn-primary" id="tbl-btn-download">Download HTML File</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const rowsInput = document.getElementById('tbl-rows');
    const colsInput = document.getElementById('tbl-cols');
    const alignSel = document.getElementById('tbl-align');
    const headerCheck = document.getElementById('tbl-header');
    const borderWidth = document.getElementById('tbl-border-width');
    const borderColor = document.getElementById('tbl-border-color');
    const cellPadding = document.getElementById('tbl-padding');
    const cellSpacing = document.getElementById('tbl-spacing');

    const preview = document.getElementById('tbl-preview-container');
    const output = document.getElementById('tbl-code-output');
    
    const reset = document.getElementById('tbl-btn-reset');
    const copy = document.getElementById('tbl-btn-copy');
    const download = document.getElementById('tbl-btn-download');

    if (!rowsInput) return;

    function render() {
        const r = Math.min(100, Math.max(1, parseInt(rowsInput.value) || 3));
        const c = Math.min(100, Math.max(1, parseInt(colsInput.value) || 3));
        const align = alignSel.value;
        const hasHeader = headerCheck.checked;
        const border = parseInt(borderWidth.value) || 0;
        const color = borderColor.value;
        const padding = parseInt(cellPadding.value) || 0;
        const spacing = parseInt(cellSpacing.value) || 0;

        let styleAttr = '';
        if (border > 0) {
            styleAttr = ' style="border: ' + border + 'px solid ' + color + '; border-collapse: ' + (spacing === 0 ? 'collapse' : 'separate') + ';"';
        } else {
            styleAttr = ' style="border: none; border-collapse: ' + (spacing === 0 ? 'collapse' : 'separate') + ';"';
        }

        let html = '<table' + styleAttr + ' border="' + border + '" cellpadding="' + padding + '" cellspacing="' + spacing + '">\\n';

        // Add Header Row
        if (hasHeader) {
            html += '  <thead>\\n    <tr>\\n';
            for (let j = 0; j < c; j++) {
                let cellStyle = ' style="border: ' + border + 'px solid ' + color + '; padding: ' + padding + 'px;';
                if (align !== 'none') cellStyle += ' text-align: ' + align + ';';
                cellStyle += '"';
                html += '      <th' + cellStyle + '>Header ' + (j + 1) + '</th>\\n';
            }
            html += '    </tr>\\n  </thead>\\n';
        }

        // Add Body Rows
        html += '  <tbody>\\n';
        for (let i = 0; i < r; i++) {
            html += '    <tr>\\n';
            for (let j = 0; j < c; j++) {
                let cellStyle = ' style="border: ' + border + 'px solid ' + color + '; padding: ' + padding + 'px;';
                if (align !== 'none') cellStyle += ' text-align: ' + align + ';';
                cellStyle += '"';
                html += '      <td' + cellStyle + '>Cell ' + (i + 1) + '-' + (j + 1) + '</td>\\n';
            }
            html += '    </tr>\\n';
        }
        html += '  </tbody>\\n</table>';

        output.value = html;
        preview.innerHTML = html;
    }

    [rowsInput, colsInput, alignSel, borderWidth, cellPadding, cellSpacing].forEach(el => el.addEventListener('input', render));
    [headerCheck, borderColor].forEach(el => el.addEventListener('change', render));

    reset.addEventListener('click', () => {
        rowsInput.value = '3';
        colsInput.value = '3';
        alignSel.value = 'center';
        headerCheck.checked = true;
        borderWidth.value = '1';
        borderColor.value = '#cccccc';
        cellPadding.value = '8';
        cellSpacing.value = '0';
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('HTML Table Code copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
`
    }),
    'csv-to-json': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <textarea id="csv-val" class="input-control" placeholder="name,age\\nJohn,30\\nSarah,25" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
            </div>

            <div class="form-group">
                <label for="json-val">JSON Output</label>
                <textarea id="json-val" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="csv-btn-convert">Convert CSV to JSON</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const csv = document.getElementById('csv-val');
    const json = document.getElementById('json-val');
    const convert = document.getElementById('csv-btn-convert');

    if (!convert) return;

    convert.addEventListener('click', () => {
        const lines = csv.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
            alert('Please input headers and row items separated by commas.');
            return;
        }

        const headers = lines[0].split(',');
        const result = [];

        for(let i=1; i<lines.length; i++) {
            const cells = lines[i].split(',');
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h.trim()] = (cells[idx] || '').trim();
            });
            result.push(obj);
        }

        json.value = JSON.stringify(result, null, 4);
    });
}
`
    }),
    'json-to-csv': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="json-val-input">JSON Array Input</label>
                <textarea id="json-val-input" class="input-control" placeholder="[ {\\"name\\": \\"John\\", \\"age\\": 30} ]" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
            </div>

            <div class="form-group">
                <label for="csv-val-output">CSV Result</label>
                <textarea id="csv-val-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="json-btn-convert">Convert JSON to CSV</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const json = document.getElementById('json-val-input');
    const csv = document.getElementById('csv-val-output');
    const convert = document.getElementById('json-btn-convert');

    if (!convert) return;

    convert.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(json.value.trim());
            if (!Array.isArray(parsed) || parsed.length === 0) {
                alert('Please check input array structure.');
                return;
            }

            const headers = Object.keys(parsed[0]);
            let csvStr = headers.join(',') + '\\n';

            parsed.forEach(obj => {
                const row = headers.map(h => {
                    const cellVal = obj[h] || '';
                    return cellVal.toString().includes(',') ? '\"' + cellVal + '\"' : cellVal;
                }).join(',');
                csvStr += row + '\\n';
            });

            csv.value = csvStr;
        } catch(e) {
            alert('Invalid JSON array input formatting: ' + e.message);
        }
    });
}
`
    }),
    'random-number-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="rand-min">Minimum Limit</label>
                    <input type="number" id="rand-min" class="input-control" value="1">
                </div>
                <div class="form-group">
                    <label for="rand-max">Maximum Limit</label>
                    <input type="number" id="rand-max" class="input-control" value="100">
                </div>
                <div class="form-group">
                    <label for="rand-quantity">Quantity</label>
                    <input type="number" id="rand-quantity" class="input-control" value="5" min="1" max="1000">
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; text-align:center; font-size:1.5rem; font-weight:800; color:var(--primary-color);" id="rand-result">
                -
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-primary" id="rand-btn-generate" style="width:100%;">Generate Random Numbers</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const minInput = document.getElementById('rand-min');
    const maxInput = document.getElementById('rand-max');
    const qtyInput = document.getElementById('rand-quantity');
    const output = document.getElementById('rand-result');
    const generateBtn = document.getElementById('rand-btn-generate');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        const qty = parseInt(qtyInput.value) || 5;

        if (min >= max) {
            alert('Minimum limit must be less than maximum.');
            return;
        }

        let results = [];
        for(let i=0; i<qty; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            results.push(num);
        }
        output.textContent = results.join(', ');
    });
}
`
    }),
    'dice-roller': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="dice-qty-select">Dice Quantity (1-10)</label>
                    <input type="number" id="dice-qty-select" class="input-control" value="2" min="1" max="10">
                </div>
                <div class="form-group">
                    <label for="dice-type-select">Dice Faces</label>
                    <select id="dice-type-select" class="input-control">
                        <option value="4">d4 (Tetrahedron)</option>
                        <option value="6" selected>d6 (Cube)</option>
                        <option value="8">d8 (Octahedron)</option>
                        <option value="10">d10 (Decahedron)</option>
                        <option value="12">d12 (Dodecahedron)</option>
                        <option value="20">d20 (Icosahedron)</option>
                    </select>
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; text-align:center; font-size:1.5rem; font-weight:800;" id="dice-rolling-result">
                Roll values: -
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-primary" id="dice-btn-action" style="width:100%;">Roll Dice</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const qty = document.getElementById('dice-qty-select');
    const type = document.getElementById('dice-type-select');
    const output = document.getElementById('dice-rolling-result');
    const rollBtn = document.getElementById('dice-btn-action');

    if (!rollBtn) return;

    rollBtn.addEventListener('click', () => {
        const count = parseInt(qty.value) || 2;
        const faces = parseInt(type.value) || 6;

        let rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * faces) + 1;
            rolls.push(roll);
            total += roll;
        }

        output.textContent = 'Rolls: ' + rolls.join(', ') + ' (Total: ' + total + ')';
    });
}
`
    }),
    'coin-flip': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="display:flex; justify-content:center; align-items:center; margin:2rem 0;">
                <div id="coin-visual-flip" style="width:120px; height:120px; border-radius:50%; background:#e2e8f0; border:6px solid #94a3b8; display:flex; justify-content:center; align-items:center; font-size:1.5rem; font-weight:800; color:#475569; transition: transform 0.3s ease;">
                    Flip
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center; margin-bottom:1.5rem;" id="coin-totals">
                Heads: 0 | Tails: 0
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="coin-btn-flip-action" style="width:100%;">Flip Coin</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const coin = document.getElementById('coin-visual-flip');
    const stats = document.getElementById('coin-totals');
    const flipBtn = document.getElementById('coin-btn-flip-action');

    let heads = 0, tails = 0;

    if (!flipBtn) return;

    flipBtn.addEventListener('click', () => {
        coin.style.transform = 'rotateY(1800deg)';
        setTimeout(() => {
            const result = Math.random() >= 0.5 ? 'Heads' : 'Tails';
            coin.textContent = result;
            coin.style.transform = 'none';
            if(result === 'Heads') {
                heads++;
                coin.style.background = '#f59e0b';
                coin.style.borderColor = '#d97706';
                coin.style.color = '#ffffff';
            } else {
                tails++;
                coin.style.background = '#94a3b8';
                coin.style.borderColor = '#475569';
                coin.style.color = '#ffffff';
            }
            stats.textContent = 'Heads: ' + heads + ' | Tails: ' + tails;
        }, 300);
    });
}
`
    }),
    'unit-price-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid" style="grid-template-columns:1fr 1fr; gap:1.5rem;">
                <div>
                    <h4 style="margin-bottom:0.75rem;">Package A</h4>
                    <div class="form-group">
                        <label>Price ($)</label>
                        <input type="number" id="p-price-a" class="input-control" value="10">
                    </div>
                    <div class="form-group">
                        <label>Quantity / Weight</label>
                        <input type="number" id="p-qty-a" class="input-control" value="2">
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom:0.75rem;">Package B</h4>
                    <div class="form-group">
                        <label>Price ($)</label>
                        <input type="number" id="p-price-b" class="input-control" value="18">
                    </div>
                    <div class="form-group">
                        <label>Quantity / Weight</label>
                        <input type="number" id="p-qty-b" class="input-control" value="4">
                    </div>
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
                <div>Package A Unit Cost: <strong id="unit-cost-a">$5.00</strong></div>
                <div>Package B Unit Cost: <strong id="unit-cost-b">$4.50</strong></div>
                <div style="margin-top:0.5rem; font-weight:700; color:var(--success-color);" id="cheaper-recommendation">Package B is 10% cheaper!</div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const priceA = document.getElementById('p-price-a');
    const qtyA = document.getElementById('p-qty-a');
    const priceB = document.getElementById('p-price-b');
    const qtyB = document.getElementById('p-qty-b');

    const costA = document.getElementById('unit-cost-a');
    const costB = document.getElementById('unit-cost-b');
    const rec = document.getElementById('cheaper-recommendation');

    if (!priceA) return;

    function calculate() {
        const pA = parseFloat(priceA.value) || 0;
        const qA = parseFloat(qtyA.value) || 0;
        const pB = parseFloat(priceB.value) || 0;
        const qB = parseFloat(qtyB.value) || 0;

        if (qA <= 0 || qB <= 0) return;

        const uA = pA / qA;
        const uB = pB / qB;

        costA.textContent = '$' + uA.toFixed(2);
        costB.textContent = '$' + uB.toFixed(2);

        if (uA === uB) {
            rec.textContent = 'Both packages have identical unit pricing.';
            rec.style.color = 'var(--text-secondary)';
        } else if (uA < uB) {
            const diff = ((uB - uA) / uB * 100).toFixed(1);
            rec.textContent = 'Package A is ' + diff + '% cheaper!';
            rec.style.color = 'var(--success-color)';
        } else {
            const diff = ((uA - uB) / uA * 100).toFixed(1);
            rec.textContent = 'Package B is ' + diff + '% cheaper!';
            rec.style.color = 'var(--success-color)';
        }
    }

    [priceA, qtyA, priceB, qtyB].forEach(el => el.addEventListener('input', calculate));
    calculate();
}
`
    }),
    'fuel-cost-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="fuel-distance">One-Way Distance (km)</label>
                    <input type="number" id="fuel-distance" class="input-control" value="100">
                </div>
                <div class="form-group">
                    <label for="fuel-consumption">Mileage (L/100km)</label>
                    <input type="number" id="fuel-consumption" class="input-control" value="8">
                </div>
                <div class="form-group">
                    <label for="fuel-price">Fuel price per Liter ($)</label>
                    <input type="number" id="fuel-price" class="input-control" value="1.5" step="0.01">
                </div>
            </div>

            <div class="form-group" style="display:flex; align-items:center; margin-top:0.5rem;">
                <label style="cursor:pointer;"><input type="checkbox" id="fuel-round-trip" checked> Calculate round-trip cost</label>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-top:1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
                <div>Total Fuel Required: <strong id="total-fuel-needed">16.00 L</strong></div>
                <div>Total Fuel Cost: <strong id="total-fuel-cost" style="color:var(--primary-color); font-size:1.25rem;">$24.00</strong></div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dist = document.getElementById('fuel-distance');
    const cons = document.getElementById('fuel-consumption');
    const price = document.getElementById('fuel-price');
    const round = document.getElementById('fuel-round-trip');

    const fuelVal = document.getElementById('total-fuel-needed');
    const costVal = document.getElementById('total-fuel-cost');

    if (!dist) return;

    function calculate() {
        const d = parseFloat(dist.value) || 0;
        const c = parseFloat(cons.value) || 0;
        const p = parseFloat(price.value) || 0;
        const multiplier = round.checked ? 2 : 1;

        const totalDist = d * multiplier;
        const fuelNeeded = (totalDist / 100) * c;
        const cost = fuelNeeded * p;

        fuelVal.textContent = fuelNeeded.toFixed(2) + ' L';
        costVal.textContent = '$' + cost.toFixed(2);
    }

    [dist, cons, price].forEach(el => el.addEventListener('input', calculate));
    round.addEventListener('change', calculate);
    calculate();
}
`
    }),
    'robots-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="rob-default-ua">Default User-Agent</label>
                    <select id="rob-default-ua" class="input-control">
                        <option value="*">* (All Crawlers)</option>
                        <option value="Googlebot">Googlebot</option>
                        <option value="Bingbot">Bingbot</option>
                        <option value="YandexBot">YandexBot</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="rob-crawl-delay">Crawl Delay (seconds)</label>
                    <input type="number" id="rob-crawl-delay" class="input-control" placeholder="None" min="1">
                </div>
                <div class="form-group">
                    <label for="rob-host">Host Directive (optional)</label>
                    <input type="text" id="rob-host" class="input-control" placeholder="example.com">
                </div>
                <div class="form-group">
                    <label for="rob-sitemap">Sitemap URL (optional)</label>
                    <input type="text" id="rob-sitemap" class="input-control" placeholder="https://example.com/sitemap.xml">
                </div>
            </div>

            <div style="margin-top:1.5rem; padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <h4>Custom Directives (Allow / Disallow)</h4>
                <div id="rob-directives-container" style="display:flex; flex-direction:column; gap:0.5rem; margin:0.75rem 0;"></div>
                <button class="btn btn-secondary btn-sm" id="rob-btn-add-dir" type="button">+ Add Directory Rule</button>
            </div>

            <div id="rob-warning" style="display:none; color:var(--error-color); font-size:0.85rem; margin-top:1rem; font-weight:700;"></div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label>Generated robots.txt Preview</label>
                <textarea readonly id="rob-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="rob-btn-reset">Reset</button>
                <button class="btn btn-secondary" id="rob-btn-copy">Copy Output</button>
                <button class="btn btn-primary" id="rob-btn-download">Download robots.txt</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const defaultUa = document.getElementById('rob-default-ua');
    const crawlDelay = document.getElementById('rob-crawl-delay');
    const host = document.getElementById('rob-host');
    const sitemap = document.getElementById('rob-sitemap');
    const addDirBtn = document.getElementById('rob-btn-add-dir');
    const dirsContainer = document.getElementById('rob-directives-container');
    const warning = document.getElementById('rob-warning');
    const output = document.getElementById('rob-output');
    const reset = document.getElementById('rob-btn-reset');
    const copy = document.getElementById('rob-btn-copy');
    const download = document.getElementById('rob-btn-download');

    if (!defaultUa) return;

    let rules = [];

    function render() {
        warning.style.display = 'none';
        warning.textContent = '';
        
        let lines = [];
        lines.push('User-agent: ' + defaultUa.value);

        if (crawlDelay.value) {
            const delay = parseInt(crawlDelay.value);
            if (isNaN(delay) || delay <= 0) {
                warning.textContent = '⚠️ Crawl delay must be a positive integer.';
                warning.style.display = 'block';
            } else {
                lines.push('Crawl-delay: ' + delay);
            }
        }

        rules.forEach(r => {
            if (r.path.trim()) {
                if (!r.path.startsWith('/')) {
                    warning.textContent = '⚠️ Custom rules directories must start with "/"';
                    warning.style.display = 'block';
                }
                lines.push(r.type + ': ' + r.path.trim());
            }
        });

        if (host.value.trim()) {
            const hostVal = host.value.trim();
            if (!/^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(hostVal)) {
                warning.textContent = '⚠️ Invalid Host domain name.';
                warning.style.display = 'block';
            } else {
                lines.push('Host: ' + hostVal);
            }
        }

        if (sitemap.value.trim()) {
            const sitemapUrl = sitemap.value.trim();
            if (!sitemapUrl.startsWith('http://') && !sitemapUrl.startsWith('https://')) {
                warning.textContent = '⚠️ Sitemap URL must be absolute (start with http:// or https://).';
                warning.style.display = 'block';
            } else {
                lines.push('Sitemap: ' + sitemapUrl);
            }
        }

        output.value = lines.join('\\n');
    }

    function addRuleRow(type = 'Disallow', path = '') {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';
        
        const typeSel = document.createElement('select');
        typeSel.className = 'input-control';
        typeSel.style.width = '120px';
        typeSel.innerHTML = '<option value="Disallow">Disallow</option><option value="Allow">Allow</option>';
        typeSel.value = type;

        const pathInput = document.createElement('input');
        pathInput.type = 'text';
        pathInput.className = 'input-control';
        pathInput.placeholder = 'e.g. /admin/';
        pathInput.value = path;
        pathInput.style.flex = '1';

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(typeSel);
        row.appendChild(pathInput);
        row.appendChild(remBtn);
        dirsContainer.appendChild(row);

        const ruleObj = { type, path };
        rules.push(ruleObj);

        const update = () => {
            ruleObj.type = typeSel.value;
            ruleObj.path = pathInput.value;
            render();
        };

        typeSel.addEventListener('change', update);
        pathInput.addEventListener('input', update);
        remBtn.addEventListener('click', () => {
            row.remove();
            rules = rules.filter(r => r !== ruleObj);
            render();
        });

        render();
    }

    addDirBtn.addEventListener('click', () => addRuleRow());
    [defaultUa, crawlDelay, host, sitemap].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        defaultUa.value = '*';
        crawlDelay.value = '';
        host.value = '';
        sitemap.value = '';
        dirsContainer.innerHTML = '';
        rules = [];
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Robots.txt output!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    addRuleRow('Disallow', '/admin/');
    addRuleRow('Disallow', '/api/');
    render();
}
`
    }),
    'sitemap-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="margin-bottom:1.5rem;">
                <h3 style="margin-bottom: 0.5rem; font-size:1.1rem;">Sitemap URLs</h3>
                <div id="site-urls-container" style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;"></div>
                <button class="btn btn-secondary" id="site-add-url" type="button">+ Add URL Row</button>
            </div>

            <div id="site-warning" style="display:none; color:var(--error-color); font-size:0.85rem; margin-top:1rem; font-weight:700;"></div>

            <div class="form-group" style="margin-top: 1.5rem;">
                <label>Generated sitemap.xml Preview</label>
                <textarea readonly id="site-output" class="input-control" style="font-family:var(--font-mono); min-height:220px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="site-btn-reset">Reset</button>
                <button class="btn btn-secondary" id="site-btn-copy">Copy Output</button>
                <button class="btn btn-primary" id="site-btn-download">Download XML</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const container = document.getElementById('site-urls-container');
    const addBtn = document.getElementById('site-add-url');
    const warning = document.getElementById('site-warning');
    const output = document.getElementById('site-output');
    const reset = document.getElementById('site-btn-reset');
    const copy = document.getElementById('site-btn-copy');
    const download = document.getElementById('site-btn-download');

    if (!container) return;

    let urls = [];

    function render() {
        warning.style.display = 'none';
        warning.textContent = '';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';

        urls.forEach(u => {
            const loc = u.loc.trim();
            if (loc) {
                if (!loc.startsWith('http://') && !loc.startsWith('https://')) {
                    warning.textContent = '⚠️ All URLs must start with http:// or https://';
                    warning.style.display = 'block';
                }
                xml += '  <url>\\n';
                xml += '    <loc>' + escapeXml(loc) + '</loc>\\n';
                if (u.lastmod) xml += '    <lastmod>' + u.lastmod + '</lastmod>\\n';
                if (u.changefreq) xml += '    <changefreq>' + u.changefreq + '</changefreq>\\n';
                if (u.priority) xml += '    <priority>' + u.priority + '</priority>\\n';
                xml += '  </url>\\n';
            }
        });

        xml += '</urlset>';
        output.value = xml;
    }

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"\\r\\n]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return '';
            }
        });
    }

    function addUrlRow(locVal = '', changefreqVal = 'weekly', priorityVal = '0.5', lastmodVal = '') {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '2fr 1fr 1fr 1.2fr auto';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';

        const locInput = document.createElement('input');
        locInput.type = 'text';
        locInput.className = 'input-control';
        locInput.placeholder = 'https://example.com/page';
        locInput.value = locVal;

        const freqSel = document.createElement('select');
        freqSel.className = 'input-control';
        freqSel.innerHTML = \`
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly" selected>weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="never">never</option>
        \`;
        freqSel.value = changefreqVal;

        const prioSel = document.createElement('select');
        prioSel.className = 'input-control';
        prioSel.innerHTML = \`
            <option value="1.0">1.0</option>
            <option value="0.8">0.8</option>
            <option value="0.5" selected>0.5</option>
            <option value="0.3">0.3</option>
            <option value="0.0">0.0</option>
        \`;
        prioSel.value = priorityVal;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'input-control';
        dateInput.value = lastmodVal || new Date().toISOString().split('T')[0];

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(locInput);
        row.appendChild(freqSel);
        row.appendChild(prioSel);
        row.appendChild(dateInput);
        row.appendChild(remBtn);
        container.appendChild(row);

        const urlObj = { loc: locVal, changefreq: changefreqVal, priority: priorityVal, lastmod: dateInput.value };
        urls.push(urlObj);

        const update = () => {
            urlObj.loc = locInput.value;
            urlObj.changefreq = freqSel.value;
            urlObj.priority = prioSel.value;
            urlObj.lastmod = dateInput.value;
            render();
        };

        [locInput, freqSel, prioSel, dateInput].forEach(el => el.addEventListener('change', update));
        locInput.addEventListener('input', update);

        remBtn.addEventListener('click', () => {
            row.remove();
            urls = urls.filter(u => u !== urlObj);
            render();
        });

        render();
    }

    addBtn.addEventListener('click', () => addUrlRow());

    reset.addEventListener('click', () => {
        container.innerHTML = '';
        urls = [];
        addUrlRow('https://example.com/', 'daily', '1.0');
        addUrlRow('https://example.com/about', 'monthly', '0.8');
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Sitemap XML copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    });

    addUrlRow('https://example.com/', 'daily', '1.0');
    addUrlRow('https://example.com/about', 'monthly', '0.8');
    render();
}
`
    }),
    'url-parser': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="url-input">Enter URL to Parse</label>
                <input type="text" id="url-input" class="input-control" placeholder="https://username:password@sub.example.com:8080/path/to/page.html?query=val#fragment">
            </div>

            <div id="url-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); margin-bottom:1rem; font-size:0.85rem; font-weight:700;"></div>

            <div id="url-results" style="display:none; margin-top:1.5rem;">
                <h3 style="margin-bottom:1rem;">Parsed Component Fields</h3>
                <div style="display:flex; flex-direction:column; gap:0.75rem;" id="url-fields-container"></div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="url-reset">Reset</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('url-input');
    const errorMsg = document.getElementById('url-error');
    const results = document.getElementById('url-results');
    const container = document.getElementById('url-fields-container');
    const reset = document.getElementById('url-reset');

    if (!input) return;

    function renderField(label, value) {
        if (!value) return '';
        return \`
            <div style="display:grid; grid-template-columns:1.5fr 4fr auto; gap:1rem; padding:0.5rem; border-bottom:1px solid var(--border-color); font-size:0.9rem; align-items:center;">
                <strong style="color:var(--text-secondary); text-transform:capitalize;">\${label}</strong>
                <span style="font-family:var(--font-mono); word-break:break-all;">\${value}</span>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('\${value.replace(/'/g, "\\\\'")}') && alert('Copied!')" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Copy</button>
            </div>
        \`;
    }

    function parse() {
        let val = input.value.trim();
        if (!val) {
            results.style.display = 'none';
            errorMsg.style.display = 'none';
            return;
        }

        if (!/^[a-zA-Z]+:\\/\\//.test(val)) {
            val = 'http://' + val;
        }

        try {
            const parsed = new URL(val);
            errorMsg.style.display = 'none';

            const hostname = parsed.hostname;
            const hostParts = hostname.split('.');
            let tld = '';
            let domain = '';
            let subdomain = '';
            
            if (hostParts.length >= 2) {
                const lastTwo = hostParts.slice(-2).join('.');
                const doubleTLDs = ['co.uk', 'com.au', 'org.uk', 'co.in', 'net.in', 'com.cn', 'edu.in', 'gov.in'];
                if (doubleTLDs.includes(lastTwo) && hostParts.length >= 3) {
                    tld = lastTwo;
                    domain = hostParts[hostParts.length - 3];
                    subdomain = hostParts.slice(0, hostParts.length - 3).join('.');
                } else {
                    tld = hostParts[hostParts.length - 1];
                    domain = hostParts[hostParts.length - 2];
                    subdomain = hostParts.slice(0, hostParts.length - 2).join('.');
                }
            } else {
                domain = hostname;
            }

            const pathParts = parsed.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            const filename = lastPart.includes('.') ? lastPart : '';

            let html = '';
            html += renderField('Protocol', parsed.protocol);
            html += renderField('Username', parsed.username);
            html += renderField('Password', parsed.password);
            html += renderField('Host', parsed.host);
            html += renderField('Subdomain', subdomain);
            html += renderField('Domain', domain);
            html += renderField('TLD', tld);
            html += renderField('Port', parsed.port);
            html += renderField('Path', parsed.pathname);
            html += renderField('File Name', filename);
            html += renderField('Query Parameters', parsed.search);
            html += renderField('Fragment / Hash', parsed.hash);

            container.innerHTML = html;
            results.style.display = 'block';
        } catch (e) {
            errorMsg.textContent = '❌ Malformed URL. Please check syntax (e.g. protocol, host).';
            errorMsg.style.display = 'block';
            results.style.display = 'none';
        }
    }

    input.addEventListener('input', parse);
    reset.addEventListener('click', () => {
        input.value = '';
        parse();
    });
}
`
    }),
    'redirect-checker': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="background:var(--bg-primary); border-left:4px solid var(--accent-color); padding:1rem; margin-bottom:1.5rem; font-size:0.9rem; line-height:1.5;">
                <strong>💡 Note on Browser Redirect Checks:</strong> Due to security restrictions (CORS), web browsers block scripts from tracking redirection paths across foreign domains. Real-time path tracing is only possible using server-side proxies or backend APIs. 
                <br><br>
                For educational purposes, you can build, simulate, and analyze custom redirect chains below to test hops, loop detection, and crawlers policies.
            </div>

            <div style="margin-bottom:1.5rem;">
                <h4>Build Redirect Hop Chain</h4>
                <div id="red-chain-container" style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.75rem; margin-bottom:1rem;"></div>
                <button class="btn btn-secondary" id="red-add-hop" type="button">+ Add Next Hop</button>
            </div>

            <div id="red-analysis" style="display:none; background:var(--bg-primary); padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <h3 style="margin-bottom:0.75rem;">Analysis Summary</h3>
                <div id="red-visual-flow" style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem; margin-bottom:1.5rem; font-family:var(--font-mono); font-size:0.85rem;"></div>
                
                <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;" id="red-checklists"></div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const container = document.getElementById('red-chain-container');
    const addHopBtn = document.getElementById('red-add-hop');
    const analysis = document.getElementById('red-analysis');
    const flow = document.getElementById('red-visual-flow');
    const checklists = document.getElementById('red-checklists');

    if (!container) return;

    let hops = [];

    function render() {
        if (hops.length === 0) {
            analysis.style.display = 'none';
            return;
        }

        analysis.style.display = 'block';

        let flowHtml = '';
        hops.forEach((h, idx) => {
            const urlText = h.url.trim() || '(Empty URL)';
            flowHtml += \`<div style="padding:0.5rem; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-sm);">\${urlText}</div>\`;
            if (idx < hops.length - 1) {
                flowHtml += \`<div style="color:var(--accent-color); font-weight:700;">-- \${h.code} --></div>\`;
            }
        });
        flow.innerHTML = flowHtml;

        let checks = [];
        let isLoop = false;
        const visitedUrls = new Set();
        
        for (let i = 0; i < hops.length; i++) {
            const u = hops[i].url.trim().toLowerCase();
            if (u) {
                if (visitedUrls.has(u)) {
                    isLoop = true;
                    break;
                }
                visitedUrls.add(u);
            }
        }

        if (isLoop) {
            checks.push(\`<span style="color:var(--error-color); font-weight:700;">⚠️ REDIRECT LOOP DETECTED:</span> Infinite loop identified. Search engine crawlers will drop this request and fail indexation.\`);
        } else {
            checks.push(\`<span style="color:var(--success-color); font-weight:700;">✅ No Loops:</span> Redirect chain terminates successfully.\`);
        }

        if (hops.length > 5) {
            checks.push(\`<span style="color:var(--error-color); font-weight:700;">⚠️ CHAIN TOO LONG:</span> Chain has \${hops.length} hops. Search engines (like Google) follow at most 5 redirection hops before failing.\`);
        } else {
            checks.push(\`<span style="color:var(--success-color); font-weight:700;">✅ Length OK:</span> Chain has \${hops.length} hops (under maximum limit of 5).\`);
        }

        let isDowngrade = false;
        for (let i = 0; i < hops.length - 1; i++) {
            const current = hops[i].url.trim().toLowerCase();
            const next = hops[i+1].url.trim().toLowerCase();
            if (current.startsWith('https://') && next.startsWith('http://')) {
                isDowngrade = true;
            }
        }
        if (isDowngrade) {
            checks.push(\`<span style="color:var(--error-color); font-weight:700;">⚠️ SECURITY DOWNGRADE:</span> Redirect redirects secure HTTPS to insecure HTTP. Vulnerable to interception.\`);
        } else {
            checks.push(\`<span style="color:var(--success-color); font-weight:700;">✅ Protocol Security:</span> Redirection contains no HTTPS-to-HTTP downgrades.\`);
        }

        checklists.innerHTML = checks.map(c => \`<div style="padding:0.4rem 0;">\${c}</div>\`).join('');
    }

    function addHopRow(urlVal = '', codeVal = '301') {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.className = 'input-control';
        urlInput.style.flex = '1';
        urlInput.placeholder = 'https://example.com/target-path';
        urlInput.value = urlVal;

        const codeSel = document.createElement('select');
        codeSel.className = 'input-control';
        codeSel.style.width = '140px';
        codeSel.innerHTML = \`
            <option value="301">301 Permanent</option>
            <option value="302">302 Found</option>
            <option value="307">307 Temporary</option>
            <option value="308">308 Permanent</option>
            <option value="200">200 OK (End)</option>
        \`;
        codeSel.value = codeVal;

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(urlInput);
        row.appendChild(codeSel);
        row.appendChild(remBtn);
        container.appendChild(row);

        const hopObj = { url: urlVal, code: codeVal };
        hops.push(hopObj);

        const update = () => {
            hopObj.url = urlInput.value;
            hopObj.code = codeSel.value;
            render();
        };

        urlInput.addEventListener('input', update);
        codeSel.addEventListener('change', update);
        remBtn.addEventListener('click', () => {
            row.remove();
            hops = hops.filter(h => h !== hopObj);
            render();
        });

        render();
    }

    addHopBtn.addEventListener('click', () => addHopRow());

    addHopRow('http://example.com/', '301');
    addHopRow('https://example.com/', '302');
    addHopRow('https://example.com/landing', '200');
    render();
}
`
    }),
    'link-analyzer': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="link-html-input">Paste HTML Content</label>
                <textarea id="link-html-input" class="input-control" placeholder="Paste raw <html> structure here..." style="min-height: 120px; font-family:var(--font-mono); font-size:0.8rem;"></textarea>
            </div>

            <div class="form-group">
                <label for="link-file-input">Or Upload HTML File</label>
                <input type="file" id="link-file-input" class="input-control" accept=".html,.htm">
            </div>

            <div class="options-grid">
                <div class="form-group">
                    <label for="link-base-url">Base Website URL (for Internal recognition)</label>
                    <input type="text" id="link-base-url" class="input-control" value="https://example.com">
                </div>
                <div class="form-group">
                    <label for="link-search">Search Links</label>
                    <input type="text" id="link-search" class="input-control" placeholder="Search URL or anchor text...">
                </div>
            </div>

            <div class="action-row" style="margin-top:1rem;">
                <button class="btn btn-primary" id="link-btn-analyze">Analyze Links</button>
                <button class="btn btn-secondary" id="link-btn-reset">Reset</button>
            </div>

            <div id="link-results" style="display:none; margin-top:1.5rem;">
                <h3>Link Extraction Summary</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; margin:1rem 0;" id="link-stats"></div>

                <div class="action-row" style="margin-bottom:0.75rem;">
                    <button class="btn btn-secondary btn-sm" id="link-btn-copy-all">Copy All Link URLs</button>
                    <button class="btn btn-secondary btn-sm" id="link-btn-download-csv">Download CSV Report</button>
                </div>

                <div style="max-height:300px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                    <table style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left;">
                        <thead>
                            <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                                <th style="padding:0.5rem;">URL</th>
                                <th style="padding:0.5rem; width:150px;">Anchor Text</th>
                                <th style="padding:0.5rem; width:120px;">Type</th>
                                <th style="padding:0.5rem; width:80px;">Occurs</th>
                            </tr>
                        </thead>
                        <tbody id="link-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const htmlInput = document.getElementById('link-html-input');
    const fileInput = document.getElementById('link-file-input');
    const baseUrlInput = document.getElementById('link-base-url');
    const searchInput = document.getElementById('link-search');
    const analyzeBtn = document.getElementById('link-btn-analyze');
    const resetBtn = document.getElementById('link-btn-reset');
    const resultsPanel = document.getElementById('link-results');
    const statsContainer = document.getElementById('link-stats');
    const tableBody = document.getElementById('link-table-body');
    
    const copyBtn = document.getElementById('link-btn-copy-all');
    const downloadBtn = document.getElementById('link-btn-download-csv');

    if (!analyzeBtn) return;

    let parsedLinks = [];

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            htmlInput.value = evt.target.result;
        };
        reader.readAsText(file);
    });

    analyzeBtn.addEventListener('click', () => {
        const html = htmlInput.value;
        if (!html.trim()) return;

        const baseVal = baseUrlInput.value.trim().toLowerCase();
        let baseHost = '';
        try {
            baseHost = new URL(baseVal).hostname;
        } catch(e) {
            baseHost = baseVal;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const anchors = doc.querySelectorAll('a');

        const counts = {};
        anchors.forEach(a => {
            const href = a.getAttribute('href') || '';
            const anchorText = a.textContent.trim() || '(No Anchor Text)';
            
            let type = 'Internal';
            if (href.startsWith('mailto:')) {
                type = 'Email';
            } else if (href.startsWith('tel:')) {
                type = 'Telephone';
            } else if (/^[a-zA-Z0-9]+:\\/\\//.test(href)) {
                try {
                    const host = new URL(href).hostname.toLowerCase();
                    if (host !== baseHost) {
                        type = 'External';
                    }
                } catch(e) {
                    type = 'External';
                }
            }

            const key = href + '|||' + anchorText + '|||' + type;
            counts[key] = (counts[key] || 0) + 1;
        });

        parsedLinks = Object.keys(counts).map(key => {
            const parts = key.split('|||');
            return {
                url: parts[0],
                anchor: parts[1],
                type: parts[2],
                count: counts[key]
            };
        });

        render();
    });

    function render() {
        const filter = searchInput.value.toLowerCase();
        const filtered = parsedLinks.filter(l => 
            l.url.toLowerCase().includes(filter) || 
            l.anchor.toLowerCase().includes(filter)
        );

        let internal = 0, external = 0, email = 0, tel = 0, total = 0;
        filtered.forEach(l => {
            const count = l.count;
            total += count;
            if (l.type === 'Internal') internal += count;
            else if (l.type === 'External') external += count;
            else if (l.type === 'Email') email += count;
            else if (l.type === 'Telephone') tel += count;
        });

        statsContainer.innerHTML = \`
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Total Links</div>
                <strong style="font-size:1.2rem;">\${total}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Internal</div>
                <strong style="font-size:1.2rem; color:var(--primary-color);">\${internal}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">External</div>
                <strong style="font-size:1.2rem; color:var(--accent-color);">\${external}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Email/Tel</div>
                <strong style="font-size:1.2rem;">\${email + tel}</strong>
            </div>
        \`;

        tableBody.innerHTML = filtered.map(l => \`
            <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem; font-family:var(--font-mono); word-break:break-all;">\${escapeHtml(l.url)}</td>
                <td style="padding:0.5rem;">\${escapeHtml(l.anchor)}</td>
                <td style="padding:0.5rem;"><span style="padding:0.2rem 0.4rem; font-size:0.75rem; border-radius:var(--radius-sm); background:\${getBadgeColor(l.type)}">\${l.type}</span></td>
                <td style="padding:0.5rem; font-weight:700;">\${l.count}</td>
            </tr>
        \`).join('');

        resultsPanel.style.display = 'block';
    }

    function getBadgeColor(type) {
        if (type === 'Internal') return 'rgba(0,128,0,0.1); color:green;';
        if (type === 'External') return 'rgba(0,0,255,0.1); color:blue;';
        return 'rgba(128,128,128,0.1); color:gray;';
    }

    function escapeHtml(str) {
        return str.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }

    searchInput.addEventListener('input', render);

    resetBtn.addEventListener('click', () => {
        htmlInput.value = '';
        fileInput.value = '';
        searchInput.value = '';
        resultsPanel.style.display = 'none';
        parsedLinks = [];
    });

    copyBtn.addEventListener('click', () => {
        const urls = parsedLinks.map(l => l.url).join('\\n');
        navigator.clipboard.writeText(urls).then(() => alert('Copied all URLs to clipboard!'));
    });

    downloadBtn.addEventListener('click', () => {
        let csv = 'URL,Anchor Text,Link Type,Occurrences\\n';
        parsedLinks.forEach(l => {
            csv += '"' + l.url.replace(/"/g, '""') + '","' + l.anchor.replace(/"/g, '""') + '","' + l.type + '",' + l.count + '\\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`
    }),
    'domain-ip-lookup': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="background:var(--bg-primary); border-left:4px solid var(--accent-color); padding:1rem; margin-bottom:1.5rem; font-size:0.9rem; line-height:1.5;">
                <strong>💡 Client-Side DNS Limitation:</strong> Standard browsers block client-side JavaScript from resolving DNS (Domain Name System) A/AAAA/MX records directly due to sandbox network limitations. Direct IP querying requires server-side tools.
                <br><br>
                This tool checks domain syntax validation, extracts TLD zones, and generates standard dig utility queries for developer execution.
            </div>

            <div class="form-group">
                <label for="dom-input">Enter Domain Name</label>
                <input type="text" id="dom-input" class="input-control" placeholder="e.g. sub.example.com">
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="dom-btn-check">Validate Domain</button>
                <button class="btn btn-secondary" id="dom-btn-reset">Reset</button>
            </div>

            <div id="dom-results" style="display:none; margin-top:1.5rem; background:var(--bg-primary); padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <h3 style="margin-bottom:1rem;">Domain Details</h3>
                <div id="dom-details-container" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('dom-input');
    const checkBtn = document.getElementById('dom-btn-check');
    const resetBtn = document.getElementById('dom-btn-reset');
    const results = document.getElementById('dom-results');
    const container = document.getElementById('dom-details-container');

    if (!checkBtn) return;

    function renderRow(label, value, isSuccess = true) {
        const color = isSuccess ? 'var(--text-primary)' : 'var(--error-color)';
        return \`
            <div style="display:grid; grid-template-columns:2fr 4fr; gap:1rem; padding:0.4rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                <strong style="color:var(--text-secondary);">\${label}</strong>
                <span style="font-family:var(--font-mono); color:\${color}; word-break:break-all;">\${value}</span>
            </div>
        \`;
    }

    checkBtn.addEventListener('click', () => {
        const val = input.value.trim().toLowerCase();
        if (!val) return;

        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,}$/;
        const isValid = domainRegex.test(val);

        let html = '';
        html += renderRow('Entered Domain', val);
        html += renderRow('Syntax Validation', isValid ? '✅ Valid Domain Format' : '❌ Invalid Domain Name Format', isValid);

        if (isValid) {
            const parts = val.split('.');
            const tld = parts[parts.length - 1];
            const domainName = parts[parts.length - 2];
            
            html += renderRow('Primary TLD', '.' + tld);
            html += renderRow('Root Domain', domainName + '.' + tld);
            html += renderRow('CLI Query Suggestion', 'dig ' + val + ' ANY');
            html += renderRow('NSLookup Query Suggestion', 'nslookup -type=any ' + val);
        }

        container.innerHTML = html;
        results.style.display = 'block';
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        results.style.display = 'none';
    });
}
`
    }),
    'og-tag-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                    <label for="og-title">Title</label>
                    <input type="text" id="og-title" class="input-control" value="My Website Homepage">
                </div>
                <div class="form-group">
                    <label for="og-sitename">Site Name</label>
                    <input type="text" id="og-sitename" class="input-control" value="AllInOneTool">
                </div>
                <div class="form-group">
                    <label for="og-url">Page URL</label>
                    <input type="text" id="og-url" class="input-control" value="https://example.com">
                </div>
                <div class="form-group">
                    <label for="og-image">Image URL</label>
                    <input type="text" id="og-image" class="input-control" value="https://example.com/assets/banner.jpg">
                </div>
                <div class="form-group">
                    <label for="og-locale">Locale</label>
                    <input type="text" id="og-locale" class="input-control" value="en_US">
                </div>
                <div class="form-group">
                    <label for="og-type">Type</label>
                    <select id="og-type" class="input-control">
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="book">book</option>
                        <option value="profile">profile</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="margin-top:0.75rem;">
                <label for="og-desc">Description</label>
                <textarea id="og-desc" class="input-control" style="min-height:60px;" placeholder="Describe your website...">AllInOneTool provides free, secure, and client-side conversion utilities directly inside your browser memory.</textarea>
            </div>

            <div style="margin-top:1.5rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-secondary);">
                <div style="padding:0.5rem 1rem; border-bottom:1px solid var(--border-color); font-size:0.8rem; font-weight:700; color:var(--text-secondary);">Social Share Preview Mock</div>
                <div style="display:flex; flex-direction:column;">
                    <div id="mock-og-image-div" style="height:160px; background:#ccc; background-size:cover; background-position:center;"></div>
                    <div style="padding:1rem; background:#fff; color:#000; border-top:1px solid #ddd;">
                        <div id="mock-og-site" style="font-size:0.75rem; color:#606770; text-transform:uppercase; margin-bottom:0.25rem;">allinonetool</div>
                        <strong id="mock-og-title" style="font-size:1rem; display:block; margin-bottom:0.25rem;">My Website Homepage</strong>
                        <span id="mock-og-desc" style="font-size:0.85rem; color:#606770; line-height:1.4; display:block;">AllInOneTool provides free, secure...</span>
                    </div>
                </div>
            </div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label>Generated OG Tags Output</label>
                <textarea readonly id="og-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="og-btn-reset">Reset</button>
                <button class="btn btn-secondary" id="og-btn-copy">Copy Tags</button>
                <button class="btn btn-primary" id="og-btn-download">Download HTML snippet</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const title = document.getElementById('og-title');
    const sitename = document.getElementById('og-sitename');
    const url = document.getElementById('og-url');
    const image = document.getElementById('og-image');
    const locale = document.getElementById('og-locale');
    const type = document.getElementById('og-type');
    const desc = document.getElementById('og-desc');

    const output = document.getElementById('og-output');
    const reset = document.getElementById('og-btn-reset');
    const copy = document.getElementById('og-btn-copy');
    const download = document.getElementById('og-btn-download');

    const mockImage = document.getElementById('mock-og-image-div');
    const mockSite = document.getElementById('mock-og-site');
    const mockTitle = document.getElementById('mock-og-title');
    const mockDesc = document.getElementById('mock-og-desc');

    if (!title) return;

    function render() {
        const t = title.value.trim();
        const s = sitename.value.trim();
        const u = url.value.trim();
        const img = image.value.trim();
        const loc = locale.value.trim();
        const tp = type.value;
        const d = desc.value.trim();

        let tags = '';
        tags += '<meta property="og:title" content="' + escapeHtml(t) + '" />\\n';
        tags += '<meta property="og:site_name" content="' + escapeHtml(s) + '" />\\n';
        tags += '<meta property="og:url" content="' + escapeHtml(u) + '" />\\n';
        tags += '<meta property="og:description" content="' + escapeHtml(d) + '" />\\n';
        if (img) tags += '<meta property="og:image" content="' + escapeHtml(img) + '" />\\n';
        tags += '<meta property="og:locale" content="' + escapeHtml(loc) + '" />\\n';
        tags += '<meta property="og:type" content="' + tp + '" />';

        output.value = tags;

        mockTitle.textContent = t || '(Untitled Page)';
        mockSite.textContent = s || 'example.com';
        mockDesc.textContent = d || '(No description provided)';
        if (img) {
            mockImage.style.backgroundImage = 'url(' + img + ')';
        } else {
            mockImage.style.backgroundImage = 'none';
        }
    }

    function escapeHtml(str) {
        return str.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }

    [title, sitename, url, image, locale, type, desc].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        title.value = 'My Website Homepage';
        sitename.value = 'AllInOneTool';
        url.value = 'https://example.com';
        image.value = 'https://example.com/assets/banner.jpg';
        locale.value = 'en_US';
        type.selectedIndex = 0;
        desc.value = 'AllInOneTool provides free, secure, and client-side conversion utilities directly inside your browser memory.';
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied OG Tags!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'og_tags.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
`
    }),
    'hmac-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="hmac-key">Secret Key (Hex or Text)</label>
                <input type="text" id="hmac-key" class="input-control" placeholder="Enter secret HMAC key...">
            </div>

            <div class="form-group">
                <label for="hmac-message">Message String</label>
                <textarea id="hmac-message" class="input-control" placeholder="Enter message to generate HMAC for..." style="min-height:100px;"></textarea>
            </div>

            <div class="options-grid">
                <div class="form-group">
                    <label for="hmac-algo">HMAC Algorithm</label>
                    <select id="hmac-algo" class="input-control">
                        <option value="MD5">HMAC-MD5</option>
                        <option value="SHA-1">HMAC-SHA1</option>
                        <option value="SHA-256" selected>HMAC-SHA256</option>
                        <option value="SHA-384">HMAC-SHA384</option>
                        <option value="SHA-512">HMAC-SHA512</option>
                    </select>
                </div>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>Generated HMAC Hash:</span>
                    <button class="btn btn-secondary btn-sm" id="hmac-btn-copy">Copy Hash</button>
                </div>
                <div id="hmac-output" style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; word-break:break-all; padding-top:0.5rem; color:var(--primary-color);">-</div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="hmac-btn-reset">Reset</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const keyInput = document.getElementById('hmac-key');
    const messageInput = document.getElementById('hmac-message');
    const algoSel = document.getElementById('hmac-algo');
    const output = document.getElementById('hmac-output');
    const copyBtn = document.getElementById('hmac-btn-copy');
    const resetBtn = document.getElementById('hmac-btn-reset');

    if (!keyInput) return;

    function md5(string) {
        function RotateLeft(lValue, iShiftBits) { return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits)); }
        function AddUnsigned(lX,lY) {
            var lX8,lY8,lX4,lY4;
            lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000);
            return (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF)^lX8^lY8^lX4^lY4;
        }
        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }
        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b,c,d), x), ac));
            return AddUnsigned(RotateLeft(a,s),b);
        }
        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b,c,d), x), ac));
            return AddUnsigned(RotateLeft(a,s),b);
        }
        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b,c,d), x), ac));
            return AddUnsigned(RotateLeft(a,s),b);
        }
        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b,c,d), x), ac));
            return AddUnsigned(RotateLeft(a,s),b);
        }
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lWordArray.length-2] = lMessageLength<<3;
            lWordArray[lWordArray.length-1] = lMessageLength>>>29;
            return lWordArray;
        }
        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        }
        function Utf8Encode(string) {
            string = string.replace(/\\r\\n/g,"\\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478); d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756); c=FF(c,d,a,b,x[k+2], S13,0x242070DB); b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF); d=FF(d,a,b,c,x[k+5], S12,0x4787C62A); c=FF(c,d,a,b,x[k+6], S13,0xA8304613); b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8); d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF); c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1); b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122); d=FF(d,a,b,c,x[k+13],S12,0xFD987193); c=FF(c,d,a,b,x[k+14],S13,0xA679438E); b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562); d=GG(d,a,b,c,x[k+6], S22,0xC040B340); c=GG(c,d,a,b,x[k+11],S23,0x265E5A51); b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D); d=GG(d,a,b,c,x[k+10],S22,0x2441453);  c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681); b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6); d=GG(d,a,b,c,x[k+14],S22,0xC33707D6); c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87); b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905); d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8); c=GG(c,d,a,b,x[k+7], S23,0x676F02D9); b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942); d=HH(d,a,b,c,x[k+8], S32,0x8771F681); c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122); b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44); d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9); c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60); b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6); d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA); c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085); b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039); d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5); c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8); b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244); d=II(d,a,b,c,x[k+7], S42,0x432AFF97); c=II(c,d,a,b,x[k+14],S43,0xAB9423A7); b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3); d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92); c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D); b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F); d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0); c=II(c,d,a,b,x[k+6], S43,0xA3014314); b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82); d=II(d,a,b,c,x[k+11],S42,0xBD3AF235); c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB); b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA); b=AddUnsigned(b,BB); c=AddUnsigned(c,CC); d=AddUnsigned(d,DD);
        }
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
        return temp.toLowerCase();
    }

    function hexToBytes(hex) {
        const bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }
    function stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i) & 0xff);
        }
        return bytes;
    }
    function bytesToString(bytes) {
        let str = '';
        for (let i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return str;
    }
    function hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }

    function hmacMD5(key, message) {
        if (key.length > 64) {
            key = hexToBytes(md5(key));
        } else {
            key = stringToBytes(key);
        }
        const k_ipad = new Uint8Array(64);
        const k_opad = new Uint8Array(64);
        for (let i = 0; i < 64; i++) {
            const byte = i < key.length ? key[i] : 0;
            k_ipad[i] = byte ^ 0x36;
            k_opad[i] = byte ^ 0x5c;
        }
        const inner = md5(bytesToString(k_ipad) + message);
        return md5(bytesToString(k_opad) + hexToString(inner));
    }

    async function computeSubtleHMAC(algo, key, message) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const messageData = encoder.encode(message);
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: { name: algo } },
            false,
            ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
        const hashArray = Array.from(new Uint8Array(signature));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function generate() {
        const key = keyInput.value;
        const msg = messageInput.value;
        const algo = algoSel.value;

        if (!key || !msg) {
            output.textContent = '-';
            return;
        }

        if (algo === 'MD5') {
            output.textContent = hmacMD5(key, msg);
        } else {
            try {
                const subAlgo = algo;
                const res = await computeSubtleHMAC(subAlgo, key, msg);
                output.textContent = res;
            } catch(e) {
                output.textContent = 'Error: ' + e.message;
            }
        }
    }

    [keyInput, messageInput, algoSel].forEach(el => el.addEventListener('input', generate));

    resetBtn.addEventListener('click', () => {
        keyInput.value = '';
        messageInput.value = '';
        output.textContent = '-';
    });

    copyBtn.addEventListener('click', () => {
        if (output.textContent === '-') return;
        navigator.clipboard.writeText(output.textContent).then(() => alert('Copied HMAC hash!'));
    });
}
`
    }),
    'user-agent-parser': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="ua-input">User-Agent String</label>
                <textarea id="ua-input" class="input-control" placeholder="Mozilla/5.0..." style="min-height:100px;"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="ua-btn-parse">Parse User-Agent</button>
                <button class="btn btn-secondary" id="ua-btn-current">Detect My Browser</button>
                <button class="btn btn-secondary" id="ua-btn-reset">Reset</button>
            </div>

            <div id="ua-results" style="display:none; margin-top:1.5rem; background:var(--bg-primary); padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <h3 style="margin-bottom:1rem;">Parsed Info</h3>
                <div id="ua-details-container" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('ua-input');
    const parseBtn = document.getElementById('ua-btn-parse');
    const currentBtn = document.getElementById('ua-btn-current');
    const resetBtn = document.getElementById('ua-btn-reset');
    const results = document.getElementById('ua-results');
    const container = document.getElementById('ua-details-container');

    if (!parseBtn) return;

    function renderRow(label, value) {
        return \`
            <div style="display:grid; grid-template-columns:2fr 4fr; gap:1rem; padding:0.4rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                <strong style="color:var(--text-secondary); text-transform:capitalize;">\${label}</strong>
                <span style="font-family:var(--font-mono); word-break:break-all;">\${value || 'Unknown'}</span>
            </div>
        \`;
    }

    function parse() {
        const ua = input.value.trim();
        if (!ua) return;

        let browser = "Unknown";
        let version = "Unknown";
        let os = "Unknown";
        let osVer = "Unknown";
        let device = "Desktop";
        let engine = "Unknown";
        let platform = "Unknown";

        if (/mobi|android|iphone|ipod/i.test(ua)) {
            device = "Mobile";
        } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
            device = "Tablet";
        }

        if (/windows/i.test(ua)) {
            os = "Windows";
            const match = ua.match(/Windows NT ([\\d.]+)/i);
            osVer = match ? match[1] : "Unknown";
            platform = "Windows";
        } else if (/macintosh|mac os x/i.test(ua)) {
            os = "macOS";
            const match = ua.match(/Mac OS X ([\\d_.]+)/i);
            osVer = match ? match[1].replace(/_/g, '.') : "Unknown";
            platform = "MacIntel";
        } else if (/iphone|ipad|ipod/i.test(ua)) {
            os = "iOS";
            const match = ua.match(/OS ([\\d_.]+)/i);
            osVer = match ? match[1].replace(/_/g, '.') : "Unknown";
            device = /ipad/i.test(ua) ? "Tablet" : "Mobile";
            platform = "Apple Devices";
        } else if (/android/i.test(ua)) {
            os = "Android";
            const match = ua.match(/Android ([\\d.]+)/i);
            osVer = match ? match[1] : "Unknown";
            platform = "Linux";
        } else if (/linux/i.test(ua)) {
            os = "Linux";
            platform = "Linux";
        }

        if (/edg\\/([\\d.]+)/i.test(ua)) {
            browser = "Edge";
            version = ua.match(/edg\\/([\\d.]+)/i)[1];
        } else if (/chrome\\/([\\d.]+)/i.test(ua)) {
            browser = "Chrome";
            version = ua.match(/chrome\\/([\\d.]+)/i)[1];
        } else if (/firefox\\/([\\d.]+)/i.test(ua)) {
            browser = "Firefox";
            version = ua.match(/firefox\\/([\\d.]+)/i)[1];
        } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
            browser = "Safari";
            const match = ua.match(/version\\/([\\d.]+)/i);
            version = match ? match[1] : "Unknown";
        } else if (/trident/i.test(ua)) {
            browser = "Internet Explorer";
            const match = ua.match(/rv:([\\d.]+)/i);
            version = match ? match[1] : "Unknown";
        }

        if (/applewebkit/i.test(ua)) {
            engine = "WebKit";
            if (/chrome|edg/i.test(ua)) {
                engine = "Blink";
            }
        } else if (/gecko/i.test(ua)) {
            engine = "Gecko";
        } else if (/trident/i.test(ua)) {
            engine = "Trident";
        }

        let html = '';
        html += renderRow('Browser', browser);
        html += renderRow('Browser Version', version);
        html += renderRow('Operating System', os);
        html += renderRow('OS Version', osVer);
        html += renderRow('Device Type', device);
        html += renderRow('Rendering Engine', engine);
        html += renderRow('Platform', platform);

        container.innerHTML = html;
        results.style.display = 'block';
    }

    parseBtn.addEventListener('click', parse);

    currentBtn.addEventListener('click', () => {
        input.value = navigator.userAgent;
        parse();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        results.style.display = 'none';
    });
}
`
    }),
    'qr-code-decoder': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="qr-upload-zone" style="border: 2px dashed var(--border-color); border-radius: var(--radius-sm); padding: 2rem; text-align: center; cursor: pointer; background: var(--bg-primary); transition: all 0.3s ease;">
                <p>Drag & Drop QR Code Image or Click to Upload</p>
                <input type="file" id="qr-file" style="display:none;" accept="image/*">
            </div>

            <div id="qr-preview-container" style="display:none; text-align:center; margin-top:1.5rem;">
                <img id="qr-preview" style="max-height: 200px; border:1px solid var(--border-color); border-radius:var(--radius-sm);" />
            </div>

            <div id="qr-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); margin-top:1.5rem; font-size:0.85rem; font-weight:700;"></div>

            <div id="qr-results" style="display:none; margin-top:1.5rem; background:var(--bg-primary); padding:1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <h3 style="margin-bottom:0.75rem;">Decoded Contents</h3>
                <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; word-break:break-all; padding:0.5rem; background:var(--bg-secondary); border-radius:var(--radius-sm); border:1px solid var(--border-color);" id="qr-text"></div>
                
                <div class="action-row" style="margin-top:1rem;">
                    <button class="btn btn-secondary btn-sm" id="qr-btn-copy">Copy Output</button>
                    <a href="#" target="_blank" class="btn btn-primary btn-sm" id="qr-btn-link" style="display:none;">Open Link</a>
                </div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="qr-btn-reset">Reset</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const zone = document.getElementById('qr-upload-zone');
    const fileInput = document.getElementById('qr-file');
    const previewContainer = document.getElementById('qr-preview-container');
    const previewImg = document.getElementById('qr-preview');
    const errorMsg = document.getElementById('qr-error');
    const results = document.getElementById('qr-results');
    const resultText = document.getElementById('qr-text');
    
    const copyBtn = document.getElementById('qr-btn-copy');
    const linkBtn = document.getElementById('qr-btn-link');
    const resetBtn = document.getElementById('qr-btn-reset');

    if (!zone) return;

    zone.addEventListener('click', () => fileInput.click());
    
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--primary-color)';
    });

    zone.addEventListener('dragleave', () => {
        zone.style.borderColor = 'var(--border-color)';
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {
        errorMsg.style.display = 'none';
        results.style.display = 'none';
        linkBtn.style.display = 'none';

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
            
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                try {
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    if (typeof jsQR !== 'undefined') {
                        const code = jsQR(imgData.data, imgData.width, imgData.height);
                        if (code) {
                            resultText.textContent = code.data;
                            results.style.display = 'block';
                            
                            if (code.data.startsWith('http://') || code.data.startsWith('https://')) {
                                linkBtn.href = code.data;
                                linkBtn.style.display = 'inline-block';
                            }
                        } else {
                            errorMsg.textContent = '❌ Could not decode QR code. Make sure the image is clear and contains a valid QR code.';
                            errorMsg.style.display = 'block';
                        }
                    } else {
                        errorMsg.textContent = '❌ jsQR library was not loaded. Please ensure you are online.';
                        errorMsg.style.display = 'block';
                    }
                } catch(err) {
                    errorMsg.textContent = '❌ Error processing image pixels: ' + err.message;
                    errorMsg.style.display = 'block';
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent).then(() => alert('Copied QR output!'));
    });

    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewContainer.style.display = 'none';
        previewImg.src = '';
        errorMsg.style.display = 'none';
        results.style.display = 'none';
        linkBtn.style.display = 'none';
    });
}
`
    }),
    'mac-generator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="options-grid">
                <div class="form-group">
                    <label for="mac-type">MAC Type</label>
                    <select id="mac-type" class="input-control">
                        <option value="random">Random MAC Address</option>
                        <option value="local">Locally Administered</option>
                        <option value="unicast">Unicast MAC Address</option>
                        <option value="multicast">Multicast MAC Address</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mac-sep">Octet Separator</label>
                    <select id="mac-sep" class="input-control">
                        <option value=":">Colon (:)</option>
                        <option value="-">Hyphen (-)</option>
                        <option value=".">Dot (.)</option>
                        <option value="">None</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mac-qty">Quantity (1-100)</label>
                    <input type="number" id="mac-qty" class="input-control" value="5" min="1" max="100">
                </div>
                <div class="form-group">
                    <label for="mac-case">Letter Case</label>
                    <select id="mac-case" class="input-control">
                        <option value="upper">UPPERCASE</option>
                        <option value="lower">lowercase</option>
                    </select>
                </div>
            </div>

            <div class="form-group" style="margin-top:1.5rem;">
                <label>Generated MAC Addresses</label>
                <textarea readonly id="mac-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="mac-btn-gen">Generate Again</button>
                <button class="btn btn-secondary" id="mac-btn-copy">Copy List</button>
                <button class="btn btn-secondary" id="mac-btn-download">Download List</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const typeSel = document.getElementById('mac-type');
    const sepSel = document.getElementById('mac-sep');
    const qtyInput = document.getElementById('mac-qty');
    const caseSel = document.getElementById('mac-case');
    
    const output = document.getElementById('mac-output');
    const genBtn = document.getElementById('mac-btn-gen');
    const copyBtn = document.getElementById('mac-btn-copy');
    const downloadBtn = document.getElementById('mac-btn-download');

    if (!genBtn) return;

    function randByte() {
        return Math.floor(Math.random() * 256);
    }

    function makeMAC() {
        const type = typeSel.value;
        const bytes = new Uint8Array(6);
        for(let i=0; i<6; i++) {
            bytes[i] = randByte();
        }

        if (type === 'multicast') {
            bytes[0] |= 0x01;
        } else if (type === 'unicast') {
            bytes[0] &= 0xFE;
        } else if (type === 'local') {
            const localHexChars = [2, 6, 10, 14];
            const firstNibble = Math.floor(Math.random() * 16);
            const secondNibble = localHexChars[Math.floor(Math.random() * 4)];
            bytes[0] = (firstNibble << 4) | secondNibble;
        }

        let macStr = '';
        const sep = sepSel.value;
        const useUpper = caseSel.value === 'upper';

        for (let i = 0; i < 6; i++) {
            let bStr = bytes[i].toString(16).padStart(2, '0');
            if (useUpper) bStr = bStr.toUpperCase();
            macStr += bStr;
            if (i < 5) macStr += sep;
        }

        return macStr;
    }

    function generate() {
        const qty = parseInt(qtyInput.value) || 5;
        const list = [];
        for (let i = 0; i < qty; i++) {
            list.push(makeMAC());
        }
        output.value = list.join('\\n');
    }

    [typeSel, sepSel, qtyInput, caseSel].forEach(el => el.addEventListener('change', generate));
    genBtn.addEventListener('click', generate);

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied MAC Addresses!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mac_addresses.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    generate();
}
`
    }),
    'html-minifier': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="html-input">HTML Input</label>
                <textarea id="html-input" class="input-control" placeholder="Paste HTML content to minify..." style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem;"></textarea>
            </div>

            <div class="action-row" style="margin-bottom:1.5rem;">
                <button class="btn btn-primary" id="html-minify">Minify HTML</button>
                <button class="btn btn-secondary" id="html-reset">Reset</button>
            </div>

            <div class="form-group">
                <label for="html-output">Result Output</label>
                <textarea id="html-output" readonly class="input-control" style="min-height: 150px; font-family:var(--font-mono); font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row" id="html-action-row" style="display:none;">
                <button class="btn btn-secondary" id="html-copy">Copy Output</button>
                <button class="btn btn-secondary" id="html-download">Download Minified HTML</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const input = document.getElementById('html-input');
    const output = document.getElementById('html-output');
    const minifyBtn = document.getElementById('html-minify');
    const resetBtn = document.getElementById('html-reset');
    const copyBtn = document.getElementById('html-copy');
    const downloadBtn = document.getElementById('html-download');
    const actionRow = document.getElementById('html-action-row');

    if (!minifyBtn) return;

    minifyBtn.addEventListener('click', () => {
        let val = input.value;
        if (!val.trim()) return;

        val = val.replace(/<!--[\\s\\S]*?-->/g, '');

        const placeholders = [];
        const regex = /(<(pre|code|script|style|textarea)[^>]*>[\\s\\S]*?<\\/\\2>)/gi;
        val = val.replace(regex, (match) => {
            placeholders.push(match);
            return '___PLACEHOLDER_' + (placeholders.length - 1) + '___';
        });

        val = val.replace(/\\s+/g, ' ');
        val = val.replace(/>\\s+</g, '><');
        val = val.replace(/\\s+</g, '<');
        val = val.replace(/>\\s+/g, '>');

        val = val.replace(/___PLACEHOLDER_(\\d+)___/g, (match, idx) => {
            return placeholders[parseInt(idx)];
        });

        output.value = val.trim();
        actionRow.style.display = 'flex';
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        actionRow.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied HTML!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minified.html';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`
    })
};
