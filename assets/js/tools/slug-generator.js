export function init() {
    const input = document.getElementById('slug-val-input');
    const preview = document.getElementById('slug-result-preview');

    if (!input) return;

    function compute() {
        const val = input.value;
        const slug = val.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/^-+|-+$/g, '');
        preview.textContent = slug || '-';
    }

    input.addEventListener('input', compute);
    compute();
}
