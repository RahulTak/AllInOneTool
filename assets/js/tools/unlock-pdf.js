export function init() {
    const loadingBlock = document.getElementById('unlock-loading');
    const loadingText = document.getElementById('unlock-loading-text');
    const dropzone = document.getElementById('unlock-dropzone');
    const input = document.getElementById('unlock-input');
    const workspace = document.getElementById('unlock-workspace');
    const fileName = document.getElementById('unlock-file-name');
    const passInput = document.getElementById('unlock-pass');
    const msgBox = document.getElementById('unlock-msg');
    const reset = document.getElementById('unlock-btn-reset');
    const action = document.getElementById('unlock-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let originalName = 'unlocked';

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalName = file.name.replace(/\.[^/.]+$/, "");
            fileName.textContent = file.name;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        passInput.value = '';
        pdfBytes = null;
        msgBox.style.display = 'none';
        msgBox.textContent = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        loadingBlock.style.display = 'none';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        msgBox.style.display = 'none';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        passInput.focus();
    }

    function showStatus(text, isError) {
        msgBox.textContent = text;
        msgBox.style.display = 'block';
        if (isError) {
            msgBox.style.background = 'rgba(239, 68, 68, 0.1)';
            msgBox.style.border = '1px solid var(--error-color, #ef4444)';
            msgBox.style.color = 'var(--error-color, #ef4444)';
        } else {
            msgBox.style.background = 'rgba(34, 197, 94, 0.1)';
            msgBox.style.border = '1px solid #16a34a';
            msgBox.style.color = '#16a34a';
        }
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        const pass = passInput.value;
        if (!pass) {
            alert('Please enter the PDF password to unlock.');
            passInput.focus();
            return;
        }

        msgBox.style.display = 'none';
        action.disabled = true;
        action.textContent = 'Verifying & Decrypting...';

        try {
            // First verify whether document is actually password protected
            let isProtected = false;
            try {
                const checkTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
                await checkTask.promise;
                // If it opened without password, it is not encrypted
                isProtected = false;
            } catch (checkErr) {
                if (checkErr.name === 'PasswordException' || checkErr.code === 1 || checkErr.code === 2) {
                    isProtected = true;
                }
            }

            if (!isProtected) {
                showStatus('This PDF is already unprotected and does not require a password.', false);
                action.disabled = false;
                action.textContent = 'Unlock & Download';
                return;
            }

            // Attempt actual cryptographic decryption using PDF.js engine
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0), password: pass });
            let pdfDoc;
            try {
                pdfDoc = await loadingTask.promise;
            } catch (decryptErr) {
                if (decryptErr.name === 'PasswordException' || decryptErr.code === 2 || (decryptErr.message && decryptErr.message.toLowerCase().includes('password'))) {
                    showStatus('Incorrect PDF password. Please try again.', true);
                } else if (decryptErr.message && (decryptErr.message.toLowerCase().includes('unsupported') || decryptErr.message.toLowerCase().includes('encryption'))) {
                    showStatus('This PDF uses an encryption method that cannot be unlocked in the browser.', true);
                } else {
                    showStatus('Decryption error: ' + decryptErr.message, true);
                }
                action.disabled = false;
                action.textContent = 'Unlock & Download';
                return;
            }

            // Successfully authenticated by the PDF crypto engine!
            showStatus('PDF unlocked successfully. Generating unlocked document...', false);

            // Reconstruct the unlocked PDF using PDFLib and PDF.js rendered canvases
            const PDFLib = window.PDFLib;
            if (!PDFLib) {
                throw new Error('PDF-lib is required to construct the unlocked PDF.');
            }

            const newPdf = await PDFLib.PDFDocument.create();
            const totalPages = pdfDoc.numPages;

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for sharp rendering

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
                const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer());
                const embeddedImg = await newPdf.embedJpg(imgBytes);

                const origViewport = page.getViewport({ scale: 1.0 });
                const newPage = newPdf.addPage([origViewport.width, origViewport.height]);
                newPage.drawImage(embeddedImg, {
                    x: 0,
                    y: 0,
                    width: origViewport.width,
                    height: origViewport.height
                });
            }

            const unlockedPdfBytes = await newPdf.save();
            const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (originalName || 'unlocked_document') + '_unlocked.pdf';
            a.click();
            URL.revokeObjectURL(url);

            showStatus('PDF unlocked successfully. Download ready.', false);
        } catch (err) {
            showStatus('Failed to generate unlocked PDF: ' + err.message, true);
        } finally {
            action.disabled = false;
            action.textContent = 'Unlock & Download';
        }
    });
}
