export function renderToolCard(tool, pathPrefix = '') {
    return `
    <a href="${pathPrefix}tools/${tool.slug}.html" class="tool-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
        <div class="tool-card-icon">${tool.icon || '⚡'}</div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <span class="btn btn-secondary" style="margin-top: auto; font-size: 0.85rem; padding: 0.5rem 1rem; text-align: center; display: inline-flex; justify-content: center; align-items: center;">Use Tool</span>
    </a>
    `;
}
