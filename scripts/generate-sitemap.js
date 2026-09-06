const fs = require('fs');
const path = require('path');
const { SITE_URL, CATEGORIES_SEO } = require('../config/seo.js');
const seoCatalog = require('./seo-catalog.js');

const today = new Date().toISOString().split('T')[0];

const urls = [];

// 1. Homepage
urls.push({
    loc: `${SITE_URL}/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '1.0'
});

// 2. Category Hub Pages (10)
Object.values(CATEGORIES_SEO).forEach(cat => {
    urls.push({
        loc: `${SITE_URL}/categories/${cat.slug}.html`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.9'
    });
});

// 3. Tool Pages (170)
Object.values(seoCatalog).forEach(tool => {
    urls.push({
        loc: `${SITE_URL}/tools/${tool.slug}.html`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.8'
    });
});

// 4. Static / Legal Pages
const staticPages = [
    'about.html',
    'contact.html',
    'privacy-policy.html',
    'terms.html',
    'disclaimer.html'
];

staticPages.forEach(file => {
    urls.push({
        loc: `${SITE_URL}/${file}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: '0.5'
    });
});

// XML string construction
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${u.lastmod}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>
`;

const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml.trim(), 'utf8');

console.log(`Generated sitemap.xml with ${urls.length} indexable URLs at ${sitemapPath}`);
