export function init() {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    const workspace = document.getElementById('compress-workspace');
    const levelSelect = document.getElementById('compress-level');
    const sizeOrig = document.getElementById('c-size-orig');
    const sizeComp = document.getElementById('c-size-comp');
    const savings = document.getElementById('c-savings');
    const percentage = document.getElementById('c-percentage');
    const banner = document.getElementById('c-status-banner');
    const reset = document.getElementById('compress-btn-reset');
    const download = document.getElementById('compress-btn-download');

    if (!input) return;
    let pdfBytes = null;
    let originalSize = 0;
    let compressedBytes = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalSize = file.size;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfBytes = null;
        compressedBytes = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    levelSelect.addEventListener('change', compress);

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        await compress();
    }

    async function compress() {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            // Save doc with structure optimization enabled
            const optimized = await doc.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            compressedBytes = optimized;
            const compSize = optimized.byteLength;

            sizeOrig.textContent = (originalSize / (1024 * 1024)).toFixed(2) + ' MB';
            sizeComp.textContent = (compSize / (1024 * 1024)).toFixed(2) + ' MB';

            if (compSize >= originalSize) {
                savings.textContent = '0 KB';
                percentage.textContent = '0%';
                banner.textContent = 'This PDF cannot be compressed further without affecting quality.';
                banner.style.color = 'var(--warning-color)';
                compressedBytes = pdfBytes; // Fallback to original
            } else {
                const diff = originalSize - compSize;
                const pct = Math.round((diff / originalSize) * 100);
                savings.textContent = (diff / 1024).toFixed(1) + ' KB';
                percentage.textContent = pct + '%';
                banner.textContent = '🎉 PDF successfully optimized and compressed by ' + pct + '%!';
                banner.style.color = 'var(--success-color)';
            }
        } catch (err) {
            console.error(err);
            alert('Failed to optimize PDF document.');
        }
    }

    download.addEventListener('click', () => {
        if (!compressedBytes) return;
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_output.pdf';
        a.click();
        URL.revokeObjectURL(url);
    });
}
