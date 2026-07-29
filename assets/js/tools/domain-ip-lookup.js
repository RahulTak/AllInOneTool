export function init() {
    const input = document.getElementById('dom-input');
    const checkBtn = document.getElementById('dom-btn-check');
    const resetBtn = document.getElementById('dom-btn-reset');
    const results = document.getElementById('dom-results');
    const container = document.getElementById('dom-details-container');

    if (!checkBtn) return;

    function renderRow(label, value, isSuccess = true) {
        const color = isSuccess ? 'var(--text-primary)' : 'var(--error-color)';
        return `
            <div style="display:grid; grid-template-columns:2fr 4fr; gap:1rem; padding:0.4rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                <strong style="color:var(--text-secondary);">${label}</strong>
                <span style="font-family:var(--font-mono); color:${color}; word-break:break-all;">${value}</span>
            </div>
        `;
    }

    checkBtn.addEventListener('click', () => {
        const val = input.value.trim().toLowerCase();
        if (!val) return;

        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
        const isValid = domainRegex.test(val);

        let html = '';
        html += renderRow('Entered Domain', val);
        html += renderRow('Syntax Validation', isValid ? '✅ Valid Domain Format' : '❌ Invalid Domain Name Format', isValid);

        if (isValid) {
            const parts = val.split('.');
            const tld = parts[parts.length - 1];
            const domainName = parts[parts.length - 2];
            
            html += renderRow('Primary TLD', '.' + tld);
            html += renderRow('Root Domain', domainName + '.' + tld);
            html += renderRow('CLI Query Suggestion', 'dig ' + val + ' ANY');
            html += renderRow('NSLookup Query Suggestion', 'nslookup -type=any ' + val);
        }

        container.innerHTML = html;
        results.style.display = 'block';
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        results.style.display = 'none';
    });
}
