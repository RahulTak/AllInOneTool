export function init() {
    const dropzone = document.getElementById('pdf-dropzone');
    const input = document.getElementById('pdf-input');
    const workspace = document.getElementById('pdf-workspace');
    const filesCount = document.getElementById('pdf-files-count');
    const reset = document.getElementById('pdf-btn-reset');
    const convert = document.getElementById('pdf-btn-convert');

    if (!input) return;
    let filesArr = [];

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            filesArr = Array.from(e.target.files);
            filesCount.textContent = filesArr.length;
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        filesArr = [];
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', async () => {
        if (filesArr.length === 0) return;
        if (typeof PDFLib !== 'undefined') {
            const pdfDoc = await PDFLib.PDFDocument.create();
            for(let i=0; i<filesArr.length; i++) {
                const page = pdfDoc.addPage([595, 842]);
                const file = filesArr[i];
                const arrayBuffer = await file.arrayBuffer();
                const pngImage = await pdfDoc.embedPng(arrayBuffer);
                page.drawImage(pngImage, {
                    x: 50,
                    y: 100,
                    width: 495,
                    height: 642
                });
            }
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'png_converted.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('PDF compiler libraries are loading. Please try again.');
        }
    });
}
