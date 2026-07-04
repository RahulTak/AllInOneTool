export function init() {
    const rowsInput = document.getElementById('tbl-rows');
    const colsInput = document.getElementById('tbl-cols');
    const output = document.getElementById('tbl-code-output');
    const copy = document.getElementById('tbl-btn-copy');

    if (!rowsInput) return;

    function render() {
        const r = parseInt(rowsInput.value) || 3;
        const c = parseInt(colsInput.value) || 3;

        let html = '<table border="1" cellpadding="5" cellspacing="0">
';
        for(let i=0; i<r; i++) {
            html += '  <tr>
';
            for(let j=0; j<c; j++) {
                html += '    <td>Cell ' + (i+1) + '-' + (j+1) + '</td>
';
            }
            html += '  </tr>
';
        }
        html += '</table>';
        output.value = html;
    }

    [rowsInput, colsInput].forEach(el => el.addEventListener('input', render));
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('HTML Table Code copied!'));
    });

    render();
}
