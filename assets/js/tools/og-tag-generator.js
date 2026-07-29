export function init() {
    const title = document.getElementById('og-title');
    const sitename = document.getElementById('og-sitename');
    const url = document.getElementById('og-url');
    const image = document.getElementById('og-image');
    const locale = document.getElementById('og-locale');
    const type = document.getElementById('og-type');
    const desc = document.getElementById('og-desc');

    const output = document.getElementById('og-output');
    const reset = document.getElementById('og-btn-reset');
    const copy = document.getElementById('og-btn-copy');
    const download = document.getElementById('og-btn-download');

    const mockImage = document.getElementById('mock-og-image-div');
    const mockSite = document.getElementById('mock-og-site');
    const mockTitle = document.getElementById('mock-og-title');
    const mockDesc = document.getElementById('mock-og-desc');

    if (!title) return;

    function render() {
        const t = title.value.trim();
        const s = sitename.value.trim();
        const u = url.value.trim();
        const img = image.value.trim();
        const loc = locale.value.trim();
        const tp = type.value;
        const d = desc.value.trim();

        let tags = '';
        tags += '<meta property="og:title" content="' + escapeHtml(t) + '" />\n';
        tags += '<meta property="og:site_name" content="' + escapeHtml(s) + '" />\n';
        tags += '<meta property="og:url" content="' + escapeHtml(u) + '" />\n';
        tags += '<meta property="og:description" content="' + escapeHtml(d) + '" />\n';
        if (img) tags += '<meta property="og:image" content="' + escapeHtml(img) + '" />\n';
        tags += '<meta property="og:locale" content="' + escapeHtml(loc) + '" />\n';
        tags += '<meta property="og:type" content="' + tp + '" />';

        output.value = tags;

        mockTitle.textContent = t || '(Untitled Page)';
        mockSite.textContent = s || 'example.com';
        mockDesc.textContent = d || '(No description provided)';
        if (img) {
            mockImage.style.backgroundImage = 'url(' + img + ')';
        } else {
            mockImage.style.backgroundImage = 'none';
        }
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

    [title, sitename, url, image, locale, type, desc].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        title.value = 'My Website Homepage';
        sitename.value = 'AllInOneTool';
        url.value = 'https://example.com';
        image.value = 'https://example.com/assets/banner.jpg';
        locale.value = 'en_US';
        type.selectedIndex = 0;
        desc.value = 'AllInOneTool provides free, secure, and client-side conversion utilities directly inside your browser memory.';
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied OG Tags!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'og_tags.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
