export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const pdfPageCount = document.getElementById('pdf-page-count');
    const qualitySelect = document.getElementById('pdf-quality');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const outputSection = document.getElementById('jpg-output-section');
    const imagesGrid = document.getElementById('jpg-images-grid');
    const downloadAllZipBtn = document.getElementById('download-all-zip');

    let pdfBytes = null;
    let pdfDoc = null;
    let convertedImages = [];

    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

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
        pdfDoc = null;
        convertedImages = [];
        fileInput.value = '';
        imagesGrid.innerHTML = '';
        outputSection.style.display = 'none';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    async function loadPdf(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        pdfName.textContent = file.name;

        try {
            pdfBytes = await file.arrayBuffer();
            pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
            pdfPageCount.textContent = 'Total Pages: ' + pdfDoc.numPages;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to load PDF. File may be corrupted.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfDoc) return;
        imagesGrid.innerHTML = '';
        convertedImages = [];
        outputSection.style.display = 'none';

        const scale = parseFloat(qualitySelect.value) || 1.5;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            await page.render({ canvasContext: ctx, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            convertedImages.push({ name: 'page_' + i + '.jpg', dataUrl });

            const card = document.createElement('div');
            card.className = 'tool-card';
            card.style.background = 'var(--bg-primary)';
            card.style.padding = '0.5rem';
            card.innerHTML = '<img src="' + dataUrl + '" style="width:100%; height:120px; object-fit:contain; border-radius:var(--radius-xs); border:1px solid var(--border-color);">' +
                '<p style="font-size:0.8rem; font-weight:700; margin-top:0.5rem; text-align:center;">Page ' + i + '</p>' +
                '<a class="btn btn-secondary" href="' + dataUrl + '" download="page_' + i + '.jpg" style="font-size:0.75rem; padding:0.25rem 0.5rem; margin-top:0.25rem; display:block; text-align:center;">Download</a>';
            imagesGrid.appendChild(card);
        }

        outputSection.style.display = 'flex';
    });

    downloadAllZipBtn.addEventListener('click', async () => {
        if (convertedImages.length === 0) return;
        const zip = new JSZip();
        for (let img of convertedImages) {
            const base64Data = img.dataUrl.split(',')[1];
            zip.file(img.name, base64Data, { base64: true });
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pdf_converted_images.zip';
        a.click();
        URL.revokeObjectURL(url);
    });
}
