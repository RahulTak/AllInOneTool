import { SITE_CONFIG } from '../constants/site.js';

export function renderHeader(activePath = '/', pathPrefix = '', toolsSummary = []) {
    // Helper to get tools under a category
    const getTools = (catId, limit = 10) => {
        const list = toolsSummary.filter(t => t.category === catId);
        let items = list.slice(0, limit).map(t => `<a href="${pathPrefix}tools/${t.slug}.html" class="mega-menu-link">${t.name}</a>`);
        if (list.length > limit) {
            items.push(`<a href="${pathPrefix}index.html#category-${catId}" class="mega-menu-link" style="font-weight: 700; color: var(--primary-color);">View all (${list.length}) →</a>`);
        }
        return items.join('');
    };

    return `
    <header class="site-header">
        <div class="container">
            <a href="${pathPrefix}index.html" class="logo-wrapper" id="header-logo">
                <div class="logo-icon">${SITE_CONFIG.logo.text}</div>
                <span>${SITE_CONFIG.logo.name}</span>
            </a>
            
            <nav class="nav-actions" style="height: 100%; display: flex; align-items: center;">
                <!-- Desktop Navigation Links -->
                <div style="display: flex; gap: 1.5rem; margin-right: 1.5rem; align-items: center; height: 100%;" class="desktop-nav">
                    <a href="${pathPrefix}index.html" style="font-weight: 500; font-size: 0.95rem;">Home</a>
                    
                    <!-- Dynamic Categories Mega-Menu Dropdown (All 10 Categories) -->
                    <div class="nav-item-dropdown">
                        <span class="nav-dropdown-trigger">Categories</span>
                        <div class="mega-menu">
                            <!-- Column 1: Image & Color -->
                            <div class="mega-menu-column">
                                <h4 class="mega-menu-title">🖼️ Image Tools</h4>
                                <div class="mega-menu-links">
                                    ${getTools('image')}
                                </div>
                                <h4 class="mega-menu-title" style="margin-top: 1rem;">🎨 Color Tools</h4>
                                <div class="mega-menu-links">
                                    ${getTools('color')}
                                </div>
                            </div>
                            
                            <!-- Column 2: PDF & Misc -->
                            <div class="mega-menu-column">
                                <h4 class="mega-menu-title">📄 PDF Tools</h4>
                                <div class="mega-menu-links">
                                    ${getTools('pdf')}
                                </div>
                                <h4 class="mega-menu-title" style="margin-top: 1rem;">⚙️ Miscellaneous</h4>
                                <div class="mega-menu-links">
                                    ${getTools('misc')}
                                </div>
                            </div>
                            
                            <!-- Column 3: Text & SEO -->
                            <div class="mega-menu-column">
                                <h4 class="mega-menu-title">✍️ Text Tools</h4>
                                <div class="mega-menu-links">
                                    ${getTools('text')}
                                </div>
                                <h4 class="mega-menu-title" style="margin-top: 1rem;">📈 SEO Tools</h4>
                                <div class="mega-menu-links">
                                    ${getTools('seo')}
                                </div>
                            </div>
                            
                            <!-- Column 4: Calculators & Passwords -->
                            <div class="mega-menu-column">
                                <h4 class="mega-menu-title">🧮 Calculators</h4>
                                <div class="mega-menu-links">
                                    ${getTools('calculator')}
                                </div>
                                <h4 class="mega-menu-title" style="margin-top: 1rem;">🔑 Passwords</h4>
                                <div class="mega-menu-links">
                                    ${getTools('password')}
                                </div>
                            </div>
                            
                            <!-- Column 5: Converters & Developer -->
                            <div class="mega-menu-column">
                                <h4 class="mega-menu-title">🔄 Converters</h4>
                                <div class="mega-menu-links">
                                    ${getTools('converter')}
                                </div>
                                <h4 class="mega-menu-title" style="margin-top: 1rem;">💻 Developer</h4>
                                <div class="mega-menu-links">
                                    ${getTools('developer')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="${pathPrefix}about.html" style="font-weight: 500; font-size: 0.95rem;">About</a>
                    <a href="${pathPrefix}contact.html" style="font-weight: 500; font-size: 0.95rem;">Contact</a>
                </div>
                
                <!-- Quick Search Icon Button -->
                <button class="btn btn-icon" id="global-search-btn" aria-label="Search Tools">
                    <svg class="search-icon-svg" viewBox="0 0 24 24" style="left: auto; position: static; transform: none; width: 20px; height: 20px;">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </button>

                <!-- Theme Toggler -->
                <button class="btn btn-icon" id="theme-toggle-btn" aria-label="Toggle Theme">
                    <svg id="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                        <circle cx="12" cy="12" r="5" class="sun-elements"></circle>
                        <line x1="12" y1="1" x2="12" y2="3" class="sun-elements"></line>
                        <line x1="12" y1="21" x2="12" y2="23" class="sun-elements"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" class="sun-elements"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" class="sun-elements"></line>
                        <line x1="1" y1="12" x2="3" y2="12" class="sun-elements"></line>
                        <line x1="21" y1="12" x2="23" y2="12" class="sun-elements"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" class="sun-elements"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" class="sun-elements"></line>
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" class="moon-element"></path>
                    </svg>
                </button>
            </nav>
        </div>
    </header>
    `;
}
