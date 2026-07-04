export function init() {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    const loader = document.getElementById('compress-loader');
    const progressText = document.getElementById('compress-progress-text');
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

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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
        loader.style.display = 'none';
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
        
        workspace.style.display = 'none';
        loader.style.display = 'flex';
        progressText.textContent = 'Optimizing document structure...';

        const level = levelSelect.value;
        try {
            if (level === 'low') {
                const doc = await PDFLib.PDFDocument.load(pdfBytes);
                doc.setTitle('');
                doc.setAuthor('');
                doc.setSubject('');
                doc.setCreator('');
                doc.setProducer('');
                doc.setKeywords([]);

                const optimized = await doc.save({
                    useObjectStreams: true,
                    addDefaultPage: false
                });
                applyCompressionResults(optimized);
            } else {
                const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
                const pdf = await loadingTask.promise;
                const totalPages = pdf.numPages;

                const newDoc = await PDFLib.PDFDocument.create();
                
                const scale = level === 'medium' ? 1.5 : 1.0;
                const quality = level === 'medium' ? 0.75 : 0.50;

                for (let i = 1; i <= totalPages; i++) {
                    progressText.textContent = 'Compressing page ' + i + ' of ' + totalPages + '...';
                    
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: scale });
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
                    const imgBytes = await blob.arrayBuffer();
                    const imgRef = await newDoc.embedJpg(imgBytes);

                    const newPage = newDoc.addPage([viewport.width, viewport.height]);
                    newPage.drawImage(imgRef, {
                        x: 0,
                        y: 0,
                        width: viewport.width,
                        height: viewport.height
                    });
                }

                const compressed = await newDoc.save({ useObjectStreams: true });
                applyCompressionResults(compressed);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to compress PDF: ' + err.message);
            loader.style.display = 'none';
            workspace.style.display = 'flex';
        }
    }

    function applyCompressionResults(optimizedBytes) {
        compressedBytes = optimizedBytes;
        const compSize = optimizedBytes.byteLength;

        sizeOrig.textContent = (originalSize / (1024 * 1024)).toFixed(2) + ' MB';
        sizeComp.textContent = (compSize / (1024 * 1024)).toFixed(2) + ' MB';

        loader.style.display = 'none';
        workspace.style.display = 'flex';

        if (compSize >= originalSize) {
            savings.textContent = '0 KB';
            percentage.textContent = '0%';
            banner.textContent = 'This PDF is already optimized and cannot be compressed further without significant quality loss.';
            banner.style.color = 'var(--warning-color)';
            compressedBytes = pdfBytes;
        } else {
            const diff = originalSize - compSize;
            const pct = Math.round((diff / originalSize) * 100);
            savings.textContent = (diff / 1024).toFixed(1) + ' KB';
            percentage.textContent = pct + '%';
            banner.textContent = '🎉 PDF successfully compressed by ' + pct + '%!';
            banner.style.color = 'var(--success-color)';
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
