export function init() {
    const dropzone = document.getElementById('pr-dropzone');
    const input = document.getElementById('pr-input');
    const workspace = document.getElementById('pr-workspace');
    const sidebar = document.getElementById('pr-sidebar');
    const canvas = document.getElementById('pr-render-canvas');
    const prevBtn = document.getElementById('pr-btn-prev');
    const nextBtn = document.getElementById('pr-btn-next');
    const pageNumText = document.getElementById('pr-page-num');
    const pageCountText = document.getElementById('pr-page-count');
    const zoomInBtn = document.getElementById('pr-btn-zoomin');
    const zoomOutBtn = document.getElementById('pr-btn-zoomout');
    const fitBtn = document.getElementById('pr-btn-fit');
    const printBtn = document.getElementById('pr-btn-print');
    const reset = document.getElementById('pr-btn-reset');

    if (!input) return;
    let pdfDoc = null;
    let totalPages = 0;
    let activePage = 1;
    let zoomScale = 1.0;
    let fileUrl = null;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileUrl = URL.createObjectURL(file);
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfDoc = null;
        sidebar.innerHTML = '';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            fileUrl = null;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (activePage > 1) {
            activePage--;
            renderActivePage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (activePage < totalPages) {
            activePage++;
            renderActivePage();
        }
    });

    zoomInBtn.addEventListener('click', () => {
        zoomScale += 0.25;
        renderActivePage();
    });

    zoomOutBtn.addEventListener('click', () => {
        if (zoomScale > 0.5) {
            zoomScale -= 0.25;
            renderActivePage();
        }
    });

    fitBtn.addEventListener('click', () => {
        zoomScale = 1.0;
        renderActivePage();
    });

    printBtn.addEventListener('click', () => {
        if (fileUrl) {
            const w = window.open(fileUrl);
            w.print();
        }
    });

    async function process(file) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        pageCountText.textContent = totalPages;
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';

        activePage = 1;
        zoomScale = 1.0;

        await renderSidebarThumbs();
        renderActivePage();
    }

    async function renderSidebarThumbs() {
        sidebar.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.15 });
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = viewport.width;
            tempCanvas.height = viewport.height;
            const ctx = tempCanvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const thumbBox = document.createElement('div');
            thumbBox.style.padding = '4px';
            thumbBox.style.border = '2px solid transparent';
            thumbBox.style.borderRadius = 'var(--radius-xs)';
            thumbBox.style.cursor = 'pointer';
            thumbBox.style.textAlign = 'center';
            thumbBox.id = 'thumb-page-' + i;

            if (i === activePage) {
                thumbBox.style.borderColor = '#2563eb';
            }

            thumbBox.onclick = () => {
                activePage = i;
                renderActivePage();
            };

            const img = document.createElement('img');
            img.src = tempCanvas.toDataURL();
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70px';
            img.style.border = '1px solid var(--border-color)';

            const label = document.createElement('div');
            label.textContent = i;
            label.style.fontSize = '0.7rem';
            label.style.color = 'var(--text-secondary)';

            thumbBox.appendChild(img);
            thumbBox.appendChild(label);
            sidebar.appendChild(thumbBox);
        }
    }

    async function renderActivePage() {
        if (!pdfDoc) return;
        pageNumText.textContent = activePage;

        // Highlight active thumbnail
        for (let i = 1; i <= totalPages; i++) {
            const el = document.getElementById('thumb-page-' + i);
            if (el) {
                el.style.borderColor = i === activePage ? '#2563eb' : 'transparent';
            }
        }

        const page = await pdfDoc.getPage(activePage);
        const viewport = page.getViewport({ scale: zoomScale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        await page.render(renderContext).promise;
    }
}
