export function init() {
    const type = document.getElementById('grad-type');
    const angle = document.getElementById('grad-angle');
    const stopsContainer = document.getElementById('stops-container');
    const addStopBtn = document.getElementById('add-stop-btn');
    const preview = document.getElementById('grad-preview-box');
    const cssCode = document.getElementById('grad-css-code');
    const reset = document.getElementById('grad-btn-reset');
    const copy = document.getElementById('grad-btn-copy');

    if (!preview) return;

    let stops = [
        { color: '#6366f1', pct: 0 },
        { color: '#a855f7', pct: 100 }
    ];

    function renderStops() {
        stopsContainer.innerHTML = '';
        stops.forEach((stop, idx) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.gap = '0.5rem';
            div.style.alignItems = 'center';
            div.innerHTML = `
                <input type="color" class="stop-color" data-idx="${idx}" value="${stop.color}" style="width:50px; height:35px; cursor:pointer;">
                <input type="number" class="stop-pct" data-idx="${idx}" value="${stop.pct}" min="0" max="100" style="width:80px;" class="input-control">
                <span>%</span>
                ${stops.length > 2 ? `<button class="btn btn-secondary delete-stop" data-idx="${idx}" style="padding:0.25rem 0.5rem; color:var(--error-color);">×</button>` : ''}
            `;
            stopsContainer.appendChild(div);
        });

        // Add event listeners
        stopsContainer.querySelectorAll('.stop-color').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'));
                stops[idx].color = e.target.value;
                render();
            });
        });

        stopsContainer.querySelectorAll('.stop-pct').forEach(el => {
            el.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-idx'));
                stops[idx].pct = parseInt(e.target.value) || 0;
                render();
            });
        });

        stopsContainer.querySelectorAll('.delete-stop').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = parseInt(el.getAttribute('data-idx'));
                stops.splice(idx, 1);
                renderStops();
                render();
            });
        });
    }

    addStopBtn.addEventListener('click', () => {
        if (stops.length >= 6) {
            alert('Maximum 6 color stops.');
            return;
        }
        stops.push({ color: '#3b82f6', pct: 50 });
        stops.sort((a, b) => a.pct - b.pct);
        renderStops();
        render();
    });

    function render() {
        const sorted = [...stops].sort((a,b) => a.pct - b.pct);
        const stopStrs = sorted.map(s => `${s.color} ${s.pct}%`).join(', ');

        const t = type.value;
        const a = angle.value;

        let gradStr = '';
        if (t === 'linear') {
            gradStr = `linear-gradient(${a}deg, ${stopStrs})`;
        } else {
            gradStr = `radial-gradient(circle, ${stopStrs})`;
        }

        const fullCSS = `background: ${sorted[0].color};\nbackground: ${gradStr};`;
        preview.style.background = gradStr;
        cssCode.value = fullCSS;
    }

    [type, angle].forEach(el => el.addEventListener('input', render));

    reset.addEventListener('click', () => {
        type.value = 'linear';
        angle.value = '90';
        stops = [
            { color: '#6366f1', pct: 0 },
            { color: '#a855f7', pct: 100 }
        ];
        renderStops();
        render();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.value).then(() => alert('CSS Code Copied!'));
    });

    renderStops();
    render();
}
