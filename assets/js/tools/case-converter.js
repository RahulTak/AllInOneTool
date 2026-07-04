export function init() {
    const input = document.getElementById('text-input');
    const output = document.getElementById('text-output');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');
    const caseBtns = document.querySelectorAll('[data-case]');

    if (!input) return;

    caseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.getAttribute('data-case');
            const val = input.value;
            output.textContent = convertCase(val, format);
        });
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent || '').then(() => {
            alert('Copied!');
        });
    });

    function convertCase(str, format) {
        if (!str) return '';
        switch(format) {
            case 'upper': return str.toUpperCase();
            case 'lower': return str.toLowerCase();
            case 'title': return str.replace(/\b\w/g, c => c.toUpperCase());
            case 'sentence': return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            case 'camel': return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            case 'snake': return str.toLowerCase().replace(/\s+/g, '_');
            case 'kebab': return str.toLowerCase().replace(/\s+/g, '-');
            case 'constant': return str.toUpperCase().replace(/\s+/g, '_');
            default: return str;
        }
    }
}
