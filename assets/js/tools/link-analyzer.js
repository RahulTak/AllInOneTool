export function init() {
    const htmlInput = document.getElementById('link-html-input');
    const fileInput = document.getElementById('link-file-input');
    const baseUrlInput = document.getElementById('link-base-url');
    const searchInput = document.getElementById('link-search');
    const analyzeBtn = document.getElementById('link-btn-analyze');
    const resetBtn = document.getElementById('link-btn-reset');
    const resultsPanel = document.getElementById('link-results');
    const statsContainer = document.getElementById('link-stats');
    const tableBody = document.getElementById('link-table-body');
    
    const copyBtn = document.getElementById('link-btn-copy-all');
    const downloadBtn = document.getElementById('link-btn-download-csv');

    if (!analyzeBtn) return;

    let parsedLinks = [];

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            htmlInput.value = evt.target.result;
        };
        reader.readAsText(file);
    });

    analyzeBtn.addEventListener('click', () => {
        const html = htmlInput.value;
        if (!html.trim()) return;

        const baseVal = baseUrlInput.value.trim().toLowerCase();
        let baseHost = '';
        try {
            baseHost = new URL(baseVal).hostname;
        } catch(e) {
            baseHost = baseVal;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const anchors = doc.querySelectorAll('a');

        const counts = {};
        anchors.forEach(a => {
            const href = a.getAttribute('href') || '';
            const anchorText = a.textContent.trim() || '(No Anchor Text)';
            
            let type = 'Internal';
            if (href.startsWith('mailto:')) {
                type = 'Email';
            } else if (href.startsWith('tel:')) {
                type = 'Telephone';
            } else if (/^[a-zA-Z0-9]+:\/\//.test(href)) {
                try {
                    const host = new URL(href).hostname.toLowerCase();
                    if (host !== baseHost) {
                        type = 'External';
                    }
                } catch(e) {
                    type = 'External';
                }
            }

            const key = href + '|||' + anchorText + '|||' + type;
            counts[key] = (counts[key] || 0) + 1;
        });

        parsedLinks = Object.keys(counts).map(key => {
            const parts = key.split('|||');
            return {
                url: parts[0],
                anchor: parts[1],
                type: parts[2],
                count: counts[key]
            };
        });

        render();
    });

    function render() {
        const filter = searchInput.value.toLowerCase();
        const filtered = parsedLinks.filter(l => 
            l.url.toLowerCase().includes(filter) || 
            l.anchor.toLowerCase().includes(filter)
        );

        let internal = 0, external = 0, email = 0, tel = 0, total = 0;
        filtered.forEach(l => {
            const count = l.count;
            total += count;
            if (l.type === 'Internal') internal += count;
            else if (l.type === 'External') external += count;
            else if (l.type === 'Email') email += count;
            else if (l.type === 'Telephone') tel += count;
        });

        statsContainer.innerHTML = `
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Total Links</div>
                <strong style="font-size:1.2rem;">${total}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Internal</div>
                <strong style="font-size:1.2rem; color:var(--primary-color);">${internal}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">External</div>
                <strong style="font-size:1.2rem; color:var(--accent-color);">${external}</strong>
            </div>
            <div style="background:var(--bg-primary); padding:0.5rem; text-align:center; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-secondary);">Email/Tel</div>
                <strong style="font-size:1.2rem;">${email + tel}</strong>
            </div>
        `;

        tableBody.innerHTML = filtered.map(l => `
            <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:0.5rem; font-family:var(--font-mono); word-break:break-all;">${escapeHtml(l.url)}</td>
                <td style="padding:0.5rem;">${escapeHtml(l.anchor)}</td>
                <td style="padding:0.5rem;"><span style="padding:0.2rem 0.4rem; font-size:0.75rem; border-radius:var(--radius-sm); background:${getBadgeColor(l.type)}">${l.type}</span></td>
                <td style="padding:0.5rem; font-weight:700;">${l.count}</td>
            </tr>
        `).join('');

        resultsPanel.style.display = 'block';
    }

    function getBadgeColor(type) {
        if (type === 'Internal') return 'rgba(0,128,0,0.1); color:green;';
        if (type === 'External') return 'rgba(0,0,255,0.1); color:blue;';
        return 'rgba(128,128,128,0.1); color:gray;';
    }

    function escapeHtml(str) {
        return str.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }

    searchInput.addEventListener('input', render);

    resetBtn.addEventListener('click', () => {
        htmlInput.value = '';
        fileInput.value = '';
        searchInput.value = '';
        resultsPanel.style.display = 'none';
        parsedLinks = [];
    });

    copyBtn.addEventListener('click', () => {
        const urls = parsedLinks.map(l => l.url).join('\n');
        navigator.clipboard.writeText(urls).then(() => alert('Copied all URLs to clipboard!'));
    });

    downloadBtn.addEventListener('click', () => {
        let csv = 'URL,Anchor Text,Link Type,Occurrences\n';
        parsedLinks.forEach(l => {
            csv += '"' + l.url.replace(/"/g, '""') + '","' + l.anchor.replace(/"/g, '""') + '","' + l.type + '",' + l.count + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}
