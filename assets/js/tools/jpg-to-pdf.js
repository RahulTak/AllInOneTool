export function init() {
    const uploadZone = document.getElementById('jpg-upload-zone');
    const fileInput = document.getElementById('jpg-file-input');
    const workspace = document.getElementById('jpg-workspace');
    const listContainer = document.getElementById('image-list-container');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-jpg');
    const pageSizeSelect = document.getElementById('page-size');
    const orientationSelect = document.getElementById('page-orientation');
    const marginSelect = document.getElementById('page-margins');

    let uploadedFiles = [];

    if (!fileInput) return;

    fileInput.addEventListener('change', handleFiles);

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
            handleFiles({ target: { files } });
        }
    });

    resetBtn.addEventListener('click', resetWorkspace);

    function resetWorkspace() {
        uploadedFiles = [];
        fileInput.value = '';
        listContainer.innerHTML = '';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    }

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                uploadedFiles.push({
                    file,
                    rotation: 0
                });
            }
        });

        renderList();
        uploadZone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    function renderList() {
        listContainer.innerHTML = '';
        uploadedFiles.forEach((item, index) => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.padding = '0.75rem 1rem';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-sm)';
            row.style.background = 'var(--bg-primary)';
            
            row.innerHTML = '<div style="display:flex; align-items:center; gap:1rem;">' +
                '<span style="font-weight:700; color:var(--text-tertiary);">' + (index+1) + '</span>' +
                '<span style="font-weight:500; font-size:0.9rem;">' + item.file.name + '</span>' +
                '<span style="font-size:0.75rem; color:var(--text-tertiary);">(' + Math.round(item.file.size/1024) + ' KB)</span>' +
                '<button class="btn btn-secondary btn-icon rotate-btn" style="padding:0.25rem; font-size:0.8rem;" data-idx="' + index + '">Rotate 🔄 (' + item.rotation + '°)</button>' +
                '</div>' +
                '<div style="display:flex; gap:0.25rem;">' +
                '<button class="btn btn-secondary btn-icon move-up" data-idx="' + index + '">▲</button>' +
                '<button class="btn btn-secondary btn-icon move-down" data-idx="' + index + '">▼</button>' +
                '<button class="btn btn-secondary btn-icon delete-btn" data-idx="' + index + '" style="color:var(--error-color);">×</button>' +
                '</div>';
            listContainer.appendChild(row);
        });

        listContainer.querySelectorAll('.move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (idx > 0) {
                    const temp = uploadedFiles[idx];
                    uploadedFiles[idx] = uploadedFiles[idx-1];
                    uploadedFiles[idx-1] = temp;
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                if (idx < uploadedFiles.length - 1) {
                    const temp = uploadedFiles[idx];
                    uploadedFiles[idx] = uploadedFiles[idx+1];
                    uploadedFiles[idx+1] = temp;
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                uploadedFiles.splice(idx, 1);
                if (uploadedFiles.length === 0) {
                    resetWorkspace();
                } else {
                    renderList();
                }
            });
        });

        listContainer.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                uploadedFiles[idx].rotation = (uploadedFiles[idx].rotation + 90) % 360;
                renderList();
            });
        });
    }

    processBtn.addEventListener('click', async () => {
        if (uploadedFiles.length === 0) return;

        try {
            const pdfDoc = await PDFLib.PDFDocument.create();

            const pSize = pageSizeSelect.value;
            const pOrient = orientationSelect.value;
            const pMargin = parseInt(marginSelect.value) || 0;

            for (let item of uploadedFiles) {
                const imgBytes = await item.file.arrayBuffer();
                let img = null;
                if (item.file.type === 'image/png') {
                    img = await pdfDoc.embedPng(imgBytes);
                } else {
                    img = await pdfDoc.embedJpg(imgBytes);
                }

                let pageW = 595.28, pageH = 841.89;
                if (pSize === 'Letter') { pageW = 612; pageH = 792; }
                else if (pSize === 'Legal') { pageW = 612; pageH = 1008; }
                else if (pSize === 'Auto') { pageW = img.width + pMargin * 2; pageH = img.height + pMargin * 2; }

                if (pOrient === 'landscape' && pSize !== 'Auto') {
                    const t = pageW; pageW = pageH; pageH = t;
                }

                const page = pdfDoc.addPage([pageW, pageH]);
                const printableW = pageW - pMargin * 2;
                const printableH = pageH - pMargin * 2;

                let imgW = img.width, imgH = img.height;
                const scale = Math.min(printableW / imgW, printableH / imgH);
                imgW = imgW * scale;
                imgH = imgH * scale;

                const drawX = pMargin + (printableW - imgW) / 2;
                const drawY = pMargin + (printableH - imgH) / 2;

                page.drawImage(img, {
                    x: drawX,
                    y: drawY,
                    width: imgW,
                    height: imgH
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
        } catch (e) {
            alert('Failed to generate PDF: ' + e.message);
        }
    });
}
