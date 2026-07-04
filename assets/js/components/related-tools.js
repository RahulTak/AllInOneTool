import { renderToolCard } from './tool-card.js';

export function renderRelatedTools(currentToolId, categoryId, toolsSummary = [], pathPrefix = '') {
    if (!toolsSummary || toolsSummary.length === 0) return '';

    // Filter tools in same category, exclude current tool
    const related = toolsSummary
        .filter(t => t.category === categoryId && t.id !== currentToolId)
        .slice(0, 4);

    // If we have fewer than 4 related tools, fill with other popular tools
    if (related.length < 4) {
        const fillers = toolsSummary
            .filter(t => t.id !== currentToolId && !related.find(r => r.id === t.id))
            .slice(0, 4 - related.length);
        related.push(...fillers);
    }

    // Get recently viewed tools from localStorage
    let recentlyViewed = [];
    try {
        const viewedIds = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        recentlyViewed = viewedIds
            .filter(id => id !== currentToolId)
            .map(id => toolsSummary.find(t => t.id === id))
            .filter(Boolean)
            .slice(0, 4);
    } catch (e) {
        console.error('Error loading recently viewed tools:', e);
    }

    let html = `
    <div style="display: flex; flex-direction: column; gap: 3rem; margin-top: 2rem;">
        <!-- Related Tools -->
        <div>
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">Related Tools</h3>
            <div class="grid-cards">
                ${related.map(tool => renderToolCard(tool, pathPrefix)).join('')}
            </div>
        </div>
    `;

    // Render recently viewed if any exist
    if (recentlyViewed.length > 0) {
        html += `
        <div>
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">Recently Viewed</h3>
            <div class="grid-cards">
                ${recentlyViewed.map(tool => renderToolCard(tool, pathPrefix)).join('')}
            </div>
        </div>
        `;
    }

    html += `</div>`;
    return html;
}

// Helper to record a visit to a tool
export function recordToolVisit(toolId) {
    try {
        let viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        // Remove duplicate if it exists
        viewed = viewed.filter(id => id !== toolId);
        // Add to front
        viewed.unshift(toolId);
        // Limit to top 10
        viewed = viewed.slice(0, 10);
        localStorage.setItem('recently_viewed', JSON.stringify(viewed));
    } catch (e) {
        console.error('Error saving tool visit:', e);
    }
}
