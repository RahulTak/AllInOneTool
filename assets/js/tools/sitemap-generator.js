export function init() {
    const container = document.getElementById('site-urls-container');
    const addBtn = document.getElementById('site-add-url');
    const warning = document.getElementById('site-warning');
    const output = document.getElementById('site-output');
    const reset = document.getElementById('site-btn-reset');
    const copy = document.getElementById('site-btn-copy');
    const download = document.getElementById('site-btn-download');

    if (!container) return;

    let urls = [];

    function render() {
        warning.style.display = 'none';
        warning.textContent = '';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        urls.forEach(u => {
            const loc = u.loc.trim();
            if (loc) {
                if (!loc.startsWith('http://') && !loc.startsWith('https://')) {
                    warning.textContent = '⚠️ All URLs must start with http:// or https://';
                    warning.style.display = 'block';
                }
                xml += '  <url>\n';
                xml += '    <loc>' + escapeXml(loc) + '</loc>\n';
                if (u.lastmod) xml += '    <lastmod>' + u.lastmod + '</lastmod>\n';
                if (u.changefreq) xml += '    <changefreq>' + u.changefreq + '</changefreq>\n';
                if (u.priority) xml += '    <priority>' + u.priority + '</priority>\n';
                xml += '  </url>\n';
            }
        });

        xml += '</urlset>';
        output.value = xml;
    }

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"\r\n]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return '';
            }
        });
    }

    function addUrlRow(locVal = '', changefreqVal = 'weekly', priorityVal = '0.5', lastmodVal = '') {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '2fr 1fr 1fr 1.2fr auto';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';

        const locInput = document.createElement('input');
        locInput.type = 'text';
        locInput.className = 'input-control';
        locInput.placeholder = 'https://example.com/page';
        locInput.value = locVal;

        const freqSel = document.createElement('select');
        freqSel.className = 'input-control';
        freqSel.innerHTML = `
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly" selected>weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="never">never</option>
        `;
        freqSel.value = changefreqVal;

        const prioSel = document.createElement('select');
        prioSel.className = 'input-control';
        prioSel.innerHTML = `
            <option value="1.0">1.0</option>
            <option value="0.8">0.8</option>
            <option value="0.5" selected>0.5</option>
            <option value="0.3">0.3</option>
            <option value="0.0">0.0</option>
        `;
        prioSel.value = priorityVal;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'input-control';
        dateInput.value = lastmodVal || new Date().toISOString().split('T')[0];

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(locInput);
        row.appendChild(freqSel);
        row.appendChild(prioSel);
        row.appendChild(dateInput);
        row.appendChild(remBtn);
        container.appendChild(row);

        const urlObj = { loc: locVal, changefreq: changefreqVal, priority: priorityVal, lastmod: dateInput.value };
        urls.push(urlObj);

        const update = () => {
            urlObj.loc = locInput.value;
            urlObj.changefreq = freqSel.value;
            urlObj.priority = prioSel.value;
            urlObj.lastmod = dateInput.value;
            render();
        };

        [locInput, freqSel, prioSel, dateInput].forEach(el => el.addEventListener('change', update));
        locInput.addEventListener('input', update);

        remBtn.addEventListener('click', () => {
            row.remove();
            urls = urls.filter(u => u !== urlObj);
            render();
        });

        render();
    }

    addBtn.addEventListener('click', () => addUrlRow());

    reset.addEventListener('click', () => {
        container.innerHTML = '';
        urls = [];
        addUrlRow('https://example.com/', 'daily', '1.0');
        addUrlRow('https://example.com/about', 'monthly', '0.8');
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Sitemap XML copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    });

    addUrlRow('https://example.com/', 'daily', '1.0');
    addUrlRow('https://example.com/about', 'monthly', '0.8');
    render();
}
