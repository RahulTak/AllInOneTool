export function renderBreadcrumbs(crumbs = [], pathPrefix = '') {
    // crumbs should be an array of: { name, url }
    const baseCrumbs = [
        { name: 'Home', url: `${pathPrefix}index.html` },
        ...crumbs
    ];

    return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        ${baseCrumbs.map((crumb, idx) => {
            const isLast = idx === baseCrumbs.length - 1;
            if (isLast) {
                return `
                <span class="breadcrumbs-current" aria-current="page">${crumb.name}</span>
                `;
            } else {
                return `
                <a href="${crumb.url}">${crumb.name}</a>
                <span class="breadcrumbs-separator" aria-hidden="true">/</span>
                `;
            }
        }).join('')}
    </nav>
    `;
}
