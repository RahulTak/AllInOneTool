export function init() {
    const dropzone = document.getElementById('jpg-dropzone');
    const input = document.getElementById('jpg-input');
    const workspace = document.getElementById('jpg-workspace');
    const list = document.getElementById('jpg-list');
    const pageSizeSelect = document.getElementById('jpg-pdf-size');
    const pageOrientSelect = document.getElementById('jpg-pdf-orient');
    const pageMarginSelect = document.getElementById('jpg-pdf-margin');
    const reset = document.getElementById('jpg-btn-reset');
    const action = document.getElementById('jpg-btn-action');

    if (!input) return;
    let imageFiles = []; // { file, dataUrl }

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(Array.from(e.target.files));
    });

    reset.addEventListener('click', () => {
        input.value = '';
        imageFiles = [];
        list.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function process(files) {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageFiles.push({ file, dataUrl: event.target.result });
                renderList();
            };
            reader.readAsDataURL(file);
        });
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    function renderList() {
        list.innerHTML = '';
        imageFiles.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.gap = '1rem';
            card.style.padding = '0.5rem';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius-sm)';
            card.style.background = 'var(--bg-secondary)';
            card.setAttribute('draggable', 'true');

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
            });
            card.addEventListener('dragover', (e) => { e.preventDefault(); });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIdx !== idx) {
                    const temp = imageFiles[fromIdx];
                    imageFiles.splice(fromIdx, 1);
                    imageFiles.splice(idx, 0, temp);
                    renderList();
                }
            });

            const img = document.createElement('img');
            img.src = item.dataUrl;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'contain';
            img.style.border = '1px solid var(--border-color)';
            img.style.borderRadius = 'var(--radius-xs)';

            const title = document.createElement('span');
            title.textContent = item.file.name;
            title.style.fontSize = '0.85rem';
            title.style.flexGrow = '1';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '0.25rem';

            const btnUp = document.createElement('button');
            btnUp.className = 'btn';
            btnUp.style.padding = '2px 8px';
            btnUp.style.fontSize = '0.75rem';
            btnUp.textContent = '▲';
            btnUp.disabled = idx === 0;
            btnUp.onclick = () => {
                const temp = imageFiles[idx];
                imageFiles[idx] = imageFiles[idx - 1];
                imageFiles[idx - 1] = temp;
                renderList();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '2px 8px';
            btnDown.style.fontSize = '0.75rem';
            btnDown.textContent = '▼';
            btnDown.disabled = idx === imageFiles.length - 1;
            btnDown.onclick = () => {
                const temp = imageFiles[idx];
                imageFiles[idx] = imageFiles[idx + 1];
                imageFiles[idx + 1] = temp;
                renderList();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '2px 8px';
            btnDel.style.fontSize = '0.75rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                imageFiles.splice(idx, 1);
                if (imageFiles.length === 0) {
                    reset.click();
                } else {
                    renderList();
                }
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnDel);

            row = card;
            row.appendChild(img);
            row.appendChild(title);
            row.appendChild(controls);
            list.appendChild(row);
        });
    }

    action.addEventListener('click', async () => {
        if (imageFiles.length === 0) return;
        try {
            const pdfDoc = await PDFLib.PDFDocument.create();
            const isPortrait = pageOrientSelect.value === 'portrait';
            const pageW = pageSizeSelect.value === 'A4' ? 595 : 612;
            const pageH = pageSizeSelect.value === 'A4' ? 842 : 792;

            const docWidth = isPortrait ? pageW : pageH;
            const docHeight = isPortrait ? pageH : pageW;

            let margin = 0;
            if (pageMarginSelect.value === 'small') margin = 20;
            else if (pageMarginSelect.value === 'large') margin = 40;

            for (const item of imageFiles) {
                const page = pdfDoc.addPage([docWidth, docHeight]);
                const arrayBuffer = await item.file.arrayBuffer();
                
                let imgRef;
                if (item.file.name.toLowerCase().endsWith('.png')) {
                    imgRef = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    imgRef = await pdfDoc.embedJpg(arrayBuffer);
                }

                const fitWidth = docWidth - (margin * 2);
                const fitHeight = docHeight - (margin * 2);

                page.drawImage(imgRef, {
                    x: margin,
                    y: margin,
                    width: fitWidth,
                    height: fitHeight
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'images_converted.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to generate PDF: ' + err.message);
        }
    });
}
