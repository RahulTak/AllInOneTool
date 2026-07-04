export function init() {
    const uploadZone = document.getElementById('pdf-upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
    const workspace = document.getElementById('pdf-workspace');
    const fileList = document.getElementById('pdf-file-list');
    const processBtn = document.getElementById('process-pdf-btn');
    const resetBtn = document.getElementById('reset-pdf');
    const rotateAngle = document.getElementById('pdf-rotate-angle');

    let selectedFiles = [];
    const path = window.location.pathname;

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
            fileInput.files = files;
            handleFiles({ target: { files } });
        }
    });

    resetBtn.addEventListener('click', () => {
        selectedFiles = [];
        fileInput.value = '';
        workspace.style.display = 'none';
        uploadZone.style.display = 'flex';
    });

    processBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        try {
            if (typeof PDFLib === 'undefined') {
                alert('Loading PDF engine... Please try again in a second.');
                return;
            }

            let pdfDoc = await PDFLib.PDFDocument.create();

            if (path.includes('merge-pdf')) {
                for (const file of selectedFiles) {
                    const bytes = await file.arrayBuffer();
                    const doc = await PDFLib.PDFDocument.load(bytes);
                    const copiedPages = await pdfDoc.copyPages(doc, doc.getPageIndices());
                    copiedPages.forEach(p => pdfDoc.addPage(p));
                }
            } else {
                const bytes = await selectedFiles[0].arrayBuffer();
                pdfDoc = await PDFLib.PDFDocument.load(bytes);

                if (path.includes('rotate-pdf')) {
                    const deg = parseInt(rotateAngle.value) || 90;
                    const pages = pdfDoc.getPages();
                    pages.forEach(page => {
                        const currRot = page.getRotation().angle;
                        page.setRotation(PDFLib.degrees(currRot + deg));
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'processed_document.pdf';
            link.click();
        } catch (e) {
            console.error(e);
            alert('An error occurred during PDF processing: ' + e.message);
        }
    });

    function handleFiles(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        selectedFiles = files;
        fileList.innerHTML = selectedFiles.map((file) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background-color: var(--bg-primary);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>📄</span>
                    <span style="font-weight: 500; font-size: 0.9rem;">${file.name}</span>
                    <span style="font-size: 0.75rem; color: var(--text-tertiary);">(dots KB)</span>
                </div>
            </div>
        `).join('');

        uploadZone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
