const fs = require('fs');
const path = require('path');
const { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE, CATEGORIES_SEO } = require('../config/seo.js');
const seoCatalog = require('./seo-catalog.js');

const categoriesDir = path.join(__dirname, '..', 'categories');
if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
}

// Group tools by category from seoCatalog
const toolsByCategory = {};
Object.values(seoCatalog).forEach(tool => {
    if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(tool);
});

console.log('Generating 10 dedicated category hub pages...');

Object.values(CATEGORIES_SEO).forEach(cat => {
    const catTools = toolsByCategory[cat.id] || [];
    const catUrl = `${SITE_URL}/categories/${cat.slug}.html`;

    // JSON-LD structured data
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${SITE_URL}/`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": cat.name,
                        "item": catUrl
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "@id": `${catUrl}#webpage`,
                "url": catUrl,
                "name": cat.title,
                "description": cat.description,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    "name": SITE_NAME,
                    "url": `${SITE_URL}/`
                },
                "about": {
                    "@type": "Thing",
                    "name": cat.name
                },
                "numberOfItems": catTools.length
            }
        ]
    };

    // Related categories links (all other categories)
    const otherCats = Object.values(CATEGORIES_SEO).filter(c => c.id !== cat.id);
    const relatedCatsHtml = otherCats.map(c => `
        <a href="./${c.slug}.html" class="category-pill-link" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-pill); font-size:0.9rem; font-weight:500; text-decoration:none; color:var(--text-primary); transition:all 0.2s ease;">
            <span>${c.icon}</span>
            <span>${c.name}</span>
        </a>
    `).join('');

    // Tool cards HTML
    const toolCardsHtml = catTools.map(tool => `
        <div class="card card-tool" style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; transition:all var(--transition-fast);">
            <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                    <span style="font-size:1.75rem;">${cat.icon}</span>
                    <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--primary-color); background:rgba(37,99,235,0.08); padding:0.25rem 0.6rem; border-radius:var(--radius-pill);">Free</span>
                </div>
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-primary);">${tool.name}</h3>
                <p style="font-size:0.875rem; line-height:1.5; color:var(--text-secondary); margin-bottom:1rem;">${tool.metaDescription || tool.description || ''}</p>
            </div>
            <a href="../tools/${tool.slug}.html" class="btn btn-primary btn-sm" style="align-self:flex-start; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem;">
                <span>Launch Tool</span>
                <span>→</span>
            </a>
        </div>
    `).join('');

    // FAQs HTML
    const faqsHtml = cat.faqs.map((faq, i) => `
        <div class="faq-item" style="border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-bottom:0.75rem; background:var(--bg-primary); overflow:hidden;">
            <div class="faq-question" style="padding:1rem 1.25rem; font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center; user-select:none;">
                <span>${faq.question}</span>
                <span class="faq-icon" style="font-size:1.2rem; transition:transform 0.2s ease;">+</span>
            </div>
            <div class="faq-answer" style="padding:0 1.25rem 1rem; font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');

    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cat.title}</title>
    <meta name="description" content="${cat.description}">
    <meta name="keywords" content="${cat.name.toLowerCase()}, free online ${cat.name.toLowerCase()}, ${cat.name.toLowerCase()} suite, client-side tools">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${catUrl}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${cat.title}">
    <meta property="og:description" content="${cat.description}">
    <meta property="og:url" content="${catUrl}">
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
    <meta property="og:site_name" content="${SITE_NAME}">
    
    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${cat.title}">
    <meta name="twitter:description" content="${cat.description}">
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(schema, null, 4)}
    </script>
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="../assets/css/variables.css">
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/layout.css">
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/tool.css">
    
    <!-- Script Dependency -->
    <script src="../assets/js/app.js" type="module" defer></script>
</head>
<body>
    <div class="container" style="max-width: 1200px; padding: 2rem 1.5rem 4rem;">
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem;">
            <ol style="display:flex; gap:0.5rem; list-style:none; padding:0; margin:0; font-size:0.875rem; color:var(--text-tertiary); align-items:center;">
                <li><a href="../index.html" style="color:var(--text-secondary); text-decoration:none;">Home</a></li>
                <li>/</li>
                <li style="color:var(--text-primary); font-weight:600;" aria-current="page">${cat.name}</li>
            </ol>
        </nav>

        <!-- Category Header -->
        <div style="margin-bottom: 2.5rem; text-align: left; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
                <span style="font-size:2.5rem;">${cat.icon}</span>
                <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); margin: 0;">${cat.h1}</h1>
            </div>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); max-width: 900px; margin: 0 0 1rem 0;">${cat.intro}</p>
            <div style="display:inline-flex; align-items:center; gap:0.5rem; font-size:0.9rem; font-weight:600; color:var(--primary-color);">
                <span>${catTools.length} Specialized Tools Available</span>
                <span>•</span>
                <span>100% Client-Side Processing</span>
            </div>
        </div>

        <!-- Tool Grid -->
        <section style="margin-bottom: 4rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary);">All ${cat.name} (${catTools.length})</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                ${toolCardsHtml}
            </div>
        </section>

        <!-- Category FAQ Section -->
        <section style="margin-bottom: 4rem; max-width: 900px;">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary);">Frequently Asked Questions about ${cat.name}</h2>
            <div class="faq-accordion">
                ${faqsHtml}
            </div>
        </section>

        <!-- Related Categories Section -->
        <section style="border-top: 1px solid var(--border-color); padding-top: 2.5rem;">
            <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary);">Explore Other Tool Categories</h2>
            <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
                ${relatedCatsHtml}
            </div>
        </section>
    </div>
</body>
</html>
`;

    const filePath = path.join(categoriesDir, `${cat.slug}.html`);
    fs.writeFileSync(filePath, pageHtml, 'utf8');
});

console.log('Successfully generated all 10 category hub pages in categories/!');
