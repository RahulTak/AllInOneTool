export function init() {
    const dropzone = document.getElementById('pe-dropzone');
    const input = document.getElementById('pe-input');
    const workspace = document.getElementById('pe-workspace');
    const fileName = document.getElementById('pe-file-name');
    const grid = document.getElementById('pe-thumbnails-grid');
    const reset = document.getElementById('pe-btn-reset');
    const action = document.getElementById('pe-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let pagesCount = 0;

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
        grid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        pagesCount = pdf.numPages;

        grid.innerHTML = '';
        for (let i = 1; i <= pagesCount; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const cell = document.createElement('div');
            cell.style.textAlign = 'center';
            cell.style.border = '1px solid var(--border-color)';
            cell.style.borderRadius = 'var(--radius-xs)';
            cell.style.padding = '0.5rem';
            cell.style.background = 'var(--bg-secondary)';

            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.style.maxWidth = '100%';
            img.style.height = '65px';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            img.style.margin = '0 auto 0.5rem';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i - 1; // 0-indexed page reference
            checkbox.id = 'page-check-' + i;

            const label = document.createElement('label');
            label.htmlFor = 'page-check-' + i;
            label.textContent = ' Page ' + i;
            label.style.fontSize = '0.75rem';
            label.style.cursor = 'pointer';

            cell.appendChild(img);
            cell.appendChild(checkbox);
            cell.appendChild(label);
            grid.appendChild(cell);
        }

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        const checkedIndices = [];
        grid.querySelectorAll('input[type="checkbox"]').forEach(box => {
            if (box.checked) {
                checkedIndices.push(parseInt(box.value));
            }
        });

        if (checkedIndices.length === 0) {
            alert('Please check at least one page to extract.');
            return;
        }

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const extractedDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await extractedDoc.copyPages(doc, checkedIndices);
            copiedPages.forEach(p => extractedDoc.addPage(p));

            const outBytes = await extractedDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted_pages.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to extract pages: ' + err.message);
        }
    });
}
