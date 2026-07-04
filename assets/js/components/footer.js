import { SITE_CONFIG } from '../constants/site.js';
import { CATEGORIES } from '../data/categories.js';

export function renderFooter(activePath = '/', pathPrefix = '') {
    // Take top 4 categories for footer
    const footerCats = CATEGORIES.slice(0, 4);

    return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Branding Column -->
                <div class="footer-brand">
                    <a href="${pathPrefix}index.html" class="logo-wrapper footer-brand-logo">
                        <div class="logo-icon">${SITE_CONFIG.logo.text}</div>
                        <span>${SITE_CONFIG.logo.name}</span>
                    </a>
                    <p>${SITE_CONFIG.description}</p>
                    <div class="social-links">
                        <a href="${SITE_CONFIG.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter">
                            <svg class="social-link-icon" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                        <a href="${SITE_CONFIG.social.github}" target="_blank" rel="noopener" aria-label="GitHub">
                            <svg class="social-link-icon" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Column 1: Links -->
                <div>
                    <h4 class="footer-title">Popular Categories</h4>
                    <ul class="footer-links">
                        ${footerCats.map(cat => {
                            return `<li><a href="${pathPrefix}index.html#category-${cat.id}">${cat.name}</a></li>`;
                        }).join('')}
                    </ul>
                </div>

                <!-- Column 2: Legal -->
                <div>
                    <h4 class="footer-title">Legal Info</h4>
                    <ul class="footer-links">
                        ${SITE_CONFIG.footerLinks.legal.map(link => {
                            return `<li><a href="${pathPrefix}${link.path.slice(1)}">${link.name}</a></li>`;
                        }).join('')}
                    </ul>
                </div>

                <!-- Column 3: Newsletter -->
                <div>
                    <h4 class="footer-title">Newsletter</h4>
                    <p style="margin-bottom: 1rem; font-size: 0.85rem;">Subscribe to get updates on newly released tools.</p>
                    <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed successfully!'); this.reset();" style="flex-direction: column; gap: 0.5rem; max-width: 100%;">
                        <input type="email" placeholder="Enter your email" required style="width: 100%;" class="input-control">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Subscribe</button>
                    </form>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>${SITE_CONFIG.copyright}</p>
                <p style="font-size: 0.8rem; color: var(--text-tertiary);">All computations are processed 100% inside your browser. No server storage.</p>
            </div>
        </div>
    </footer>
    `;
}
