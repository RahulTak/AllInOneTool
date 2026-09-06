export function init() {
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
            originalName = file.name.replace(/\.[^/.]+$/, "");
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

    async function generateDataDrivenPdf(rows, sheetName, originalName) {
        const PDFLib = window.PDFLib;
        if (!PDFLib) {
            throw new Error('PDFLib library is required for data-driven PDF generation.');
        }

        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Filter out completely empty rows
        const cleanRows = rows.filter(r => r && r.some(c => c !== null && c !== undefined && String(c).trim() !== ''));
        if (cleanRows.length === 0) {
            throw new Error('No data found in sheet to export.');
        }

        // Determine column count
        const colCount = Math.max(...cleanRows.map(r => r.length));
        if (colCount === 0) {
            throw new Error('No columns found in sheet data.');
        }

        // Normalize all rows to have colCount cells and sanitize text for StandardFonts
        const normalizedRows = cleanRows.map(r => {
            const row = [];
            for (let i = 0; i < colCount; i++) {
                const val = r[i] !== undefined && r[i] !== null ? String(r[i]).trim() : '';
                // Sanitize text for standard font (WinAnsi encoding)
                row.push(val.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' '));
            }
            return row;
        });

        // Use landscape orientation for spreadsheets to provide ample width
        const pageWidth = 792;  // Letter landscape: 11in = 792 pt
        const pageHeight = 612; // 8.5in = 612 pt
        const marginLeft = 36;
        const marginRight = 36;
        const marginTop = 45;
        const marginBottom = 40;
        const tableWidth = pageWidth - marginLeft - marginRight;

        // Calculate column widths based on content lengths
        const colMaxLens = new Array(colCount).fill(1);
        normalizedRows.forEach(row => {
            row.forEach((cell, i) => {
                colMaxLens[i] = Math.max(colMaxLens[i], cell.length);
            });
        });

        const totalLenScore = colMaxLens.reduce((sum, len) => sum + Math.min(len, 40), 0);
        let colWidths = colMaxLens.map(len => {
            const ratio = Math.min(len, 40) / (totalLenScore || 1);
            return Math.max(50, Math.floor(ratio * tableWidth));
        });

        // Adjust sum of column widths to exactly match tableWidth
        const currentSum = colWidths.reduce((a, b) => a + b, 0);
        const diff = tableWidth - currentSum;
        colWidths[colWidths.length - 1] += diff;

        // Row metrics
        const headerRowHeight = 22;
        const dataRowHeight = 18;
        const fontSizeHeader = 8.5;
        const fontSizeData = 8;

        // Calculate rows per page
        // Page 1 has title block (~32pt)
        const firstPageAvailableHeight = pageHeight - marginTop - marginBottom - 32;
        const firstPageRowsCount = Math.max(1, Math.floor((firstPageAvailableHeight - headerRowHeight) / dataRowHeight));
        const subPageAvailableHeight = pageHeight - marginTop - marginBottom;
        const subPageRowsCount = Math.max(1, Math.floor((subPageAvailableHeight - headerRowHeight) / dataRowHeight));

        // Data rows: index 0 is header, 1..N are data
        const headerRow = normalizedRows[0];
        const dataRows = normalizedRows.slice(1);

        // Group data rows into pages
        const pagesData = [];
        let rIndex = 0;
        pagesData.push(dataRows.slice(0, firstPageRowsCount));
        rIndex = firstPageRowsCount;
        while (rIndex < dataRows.length) {
            pagesData.push(dataRows.slice(rIndex, rIndex + subPageRowsCount));
            rIndex += subPageRowsCount;
        }

        const totalPages = pagesData.length;

        function truncate(text, font, size, maxWidth) {
            if (!text) return '';
            let current = text;
            while (current.length > 0 && font.widthOfTextAtSize(current, size) > maxWidth) {
                current = current.slice(0, -1);
            }
            if (current.length < text.length && current.length > 3) {
                current = current.slice(0, -3) + '...';
            }
            return current;
        }

        // Draw each page
        pagesData.forEach((pageRows, pageIdx) => {
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
            let currentY = pageHeight - marginTop;

            // Header info on first page
            if (pageIdx === 0) {
                const title = sheetName ? ('Sheet: ' + sheetName) : 'Spreadsheet Export';
                page.drawText(title, {
                    x: marginLeft,
                    y: currentY,
                    size: 13,
                    font: fontBold,
                    color: rgb(0.06, 0.09, 0.16)
                });
                const sub = 'Workbook: ' + originalName + ' | Total Records: ' + dataRows.length;
                page.drawText(sub, {
                    x: marginLeft,
                    y: currentY - 14,
                    size: 8,
                    font: fontRegular,
                    color: rgb(0.4, 0.45, 0.52)
                });
                currentY -= 32;
            }

            // Draw Table Header
            let currentX = marginLeft;
            colWidths.forEach((w, colIdx) => {
                page.drawRectangle({
                    x: currentX,
                    y: currentY - headerRowHeight,
                    width: w,
                    height: headerRowHeight,
                    color: rgb(0.93, 0.95, 0.98),
                    borderColor: rgb(0.8, 0.84, 0.88),
                    borderWidth: 0.5
                });
                const text = truncate(headerRow[colIdx] || '', fontBold, fontSizeHeader, w - 8);
                if (text) {
                    page.drawText(text, {
                        x: currentX + 4,
                        y: currentY - headerRowHeight + 6,
                        size: fontSizeHeader,
                        font: fontBold,
                        color: rgb(0.06, 0.09, 0.16)
                    });
                }
                currentX += w;
            });
            currentY -= headerRowHeight;

            // Draw Data Rows
            pageRows.forEach((row, rowInPageIdx) => {
                const isEven = rowInPageIdx % 2 === 0;
                const bgColor = isEven ? rgb(1, 1, 1) : rgb(0.97, 0.98, 0.99);
                let colX = marginLeft;

                colWidths.forEach((w, colIdx) => {
                    page.drawRectangle({
                        x: colX,
                        y: currentY - dataRowHeight,
                        width: w,
                        height: dataRowHeight,
                        color: bgColor,
                        borderColor: rgb(0.88, 0.9, 0.93),
                        borderWidth: 0.5
                    });
                    const cellVal = row[colIdx] || '';
                    const text = truncate(cellVal, fontRegular, fontSizeData, w - 8);
                    if (text) {
                        page.drawText(text, {
                            x: colX + 4,
                            y: currentY - dataRowHeight + 5,
                            size: fontSizeData,
                            font: fontRegular,
                            color: rgb(0.12, 0.16, 0.22)
                        });
                    }
                    colX += w;
                });
                currentY -= dataRowHeight;
            });

            // Footer (Page Number)
            const footerText = 'Page ' + (pageIdx + 1) + ' of ' + totalPages;
            const footerWidth = fontRegular.widthOfTextAtSize(footerText, 8);
            page.drawText(footerText, {
                x: (pageWidth - footerWidth) / 2,
                y: 18,
                size: 8,
                font: fontRegular,
                color: rgb(0.45, 0.5, 0.55)
            });
        });

        // Save PDF and validate non-empty binary
        const pdfBytes = await pdfDoc.save();
        if (!pdfBytes || pdfBytes.length < 500) {
            throw new Error('Generated PDF byte buffer is empty or invalid.');
        }

        return new Blob([pdfBytes], { type: 'application/pdf' });
    }

    action.addEventListener('click', async () => {
        const rows = getSheetData();
        if (!rows || rows.length === 0) {
            alert('No spreadsheet data to export.');
            return;
        }

        action.disabled = true;
        action.textContent = 'Generating PDF...';

        try {
            const sheetName = sheetSelect.value || 'Sheet1';
            const blob = await generateDataDrivenPdf(rows, sheetName, originalName || 'spreadsheet');

            if (!blob || blob.size < 500) {
                throw new Error('PDF output is empty or invalid.');
            }

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = (originalName || 'spreadsheet') + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
        } catch (err) {
            console.error('Excel to PDF error:', err);
            alert('Failed to generate PDF: ' + err.message);
        } finally {
            action.disabled = false;
            action.textContent = 'Generate PDF from Sheet';
        }
    });
}
