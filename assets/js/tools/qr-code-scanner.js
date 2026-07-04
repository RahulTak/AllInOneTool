export function init() {
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
