export function init() {
    const dropzone = document.getElementById('num-dropzone');
    const input = document.getElementById('num-input');
    const workspace = document.getElementById('num-workspace');
    const fileName = document.getElementById('num-file-name');
    const startInput = document.getElementById('num-start');
    const posSelect = document.getElementById('num-pos');
    const sizeSelect = document.getElementById('num-size');
    const colorInput = document.getElementById('num-color');
    const reset = document.getElementById('num-btn-reset');
    const action = document.getElementById('num-btn-action');

    if (!input) return;
    let pdfBytes = null;

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

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = doc.getPages();
            const startNum = parseInt(startInput.value) || 1;
            const size = parseInt(sizeSelect.value) || 12;
            const pos = posSelect.value;

            pages.forEach((page, idx) => {
                const { width, height } = page.getSize();
                const numText = String(startNum + idx);

                let x = width / 2;
                let y = 30;

                if (pos === 'bottom-left') { x = 40; }
                else if (pos === 'bottom-right') { x = width - 60; }
                else if (pos === 'top-center') { y = height - 40; }
                else if (pos === 'top-right') { x = width - 60; y = height - 40; }

                const hexColor = colorInput.value;
                const r = parseInt(hexColor.slice(1,3), 16) / 255;
                const g = parseInt(hexColor.slice(3,5), 16) / 255;
                const b = parseInt(hexColor.slice(5,7), 16) / 255;

                page.drawText(numText, {
                    x,
                    y,
                    size,
                    color: PDFLib.rgb(r, g, b)
                });
            });

            const numbered = await doc.save();
            const blob = new Blob([numbered], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'numbered_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to stamp page numbers onto PDF.');
        }
    });
}
