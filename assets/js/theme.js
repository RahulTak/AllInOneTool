// Simple theme loader and switcher logic
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    
    // Bind toggle buttons
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    }

    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    const sunElements = document.querySelectorAll('.sun-elements');
    const moonElement = document.querySelector('.moon-element');

    if (!moonElement) return;

    if (theme === 'dark') {
        sunElements.forEach(el => el.style.display = 'block');
        moonElement.style.display = 'none';
    } else {
        sunElements.forEach(el => el.style.display = 'none');
        moonElement.style.display = 'block';
    }
}
