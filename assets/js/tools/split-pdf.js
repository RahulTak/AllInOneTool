export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const pdfName = document.getElementById('pdf-name');
    const pdfPageCount = document.getElementById('pdf-page-count');
    const splitMode = document.getElementById('split-mode');
    const rangeGroup = document.getElementById('split-range-input-group');
    const rangeVal = document.getElementById('split-range-val');
    const processBtn = document.getElementById('process-pdf-btn');
    const removeBtn = document.getElementById('remove-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');

    let pdfBytes = null;
    let selectedFile = null;
    let totalPages = 0;

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

    splitMode.addEventListener('change', () => {
        if (splitMode.value === 'every') {
            rangeGroup.style.display = 'none';
        } else {
            rangeGroup.style.display = 'block';
            if (splitMode.value === 'extract') {
                rangeVal.placeholder = 'e.g. 1,3,5 or 2-4';
                rangeVal.value = '1,3';
            } else {
                rangeVal.placeholder = 'e.g. 1-3, 4-6';
                rangeVal.value = '1-3, 4-6';
            }
        }
    });

    removeBtn.addEventListener('click', resetWorkspace);
    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        pdfBytes = null;
        selectedFile = null;
        fileInput.value = '';
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

        try {
            pdfBytes = await file.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            totalPages = doc.getPageCount();
            pdfPageCount.textContent = 'Total Pages: ' + totalPages;
            uploadZone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (e) {
            alert('Failed to parse PDF. The file may be corrupted or password-protected.');
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!pdfBytes) return;

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const mode = splitMode.value;

            if (mode === 'every') {
                const zip = new JSZip();
                for (let i = 0; i < totalPages; i++) {
                    const subDoc = await PDFLib.PDFDocument.create();
                    const [page] = await subDoc.copyPages(doc, [i]);
                    subDoc.addPage(page);
                    const bytes = await subDoc.save();
                    zip.file('page_' + (i + 1) + '.pdf', bytes);
                }
                const content = await zip.generateAsync({ type: 'blob' });
                downloadBlob(content, 'split_pages.zip');
            } else if (mode === 'extract') {
                const indices = parseIndices(rangeVal.value);
                if (indices.length === 0) {
                    alert('Invalid page ranges specified.');
                    return;
                }
                const subDoc = await PDFLib.PDFDocument.create();
                const pages = await subDoc.copyPages(doc, indices);
                pages.forEach(p => subDoc.addPage(p));
                const bytes = await subDoc.save();
                downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'extracted_pages.pdf');
            } else {
                const ranges = rangeVal.value.split(',');
                const zip = new JSZip();
                for (let r of ranges) {
                    const indices = parseIndices(r.trim());
                    if (indices.length > 0) {
                        const subDoc = await PDFLib.PDFDocument.create();
                        const pages = await subDoc.copyPages(doc, indices);
                        pages.forEach(p => subDoc.addPage(p));
                        const bytes = await subDoc.save();
                        zip.file('split_' + r.trim() + '.pdf', bytes);
                    }
                }
                const content = await zip.generateAsync({ type: 'blob' });
                downloadBlob(content, 'split_ranges.zip');
            }
        } catch (err) {
            alert('Processing error: ' + err.message);
        }
    });

    function parseIndices(str) {
        const indices = [];
        const parts = str.split(/[,;]+/);
        for (let p of parts) {
            if (p.includes('-')) {
                const [start, end] = p.split('-').map(x => parseInt(x.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) indices.push(i - 1);
                    }
                }
            } else {
                const val = parseInt(p.trim());
                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    indices.push(val - 1);
                }
            }
        }
        return [...new Set(indices)];
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}
