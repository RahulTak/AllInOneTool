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
