export function init() {
    const dropzone = document.getElementById('pdf-dropzone');
    const input = document.getElementById('pdf-input');
    const workspace = document.getElementById('pdf-workspace');
    const thumbsList = document.getElementById('pdf-thumbnails-list');
    const pageSizeSelect = document.getElementById('pdf-page-size');
    const pageOrientSelect = document.getElementById('pdf-page-orient');
    const reset = document.getElementById('pdf-btn-reset');
    const convert = document.getElementById('pdf-btn-convert');

    if (!input) return;
    let imagesArr = []; // Array of { file, dataUrl }

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagesArr.push({ file, dataUrl: event.target.result });
                    renderThumbs();
                };
                reader.readAsDataURL(file);
            });
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        imagesArr = [];
        thumbsList.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function renderThumbs() {
        thumbsList.innerHTML = '';
        imagesArr.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '1rem';
            row.style.padding = '0.5rem';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-xs)';
            row.style.background = 'var(--bg-secondary)';

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
                const temp = imagesArr[idx];
                imagesArr[idx] = imagesArr[idx - 1];
                imagesArr[idx - 1] = temp;
                renderThumbs();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '2px 8px';
            btnDown.style.fontSize = '0.75rem';
            btnDown.textContent = '▼';
            btnDown.disabled = idx === imagesArr.length - 1;
            btnDown.onclick = () => {
                const temp = imagesArr[idx];
                imagesArr[idx] = imagesArr[idx + 1];
                imagesArr[idx + 1] = temp;
                renderThumbs();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '2px 8px';
            btnDel.style.fontSize = '0.75rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                imagesArr.splice(idx, 1);
                if (imagesArr.length === 0) {
                    reset.click();
                } else {
                    renderThumbs();
                }
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnDel);

            row.appendChild(img);
            row.appendChild(title);
            row.appendChild(controls);
            thumbsList.appendChild(row);
        });
    }

    convert.addEventListener('click', async () => {
        if (imagesArr.length === 0) return;
        if (typeof PDFLib !== 'undefined') {
            const pdfDoc = await PDFLib.PDFDocument.create();

            const isPortrait = pageOrientSelect.value === 'portrait';
            const pageW = pageSizeSelect.value === 'A4' ? 595 : 612;
            const pageH = pageSizeSelect.value === 'A4' ? 842 : 792;
            
            const docWidth = isPortrait ? pageW : pageH;
            const docHeight = isPortrait ? pageH : pageW;

            for(let i=0; i<imagesArr.length; i++) {
                const page = pdfDoc.addPage([docWidth, docHeight]);
                const item = imagesArr[i];
                const arrayBuffer = await item.file.arrayBuffer();
                const pngImage = await pdfDoc.embedPng(arrayBuffer);
                
                const margin = 20;
                const fitWidth = docWidth - (margin * 2);
                const fitHeight = docHeight - (margin * 2);

                page.drawImage(pngImage, {
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
            a.download = 'png_images.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('PDF library dependencies are loading. Please try again.');
        }
    });
}
