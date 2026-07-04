export function init() {
    const dropzone = document.getElementById('merge-dropzone');
    const input = document.getElementById('merge-input');
    const workspace = document.getElementById('merge-workspace');
    const list = document.getElementById('merge-list');
    const reset = document.getElementById('merge-btn-reset');
    const action = document.getElementById('merge-btn-action');

    if (!input) return;
    let pdfFiles = []; // { file, totalPages, sizeStr, thumbUrl }

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(Array.from(e.target.files));
    });

    // Drag-over and drop handlers on workspace
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            process(Array.from(e.dataTransfer.files));
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfFiles = [];
        list.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(files) {
        for (const file of files) {
            if (!file.name.toLowerCase().endsWith('.pdf')) continue;
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const totalPages = pdf.numPages;
                const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

                // Render page 1 thumbnail
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.25 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                const thumbUrl = canvas.toDataURL();

                pdfFiles.push({ file, totalPages, sizeStr, thumbUrl });
            } catch (err) {
                console.error('Failed to parse file: ', file.name, err);
            }
        }

        if (pdfFiles.length > 0) {
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
            renderList();
        }
    }

    function renderList() {
        list.innerHTML = '';
        pdfFiles.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.gap = '1rem';
            card.style.padding = '0.75rem';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius-sm)';
            card.style.background = 'var(--bg-secondary)';
            card.setAttribute('draggable', 'true');

            // Drag and drop event handlers
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
            });
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIdx !== idx) {
                    const temp = pdfFiles[fromIdx];
                    pdfFiles.splice(fromIdx, 1);
                    pdfFiles.splice(idx, 0, temp);
                    renderList();
                }
            });

            const img = document.createElement('img');
            img.src = item.thumbUrl;
            img.style.width = '45px';
            img.style.height = '60px';
            img.style.objectFit = 'contain';
            img.style.border = '1px solid var(--border-color)';
            img.style.borderRadius = 'var(--radius-xs)';
            img.style.background = '#ffffff';

            const details = document.createElement('div');
            details.style.flexGrow = '1';
            details.innerHTML = `<div style="font-weight:600; font-size:0.9rem; margin-bottom:0.25rem;">${item.file.name}</div>
                                 <div style="font-size:0.75rem; color:var(--text-secondary);">Pages: ${item.totalPages} | Size: ${item.sizeStr}</div>`;

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '0.25rem';

            const btnUp = document.createElement('button');
            btnUp.className = 'btn';
            btnUp.style.padding = '4px 8px';
            btnUp.style.fontSize = '0.75rem';
            btnUp.textContent = '▲';
            btnUp.disabled = idx === 0;
            btnUp.onclick = () => {
                const temp = pdfFiles[idx];
                pdfFiles[idx] = pdfFiles[idx - 1];
                pdfFiles[idx - 1] = temp;
                renderList();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '4px 8px';
            btnDown.style.fontSize = '0.75rem';
            btnDown.textContent = '▼';
            btnDown.disabled = idx === pdfFiles.length - 1;
            btnDown.onclick = () => {
                const temp = pdfFiles[idx];
                pdfFiles[idx] = pdfFiles[idx + 1];
                pdfFiles[idx + 1] = temp;
                renderList();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '4px 8px';
            btnDel.style.fontSize = '0.75rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                pdfFiles.splice(idx, 1);
                if (pdfFiles.length === 0) {
                    reset.click();
                } else {
                    renderList();
                }
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnDel);

            card.appendChild(img);
            card.appendChild(details);
            card.appendChild(controls);
            list.appendChild(card);
        });
    }

    action.addEventListener('click', async () => {
        if (pdfFiles.length === 0) return;
        try {
            const mergedDoc = await PDFLib.PDFDocument.create();
            for (const item of pdfFiles) {
                const bytes = await item.file.arrayBuffer();
                const doc = await PDFLib.PDFDocument.load(bytes);
                const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
                copiedPages.forEach(p => mergedDoc.addPage(p));
            }

            const pdfBytes = await mergedDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to merge documents: ' + err.message);
        }
    });
}
