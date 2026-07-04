export function init() {
    const x1 = document.getElementById('perc-x1');
    const y1 = document.getElementById('perc-y1');
    const res1 = document.getElementById('perc-res1');

    const x2 = document.getElementById('perc-x2');
    const y2 = document.getElementById('perc-y2');
    const res2 = document.getElementById('perc-res2');

    const x3 = document.getElementById('perc-x3');
    const y3 = document.getElementById('perc-y3');
    const res3 = document.getElementById('perc-res3');

    const x4 = document.getElementById('perc-x4');
    const y4 = document.getElementById('perc-y4');
    const res4 = document.getElementById('perc-res4');

    const x5 = document.getElementById('perc-x5');
    const y5 = document.getElementById('perc-y5');
    const res5 = document.getElementById('perc-res5');

    if (!x1) return;

    function calc1() {
        const valX = parseFloat(x1.value) || 0;
        const valY = parseFloat(y1.value) || 0;
        res1.textContent = ((valX / 100) * valY).toFixed(2).replace(/\.00$/, '');
    }

    function calc2() {
        const valX = parseFloat(x2.value) || 0;
        const valY = parseFloat(y2.value) || 0;
        if (valY === 0) { res2.textContent = '0%'; return; }
        res2.textContent = ((valX / valY) * 100).toFixed(2).replace(/\.00$/, '') + '%';
    }

    function calc3() {
        const valX = parseFloat(x3.value) || 0;
        const valY = parseFloat(y3.value) || 0;
        if (valX === 0) { res3.textContent = '-'; return; }
        const diff = valY - valX;
        const pct = (diff / valX) * 100;
        if (pct >= 0) {
            res3.textContent = pct.toFixed(2).replace(/\.00$/, '') + '% Increase';
            res3.style.color = 'var(--success-color)';
        } else {
            res3.textContent = Math.abs(pct).toFixed(2).replace(/\.00$/, '') + '% Decrease';
            res3.style.color = 'var(--error-color)';
        }
    }

    function calc4() {
        const valX = parseFloat(x4.value) || 0;
        const valY = parseFloat(y4.value) || 0;
        const avg = (valX + valY) / 2;
        if (avg === 0) { res4.textContent = '0%'; return; }
        const diff = Math.abs(valX - valY);
        res4.textContent = ((diff / avg) * 100).toFixed(2).replace(/\.00$/, '') + '%';
    }

    function calc5() {
        const valX = parseFloat(x5.value) || 0;
        const valY = parseFloat(y5.value) || 0;
        const savings = valX * (valY / 100);
        res5.textContent = '$' + (valX - savings).toFixed(2);
    }

    [x1, y1].forEach(el => el.addEventListener('input', calc1));
    [x2, y2].forEach(el => el.addEventListener('input', calc2));
    [x3, y3].forEach(el => el.addEventListener('input', calc3));
    [x4, y4].forEach(el => el.addEventListener('input', calc4));
    [x5, y5].forEach(el => el.addEventListener('input', calc5));

    calc1(); calc2(); calc3(); calc4(); calc5();
}
