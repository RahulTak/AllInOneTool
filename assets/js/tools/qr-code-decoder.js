export function init() {
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
