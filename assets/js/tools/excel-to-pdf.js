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
