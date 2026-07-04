export function init() {
    const title = document.getElementById('meta-title');
    const desc = document.getElementById('meta-desc');
    const keywords = document.getElementById('meta-keywords');
    const author = document.getElementById('meta-author');
    const canonical = document.getElementById('meta-canonical');
    const robots = document.getElementById('meta-robots');
    const output = document.getElementById('meta-output-code');
    const copy = document.getElementById('meta-copy');

    if (!title) return;

    function render() {
        const t = title.value;
        const d = desc.value;
        const k = keywords.value;
        const a = author.value;
        const c = canonical.value;
        const r = robots.value;

        const code = `<!-- Primary Meta Tags -->
<title>${t}</title>
<meta name="title" content="${t}">
<meta name="description" content="${d}">
<meta name="keywords" content="${k}">
<meta name="author" content="${a}">
<link rel="canonical" href="${c}">
<meta name="robots" content="${r}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${c}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${c}">
<meta property="twitter:title" content="${t}">
<meta property="twitter:description" content="${d}">`;

        output.value = code;
    }

    [title, desc, keywords, author, canonical, robots].forEach(el => el.addEventListener('input', render));
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Meta tags copied!'));
    });

    render();
}
