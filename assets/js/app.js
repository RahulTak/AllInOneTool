import { initTheme } from './theme.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderSidebar } from './components/sidebar.js';
import { renderBreadcrumbs } from './components/breadcrumbs.js';
import { renderFaq, initFaqAccordion } from './components/faq.js';
import { renderRelatedTools, recordToolVisit } from './components/related-tools.js';
import { initSearch } from './components/search-box.js';
import { SITE_CONFIG } from './constants/site.js';
import { CATEGORIES } from './data/categories.js';
import { renderToolCard } from './components/tool-card.js';

// DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    // Determine path level prefix (e.g. for /tools/ pages, prefix is '../')
    const path = window.location.pathname;
    const isToolPage = path.includes('/tools/');
    const isBlogPage = path.includes('/blog/');
    const isCategoryPage = path.includes('/categories/');
    const pathPrefix = (isToolPage || isBlogPage || isCategoryPage) ? '../' : './';

    // Load tools summary dynamically
    let toolsSummary = [];
    try {
        const module = await import('./data/tools-summary.js');
        toolsSummary = module.TOOLS_SUMMARY;
    } catch (e) {
        console.warn('Tools summary not available yet. This is expected during bootstrap.', e);
    }

    // 1. Identify active page ID
    const toolMeta = document.querySelector('meta[name="tool-id"]');
    const toolId = toolMeta ? toolMeta.getAttribute('content') : null;

    if (isToolPage && toolId) {
        // --- TOOL PAGE RENDER FLOW ---
        recordToolVisit(toolId);
        await assembleToolPage(toolId, toolsSummary, pathPrefix);
    } else {
        // --- HOMEPAGE / STATIC PAGE RENDER FLOW ---
        assembleStaticPage(path, toolsSummary, pathPrefix);
    }

    // Initialize Theme and search boxes
    initTheme();

    // Hook search triggers
    const globalSearchBtn = document.getElementById('global-search-btn');
    const sidebarSearchInput = document.getElementById('sidebar-search-input');
    const sidebarSearchSuggestions = document.getElementById('sidebar-search-suggestions');

    if (globalSearchBtn) {
        globalSearchBtn.addEventListener('click', () => {
            // Focus on sidebar search if exists or show alert/search overlay
            if (sidebarSearchInput) {
                sidebarSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                sidebarSearchInput.focus();
            } else {
                alert('Use the homepage search to find tools instantly!');
            }
        });
    }

    if (sidebarSearchInput && sidebarSearchSuggestions) {
        initSearch(sidebarSearchInput, sidebarSearchSuggestions, toolsSummary, pathPrefix);
    }
});

async function assembleToolPage(toolId, toolsSummary, pathPrefix) {
    // 1. Get tool-specific configuration
    let config = {};
    try {
        const configModule = await import(`./data/tools/${toolId}.js`);
        config = configModule.config;
    } catch (e) {
        console.error(`Could not load configuration for tool ${toolId}:`, e);
        return;
    }

    // Extract workspace element
    const workspaceElement = document.getElementById('tool-workspace');
    const workspaceHTML = workspaceElement ? workspaceElement.outerHTML : '';

    // Rebuild page layout structure
    const appShell = document.createElement('div');
    appShell.id = 'app-shell';

    // Breadcrumbs arrays
    const crumbs = [
        { name: config.categoryName || config.category, url: `${pathPrefix}index.html#category-${config.category}` },
        { name: config.name, url: '#' }
    ];

    appShell.innerHTML = `
        ${renderHeader(window.location.pathname, pathPrefix, toolsSummary)}
        
        <main class="app-main">
            <div class="container">
                <!-- Breadcrumbs -->
                ${renderBreadcrumbs(crumbs, pathPrefix)}

                <div class="layout-grid">
                    <!-- Main Content Column -->
                    <div class="layout-content-wrapper">
                        <!-- Tool Title Area -->
                        <div class="tool-title-row">
                            <h1>${config.seoTitle || config.name}</h1>
                            <p>${config.description}</p>
                        </div>

                        <!-- Top Ad Placement -->
                        <div class="ad-box ad-banner" id="ad-header-banner">
                            <span>Banner Placement</span>
                        </div>

                        <!-- Main Interactive Tool Workspace -->
                        <div id="tool-workspace-container">
                            ${workspaceHTML}
                        </div>

                        <!-- Mid Ad Placement -->
                        <div class="ad-box ad-banner" id="ad-mid-banner">
                            <span>In-Content Ad</span>
                        </div>

                        <!-- How to Use Content -->
                        ${renderHowToUse(config)}

                        <!-- Benefits Content -->
                        ${renderBenefits(config)}

                        <!-- Collapsible FAQs -->
                        ${renderFaq(config.faqs)}

                        <!-- Related and Popular Tools grids -->
                        ${renderRelatedTools(toolId, config.category, toolsSummary, pathPrefix)}

                        <!-- Static Comments Section -->
                        ${renderCommentsSection()}

                        <!-- Static Newsletter Box -->
                        ${renderNewsletterCTA()}
                    </div>

                    <!-- Right Sidebar -->
                    ${renderSidebar(config.category, pathPrefix, toolsSummary)}
                </div>
            </div>
        </main>

        ${renderFooter(window.location.pathname, pathPrefix)}
    `;

    // Overwrite page body
    document.body.innerHTML = '';
    document.body.appendChild(appShell);

    // Initialize collapsible FAQ accordion click bindings
    initFaqAccordion();

    // Dynamically inject JSON-LD schemas
    injectToolSchemas(config);

    // Run tool's processing logic
    try {
        const logicModule = await import(`./tools/${toolId}.js`);
        if (logicModule.init) {
            logicModule.init();
        }
    } catch (e) {
        console.error(`Error executing tool logic for ${toolId}:`, e);
    }
}

function assembleStaticPage(path, toolsSummary, pathPrefix) {
    // For homepage/about/privacy, we wrap the body inside header and footer
    const currentBody = document.body.innerHTML;
    
    const appShell = document.createElement('div');
    appShell.id = 'app-shell';
    appShell.innerHTML = `
        ${renderHeader(path, pathPrefix, toolsSummary)}
        
        <main class="app-main">
            ${currentBody}
        </main>
        
        ${renderFooter(path, pathPrefix)}
    `;

    document.body.innerHTML = '';
    document.body.appendChild(appShell);

    // Dynamic Popular Tools grid rendering
    const popularGrid = document.getElementById('home-popular-tools-grid');
    const homeSearchInput = document.getElementById('home-search-input');
    const homeSearchSuggestions = document.getElementById('home-search-suggestions');

    if (popularGrid) {
        // Initial render: default is popular, unless a hash is present
        let initialCat = 'popular';
        if (window.location.hash && window.location.hash.startsWith('#category-')) {
            initialCat = window.location.hash.replace('#category-', '');
        }

        renderHomepageTools(toolsSummary, pathPrefix, initialCat);

        // Bind click events to sidebar category links for live filtering
        const sidebarLinks = document.querySelectorAll('.layout-sidebar-wrapper .sidebar-menu-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const hashIdx = href.indexOf('#category-');
                if (hashIdx !== -1) {
                    e.preventDefault();
                    const catId = href.substring(hashIdx + '#category-'.length);
                    renderHomepageTools(toolsSummary, pathPrefix, catId);
                    
                    const section = document.getElementById('popular-tools-section');
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    history.pushState(null, null, `#category-${catId}`);
                }
            });
        });

        // Intercept header mega-menu category selections to filter on home
        document.body.addEventListener('click', (e) => {
            const megaLink = e.target.closest('.mega-menu-link');
            if (megaLink) {
                const href = megaLink.getAttribute('href');
                const hashIdx = href.indexOf('#category-');
                if (hashIdx !== -1) {
                    const catId = href.substring(hashIdx + '#category-'.length);
                    if (popularGrid) {
                        e.preventDefault();
                        renderHomepageTools(toolsSummary, pathPrefix, catId);
                        const section = document.getElementById('popular-tools-section');
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        history.pushState(null, null, `#category-${catId}`);
                    }
                }
            }
        });

        // Scroll to alignment if hash loaded on page launch
        if (window.location.hash && window.location.hash.startsWith('#category-')) {
            const section = document.getElementById('popular-tools-section');
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
            }
        }
    }

    if (homeSearchInput && homeSearchSuggestions) {
        initSearch(homeSearchInput, homeSearchSuggestions, toolsSummary, pathPrefix);
    }
}

function renderHomepageTools(toolsSummary, pathPrefix, categoryId = 'popular') {
    const popularGrid = document.getElementById('home-popular-tools-grid');
    const section = document.getElementById('popular-tools-section');
    if (!popularGrid || !section) return;

    const titleEl = section.querySelector('.home-section-title');
    const descEl = section.querySelector('.home-section-subtitle');

    let displayTools = [];
    if (categoryId === 'popular') {
        // Select 12 popular tools across categories
        const popularIds = [
            'image-compressor', 'word-counter', 'qr-code-generator', 'merge-pdf',
            'age-calculator', 'emi-calculator', 'case-converter', 'json-formatter',
            'binary-converter', 'strong-password-generator', 'color-converter', 'serp-simulator'
        ];
        displayTools = toolsSummary.filter(t => popularIds.includes(t.id));
        if (titleEl) titleEl.textContent = 'Most Popular Tools';
        if (descEl) descEl.textContent = 'Access our most frequently used browser-side utilities instantly.';
    } else {
        const cat = CATEGORIES.find(c => c.id === categoryId);
        if (cat) {
            displayTools = toolsSummary.filter(t => t.category === categoryId);
            if (titleEl) titleEl.textContent = `${cat.icon} ${cat.name}`;
            if (descEl) descEl.textContent = cat.description;
        }
    }

    if (displayTools.length === 0) {
        popularGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-tertiary); padding: 2rem;">No tools found in this category.</div>`;
    } else {
        popularGrid.innerHTML = displayTools.map(tool => renderToolCard(tool, pathPrefix)).join('');
    }
}

// Helpers for tool sections
function renderHowToUse(config) {
    if (!config.howToUse || config.howToUse.length === 0) return '';
    return `
    <div class="tool-detail-section">
        <h2>How to use ${config.name}</h2>
        <div class="tool-detail-list">
            ${config.howToUse.map((step, idx) => `
                <div class="tool-detail-item">
                    <div class="tool-detail-item-number">${idx + 1}</div>
                    <div class="tool-detail-item-content">
                        <p>${step}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

function renderBenefits(config) {
    if (!config.benefits || config.benefits.length === 0) return '';
    return `
    <div class="tool-detail-section">
        <h2>Key Benefits of our ${config.name}</h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.25rem;">
            ${config.benefits.map(benefit => `
                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <span style="color: var(--success-color); font-weight: bold; font-size: 1.15rem; line-height: 1;">✓</span>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">${benefit}</p>
                </div>
            `).join('')}
        </div>
    </div>
    `;
}

function renderCommentsSection() {
    return `
    <div class="tool-detail-section" style="gap: 1.5rem;">
        <h2>User Feedback & Comments</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div class="testimonial-avatar" style="flex-shrink: 0;">JD</div>
                <div>
                    <h4 style="font-weight: 600; font-size: 0.95rem;">John Doe</h4>
                    <p style="font-size: 0.8rem; color: var(--text-tertiary);">2 days ago</p>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">This runs incredibly fast compared to online converters where I have to upload files. Love the client-side approach!</p>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <div class="testimonial-avatar" style="flex-shrink: 0;">SM</div>
                <div>
                    <h4 style="font-weight: 600; font-size: 0.95rem;">Sarah Miller</h4>
                    <p style="font-size: 0.8rem; color: var(--text-tertiary);">1 week ago</p>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">Completely secure and privacy-friendly. Checked the network logs and no data is being sent to any server. Brilliant layout!</p>
                </div>
            </div>
        </div>
        <form onsubmit="event.preventDefault(); alert('Comments are simulation-only.'); this.reset();" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <textarea class="input-control" placeholder="Add a public comment..." required style="min-height: 80px;"></textarea>
            <button class="btn btn-primary" type="submit" style="align-self: flex-end;">Post Comment</button>
        </form>
    </div>
    `;
}

function renderNewsletterCTA() {
    return `
    <div class="newsletter-box" style="margin: 0;">
        <h3>Get Updates About New Tools</h3>
        <p>Subscribe to our periodic newsletter list to learn about new additions, guides, and feature releases.</p>
        <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed successfully!'); this.reset();">
            <input type="email" placeholder="Your email address" class="input-control" required>
            <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
    </div>
    `;
}

function injectToolSchemas(config) {
    // 1. Organization Schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url,
        "logo": `${SITE_CONFIG.url}/assets/images/logo.png`,
        "contactPoint": {
            "@type": "ContactPoint",
            "email": SITE_CONFIG.contact.email,
            "contactType": "customer support"
        }
    };

    // 2. WebSite Schema
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_CONFIG.url}/index.html?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${SITE_CONFIG.url}/index.html`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": config.categoryName || config.category,
                "item": `${SITE_CONFIG.url}/index.html#category-${config.category}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": config.name,
                "item": `${SITE_CONFIG.url}/tools/${config.slug}.html`
            }
        ]
    };

    // 4. SoftwareApplication (Tool) Schema
    const appSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": config.name,
        "description": config.description,
        "applicationCategory": `${config.categoryName || config.category}Tool`,
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 Canvas and JavaScript",
        "url": `${SITE_CONFIG.url}/tools/${config.slug}.html`
    };

    // Append script tags to document head
    const schemas = [orgSchema, webSiteSchema, breadcrumbSchema, appSchema];
    
    // Add FAQ Schema if FAQs exist
    if (config.faqs && config.faqs.length > 0) {
        const faqPageSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": config.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        schemas.push(faqPageSchema);
    }

    schemas.forEach(schema => {
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.text = JSON.stringify(schema);
        document.head.appendChild(scriptTag);
    });
}
