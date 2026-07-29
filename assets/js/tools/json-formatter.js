export function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const errorMsg = document.getElementById('json-error-msg');
    const indentSel = document.getElementById('json-indent');
    const beauty = document.getElementById('json-beautify');
    const mini = document.getElementById('json-minify');
    const clearBtn = document.getElementById('json-clear');
    const reset = document.getElementById('json-reset');
    const copy = document.getElementById('json-copy');
    const download = document.getElementById('json-download');
    const actionRow = document.getElementById('json-action-row');

    if (!input) return;

    function preprocessInput(val) {
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            try {
                return JSON.parse(val);
            } catch (e) {
                return val.slice(1, -1)
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\t/g, '\t')
                    .replace(/\\\\/g, '\\');
            }
        }
        if (val.startsWith("'") && val.endsWith("'")) {
            return val.slice(1, -1)
                .replace(/\\'/g, "'")
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');
        }
        return val;
    }

    function showSuccess(result) {
        output.value = result;
        errorMsg.style.display = 'none';
        actionRow.style.display = 'flex';
    }

    function showError(err) {
        output.value = '';
        actionRow.style.display = 'none';
        
        let msg = err.message;
        let line = null;
        let col = null;

        const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
        if (lineColMatch) {
            line = parseInt(lineColMatch[1], 10);
            col = parseInt(lineColMatch[2], 10);
        } else {
            const posMatch = msg.match(/position\s+(\d+)/i);
            if (posMatch) {
                const pos = parseInt(posMatch[1], 10);
                const prefix = input.value.slice(0, pos);
                const lines = prefix.split('\n');
                line = lines.length;
                col = lines[lines.length - 1].length + 1;
            }
        }

        if (line !== null && col !== null) {
            errorMsg.textContent = '❌ Syntax Error: ' + msg + ' (at Line ' + line + ', Col ' + col + ')';
        } else {
            errorMsg.textContent = '❌ Syntax Error: ' + msg;
        }
        errorMsg.style.display = 'block';
    }

    beauty.addEventListener('click', () => {
        let val = input.value.trim();
        if (!val) return;
        val = preprocessInput(val);
        try {
            let parsed = JSON.parse(val);
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            const spaces = parseInt(indentSel.value, 10) || 2;
            showSuccess(JSON.stringify(parsed, null, spaces));
        } catch(e) {
            showError(e);
        }
    });

    mini.addEventListener('click', () => {
        let val = input.value.trim();
        if (!val) return;
        val = preprocessInput(val);
        try {
            let parsed = JSON.parse(val);
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            showSuccess(JSON.stringify(parsed));
        } catch(e) {
            showError(e);
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        indentSel.value = '2';
        errorMsg.style.display = 'none';
        actionRow.style.display = 'none';
    });

    copy.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => alert('Copied JSON to clipboard!'));
    });

    download.addEventListener('click', () => {
        if (!output.value) return;
        const blob = new Blob([output.value], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}
