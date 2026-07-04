export function init() {
    const input = document.getElementById('html-esc-input');
    const output = document.getElementById('html-esc-output');
    const escapeBtn = document.getElementById('html-esc-escape');
    const unescapeBtn = document.getElementById('html-esc-unescape');
    const reset = document.getElementById('html-esc-reset');

    if (!input) return;

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    function unescapeHtml(str) {
        return str.replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'");
    }

    escapeBtn.addEventListener('click', () => {
        output.value = escapeHtml(input.value);
    });

    unescapeBtn.addEventListener('click', () => {
        output.value = unescapeHtml(input.value);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
