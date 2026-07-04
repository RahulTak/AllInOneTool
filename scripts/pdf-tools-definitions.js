module.exports = {
    'merge-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="merge-dropzone">
                <span class="upload-icon">📄</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDFs here</h4>
                    <p>Select multiple PDF documents to merge</p>
                </div>
                <input type="file" class="upload-input" id="merge-input" accept=".pdf" multiple>
            </div>

            <div id="merge-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Documents to Merge (Drag to sort, or use arrows)</h5>
                    <div id="merge-list" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="merge-btn-reset">Reset / Clear</button>
                    <button class="btn btn-primary" id="merge-btn-action">Merge Documents</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('merge-dropzone');
    const input = document.getElementById('merge-input');
    const workspace = document.getElementById('merge-workspace');
    const list = document.getElementById('merge-list');
    const reset = document.getElementById('merge-btn-reset');
    const action = document.getElementById('merge-btn-action');

    if (!input) return;
    let pdfFiles = []; // { file, totalPages, sizeStr, thumbUrl }

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(Array.from(e.target.files));
    });

    // Drag-over and drop handlers on workspace
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            process(Array.from(e.dataTransfer.files));
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfFiles = [];
        list.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(files) {
        for (const file of files) {
            if (!file.name.toLowerCase().endsWith('.pdf')) continue;
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const totalPages = pdf.numPages;
                const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

                // Render page 1 thumbnail
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.25 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                const thumbUrl = canvas.toDataURL();

                pdfFiles.push({ file, totalPages, sizeStr, thumbUrl });
            } catch (err) {
                console.error('Failed to parse file: ', file.name, err);
            }
        }

        if (pdfFiles.length > 0) {
            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
            renderList();
        }
    }

    function renderList() {
        list.innerHTML = '';
        pdfFiles.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.gap = '1rem';
            card.style.padding = '0.75rem';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius-sm)';
            card.style.background = 'var(--bg-secondary)';
            card.setAttribute('draggable', 'true');

            // Drag and drop event handlers
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
            });
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIdx !== idx) {
                    const temp = pdfFiles[fromIdx];
                    pdfFiles.splice(fromIdx, 1);
                    pdfFiles.splice(idx, 0, temp);
                    renderList();
                }
            });

            const img = document.createElement('img');
            img.src = item.thumbUrl;
            img.style.width = '45px';
            img.style.height = '60px';
            img.style.objectFit = 'contain';
            img.style.border = '1px solid var(--border-color)';
            img.style.borderRadius = 'var(--radius-xs)';
            img.style.background = '#ffffff';

            const details = document.createElement('div');
            details.style.flexGrow = '1';
            details.innerHTML = \`<div style="font-weight:600; font-size:0.9rem; margin-bottom:0.25rem;">\${item.file.name}</div>
                                 <div style="font-size:0.75rem; color:var(--text-secondary);">Pages: \${item.totalPages} | Size: \${item.sizeStr}</div>\`;

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '0.25rem';

            const btnUp = document.createElement('button');
            btnUp.className = 'btn';
            btnUp.style.padding = '4px 8px';
            btnUp.style.fontSize = '0.75rem';
            btnUp.textContent = '▲';
            btnUp.disabled = idx === 0;
            btnUp.onclick = () => {
                const temp = pdfFiles[idx];
                pdfFiles[idx] = pdfFiles[idx - 1];
                pdfFiles[idx - 1] = temp;
                renderList();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'btn';
            btnDown.style.padding = '4px 8px';
            btnDown.style.fontSize = '0.75rem';
            btnDown.textContent = '▼';
            btnDown.disabled = idx === pdfFiles.length - 1;
            btnDown.onclick = () => {
                const temp = pdfFiles[idx];
                pdfFiles[idx] = pdfFiles[idx + 1];
                pdfFiles[idx + 1] = temp;
                renderList();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '4px 8px';
            btnDel.style.fontSize = '0.75rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                pdfFiles.splice(idx, 1);
                if (pdfFiles.length === 0) {
                    reset.click();
                } else {
                    renderList();
                }
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);
            controls.appendChild(btnDel);

            card.appendChild(img);
            card.appendChild(details);
            card.appendChild(controls);
            list.appendChild(card);
        });
    }

    action.addEventListener('click', async () => {
        if (pdfFiles.length === 0) return;
        try {
            const mergedDoc = await PDFLib.PDFDocument.create();
            for (const item of pdfFiles) {
                const bytes = await item.file.arrayBuffer();
                const doc = await PDFLib.PDFDocument.load(bytes);
                const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
                copiedPages.forEach(p => mergedDoc.addPage(p));
            }

            const pdfBytes = await mergedDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to merge documents: ' + err.message);
        }
    });
}
`
    }),
    'jpg-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="jpg-dropzone">
                <span class="upload-icon">🖼️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Images here</h4>
                    <p>Compile multiple images into a clean single PDF</p>
                </div>
                <input type="file" class="upload-input" id="jpg-input" accept="image/jpeg,image/png,image/jpg" multiple>
            </div>

            <div id="jpg-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Images Sequence (Drag or use arrows to sort)</h5>
                    <div id="jpg-list" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="jpg-pdf-size">Page Size</label>
                        <select id="jpg-pdf-size" class="input-control">
                            <option value="A4">A4 (595 x 842 pt)</option>
                            <option value="LETTER">Letter (612 x 792 pt)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="jpg-pdf-orient">Orientation</label>
                        <select id="jpg-pdf-orient" class="input-control">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="jpg-pdf-margin">Margins</label>
                        <select id="jpg-pdf-margin" class="input-control">
                            <option value="none">No Margin</option>
                            <option value="small">Small Margin (20pt)</option>
                            <option value="large">Large Margin (40pt)</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="jpg-btn-reset">Reset / Clear</button>
                    <button class="btn btn-primary" id="jpg-btn-action">Convert Images to PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),
    'compress-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="compress-dropzone">
                <span class="upload-icon">📉</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Compress structural metadata and objects client-side</p>
                </div>
                <input type="file" class="upload-input" id="compress-input" accept=".pdf">
            </div>

            <div id="compress-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div class="options-grid">
                    <div class="form-group">
                        <label for="compress-level">Compression Level</label>
                        <select id="compress-level" class="input-control">
                            <option value="low">Low Compression (Highest Quality)</option>
                            <option value="medium" selected>Medium Compression (Balanced)</option>
                            <option value="high">High Compression (Smallest File)</option>
                        </select>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; display:flex; flex-direction:column; gap:0.5rem;" id="compress-stats-box">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.85rem;">
                        <div>Original Size: <strong id="c-size-orig">-</strong></div>
                        <div>Compressed Size: <strong id="c-size-comp">-</strong></div>
                        <div>Savings: <strong id="c-savings">-</strong></div>
                        <div>Percentage: <strong id="c-percentage">-</strong></div>
                    </div>
                    <div id="c-status-banner" style="font-weight:600; font-size:0.85rem; margin-top:0.5rem; text-align:center;"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="compress-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="compress-btn-download">Download Compressed PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    const workspace = document.getElementById('compress-workspace');
    const levelSelect = document.getElementById('compress-level');
    const sizeOrig = document.getElementById('c-size-orig');
    const sizeComp = document.getElementById('c-size-comp');
    const savings = document.getElementById('c-savings');
    const percentage = document.getElementById('c-percentage');
    const banner = document.getElementById('c-status-banner');
    const reset = document.getElementById('compress-btn-reset');
    const download = document.getElementById('compress-btn-download');

    if (!input) return;
    let pdfBytes = null;
    let originalSize = 0;
    let compressedBytes = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            originalSize = file.size;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfBytes = null;
        compressedBytes = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    levelSelect.addEventListener('change', compress);

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        await compress();
    }

    async function compress() {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            // Save doc with structure optimization enabled
            const optimized = await doc.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            compressedBytes = optimized;
            const compSize = optimized.byteLength;

            sizeOrig.textContent = (originalSize / (1024 * 1024)).toFixed(2) + ' MB';
            sizeComp.textContent = (compSize / (1024 * 1024)).toFixed(2) + ' MB';

            if (compSize >= originalSize) {
                savings.textContent = '0 KB';
                percentage.textContent = '0%';
                banner.textContent = 'This PDF cannot be compressed further without affecting quality.';
                banner.style.color = 'var(--warning-color)';
                compressedBytes = pdfBytes; // Fallback to original
            } else {
                const diff = originalSize - compSize;
                const pct = Math.round((diff / originalSize) * 100);
                savings.textContent = (diff / 1024).toFixed(1) + ' KB';
                percentage.textContent = pct + '%';
                banner.textContent = '🎉 PDF successfully optimized and compressed by ' + pct + '%!';
                banner.style.color = 'var(--success-color)';
            }
        } catch (err) {
            console.error(err);
            alert('Failed to optimize PDF document.');
        }
    }

    download.addEventListener('click', () => {
        if (!compressedBytes) return;
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_output.pdf';
        a.click();
        URL.revokeObjectURL(url);
    });
}
`
    }),
    'word-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="word-dropzone">
                <span class="upload-icon">📝</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop DOC/DOCX here</h4>
                    <p>Client-side guide and workflow validation</p>
                </div>
                <input type="file" class="upload-input" id="word-input" accept=".doc,.docx">
            </div>

            <div id="word-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="color:var(--error-color); margin-bottom:0.75rem;">⚠️ Browser Security & Layout Limitations</h5>
                    <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">
                        Standard browser runtimes cannot compile Microsoft Word file formats (.doc or .docx) directly into PDF vector binaries offline. Doing so requires advanced typesetting engines that are only native to server-side environments or native desktop applications.
                    </p>
                    <hr style="margin:1rem 0; border:0; border-top:1px solid var(--border-color);">
                    <h6 style="font-weight:600; margin-bottom:0.5rem;">Uploaded File Details:</h6>
                    <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
                        <strong>Filename:</strong> <span id="word-file-name">-</span><br>
                        <strong>File Size:</strong> <span id="word-file-size">-</span>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Recommended Secure Workflows:</h5>
                    <ol style="font-size:0.85rem; line-height:1.7; padding-left:1.2rem; color:var(--text-secondary);">
                        <li><strong>In MS Word:</strong> Open the file, go to <strong>File → Save As</strong> and choose <strong>PDF (*.pdf)</strong>.</li>
                        <li><strong>In Google Docs:</strong> Upload the DOCX, open it, go to <strong>File → Download → PDF Document (.pdf)</strong>.</li>
                        <li><strong>Print Preview:</strong> Open the file in any browser or reader, press <strong>Cmd+P / Ctrl+P</strong>, and choose <strong>Save as PDF</strong> as your destination printer.</li>
                    </ol>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="word-btn-reset">Reset / Clear</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('word-dropzone');
    const input = document.getElementById('word-input');
    const workspace = document.getElementById('word-workspace');
    const fileName = document.getElementById('word-file-name');
    const fileSize = document.getElementById('word-file-size');
    const reset = document.getElementById('word-btn-reset');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function process(file) {
        if (!file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
            alert('Please upload a valid Microsoft Word (.doc or .docx) document.');
            input.value = '';
            return;
        }
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
`
    }),
    'pdf-to-word': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="pdfword-dropzone">
                <span class="upload-icon">📄</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Client-side guide and document details extractor</p>
                </div>
                <input type="file" class="upload-input" id="pdfword-input" accept=".pdf">
            </div>

            <div id="pdfword-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="color:var(--error-color); margin-bottom:0.75rem;">⚠️ Browser Formatting Limitations</h5>
                    <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">
                        PDFs are compiled absolute-coordinate vector outputs. Converting absolute layout nodes back into editable flows of paragraphs, tables, and sections (.docx format) requires complex server-side optical character recognition (OCR) and layout styling engines.
                    </p>
                    <hr style="margin:1rem 0; border:0; border-top:1px solid var(--border-color);">
                    <h6 style="font-weight:600; margin-bottom:0.5rem;">Uploaded File Details:</h6>
                    <div style="font-size:0.85rem; color:var(--text-secondary);">
                        <strong>Filename:</strong> <span id="pdfword-file-name">-</span><br>
                        <strong>File Size:</strong> <span id="pdfword-file-size">-</span>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Recommended Conversion Workflows:</h5>
                    <ol style="font-size:0.85rem; line-height:1.7; padding-left:1.2rem; color:var(--text-secondary);">
                        <li><strong>In MS Word:</strong> Open MS Word, click <strong>File → Open</strong> and select your PDF file. MS Word will automatically convert the document with its layout engine.</li>
                        <li><strong>Google Docs:</strong> Upload the PDF to Google Drive, double-click it, and select <strong>Open with Google Docs</strong>.</li>
                        <li><strong>Adobe Reader:</strong> Use the export tool inside Adobe Acrobat Reader to export as Microsoft Word format.</li>
                    </ol>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="pdfword-btn-reset">Reset / Clear</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('pdfword-dropzone');
    const input = document.getElementById('pdfword-input');
    const workspace = document.getElementById('pdfword-workspace');
    const fileName = document.getElementById('pdfword-file-name');
    const fileSize = document.getElementById('pdfword-file-size');
    const reset = document.getElementById('pdfword-btn-reset');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    function process(file) {
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
`
    }),
    'protect-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="protect-dropzone">
                <span class="upload-icon">🔒</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Apply strong owner/user passwords client-side</p>
                </div>
                <input type="file" class="upload-input" id="protect-input" accept=".pdf">
            </div>

            <div id="protect-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    Filename: <strong id="protect-file-name">-</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="protect-pass">Enter Password</label>
                        <input type="password" id="protect-pass" class="input-control" placeholder="••••••••">
                    </div>
                    <div class="form-group">
                        <label for="protect-pass-confirm">Confirm Password</label>
                        <input type="password" id="protect-pass-confirm" class="input-control" placeholder="••••••••">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="protect-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="protect-btn-action">Encrypt & Download PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('protect-dropzone');
    const input = document.getElementById('protect-input');
    const workspace = document.getElementById('protect-workspace');
    const fileName = document.getElementById('protect-file-name');
    const passInput = document.getElementById('protect-pass');
    const passConfirm = document.getElementById('protect-pass-confirm');
    const reset = document.getElementById('protect-btn-reset');
    const action = document.getElementById('protect-btn-action');

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
        passInput.value = '';
        passConfirm.value = '';
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
        const pass = passInput.value;
        const confirm = passConfirm.value;

        if (!pass) {
            alert('Please enter a password.');
            return;
        }
        if (pass !== confirm) {
            alert('Passwords do not match. Please verify.');
            return;
        }

        try {
            if (typeof exports === 'undefined' || !exports.encryptPDF) {
                alert('Encryption libraries are still loading. Please try again.');
                return;
            }
            
            // Call exports.encryptPDF from our loaded CDN bundle
            const encrypted = await exports.encryptPDF(pdfBytes, pass);
            const blob = new Blob([encrypted], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'protected_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to encrypt PDF: ' + err.message);
        }
    });
}
`
    }),
    'unlock-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
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
                        <input type="password" id="unlock-pass" class="input-control" placeholder="••••••••">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="unlock-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="unlock-btn-action">Unlock & Download</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('unlock-dropzone');
    const input = document.getElementById('unlock-input');
    const workspace = document.getElementById('unlock-workspace');
    const fileName = document.getElementById('unlock-file-name');
    const passInput = document.getElementById('unlock-pass');
    const reset = document.getElementById('unlock-btn-reset');
    const action = document.getElementById('unlock-btn-action');

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
        passInput.value = '';
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
        const pass = passInput.value;
        if (!pass) {
            alert('Please enter the password to unlock this document.');
            return;
        }

        try {
            if (typeof exports === 'undefined' || !exports.decryptPDF) {
                alert('Decryption libraries are still loading. Please try again.');
                return;
            }
            
            const decrypted = await exports.decryptPDF(pdfBytes, pass);
            const blob = new Blob([decrypted], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'unlocked_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Incorrect password. Please verify and try again.');
        }
    });
}
`
    }),
    'add-watermark-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="wm-dropzone">
                <span class="upload-icon">🖋️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Apply customizable text or image watermark stamps</p>
                </div>
                <input type="file" class="upload-input" id="wm-input" accept=".pdf">
            </div>

            <div id="wm-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Loaded Filename: <strong id="wm-file-name">-</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="wm-type">Watermark Type</label>
                        <select id="wm-type" class="input-control">
                            <option value="text">Text Watermark</option>
                            <option value="image">Image Watermark</option>
                        </select>
                    </div>

                    <div class="form-group" id="wm-text-block">
                        <label for="wm-text">Watermark Text</label>
                        <input type="text" id="wm-text" class="input-control" value="COPYRIGHT BRAND">
                    </div>

                    <div class="form-group" id="wm-image-block" style="display:none;">
                        <label for="wm-image">Upload Watermark Image</label>
                        <input type="file" id="wm-image" class="input-control" accept="image/*">
                    </div>

                    <div class="form-group">
                        <label for="wm-pos">Stamp Position</label>
                        <select id="wm-pos" class="input-control">
                            <option value="center" selected>Center</option>
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="wm-opacity">Opacity</label>
                        <select id="wm-opacity" class="input-control">
                            <option value="0.2">Low (20%)</option>
                            <option value="0.4" selected>Medium (40%)</option>
                            <option value="0.7">High (70%)</option>
                            <option value="1.0">Solid (100%)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="wm-rotate">Rotation (Degrees)</label>
                        <select id="wm-rotate" class="input-control">
                            <option value="0" selected>0° (Horizontal)</option>
                            <option value="45">45° Diagonal</option>
                            <option value="90">90° Vertical</option>
                            <option value="-45">-45° Diagonal</option>
                        </select>
                    </div>

                    <div class="form-group" id="wm-color-block">
                        <label for="wm-color">Text Color</label>
                        <input type="color" id="wm-color" class="input-control" value="#ff0000" style="height:45px; padding:2px;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="wm-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="wm-btn-action">Stamp & Download PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('wm-dropzone');
    const input = document.getElementById('wm-input');
    const workspace = document.getElementById('wm-workspace');
    const fileName = document.getElementById('wm-file-name');
    const typeSelect = document.getElementById('wm-type');
    const textBlock = document.getElementById('wm-text-block');
    const textInput = document.getElementById('wm-text');
    const imageBlock = document.getElementById('wm-image-block');
    const imageInput = document.getElementById('wm-image');
    const posSelect = document.getElementById('wm-pos');
    const opacitySelect = document.getElementById('wm-opacity');
    const rotateSelect = document.getElementById('wm-rotate');
    const colorBlock = document.getElementById('wm-color-block');
    const colorInput = document.getElementById('wm-color');
    const reset = document.getElementById('wm-btn-reset');
    const action = document.getElementById('wm-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let imgDataUrl = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            process(file);
        }
    });

    typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'text') {
            textBlock.style.display = 'block';
            colorBlock.style.display = 'block';
            imageBlock.style.display = 'none';
        } else {
            textBlock.style.display = 'none';
            colorBlock.style.display = 'none';
            imageBlock.style.display = 'block';
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgDataUrl = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        imageInput.value = '';
        pdfBytes = null;
        imgDataUrl = null;
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

            const isText = typeSelect.value === 'text';
            const opacity = parseFloat(opacitySelect.value) || 0.4;
            const rotateDeg = parseInt(rotateSelect.value) || 0;
            const pos = posSelect.value;

            let imageRef = null;
            if (!isText && imgDataUrl) {
                const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
                if (imgDataUrl.includes('image/png')) {
                    imageRef = await doc.embedPng(imgBytes);
                } else {
                    imageRef = await doc.embedJpg(imgBytes);
                }
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                let x = width / 2;
                let y = height / 2;

                if (pos === 'top-left') { x = 60; y = height - 60; }
                else if (pos === 'top-right') { x = width - 150; y = height - 60; }
                else if (pos === 'bottom-left') { x = 60; y = 60; }
                else if (pos === 'bottom-right') { x = width - 150; y = 60; }

                if (isText) {
                    const hexColor = colorInput.value;
                    const r = parseInt(hexColor.slice(1,3), 16) / 255;
                    const g = parseInt(hexColor.slice(3,5), 16) / 255;
                    const b = parseInt(hexColor.slice(5,7), 16) / 255;

                    page.drawText(textInput.value || 'COPYRIGHT', {
                        x,
                        y,
                        size: 36,
                        opacity,
                        color: PDFLib.rgb(r, g, b),
                        rotate: PDFLib.degrees(rotateDeg)
                    });
                } else if (imageRef) {
                    const imgW = 120;
                    const imgH = 60;
                    page.drawImage(imageRef, {
                        x: x - imgW / 2,
                        y: y - imgH / 2,
                        width: imgW,
                        height: imgH,
                        opacity
                    });
                }
            }

            const stamped = await doc.save();
            const blob = new Blob([stamped], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'watermarked_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Failed to stamp watermark onto PDF.');
        }
    });
}
`
    }),
    'page-numbers-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="num-dropzone">
                <span class="upload-icon">🔢</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Apply dynamic page counters to PDF margins</p>
                </div>
                <input type="file" class="upload-input" id="num-input" accept=".pdf">
            </div>

            <div id="num-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Loaded Filename: <strong id="num-file-name">-</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="num-start">Start Counter At</label>
                        <input type="number" id="num-start" class="input-control" value="1" min="1">
                    </div>

                    <div class="form-group">
                        <label for="num-pos">Counter Position</label>
                        <select id="num-pos" class="input-control">
                            <option value="bottom-center" selected>Bottom Center</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="num-size">Font Size</label>
                        <select id="num-size" class="input-control">
                            <option value="10">10 pt</option>
                            <option value="12" selected>12 pt</option>
                            <option value="14">14 pt</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="num-color">Counter Color</label>
                        <input type="color" id="num-color" class="input-control" value="#000000" style="height:45px; padding:2px;">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="num-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="num-btn-action">Number Pages & Download</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),
    'html-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="form-group">
                <label for="html-val">Enter HTML Code</label>
                <textarea id="html-val" class="input-control" style="min-height:180px; font-family:var(--font-mono); font-size:0.85rem;" placeholder="Type html template here..."></textarea>
            </div>

            <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; margin-top:1rem;">
                <h5 style="margin-bottom:0.5rem; font-weight:600;">HTML Live Preview Viewport</h5>
                <iframe id="html-preview-frame" style="width:100%; height:250px; border:1px dashed var(--border-color); border-radius:var(--radius-xs); background:#ffffff;"></iframe>
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
    const iframe = document.getElementById('html-preview-frame');
    const action = document.getElementById('html-btn-action');

    if (!textarea) return;

    // Set sample HTML template
    textarea.value = \`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #333; }
    h1 { color: #2563eb; }
    p { line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>Interactive HTML Document</h1>
  <p>This PDF was generated client-side from formatted HTML text code inputs.</p>
  <table>
    <tr><th>Item Name</th><th>Quantity</th><th>Unit Price</th></tr>
    <tr><td>Product Alpha</td><td>2</td><td>$45.00</td></tr>
    <tr><td>Product Beta</td><td>1</td><td>$99.00</td></tr>
  </table>
</body>
</html>\`;

    updatePreview();

    previewBtn.addEventListener('click', updatePreview);

    function updatePreview() {
        iframe.srcdoc = textarea.value;
    }

    action.addEventListener('click', () => {
        const val = textarea.value;
        if (!val.trim()) return;

        // Render HTML element compilation via html2pdf library
        const element = iframe.contentDocument.body || iframe.contentWindow.document.documentElement;
        const opt = {
            margin:       0.5,
            filename:     'html_converted.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });
}
`
    }),
    'excel-to-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="xls-dropzone">
                <span class="upload-icon">📊</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop Excel here</h4>
                    <p>Supports XLS, XLSX workbooks</p>
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
                    <div id="xls-grid-preview" style="background:#ffffff; border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-xs); min-height:150px; font-size:0.8rem;"></div>
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

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
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
            alert('Failed to parse Excel workbook.');
        }
    }

    function renderSheet() {
        if (!workbook) return;
        const sheetName = sheetSelect.value;
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet data to raw HTML table
        let htmlTable = XLSX.utils.sheet_to_html(worksheet);

        // Styled tables margins override
        htmlTable = htmlTable.replace('<table>', '<table style="width:100%; border-collapse:collapse; text-align:left;">');
        htmlTable = htmlTable.replace(/<td>/g, '<td style="border:1px solid var(--border-color); padding:6px; min-width:80px;">');
        htmlTable = htmlTable.replace(/<th>/g, '<th style="border:1px solid var(--border-color); padding:6px; background-color:var(--bg-secondary);">');

        previewGrid.innerHTML = htmlTable;
    }

    action.addEventListener('click', () => {
        if (!previewGrid.innerHTML) return;
        
        const opt = {
            margin:       0.4,
            filename:     'excel_sheet_output.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(previewGrid.firstChild).save();
    });
}
`
    }),
    'pdf-page-extractor': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="pe-dropzone">
                <span class="upload-icon">✂️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Isolate and extract specific pages visually</p>
                </div>
                <input type="file" class="upload-input" id="pe-input" accept=".pdf">
            </div>

            <div id="pe-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    Name: <strong id="pe-file-name">-</strong>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Check Pages to Extract</h5>
                    <div id="pe-thumbnails-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:1rem; max-height:280px; overflow-y:auto; padding:0.5rem; background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-xs);"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="pe-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="pe-btn-action">Extract Checked Pages</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('pe-dropzone');
    const input = document.getElementById('pe-input');
    const workspace = document.getElementById('pe-workspace');
    const fileName = document.getElementById('pe-file-name');
    const grid = document.getElementById('pe-thumbnails-grid');
    const reset = document.getElementById('pe-btn-reset');
    const action = document.getElementById('pe-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let pagesCount = 0;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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
        grid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        pagesCount = pdf.numPages;

        grid.innerHTML = '';
        for (let i = 1; i <= pagesCount; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const cell = document.createElement('div');
            cell.style.textAlign = 'center';
            cell.style.border = '1px solid var(--border-color)';
            cell.style.borderRadius = 'var(--radius-xs)';
            cell.style.padding = '0.5rem';
            cell.style.background = 'var(--bg-secondary)';

            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.style.maxWidth = '100%';
            img.style.height = '65px';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            img.style.margin = '0 auto 0.5rem';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i - 1; // 0-indexed page reference
            checkbox.id = 'page-check-' + i;

            const label = document.createElement('label');
            label.htmlFor = 'page-check-' + i;
            label.textContent = ' Page ' + i;
            label.style.fontSize = '0.75rem';
            label.style.cursor = 'pointer';

            cell.appendChild(img);
            cell.appendChild(checkbox);
            cell.appendChild(label);
            grid.appendChild(cell);
        }

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        const checkedIndices = [];
        grid.querySelectorAll('input[type="checkbox"]').forEach(box => {
            if (box.checked) {
                checkedIndices.push(parseInt(box.value));
            }
        });

        if (checkedIndices.length === 0) {
            alert('Please check at least one page to extract.');
            return;
        }

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const extractedDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await extractedDoc.copyPages(doc, checkedIndices);
            copiedPages.forEach(p => extractedDoc.addPage(p));

            const outBytes = await extractedDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted_pages.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to extract pages: ' + err.message);
        }
    });
}
`
    }),
    'pdf-page-organizer': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="po-dropzone">
                <span class="upload-icon">🗂️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Reorder, rotate, or delete individual pages visually</p>
                </div>
                <input type="file" class="upload-input" id="po-input" accept=".pdf">
            </div>

            <div id="po-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    Name: <strong id="po-file-name">-</strong>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Organize Pages (Drag & Drop or use arrows to rearrange)</h5>
                    <div id="po-thumbnails-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:1rem; max-height:350px; overflow-y:auto; padding:0.5rem; background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-xs);"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="po-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="po-btn-action">Compile & Download Organized PDF</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('po-dropzone');
    const input = document.getElementById('po-input');
    const workspace = document.getElementById('po-workspace');
    const fileName = document.getElementById('po-file-name');
    const list = document.getElementById('po-thumbnails-list');
    const reset = document.getElementById('po-btn-reset');
    const action = document.getElementById('po-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let pagesArr = []; // { originalIdx, currentRot, thumbUrl }

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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
        pagesArr = [];
        list.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        const total = pdf.numPages;

        pagesArr = [];
        for (let i = 1; i <= total; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.25 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            pagesArr.push({
                originalIdx: i - 1, // 0-indexed
                currentRot: 0, // rotation offset: 0, 90, 180, 270
                thumbUrl: canvas.toDataURL()
            });
        }

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        renderPages();
    }

    function renderPages() {
        list.innerHTML = '';
        pagesArr.forEach((item, idx) => {
            const card = document.createElement('div');
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius-xs)';
            card.style.padding = '0.5rem';
            card.style.background = 'var(--bg-secondary)';
            card.style.textAlign = 'center';
            card.setAttribute('draggable', 'true');

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', idx);
            });
            card.addEventListener('dragover', (e) => { e.preventDefault(); });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                if (fromIdx !== idx) {
                    const temp = pagesArr[fromIdx];
                    pagesArr.splice(fromIdx, 1);
                    pagesArr.splice(idx, 0, temp);
                    renderPages();
                }
            });

            const img = document.createElement('img');
            img.src = item.thumbUrl;
            img.style.maxWidth = '100%';
            img.style.height = '60px';
            img.style.objectFit = 'contain';
            img.style.transform = 'rotate(' + item.currentRot + 'deg)';
            img.style.transition = 'transform 0.2s';
            img.style.display = 'block';
            img.style.margin = '0 auto 0.5rem';

            const label = document.createElement('div');
            label.textContent = 'Page ' + (item.originalIdx + 1);
            label.style.fontSize = '0.75rem';
            label.style.fontWeight = '600';
            label.style.marginBottom = '0.5rem';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.justifyContent = 'center';
            controls.style.gap = '0.2rem';

            const btnRot = document.createElement('button');
            btnRot.className = 'btn';
            btnRot.style.padding = '2px 6px';
            btnRot.style.fontSize = '0.7rem';
            btnRot.textContent = '⟳';
            btnRot.onclick = () => {
                item.currentRot = (item.currentRot + 90) % 360;
                img.style.transform = 'rotate(' + item.currentRot + 'deg)';
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'btn';
            btnDel.style.padding = '2px 6px';
            btnDel.style.fontSize = '0.7rem';
            btnDel.style.backgroundColor = 'var(--error-color)';
            btnDel.style.color = '#ffffff';
            btnDel.textContent = '✕';
            btnDel.onclick = () => {
                pagesArr.splice(idx, 1);
                if (pagesArr.length === 0) {
                    reset.click();
                } else {
                    renderPages();
                }
            };

            controls.appendChild(btnRot);
            controls.appendChild(btnDel);

            card.appendChild(img);
            card.appendChild(label);
            card.appendChild(controls);
            list.appendChild(card);
        });
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes || pagesArr.length === 0) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const organizedDoc = await PDFLib.PDFDocument.create();

            for (const item of pagesArr) {
                const copiedPages = await organizedDoc.copyPages(doc, [item.originalIdx]);
                const page = organizedDoc.addPage(copiedPages[0]);
                if (item.currentRot > 0) {
                    const rot = page.getRotation().angle;
                    page.setRotation(PDFLib.degrees(rot + item.currentRot));
                }
            }

            const outBytes = await organizedDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organized_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to save organized PDF: ' + err.message);
        }
    });
}
`
    }),
    'delete-pdf-pages': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="dp-dropzone">
                <span class="upload-icon">🗑️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Select unwanted pages to delete from document layout</p>
                </div>
                <input type="file" class="upload-input" id="dp-input" accept=".pdf">
            </div>

            <div id="dp-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    Name: <strong id="dp-file-name">-</strong>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h5 style="margin-bottom:0.75rem; font-weight:600;">Check Pages to Delete</h5>
                    <div id="dp-thumbnails-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:1rem; max-height:280px; overflow-y:auto; padding:0.5rem; background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-xs);"></div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="dp-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="dp-btn-action" style="background-color:var(--error-color); border-color:var(--error-color); color:#ffffff;">Delete Selected Pages</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('dp-dropzone');
    const input = document.getElementById('dp-input');
    const workspace = document.getElementById('dp-workspace');
    const fileName = document.getElementById('dp-file-name');
    const grid = document.getElementById('dp-thumbnails-grid');
    const reset = document.getElementById('dp-btn-reset');
    const action = document.getElementById('dp-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let pagesCount = 0;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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
        grid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        pagesCount = pdf.numPages;

        grid.innerHTML = '';
        for (let i = 1; i <= pagesCount; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const cell = document.createElement('div');
            cell.style.textAlign = 'center';
            cell.style.border = '1px solid var(--border-color)';
            cell.style.borderRadius = 'var(--radius-xs)';
            cell.style.padding = '0.5rem';
            cell.style.background = 'var(--bg-secondary)';

            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            img.style.maxWidth = '100%';
            img.style.height = '65px';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            img.style.margin = '0 auto 0.5rem';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i - 1; // 0-indexed page reference
            checkbox.id = 'page-check-' + i;

            const label = document.createElement('label');
            label.htmlFor = 'page-check-' + i;
            label.textContent = ' Page ' + i;
            label.style.fontSize = '0.75rem';
            label.style.cursor = 'pointer';

            cell.appendChild(img);
            cell.appendChild(checkbox);
            cell.appendChild(label);
            grid.appendChild(cell);
        }

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        const deleteIndices = [];
        grid.querySelectorAll('input[type="checkbox"]').forEach(box => {
            if (box.checked) {
                deleteIndices.push(parseInt(box.value));
            }
        });

        if (deleteIndices.length === 0) {
            alert('Please check at least one page to delete.');
            return;
        }

        if (deleteIndices.length === pagesCount) {
            alert('Cannot delete all pages. At least one page must remain.');
            return;
        }

        const keepIndices = [];
        for (let i = 0; i < pagesCount; i++) {
            if (!deleteIndices.includes(i)) {
                keepIndices.push(i);
            }
        }

        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const prunedDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await prunedDoc.copyPages(doc, keepIndices);
            copiedPages.forEach(p => prunedDoc.addPage(p));

            const outBytes = await prunedDoc.save();
            const blob = new Blob([outBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pages_deleted.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to delete pages: ' + err.message);
        }
    });
}
`
    }),
    'pdf-metadata-editor': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="meta-dropzone">
                <span class="upload-icon">✍️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Read and update standard file metadata keys</p>
                </div>
                <input type="file" class="upload-input" id="meta-input" accept=".pdf">
            </div>

            <div id="meta-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem;">
                    Name: <strong id="meta-file-name">-</strong>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="meta-title">Title</label>
                        <input type="text" id="meta-title" class="input-control">
                    </div>
                    <div class="form-group">
                        <label for="meta-author">Author</label>
                        <input type="text" id="meta-author" class="input-control">
                    </div>
                    <div class="form-group">
                        <label for="meta-subject">Subject</label>
                        <input type="text" id="meta-subject" class="input-control">
                    </div>
                    <div class="form-group">
                        <label for="meta-keywords">Keywords</label>
                        <input type="text" id="meta-keywords" class="input-control" placeholder="comma-separated words">
                    </div>
                    <div class="form-group">
                        <label for="meta-creator">Creator</label>
                        <input type="text" id="meta-creator" class="input-control" readonly style="background-color:var(--bg-secondary);">
                    </div>
                    <div class="form-group">
                        <label for="meta-producer">Producer</label>
                        <input type="text" id="meta-producer" class="input-control" readonly style="background-color:var(--bg-secondary);">
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="meta-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="meta-btn-action">Save Metadata & Download</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('meta-dropzone');
    const input = document.getElementById('meta-input');
    const workspace = document.getElementById('meta-workspace');
    const fileName = document.getElementById('meta-file-name');
    const titleInput = document.getElementById('meta-title');
    const authorInput = document.getElementById('meta-author');
    const subjectInput = document.getElementById('meta-subject');
    const keywordsInput = document.getElementById('meta-keywords');
    const creatorInput = document.getElementById('meta-creator');
    const producerInput = document.getElementById('meta-producer');
    const reset = document.getElementById('meta-btn-reset');
    const action = document.getElementById('meta-btn-action');

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
        
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            titleInput.value = doc.getTitle() || '';
            authorInput.value = doc.getAuthor() || '';
            subjectInput.value = doc.getSubject() || '';
            keywordsInput.value = (doc.getKeywords() || '').split(';').join(', ');
            creatorInput.value = doc.getCreator() || 'AllInOneTool';
            producerInput.value = doc.getProducer() || 'pdf-lib (v1.17.1)';

            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (err) {
            alert('Failed to load PDF metadata.');
        }
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            doc.setTitle(titleInput.value);
            doc.setAuthor(authorInput.value);
            doc.setSubject(subjectInput.value);
            
            const kwArray = keywordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            doc.setKeywords(kwArray);

            const savedBytes = await doc.save();
            const blob = new Blob([savedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'updated_metadata.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to save metadata.');
        }
    });
}
`
    }),
    'crop-pdf': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div class="upload-zone" id="crop-dropzone">
                <span class="upload-icon">✂️</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Crop vector page dimensions and trim document margins</p>
                </div>
                <input type="file" class="upload-input" id="crop-input" accept=".pdf">
            </div>

            <div id="crop-workspace" style="display:none; flex-direction:column; gap:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    Name: <strong id="crop-file-name">-</strong>
                </div>

                <div style="display:flex; justify-content:center; align-items:center; overflow:hidden; padding:1rem; background:var(--bg-secondary); border-radius:var(--radius-sm);">
                    <div style="position:relative; display:inline-block; border:1px solid var(--border-color);" id="crop-canvas-wrapper">
                        <canvas id="crop-preview-canvas" style="max-height:280px; max-width:100%; display:block; background:#ffffff;"></canvas>
                        <!-- Crop Box Overlay Overlay -->
                        <div id="crop-overlay-box" style="position:absolute; top:15%; left:15%; width:70%; height:70%; border:2px dashed #2563eb; cursor:move; box-sizing:border-box;"></div>
                    </div>
                </div>

                <div class="options-grid">
                    <div class="form-group">
                        <label for="crop-scope">Apply Crop Scope</label>
                        <select id="crop-scope" class="input-control">
                            <option value="all" selected>All Pages</option>
                            <option value="current">Current Page (Page 1) Only</option>
                        </select>
                    </div>
                </div>

                <div class="action-row">
                    <button class="btn btn-secondary" id="crop-btn-reset">Reset</button>
                    <button class="btn btn-primary" id="crop-btn-action">Trim Margins & Download</button>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const fileName = document.getElementById('crop-file-name');
    const canvas = document.getElementById('crop-preview-canvas');
    const wrapper = document.getElementById('crop-canvas-wrapper');
    const overlay = document.getElementById('crop-overlay-box');
    const scopeSelect = document.getElementById('crop-scope');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let naturalWidth = 0;
    let naturalHeight = 0;

    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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

    // Simple Drag overlay
    overlay.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(overlay.style.left) || 15;
        startTop = parseFloat(overlay.style.top) || 15;
    }

    function drag(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const containerRect = wrapper.getBoundingClientRect();
        
        let leftPercent = startLeft + (dx / containerRect.width) * 100;
        let topPercent = startTop + (dy / containerRect.height) * 100;

        leftPercent = Math.max(0, Math.min(leftPercent, 100 - parseFloat(overlay.style.width)));
        topPercent = Math.max(0, Math.min(topPercent, 100 - parseFloat(overlay.style.height)));

        overlay.style.left = leftPercent.toFixed(1) + '%';
        overlay.style.top = topPercent.toFixed(1) + '%';
    }

    function stopDrag() {
        isDragging = false;
    }

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.6 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        naturalWidth = viewport.width;
        naturalHeight = viewport.height;

        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = doc.getPages();

            const leftPct = parseFloat(overlay.style.left) / 100;
            const topPct = parseFloat(overlay.style.top) / 100;
            const widthPct = parseFloat(overlay.style.width) / 100;
            const heightPct = parseFloat(overlay.style.height) / 100;

            const scope = scopeSelect.value;
            const limit = scope === 'current' ? 1 : pages.length;

            for (let i = 0; i < limit; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();

                // Compute cropbox bounds
                const x = width * leftPct;
                const y = height * (1 - topPct - heightPct); // PDF coordinates (bottom-left = 0,0)
                const w = width * widthPct;
                const h = height * heightPct;

                page.setCropBox(x, y, w, h);
            }

            const croppedBytes = await doc.save();
            const blob = new Blob([croppedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropped_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to crop PDF document.');
        }
    });
}
`
    }),
    'pdf-reader': () => ({
        workspaceHTML: `
        <div class="tool-workspace" style="max-width:100%; padding:0;">
            <div class="upload-zone" id="pr-dropzone" style="margin: 2rem;">
                <span class="upload-icon">📖</span>
                <div class="upload-text">
                    <h4>Click or Drag & Drop PDF here</h4>
                    <p>Open and read PDF files in a clean visual layout workspace</p>
                </div>
                <input type="file" class="upload-input" id="pr-input" accept=".pdf">
            </div>

            <div id="pr-workspace" style="display:none; flex-direction:column; background:var(--bg-secondary); border-radius:var(--radius-sm); border:1px solid var(--border-color); overflow:hidden;">
                <!-- Reader Toolbar -->
                <div style="background:var(--bg-primary); border-bottom:1px solid var(--border-color); padding:0.5rem 1rem; display:flex; flex-wrap:wrap; align-items:center; gap:0.75rem;">
                    <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-secondary" id="pr-btn-prev" style="padding:4px 8px;">◀ Prev</button>
                        <button class="btn btn-secondary" id="pr-btn-next" style="padding:4px 8px;">Next ▶</button>
                    </div>

                    <div style="font-size:0.85rem; color:var(--text-secondary);">
                        Page <span id="pr-page-num" style="font-weight:600;">1</span> of <span id="pr-page-count">-</span>
                    </div>

                    <div style="display:flex; align-items:center; gap:0.25rem; margin-left:auto;">
                        <button class="btn btn-secondary" id="pr-btn-zoomin" style="padding:4px 8px;">➕ Zoom In</button>
                        <button class="btn btn-secondary" id="pr-btn-zoomout" style="padding:4px 8px;">➖ Zoom Out</button>
                    </div>

                    <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-secondary" id="pr-btn-fit" style="padding:4px 8px;">Fit Width</button>
                        <button class="btn btn-secondary" id="pr-btn-print" style="padding:4px 8px;">🖨️ Print</button>
                        <button class="btn btn-secondary" id="pr-btn-reset" style="padding:4px 8px; background-color:var(--error-color); color:#ffffff; border-color:var(--error-color);">Close</button>
                    </div>
                </div>

                <!-- Main Viewport Layout -->
                <div style="display:grid; grid-template-columns:180px 1fr; height:450px;">
                    <!-- Thumbnails Sidebar -->
                    <div id="pr-sidebar" style="background:#ffffff; border-right:1px solid var(--border-color); overflow-y:auto; padding:0.75rem; display:flex; flex-direction:column; gap:1rem;"></div>

                    <!-- Reading canvas display -->
                    <div id="pr-viewport" style="overflow:auto; display:flex; align-items:flex-start; justify-content:center; padding:1.5rem; background:#475569;">
                        <canvas id="pr-render-canvas" style="box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); background:#ffffff;"></canvas>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const dropzone = document.getElementById('pr-dropzone');
    const input = document.getElementById('pr-input');
    const workspace = document.getElementById('pr-workspace');
    const sidebar = document.getElementById('pr-sidebar');
    const canvas = document.getElementById('pr-render-canvas');
    const prevBtn = document.getElementById('pr-btn-prev');
    const nextBtn = document.getElementById('pr-btn-next');
    const pageNumText = document.getElementById('pr-page-num');
    const pageCountText = document.getElementById('pr-page-count');
    const zoomInBtn = document.getElementById('pr-btn-zoomin');
    const zoomOutBtn = document.getElementById('pr-btn-zoomout');
    const fitBtn = document.getElementById('pr-btn-fit');
    const printBtn = document.getElementById('pr-btn-print');
    const reset = document.getElementById('pr-btn-reset');

    if (!input) return;
    let pdfDoc = null;
    let totalPages = 0;
    let activePage = 1;
    let zoomScale = 1.0;
    let fileUrl = null;

    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileUrl = URL.createObjectURL(file);
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        pdfDoc = null;
        sidebar.innerHTML = '';
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            fileUrl = null;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (activePage > 1) {
            activePage--;
            renderActivePage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (activePage < totalPages) {
            activePage++;
            renderActivePage();
        }
    });

    zoomInBtn.addEventListener('click', () => {
        zoomScale += 0.25;
        renderActivePage();
    });

    zoomOutBtn.addEventListener('click', () => {
        if (zoomScale > 0.5) {
            zoomScale -= 0.25;
            renderActivePage();
        }
    });

    fitBtn.addEventListener('click', () => {
        zoomScale = 1.0;
        renderActivePage();
    });

    printBtn.addEventListener('click', () => {
        if (fileUrl) {
            const w = window.open(fileUrl);
            w.print();
        }
    });

    async function process(file) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        pageCountText.textContent = totalPages;
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';

        activePage = 1;
        zoomScale = 1.0;

        await renderSidebarThumbs();
        renderActivePage();
    }

    async function renderSidebarThumbs() {
        sidebar.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.15 });
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = viewport.width;
            tempCanvas.height = viewport.height;
            const ctx = tempCanvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const thumbBox = document.createElement('div');
            thumbBox.style.padding = '4px';
            thumbBox.style.border = '2px solid transparent';
            thumbBox.style.borderRadius = 'var(--radius-xs)';
            thumbBox.style.cursor = 'pointer';
            thumbBox.style.textAlign = 'center';
            thumbBox.id = 'thumb-page-' + i;

            if (i === activePage) {
                thumbBox.style.borderColor = '#2563eb';
            }

            thumbBox.onclick = () => {
                activePage = i;
                renderActivePage();
            };

            const img = document.createElement('img');
            img.src = tempCanvas.toDataURL();
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70px';
            img.style.border = '1px solid var(--border-color)';

            const label = document.createElement('div');
            label.textContent = i;
            label.style.fontSize = '0.7rem';
            label.style.color = 'var(--text-secondary)';

            thumbBox.appendChild(img);
            thumbBox.appendChild(label);
            sidebar.appendChild(thumbBox);
        }
    }

    async function renderActivePage() {
        if (!pdfDoc) return;
        pageNumText.textContent = activePage;

        // Highlight active thumbnail
        for (let i = 1; i <= totalPages; i++) {
            const el = document.getElementById('thumb-page-' + i);
            if (el) {
                el.style.borderColor = i === activePage ? '#2563eb' : 'transparent';
            }
        }

        const page = await pdfDoc.getPage(activePage);
        const viewport = page.getViewport({ scale: zoomScale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        await page.render(renderContext).promise;
    }
}
`
    })
};
