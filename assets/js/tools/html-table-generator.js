export function init() {
    const rowsInput = document.getElementById('tbl-rows');
    const colsInput = document.getElementById('tbl-cols');
    const alignSel = document.getElementById('tbl-align');
    const headerCheck = document.getElementById('tbl-header');
    const borderWidth = document.getElementById('tbl-border-width');
    const borderColor = document.getElementById('tbl-border-color');
    const cellPadding = document.getElementById('tbl-padding');
    const cellSpacing = document.getElementById('tbl-spacing');

    const preview = document.getElementById('tbl-preview-container');
    const output = document.getElementById('tbl-code-output');
    
    const reset = document.getElementById('tbl-btn-reset');
    const copy = document.getElementById('tbl-btn-copy');
    const download = document.getElementById('tbl-btn-download');

    if (!rowsInput) return;

    function render() {
        const r = Math.min(100, Math.max(1, parseInt(rowsInput.value) || 3));
        const c = Math.min(100, Math.max(1, parseInt(colsInput.value) || 3));
        const align = alignSel.value;
        const hasHeader = headerCheck.checked;
        const border = parseInt(borderWidth.value) || 0;
        const color = borderColor.value;
        const padding = parseInt(cellPadding.value) || 0;
        const spacing = parseInt(cellSpacing.value) || 0;

        let styleAttr = '';
        if (border > 0) {
            styleAttr = ' style="border: ' + border + 'px solid ' + color + '; border-collapse: ' + (spacing === 0 ? 'collapse' : 'separate') + ';"';
        } else {
            styleAttr = ' style="border: none; border-collapse: ' + (spacing === 0 ? 'collapse' : 'separate') + ';"';
        }

        let html = '<table' + styleAttr + ' border="' + border + '" cellpadding="' + padding + '" cellspacing="' + spacing + '">\n';

        // Add Header Row
        if (hasHeader) {
            html += '  <thead>\n    <tr>\n';
            for (let j = 0; j < c; j++) {
                let cellStyle = ' style="border: ' + border + 'px solid ' + color + '; padding: ' + padding + 'px;';
                if (align !== 'none') cellStyle += ' text-align: ' + align + ';';
                cellStyle += '"';
                html += '      <th' + cellStyle + '>Header ' + (j + 1) + '</th>\n';
            }
            html += '    </tr>\n  </thead>\n';
        }

        // Add Body Rows
        html += '  <tbody>\n';
        for (let i = 0; i < r; i++) {
            html += '    <tr>\n';
            for (let j = 0; j < c; j++) {
                let cellStyle = ' style="border: ' + border + 'px solid ' + color + '; padding: ' + padding + 'px;';
                if (align !== 'none') cellStyle += ' text-align: ' + align + ';';
                cellStyle += '"';
                html += '      <td' + cellStyle + '>Cell ' + (i + 1) + '-' + (j + 1) + '</td>\n';
            }
            html += '    </tr>\n';
        }
        html += '  </tbody>\n</table>';

        output.value = html;
        preview.innerHTML = html;
    }

    [rowsInput, colsInput, alignSel, borderWidth, cellPadding, cellSpacing].forEach(el => el.addEventListener('input', render));
    [headerCheck, borderColor].forEach(el => el.addEventListener('change', render));

    reset.addEventListener('click', () => {
        rowsInput.value = '3';
        colsInput.value = '3';
        alignSel.value = 'center';
        headerCheck.checked = true;
        borderWidth.value = '1';
        borderColor.value = '#cccccc';
        cellPadding.value = '8';
        cellSpacing.value = '0';
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('HTML Table Code copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
