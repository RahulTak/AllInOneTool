export function init() {
    const aInput = document.getElementById('quad-a');
    const bInput = document.getElementById('quad-b');
    const cInput = document.getElementById('quad-c');
    const calcBtn = document.getElementById('quad-calc');
    const resetBtn = document.getElementById('quad-reset');
    const errBox = document.getElementById('quad-error');
    const eqDisplay = document.getElementById('quad-formatted-eq');
    const r1El = document.getElementById('quad-root1');
    const r2El = document.getElementById('quad-root2');
    const discEl = document.getElementById('quad-disc');
    const natureEl = document.getElementById('quad-nature');
    const vertexEl = document.getElementById('quad-vertex');
    const dirEl = document.getElementById('quad-direction');

    if (!aInput || !calcBtn) return;

    function formatEq(a, b, c) {
        let s = '';
        if (a === 1) s += 'x²';
        else if (a === -1) s += '-x²';
        else s += a + 'x²';

        if (b > 0) s += ' + ' + (b === 1 ? '' : b) + 'x';
        else if (b < 0) s += ' − ' + (b === -1 ? '' : Math.abs(b)) + 'x';

        if (c > 0) s += ' + ' + c;
        else if (c < 0) s += ' − ' + Math.abs(c);

        return s + ' = 0';
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const a = parseFloat(aInput.value);
        const b = parseFloat(bInput.value);
        const c = parseFloat(cInput.value);

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            errBox.textContent = 'Please enter valid numeric coefficients for a, b, and c.';
            errBox.style.display = 'block';
            return;
        }

        if (a === 0) {
            errBox.textContent = 'Coefficient "a" cannot be 0 in a quadratic equation (ax² + bx + c = 0). When a = 0, this is a linear equation.';
            errBox.style.display = 'block';
            return;
        }

        eqDisplay.textContent = formatEq(a, b, c);

        const D = (b * b) - (4 * a * c);
        discEl.textContent = Number(D.toFixed(4)).toString();

        const vertexX = -b / (2 * a);
        const vertexY = (a * vertexX * vertexX) + (b * vertexX) + c;
        vertexEl.textContent = '(' + Number(vertexX.toFixed(3)) + ', ' + Number(vertexY.toFixed(3)) + ')';
        dirEl.textContent = (a > 0) ? 'Upwards (min vertex)' : 'Downwards (max vertex)';

        if (D > 0) {
            const sqrtD = Math.sqrt(D);
            const x1 = (-b + sqrtD) / (2 * a);
            const x2 = (-b - sqrtD) / (2 * a);
            r1El.textContent = Number(x1.toFixed(4)).toString();
            r2El.textContent = Number(x2.toFixed(4)).toString();
            natureEl.textContent = 'Two distinct real roots';
        } else if (D === 0) {
            const x = -b / (2 * a);
            r1El.textContent = Number(x.toFixed(4)).toString();
            r2El.textContent = Number(x.toFixed(4)).toString();
            natureEl.textContent = 'One repeated real root (D = 0)';
        } else {
            // Complex roots
            const real = -b / (2 * a);
            const imag = Math.sqrt(-D) / (2 * Math.abs(a));
            const realStr = (Math.abs(real) < 1e-10) ? '0' : Number(real.toFixed(4)).toString();
            const imagStr = Number(imag.toFixed(4)).toString();

            r1El.textContent = realStr + ' + ' + imagStr + 'i';
            r2El.textContent = realStr + ' − ' + imagStr + 'i';
            natureEl.textContent = 'Two complex conjugate roots (D < 0)';
        }
    }

    [aInput, bInput, cInput].forEach(el => el.addEventListener('input', calculate));
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        aInput.value = '1';
        bInput.value = '-5';
        cInput.value = '6';
        calculate();
    });

    calculate();
}
