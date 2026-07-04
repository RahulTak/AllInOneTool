export function init() {
    const grid = document.getElementById('clocks-grid');
    if (!grid) return;

    const cities = [
        { name: 'UTC/GMT', zone: 'UTC' },
        { name: 'New York', zone: 'America/New_York' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Dubai', zone: 'Asia/Dubai' },
        { name: 'Mumbai', zone: 'Asia/Kolkata' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'Sydney', zone: 'Australia/Sydney' }
    ];

    function updateClocks() {
        grid.innerHTML = cities.map(city => {
            const options = { timeZone: city.zone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const timeStr = new Date().toLocaleTimeString('en-US', options);
            const dateStr = new Date().toLocaleDateString('en-US', { timeZone: city.zone, month: 'short', day: 'numeric' });
            return `
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1rem; text-align:center;">
                    <h4 style="margin-bottom:0.25rem;">${city.name}</h4>
                    <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono); color:var(--primary-color);">${timeStr}</div>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">${dateStr}</span>
                </div>
            `;
        }).join('');
    }

    setInterval(updateClocks, 1000);
    updateClocks();
}
