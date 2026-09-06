module.exports = {
    // 1. PDF to Word
    'pdf-to-word': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="pdfword-dropzone">
                <span class="upload-icon">📄</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Convert PDF documents into genuine, editable Word (.docx) documents client-side</p>
                </div>
                <input type="file" class="upload-input" id="pdfword-input" accept=".pdf">
            </div>

            <div id="pdfword-loader" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem;">
                <div class="loader" style="border:4px solid var(--border-color); border-top:4px solid var(--primary-color); border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
                <span id="pdfword-progress" style="font-weight:600; color:var(--text-secondary);">Extracting page 0 of 0...</span>
            </div>

            <div id="pdfword-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <div style="margin-bottom:0.5rem;">Filename: <strong id="pdfword-file-name">-</strong></div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);">Size: <strong id="pdfword-file-size">-</strong></div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Extracted Text Preview</h5>
                    <textarea id="pdfword-preview-text" class="input-control" style="min-height:220px; font-family:var(--font-sans); font-size:0.9rem; line-height:1.6; background:#ffffff; color:#334155;" readonly></textarea>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="pdfword-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="pdfword-btn-action">Download as Word Document (.docx)</button>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
        `,
        logicJS: `export function init() {
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
    let extractedPages = [];
    let originalName = 'document';

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalName = file.name.replace(/\\.[^/.]+$/, "");
            fileName.textContent = file.name;
            fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfBytes = null;
        extractedPages = [];
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
            
            extractedPages = [];
            let fullTextForPreview = '';

            for (let i = 1; i <= totalPages; i++) {
                progressText.textContent = 'Extracting text page ' + i + ' of ' + totalPages + '...';
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Group text items by vertical position (y coordinate) to preserve lines and paragraphs
                const items = textContent.items;
                let lines = [];
                let currentY = null;
                let currentLine = [];

                items.forEach(item => {
                    const y = Math.round(item.transform[5]);
                    if (currentY === null || Math.abs(y - currentY) < 4) {
                        currentLine.push(item.str);
                        currentY = y;
                    } else {
                        if (currentLine.length > 0) {
                            lines.push(currentLine.join(' '));
                        }
                        currentLine = [item.str];
                        currentY = y;
                    }
                });
                if (currentLine.length > 0) {
                    lines.push(currentLine.join(' '));
                }

                const pageText = lines.join('\\n').trim();
                extractedPages.push(pageText);
                fullTextForPreview += (totalPages > 1 ? ('--- Page ' + i + ' ---\\n') : '') + pageText + '\\n\\n';
            }

            const previewText = fullTextForPreview.trim();
            previewArea.value = previewText || 'Notice: No extractable text found in this PDF. It may contain scanned images without OCR.';
            
            loader.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (err) {
            alert('Failed to parse PDF document: ' + err.message);
            reset.click();
        }
    }

    function escapeXml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    async function buildValidDocx(pages) {
        if (!window.JSZip) {
            throw new Error('JSZip library is required to build Word documents.');
        }

        const zip = new window.JSZip();

        // 1. [Content_Types].xml - Declares WordprocessingML parts
        zip.file('[Content_Types].xml', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>\`);

        // 2. _rels/.rels - Package root relationship
        zip.folder('_rels').file('.rels', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>\`);

        // 3. word/_rels/document.xml.rels - Word document relationships
        const wordFolder = zip.folder('word');
        wordFolder.folder('_rels').file('document.xml.rels', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>\`);

        // 4. word/styles.xml - Default paragraph and run styles
        wordFolder.file('styles.xml', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="333333"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>\`);

        // 5. word/settings.xml - Word compatibility settings
        wordFolder.file('settings.xml', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:compat>
    <w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>
  </w:compat>
</w:settings>\`);

        // 6. word/document.xml - Main document body containing extracted paragraphs and page breaks
        let bodyXml = '';
        pages.forEach((pageText, pIdx) => {
            if (pIdx > 0) {
                // Page break between PDF pages
                bodyXml += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
            }
            const paragraphs = pageText.split(/\\r?\\n/).filter(p => p.trim().length > 0);
            if (paragraphs.length === 0) {
                bodyXml += '<w:p><w:r><w:t></w:t></w:r></w:p>';
            } else {
                paragraphs.forEach(p => {
                    bodyXml += '<w:p><w:r><w:t xml:space="preserve">' + escapeXml(p) + '</w:t></w:r></w:p>';
                });
            }
        });

        bodyXml += \`<w:sectPr>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
</w:sectPr>\`;

        wordFolder.file('document.xml', \`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>\${bodyXml}</w:body>
</w:document>\`);

        // Generate genuine DOCX package
        return await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
    }

    action.addEventListener('click', async () => {
        if (!extractedPages || extractedPages.length === 0) {
            alert('Please upload a PDF document first.');
            return;
        }

        try {
            action.disabled = true;
            action.textContent = 'Generating Word Document...';

            const blob = await buildValidDocx(extractedPages);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (originalName || 'extracted_document') + '.docx';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to generate Word document: ' + err.message);
        } finally {
            action.disabled = false;
            action.textContent = 'Download as Word Document (.docx)';
        }
    });
}
`
    }),

    // 2. Unlock PDF
    'unlock-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="unlock-loading" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem;">
                <div class="loader" style="border:4px solid var(--border-color); border-top:4px solid var(--primary-color); border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;"></div>
                <span id="unlock-loading-text" style="font-weight:600; color:var(--text-secondary);">Processing PDF...</span>
            </div>

            <div class="upload-zone" id="unlock-dropzone">
                <span class="upload-icon">🔓</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Locked PDF here</h4>
                    <p>Decrypt and remove access restriction passwords client-side</p>
                </div>
                <input type="file" class="upload-input" id="unlock-input" accept=".pdf">
            </div>

            <div id="unlock-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    Locked Filename: <strong id="unlock-file-name">-</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="unlock-pass">Enter PDF Password</label>
                        <input type="password" id="unlock-pass" class="input-control" placeholder="Type password here...">
                    </div>
                </div>

                <div id="unlock-msg" style="display:none; padding:0.75rem 1rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="unlock-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="unlock-btn-action">Unlock & Download</button>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
        `,
        logicJS: `export function init() {
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
            originalName = file.name.replace(/\\.[^/.]+$/, "");
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
`
    }),

    // 3. HTML to PDF Converter
    'html-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="html-val">Enter HTML Code</label>
                <textarea id="html-val" class="input-control" style="min-height:180px; font-family:var(--font-mono); font-size:0.85rem;" placeholder="Type html template here..."></textarea>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1rem;">
                <h5 style="margin-bottom:0.75rem; font-weight:600;">HTML Live Preview Viewport</h5>
                <div id="html-render-container" style="width:100%; min-height:220px; border:1px dashed var(--border-color); border-radius:var(--radius-xs); background:#ffffff; color:#1e293b; padding:20px; box-sizing:border-box; overflow-y:auto;"></div>
            </div>

            <div class="action-row" style="margin-top:1.5rem;">
                <button class="btn btn-secondary" id="html-btn-preview">Update Live Preview</button>
                <button class="btn btn-primary" id="html-btn-action">Compile HTML to PDF</button>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const textarea = document.getElementById('html-val');
    const previewBtn = document.getElementById('html-btn-preview');
    const renderContainer = document.getElementById('html-render-container');
    const action = document.getElementById('html-btn-action');

    if (!textarea || !renderContainer) return;

    // Set sample HTML template
    textarea.value = \`<h1>Hello World</h1>
<p>This is a PDF test generated directly from client-side HTML.</p>
<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>
<table style="width:100%; border-collapse:collapse; margin-top:15px;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Item Name</th>
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Quantity</th>
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Unit Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px;">Product Alpha</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">2</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">$45.00</td>
    </tr>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px;">Product Beta</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">1</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">$99.00</td>
    </tr>
  </tbody>
</table>\`;

    updatePreview();

    textarea.addEventListener('input', updatePreview);
    previewBtn.addEventListener('click', updatePreview);

    function updatePreview() {
        renderContainer.innerHTML = textarea.value;
    }

    action.addEventListener('click', async () => {
        const val = textarea.value;
        if (!val.trim()) {
            alert('Please enter HTML code before compiling to PDF.');
            return;
        }

        updatePreview();

        // Wait for all images inside render container to complete loading
        const images = Array.from(renderContainer.querySelectorAll('img'));
        if (images.length > 0) {
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(res => {
                    img.onload = res;
                    img.onerror = res;
                });
            }));
        }

        // Brief delay to allow DOM styles and web fonts to settle
        await new Promise(res => setTimeout(res, 150));

        action.disabled = true;
        action.textContent = 'Generating PDF...';

        try {
            const opt = {
                margin:       [0.4, 0.4, 0.4, 0.4],
                filename:     'html_converted.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(renderContainer).save();
        } catch (err) {
            alert('Failed to generate PDF from HTML: ' + err.message);
        } finally {
            action.disabled = false;
            action.textContent = 'Compile HTML to PDF';
        }
    });
}
`
    }),

    // 4. Excel to PDF Guide
    'excel-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="xls-dropzone">
                <span class="upload-icon">📊</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Excel here</h4>
                    <p>Supports XLS, XLSX workbooks (converts spreadsheet tables to PDF)</p>
                </div>
                <input type="file" class="upload-input" id="xls-input" accept=".xls,.xlsx">
            </div>

            <div id="xls-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    Workbook Name: <strong id="xls-file-name">-</strong>
                </div>

                <div class="form-group">
                    <label for="xls-sheet-select">Select Sheet Name</label>
                    <select id="xls-sheet-select" class="input-control"></select>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; overflow-x:auto;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Sheet Table Grid Preview</h5>
                    <div id="xls-grid-preview" style="background:#ffffff; border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-xs); min-height:150px; overflow-x:auto;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="xls-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="xls-btn-action">Generate PDF from Sheet</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('xls-dropzone');
    const input = document.getElementById('xls-input');
    const workspace = document.getElementById('xls-workspace');
    const fileName = document.getElementById('xls-file-name');
    const sheetSelect = document.getElementById('xls-sheet-select');
    const previewGrid = document.getElementById('xls-grid-preview');
    const reset = document.getElementById('xls-btn-reset');
    const action = document.getElementById('xls-btn-action');

    if (!input) return;
    let workbook = null;
    let originalName = 'spreadsheet';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalName = file.name.replace(/\\.[^/.]+$/, "");
            fileName.textContent = file.name;
            process(file);
        }
    });

    sheetSelect.addEventListener('change', renderSheet);

    reset.addEventListener('click', () => {
        input.value = '';
        workbook = null;
        sheetSelect.innerHTML = '';
        previewGrid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

            sheetSelect.innerHTML = '';
            workbook.SheetNames.forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                sheetSelect.appendChild(opt);
            });

            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
            renderSheet();
        } catch (err) {
            alert('Failed to parse Excel workbook: ' + err.message);
            reset.click();
        }
    }

    function getSheetData() {
        if (!workbook) return [];
        const sheetName = sheetSelect.value;
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) return [];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    }

    function renderSheet() {
        const rows = getSheetData();
        if (rows.length === 0) {
            previewGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">Sheet is empty.</p>';
            return;
        }

        let tableHtml = '<table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:0.85rem;">';
        rows.forEach((row, rIdx) => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                if (rIdx === 0) {
                    tableHtml += '<th style="border:1px solid #cbd5e1; padding:8px 12px; background:#f1f5f9; color:#0f172a; text-align:left; font-weight:700;">' + String(cell) + '</th>';
                } else {
                    tableHtml += '<td style="border:1px solid #cbd5e1; padding:8px 12px; color:#1e293b; background:' + (rIdx % 2 === 0 ? '#f8fafc' : '#ffffff') + ';">' + String(cell) + '</td>';
                }
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</table>';

        previewGrid.innerHTML = tableHtml;
    }

    action.addEventListener('click', async () => {
        const rows = getSheetData();
        if (rows.length === 0) {
            alert('No spreadsheet data to export.');
            return;
        }

        action.disabled = true;
        action.textContent = 'Generating PDF...';

        try {
            // Build a clean, unconstrained DOM container for multi-page PDF generation
            const printContainer = document.createElement('div');
            printContainer.id = 'xls-print-container';
            printContainer.style.background = '#ffffff';
            printContainer.style.color = '#0f172a';
            printContainer.style.padding = '20px';
            printContainer.style.fontFamily = 'Arial, sans-serif';
            printContainer.style.width = '1000px'; // Wide landscape layout
            printContainer.style.boxSizing = 'border-box';

            const sheetName = sheetSelect.value || 'Sheet1';
            let printHtml = '<h2 style="margin-bottom:8px; color:#1e293b; font-size:18px;">' + sheetName + '</h2>';
            printHtml += '<p style="font-size:11px; color:#64748b; margin-bottom:16px;">Exported from: ' + (fileName.textContent || 'Workbook') + '</p>';
            printHtml += '<table style="width:100%; border-collapse:collapse; font-size:11px;">';

            rows.forEach((row, rIdx) => {
                printHtml += '<tr style="page-break-inside:avoid;">';
                row.forEach(cell => {
                    if (rIdx === 0) {
                        printHtml += '<th style="border:1px solid #cbd5e1; padding:8px 10px; background:#f1f5f9; color:#0f172a; text-align:left; font-weight:bold;">' + String(cell) + '</th>';
                    } else {
                        printHtml += '<td style="border:1px solid #cbd5e1; padding:7px 10px; color:#1e293b; background:' + (rIdx % 2 === 0 ? '#f8fafc' : '#ffffff') + ';">' + String(cell) + '</td>';
                    }
                });
                printHtml += '</tr>';
            });
            printHtml += '</table>';

            printContainer.innerHTML = printHtml;
            document.body.appendChild(printContainer);

            // Wait a moment for DOM attachment
            await new Promise(r => setTimeout(r, 100));

            const opt = {
                margin:       [0.4, 0.4, 0.4, 0.4],
                filename:     (originalName || 'excel_sheet') + '.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(printContainer).save();

            // Clean up
            document.body.removeChild(printContainer);
        } catch (err) {
            alert('Failed to generate PDF: ' + err.message);
        } finally {
            action.disabled = false;
            action.textContent = 'Generate PDF from Sheet';
        }
    });
}
`
    })
};
