export function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const errorMsg = document.getElementById('json-error-msg');
    const beauty = document.getElementById('json-beautify');
    const mini = document.getElementById('json-minify');
    const reset = document.getElementById('json-reset');
    const copy = document.getElementById('json-copy');
    const download = document.getElementById('json-download');
    const actionRow = document.getElementById('json-action-row');

    if (!input) return;

    function showSuccess(result) {
        output.value = result;
        errorMsg.style.display = 'none';
        actionRow.style.display = 'flex';
    }

    function showError(err) {
        output.value = '';
        actionRow.style.display = 'none';
        
        let msg = err.message;
        const posMatch = msg.match(/position\s+(\d+)/i);
        if (posMatch) {
            const pos = parseInt(posMatch[1]);
            const val = input.value;
            const lines = val.slice(0, pos).split('\n');
            msg += ' (at Line ' + lines.length + ', Col ' + (lines[lines.length - 1].length + 1) + ')';
        }
        errorMsg.textContent = '❌ ' + msg;
        errorMsg.style.display = 'block';
    }

    beauty.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        try {
            const parsed = JSON.parse(val);
            showSuccess(JSON.stringify(parsed, null, 4));
        } catch(e) {
            showError(e);
        }
    });

    mini.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        try {
            const parsed = JSON.parse(val);
            showSuccess(JSON.stringify(parsed));
        } catch(e) {
            showError(e);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied JSON to clipboard!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}
