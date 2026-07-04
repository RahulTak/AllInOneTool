export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const fileName = document.getElementById('crop-file-name');
    const canvas = document.getElementById('crop-preview-canvas');
    const wrapper = document.getElementById('crop-canvas-wrapper');
    const overlay = document.getElementById('crop-overlay-box');
    const scopeSelect = document.getElementById('crop-scope');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let naturalWidth = 0;
    let naturalHeight = 0;

    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfBytes = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    // Simple Drag overlay
    overlay.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(overlay.style.left) || 15;
        startTop = parseFloat(overlay.style.top) || 15;
    }

    function drag(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const containerRect = wrapper.getBoundingClientRect();
        
        let leftPercent = startLeft + (dx / containerRect.width) * 100;
        let topPercent = startTop + (dy / containerRect.height) * 100;

        leftPercent = Math.max(0, Math.min(leftPercent, 100 - parseFloat(overlay.style.width)));
        topPercent = Math.max(0, Math.min(topPercent, 100 - parseFloat(overlay.style.height)));

        overlay.style.left = leftPercent.toFixed(1) + '%';
        overlay.style.top = topPercent.toFixed(1) + '%';
    }

    function stopDrag() {
        isDragging = false;
    }

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.6 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        naturalWidth = viewport.width;
        naturalHeight = viewport.height;

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = doc.getPages();

            const leftPct = parseFloat(overlay.style.left) / 100;
            const topPct = parseFloat(overlay.style.top) / 100;
            const widthPct = parseFloat(overlay.style.width) / 100;
            const heightPct = parseFloat(overlay.style.height) / 100;

            const scope = scopeSelect.value;
            const limit = scope === 'current' ? 1 : pages.length;

            for (let i = 0; i < limit; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();

                // Compute cropbox bounds
                const x = width * leftPct;
                const y = height * (1 - topPct - heightPct); // PDF coordinates (bottom-left = 0,0)
                const w = width * widthPct;
                const h = height * heightPct;

                page.setCropBox(x, y, w, h);
            }

            const croppedBytes = await doc.save();
            const blob = new Blob([croppedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropped_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to crop PDF document.');
        }
    });
}
