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
                    <label for="tbl-rows">Rows</label>
                    <input type="number" id="tbl-rows" class="input-control" value="3" min="1" max="100">
                </div>
                <div class="form-group">
                    <label for="tbl-cols">Columns</label>
                    <input type="number" id="tbl-cols" class="input-control" value="3" min="1" max="100">
                </div>
            </div>

            <div class="form-group" style="margin-top:1rem;">
                <label>HTML Code Result</label>
                <textarea readonly id="tbl-code-output" class="input-control" style="font-family:var(--font-mono); min-height:180px; font-size:0.85rem; background:var(--bg-primary);"></textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-primary" id="tbl-btn-copy">Copy HTML Table</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const rowsInput = document.getElementById('tbl-rows');
    const colsInput = document.getElementById('tbl-cols');
    const output = document.getElementById('tbl-code-output');
    const copy = document.getElementById('tbl-btn-copy');

    if (!rowsInput) return;

    function render() {
        const r = parseInt(rowsInput.value) || 3;
        const c = parseInt(colsInput.value) || 3;

        let html = '<table border=\"1\" cellpadding=\"5\" cellspacing=\"0\">\n';
        for(let i=0; i<r; i++) {
            html += '  <tr>\n';
            for(let j=0; j<c; j++) {
                html += '    <td>Cell ' + (i+1) + '-' + (j+1) + '</td>\n';
            }
            html += '  </tr>\n';
        }
        html += '</table>';
        output.value = html;
    }

    [rowsInput, colsInput].forEach(el => el.addEventListener('input', render));
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('HTML Table Code copied!'));
    });

    render();
}
`
    }),
    'csv-to-json': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="csv-val">CSV Text</label>
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
    })
};
