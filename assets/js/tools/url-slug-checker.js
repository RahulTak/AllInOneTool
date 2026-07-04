export function init() {
    const input = document.getElementById('slug-checker-val');
    const badge = document.getElementById('slug-checker-badge');
    const tips = document.getElementById('slug-checker-tips');

    if (!input) return;

    function verify() {
        const val = input.value.trim();
        const containsCaps = /[A-Z]/.test(val);
        const containsSpecial = /[^a-z0-9-]/.test(val);
        const tooLong = val.length > 70;

        if (containsCaps || containsSpecial || tooLong || val.length === 0) {
            badge.textContent = 'No (SEO Issues Found)';
            badge.style.color = 'var(--error-color)';
            let issues = [];
            if (containsCaps) issues.push('contains uppercase letters');
            if (containsSpecial) issues.push('contains spaces or special chars');
            if (tooLong) issues.push('exceeds 70 character limit');
            tips.textContent = 'Issues: ' + issues.join(', ') + '.';
        } else {
            badge.textContent = 'Yes (SEO Friendly)';
            badge.style.color = 'var(--success-color)';
            tips.textContent = 'Matches standard lowercase lowercase alphanumeric and hyphen criteria.';
        }
    }

    input.addEventListener('input', verify);
    verify();
}
