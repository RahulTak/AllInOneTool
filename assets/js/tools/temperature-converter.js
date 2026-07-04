export function init() {
    const c = document.getElementById('temp-celsius');
    const f = document.getElementById('temp-fahrenheit');
    const k = document.getElementById('temp-kelvin');

    if (!c) return;

    c.addEventListener('input', () => {
        const val = parseFloat(c.value);
        if (isNaN(val)) { f.value = ''; k.value = ''; return; }
        f.value = ((val * 9/5) + 32).toFixed(2).replace(/\.00$/, '');
        k.value = (val + 273.15).toFixed(2).replace(/\.00$/, '');
    });

    f.addEventListener('input', () => {
        const val = parseFloat(f.value);
        if (isNaN(val)) { c.value = ''; k.value = ''; return; }
        const cel = (val - 32) * 5/9;
        c.value = cel.toFixed(2).replace(/\.00$/, '');
        k.value = (cel + 273.15).toFixed(2).replace(/\.00$/, '');
    });

    k.addEventListener('input', () => {
        const val = parseFloat(k.value);
        if (isNaN(val)) { c.value = ''; f.value = ''; return; }
        const cel = val - 273.15;
        c.value = cel.toFixed(2).replace(/\.00$/, '');
        f.value = ((cel * 9/5) + 32).toFixed(2).replace(/\.00$/, '');
    });
}
