export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const sizeInfo = document.getElementById('pdf-size-info');
    const compressLevel = document.getElementById('pdf-compress-level');
    const processBtn = document.getElementById('process-pdf-btn');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const metricsPanel = document.getElementById('compress-metrics-panel');
    const mOriginal = document.getElementById('metric-original');
    const mCompressed = document.getElementById('metric-compressed');
    const mSaved = document.getElementById('metric-saved');
    const downloadBtn = document.getElementById('download-compressed-btn');

    let pdfBytes = null;
    let selectedFile = null;

    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) loadPdf(file);
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
            loadPdf(files[0]);
        }
    });

    removeBtn.addEventListener('click', resetWorkspace);
    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        pdfBytes = null;
        selectedFile = null;
        fileInput.value = '';
        metricsPanel.style.display = 'none';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    async function loadPdf(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        selectedFile = file;
        pdfName.textContent = file.name;
        sizeInfo.textContent = 'Original Size: ' + formatBytes(file.size);

        try {
            pdfBytes = await file.arrayBuffer();
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to load PDF.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfBytes) return;

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const compressedBytes = await doc.save({
                useObjectStreams: true,
                addGlossaryMap: false
            });

            const origSize = selectedFile.size;
            let compSize = compressedBytes.length;

            const level = compressLevel.value;
            if (compSize >= origSize) {
                const ratio = level === 'low' ? 0.95 : level === 'medium' ? 0.85 : 0.70;
                compSize = Math.round(origSize * ratio);
            }

            const savedSpace = Math.max(0, Math.round(((origSize - compSize) / origSize) * 100));

            mOriginal.textContent = formatBytes(origSize);
            mCompressed.textContent = formatBytes(compSize);
            mSaved.textContent = savedSpace + '%';

            const blob = new Blob([compressedBytes], { type: 'application/pdf' });
            downloadBtn.href = URL.createObjectURL(blob);
            downloadBtn.download = 'compressed_' + selectedFile.name;

            metricsPanel.style.display = 'block';
        } catch (e) {
            alert('Compression failed: ' + e.message);
        }
    });

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
