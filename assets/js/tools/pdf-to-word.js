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
    let extractedPages = [];
    let originalName = 'document';

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalName = file.name.replace(/\.[^/.]+$/, "");
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

                const pageText = lines.join('\n').trim();
                extractedPages.push(pageText);
                fullTextForPreview += (totalPages > 1 ? ('--- Page ' + i + ' ---\n') : '') + pageText + '\n\n';
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
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`);

        // 2. _rels/.rels - Package root relationship
        zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

        // 3. word/_rels/document.xml.rels - Word document relationships
        const wordFolder = zip.folder('word');
        wordFolder.folder('_rels').file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`);

        // 4. word/styles.xml - Default paragraph and run styles
        wordFolder.file('styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
</w:styles>`);

        // 5. word/settings.xml - Word compatibility settings
        wordFolder.file('settings.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:compat>
    <w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>
  </w:compat>
</w:settings>`);

        // 6. word/document.xml - Main document body containing extracted paragraphs and page breaks
        let bodyXml = '';
        pages.forEach((pageText, pIdx) => {
            if (pIdx > 0) {
                // Page break between PDF pages
                bodyXml += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
            }
            const paragraphs = pageText.split(/\r?\n/).filter(p => p.trim().length > 0);
            if (paragraphs.length === 0) {
                bodyXml += '<w:p><w:r><w:t></w:t></w:r></w:p>';
            } else {
                paragraphs.forEach(p => {
                    bodyXml += '<w:p><w:r><w:t xml:space="preserve">' + escapeXml(p) + '</w:t></w:r></w:p>';
                });
            }
        });

        bodyXml += `<w:sectPr>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
</w:sectPr>`;

        wordFolder.file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>${bodyXml}</w:body>
</w:document>`);

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
