export function initSearch(inputElement, suggestionsElement, toolsSummary = [], pathPrefix = '') {
    if (!inputElement || !suggestionsElement) return;

    inputElement.addEventListener('input', () => {
        const query = inputElement.value.trim().toLowerCase();
        if (!query) {
            suggestionsElement.style.display = 'none';
            suggestionsElement.innerHTML = '';
            return;
        }

        // Search matching tools
        const matches = toolsSummary.filter(tool => {
            return tool.name.toLowerCase().includes(query) || 
                   (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(query))) ||
                   tool.description.toLowerCase().includes(query);
        }).slice(0, 8); // Limit to 8 suggestions

        if (matches.length === 0) {
            suggestionsElement.innerHTML = `
                <div class="search-suggestion-item" style="cursor: default;">
                    <div class="search-suggestion-info">
                        <span class="search-suggestion-name">No tools found</span>
                    </div>
                </div>
            `;
            suggestionsElement.style.display = 'block';
            return;
        }

        suggestionsElement.innerHTML = matches.map(tool => `
            <div class="search-suggestion-item" data-slug="${tool.slug}">
                <div class="search-suggestion-icon">${tool.icon || '⚡'}</div>
                <div class="search-suggestion-info">
                    <span class="search-suggestion-name">${tool.name}</span>
                    <span class="search-suggestion-cat">${tool.category.toUpperCase()}</span>
                </div>
            </div>
        `).join('');

        suggestionsElement.style.display = 'block';

        // Add click events to suggestion items
        suggestionsElement.querySelectorAll('.search-suggestion-item').forEach(item => {
            const slug = item.getAttribute('data-slug');
            if (!slug) return;
            item.addEventListener('click', () => {
                window.location.href = `${pathPrefix}tools/${slug}.html`;
            });
        });
    });

    // Close search suggestions on click outside
    document.addEventListener('click', (e) => {
        if (!inputElement.contains(e.target) && !suggestionsElement.contains(e.target)) {
            suggestionsElement.style.display = 'none';
        }
    });

    // Support keyboard selection (Arrow keys + Enter)
    let activeIdx = -1;
    inputElement.addEventListener('keydown', (e) => {
        const items = suggestionsElement.querySelectorAll('.search-suggestion-item');
        if (suggestionsElement.style.display !== 'block' || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = (activeIdx + 1) % items.length;
            highlightItem(items, activeIdx);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = (activeIdx - 1 + items.length) % items.length;
            highlightItem(items, activeIdx);
        } else if (e.key === 'Enter') {
            if (activeIdx >= 0 && activeIdx < items.length) {
                e.preventDefault();
                items[activeIdx].click();
            }
        }
    });

    function highlightItem(items, index) {
        items.forEach((item, idx) => {
            if (idx === index) {
                item.style.backgroundColor = 'var(--bg-tertiary)';
            } else {
                item.style.backgroundColor = '';
            }
        });
    }
}
