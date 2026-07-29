export function init() {
    const input = document.getElementById('url-input');
    const errorMsg = document.getElementById('url-error');
    const results = document.getElementById('url-results');
    const container = document.getElementById('url-fields-container');
    const reset = document.getElementById('url-reset');

    if (!input) return;

    function renderField(label, value) {
        if (!value) return '';
        return `
            <div style="display:grid; grid-template-columns:1.5fr 4fr auto; gap:1rem; padding:0.5rem; border-bottom:1px solid var(--border-color); font-size:0.9rem; align-items:center;">
                <strong style="color:var(--text-secondary); text-transform:capitalize;">${label}</strong>
                <span style="font-family:var(--font-mono); word-break:break-all;">${value}</span>
                <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${value.replace(/'/g, "\\'")}') && alert('Copied!')" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Copy</button>
            </div>
        `;
    }

    function parse() {
        let val = input.value.trim();
        if (!val) {
            results.style.display = 'none';
            errorMsg.style.display = 'none';
            return;
        }

        if (!/^[a-zA-Z]+:\/\//.test(val)) {
            val = 'http://' + val;
        }

        try {
            const parsed = new URL(val);
            errorMsg.style.display = 'none';

            const hostname = parsed.hostname;
            const hostParts = hostname.split('.');
            let tld = '';
            let domain = '';
            let subdomain = '';
            
            if (hostParts.length >= 2) {
                const lastTwo = hostParts.slice(-2).join('.');
                const doubleTLDs = ['co.uk', 'com.au', 'org.uk', 'co.in', 'net.in', 'com.cn', 'edu.in', 'gov.in'];
                if (doubleTLDs.includes(lastTwo) && hostParts.length >= 3) {
                    tld = lastTwo;
                    domain = hostParts[hostParts.length - 3];
                    subdomain = hostParts.slice(0, hostParts.length - 3).join('.');
                } else {
                    tld = hostParts[hostParts.length - 1];
                    domain = hostParts[hostParts.length - 2];
                    subdomain = hostParts.slice(0, hostParts.length - 2).join('.');
                }
            } else {
                domain = hostname;
            }

            const pathParts = parsed.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            const filename = lastPart.includes('.') ? lastPart : '';

            let html = '';
            html += renderField('Protocol', parsed.protocol);
            html += renderField('Username', parsed.username);
            html += renderField('Password', parsed.password);
            html += renderField('Host', parsed.host);
            html += renderField('Subdomain', subdomain);
            html += renderField('Domain', domain);
            html += renderField('TLD', tld);
            html += renderField('Port', parsed.port);
            html += renderField('Path', parsed.pathname);
            html += renderField('File Name', filename);
            html += renderField('Query Parameters', parsed.search);
            html += renderField('Fragment / Hash', parsed.hash);

            container.innerHTML = html;
            results.style.display = 'block';
        } catch (e) {
            errorMsg.textContent = '❌ Malformed URL. Please check syntax (e.g. protocol, host).';
            errorMsg.style.display = 'block';
            results.style.display = 'none';
        }
    }

    input.addEventListener('input', parse);
    reset.addEventListener('click', () => {
        input.value = '';
        parse();
    });
}
