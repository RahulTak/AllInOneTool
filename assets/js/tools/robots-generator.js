export function init() {
    const defaultUa = document.getElementById('rob-default-ua');
    const crawlDelay = document.getElementById('rob-crawl-delay');
    const host = document.getElementById('rob-host');
    const sitemap = document.getElementById('rob-sitemap');
    const addDirBtn = document.getElementById('rob-btn-add-dir');
    const dirsContainer = document.getElementById('rob-directives-container');
    const warning = document.getElementById('rob-warning');
    const output = document.getElementById('rob-output');
    const reset = document.getElementById('rob-btn-reset');
    const copy = document.getElementById('rob-btn-copy');
    const download = document.getElementById('rob-btn-download');

    if (!defaultUa) return;

    let rules = [];

    function render() {
        warning.style.display = 'none';
        warning.textContent = '';
        
        let lines = [];
        lines.push('User-agent: ' + defaultUa.value);

        if (crawlDelay.value) {
            const delay = parseInt(crawlDelay.value);
            if (isNaN(delay) || delay <= 0) {
                warning.textContent = '⚠️ Crawl delay must be a positive integer.';
                warning.style.display = 'block';
            } else {
                lines.push('Crawl-delay: ' + delay);
            }
        }

        rules.forEach(r => {
            if (r.path.trim()) {
                if (!r.path.startsWith('/')) {
                    warning.textContent = '⚠️ Custom rules directories must start with "/"';
                    warning.style.display = 'block';
                }
                lines.push(r.type + ': ' + r.path.trim());
            }
        });

        if (host.value.trim()) {
            const hostVal = host.value.trim();
            if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(hostVal)) {
                warning.textContent = '⚠️ Invalid Host domain name.';
                warning.style.display = 'block';
            } else {
                lines.push('Host: ' + hostVal);
            }
        }

        if (sitemap.value.trim()) {
            const sitemapUrl = sitemap.value.trim();
            if (!sitemapUrl.startsWith('http://') && !sitemapUrl.startsWith('https://')) {
                warning.textContent = '⚠️ Sitemap URL must be absolute (start with http:// or https://).';
                warning.style.display = 'block';
            } else {
                lines.push('Sitemap: ' + sitemapUrl);
            }
        }

        output.value = lines.join('\n');
    }

    function addRuleRow(type = 'Disallow', path = '') {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';
        
        const typeSel = document.createElement('select');
        typeSel.className = 'input-control';
        typeSel.style.width = '120px';
        typeSel.innerHTML = '<option value="Disallow">Disallow</option><option value="Allow">Allow</option>';
        typeSel.value = type;

        const pathInput = document.createElement('input');
        pathInput.type = 'text';
        pathInput.className = 'input-control';
        pathInput.placeholder = 'e.g. /admin/';
        pathInput.value = path;
        pathInput.style.flex = '1';

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(typeSel);
        row.appendChild(pathInput);
        row.appendChild(remBtn);
        dirsContainer.appendChild(row);

        const ruleObj = { type, path };
        rules.push(ruleObj);

        const update = () => {
            ruleObj.type = typeSel.value;
            ruleObj.path = pathInput.value;
            render();
        };

        typeSel.addEventListener('change', update);
        pathInput.addEventListener('input', update);
        remBtn.addEventListener('click', () => {
            row.remove();
            rules = rules.filter(r => r !== ruleObj);
            render();
        });

        render();
    }

    addDirBtn.addEventListener('click', () => addRuleRow());
    [defaultUa, crawlDelay, host, sitemap].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        defaultUa.value = '*';
        crawlDelay.value = '';
        host.value = '';
        sitemap.value = '';
        dirsContainer.innerHTML = '';
        rules = [];
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Robots.txt output!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    addRuleRow('Disallow', '/admin/');
    addRuleRow('Disallow', '/api/');
    render();
}
