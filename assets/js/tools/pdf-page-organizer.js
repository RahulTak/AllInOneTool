export function init() {
    const dropzone = document.getElementById('po-dropzone');
    const input = document.getElementById('po-input');
    const workspace = document.getElementById('po-workspace');
    const fileName = document.getElementById('po-file-name');
    const list = document.getElementById('po-thumbnails-list');
    const reset = document.getElementById('po-btn-reset');
    const action = document.getElementById('po-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let pagesArr = []; // { originalIdx, currentRot, thumbUrl }

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
        pagesArr = [];
        list.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        const total = pdf.numPages;

        pagesArr = [];
        for (let i = 1; i <= total; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.25 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            pagesArr.push({
                originalIdx: i - 1, // 0-indexed
                currentRot: 0, // rotation offset: 0, 90, 180, 270
                thumbUrl: canvas.toDataURL()
            });
        }

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        renderPages();
    }

    function renderPages() {
        list.innerHTML = '';
        pagesArr.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius-xs)';
            card.style.padding = '0.5rem';
            card.style.background = 'var(--bg-secondary)';
            card.style.textAlign = 'center';
            card.setAttribute('draggable', 'true');

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
            });
            card.addEventListener('dragover', (e) => { e.preventDefault(); });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIdx !== idx) {
                    const temp = pagesArr[fromIdx];
                    pagesArr.splice(fromIdx, 1);
                    pagesArr.splice(idx, 0, temp);
                    renderPages();
                }
            });

            const img = document.createElement('img');
            img.src = item.thumbUrl;
            img.style.maxWidth = '100%';
            img.style.height = '60px';
            img.style.objectFit = 'contain';
            img.style.transform = 'rotate(' + item.currentRot + 'deg)';
            img.style.transition = 'transform 0.2s';
            img.style.display = 'block';
            img.style.margin = '0 auto 0.5rem';

            const label = document.createElement('div');
            label.textContent = 'Page ' + (item.originalIdx + 1);
            label.style.fontSize = '0.75rem';
            label.style.fontWeight = '600';
            label.style.marginBottom = '0.5rem';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.justifyContent = 'center';
            controls.style.gap = '0.2rem';

            const btnRot = document.createElement('button');
            btnRot.className = 'btn';
            btnRot.style.padding = '2px 6px';
            btnRot.style.fontSize = '0.7rem';
            btnRot.textContent = '⟳';
            btnRot.onclick = () => {
                item.currentRot = (item.currentRot + 90) % 360;
                img.style.transform = 'rotate(' + item.currentRot + 'deg)';
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '2px 6px';
            btnDel.style.fontSize = '0.7rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                pagesArr.splice(idx, 1);
                if (pagesArr.length === 0) {
                    reset.click();
                } else {
                    renderPages();
                }
            };

            controls.appendChild(btnRot);
            controls.appendChild(btnDel);

            card.appendChild(img);
            card.appendChild(label);
            card.appendChild(controls);
            list.appendChild(card);
        });
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes || pagesArr.length === 0) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const organizedDoc = await PDFLib.PDFDocument.create();

            for (const item of pagesArr) {
                const copiedPages = await organizedDoc.copyPages(doc, [item.originalIdx]);
                const page = organizedDoc.addPage(copiedPages[0]);
                if (item.currentRot > 0) {
                    const rot = page.getRotation().angle;
                    page.setRotation(PDFLib.degrees(rot + item.currentRot));
                }
            }

            const outBytes = await organizedDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organized_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to save organized PDF: ' + err.message);
        }
    });
}
