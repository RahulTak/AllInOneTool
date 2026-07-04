export function init() {
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
        if (type === 'vcard') return 'BEGIN:VCARD\nVERSION:3.0\nN:' + (document.getElementById('qr-vc-name')?.value || '') + '\nTEL:' + (document.getElementById('qr-vc-phone')?.value || '') + '\nEMAIL:' + (document.getElementById('qr-vc-email')?.value || '') + '\nEND:VCARD';
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
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '"><rect width="100%" height="100%" fill="' + bg + '"/><image href="' + dataUrl + '" width="100%" height="100%"/></svg>';
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
