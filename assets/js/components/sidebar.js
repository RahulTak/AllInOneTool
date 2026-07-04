import { CATEGORIES } from '../data/categories.js';

export function renderSidebar(currentCat = '', pathPrefix = '') {
    // List of static popular tools for quick navigation
    const popularTools = [
        { name: 'Image Compressor', slug: 'image-compressor', cat: 'image' },
        { name: 'Word Counter', slug: 'word-counter', cat: 'text' },
        { name: 'QR Code Generator', slug: 'qr-code-generator', cat: 'developer' },
        { name: 'Merge PDF', slug: 'merge-pdf', cat: 'pdf' },
        { name: 'Age Calculator', slug: 'age-calculator', cat: 'calculator' },
        { name: 'Case Converter', slug: 'case-converter', cat: 'text' },
        { name: 'JSON Formatter', slug: 'json-formatter', cat: 'developer' },
        { name: 'Strong Password Generator', slug: 'strong-password-generator', cat: 'password' }
    ];

    return `
    <aside class="layout-sidebar-wrapper">
        <!-- Search Box Sidebar -->
        <div class="sidebar-box">
            <h3 class="sidebar-box-title">Search Tools</h3>
            <div class="search-input-wrapper">
                <input type="text" placeholder="Type to search..." class="search-input" id="sidebar-search-input" autocomplete="off">
                <svg class="search-icon-svg" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <div class="search-suggestions" id="sidebar-search-suggestions"></div>
            </div>
        </div>

        <!-- Categories List -->
        <div class="sidebar-box">
            <h3 class="sidebar-box-title">Categories</h3>
            <nav class="sidebar-menu">
                ${CATEGORIES.map(cat => {
                    const isActive = cat.id === currentCat ? 'active' : '';
                    return `
                    <a href="${pathPrefix}index.html#category-${cat.id}" class="sidebar-menu-link ${isActive}">
                        <span>${cat.icon} ${cat.name}</span>
                        <span style="font-size: 0.75rem; opacity: 0.6;">${cat.count}</span>
                    </a>
                    `;
                }).join('')}
            </nav>
        </div>

        <!-- Advertisement Placeholder -->
        <div class="ad-box ad-sidebar" id="sidebar-ad-placeholder">
            <span>Advertisement</span>
        </div>

        <!-- Popular Tools -->
        <div class="sidebar-box">
            <h3 class="sidebar-box-title">Popular Tools</h3>
            <nav class="sidebar-menu">
                ${popularTools.map(tool => {
                    return `
                    <a href="${pathPrefix}tools/${tool.slug}.html" class="sidebar-menu-link">
                        <span>⚡ ${tool.name}</span>
                    </a>
                    `;
                }).join('')}
            </nav>
        </div>
    </aside>
    `;
}
