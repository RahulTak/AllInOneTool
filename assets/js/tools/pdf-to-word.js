export function init() {
    const dropzone = document.getElementById('pdfword-dropzone');
    const input = document.getElementById('pdfword-input');
    const loader = document.getElementById('pdfword-loader');
    const progressText = document.getElementById('pdfword-progress');
    const workspace = document.getElementById('pdfword-workspace');
    const fileName = document.getElementById('pdfword-file-name');
    const fileSize = document.getElementById('pdfword-file-size');
    const previewArea = document.getElementById('pdfword-preview-text');
    const reset = document.getElementById('pdfword-btn-reset');
    const action = document.getElementById('pdfword-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let extractedText = '';

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfBytes = null;
        extractedText = '';
        previewArea.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        loader.style.display = 'none';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        dropzone.style.display = 'none';
        loader.style.display = 'flex';

        try {
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            const pdf = await loadingTask.promise;
            const totalPages = pdf.numPages;
            
            let fullText = '';
            for (let i = 1; i <= totalPages; i++) {
                progressText.textContent = 'Extracting text page ' + i + ' of ' + totalPages + '...';
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            extractedText = fullText.trim();
            previewArea.value = extractedText || 'No extractable text blocks found inside this PDF.';
            
            loader.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (err) {
            alert('Failed to parse PDF document: ' + err.message);
            reset.click();
        }
    }

    action.addEventListener('click', () => {
        if (!extractedText) return;
        
        const paragraphs = extractedText.split('\n').filter(p => p.trim().length > 0);
        const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <title>Extracted Word Layout</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; padding: 20px; }
            p { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          ${paragraphs.map(p => `<p>${p}</p>`).join('')}
        </body>
        </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_document.docx';
        a.click();
        URL.revokeObjectURL(url);
    });
}
