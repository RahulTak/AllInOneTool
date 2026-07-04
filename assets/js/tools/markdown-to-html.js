export function init() {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('html-preview');
    const clearBtn = document.getElementById('md-clear');
    const copyBtn = document.getElementById('md-copy');
    const downloadBtn = document.getElementById('md-download');

    if (!input) return;

    function render() {
        const val = input.value;
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(val);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
            preview.innerHTML = cleanHtml;
        } else {
            preview.textContent = val;
        }
    }

    input.addEventListener('input', render);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        preview.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(input.value);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
            navigator.clipboard.writeText(cleanHtml).then(() => alert('Copied HTML!'));
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(input.value);
            const cleanHtml = rawHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
            const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.html';
            a.click();
            URL.revokeObjectURL(url);
        }
    });
}
