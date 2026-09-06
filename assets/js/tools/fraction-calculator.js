export function init() {
    const f1w = document.getElementById('f1-whole');
    const f1n = document.getElementById('f1-num');
    const f1d = document.getElementById('f1-den');
    const opSel = document.getElementById('frac-op');
    const f2w = document.getElementById('f2-whole');
    const f2n = document.getElementById('f2-num');
    const f2d = document.getElementById('f2-den');
    const calcBtn = document.getElementById('frac-calc');
    const resetBtn = document.getElementById('frac-reset');
    const errBox = document.getElementById('frac-error');
    const resSimple = document.getElementById('frac-res-simple');
    const resMixed = document.getElementById('frac-res-mixed');
    const resDec = document.getElementById('frac-res-dec');
    const resSteps = document.getElementById('frac-res-steps');

    if (!f1n || !calcBtn) return;

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const w1 = parseInt(f1w.value, 10) || 0;
        let n1 = parseInt(f1n.value, 10);
        const d1 = parseInt(f1d.value, 10);

        const w2 = parseInt(f2w.value, 10) || 0;
        let n2 = parseInt(f2n.value, 10);
        const d2 = parseInt(f2d.value, 10);
        const op = opSel.value;

        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
            errBox.textContent = 'Please enter integer numerators and denominators for both fractions.';
            errBox.style.display = 'block';
            return;
        }

        if (d1 === 0 || d2 === 0) {
            errBox.textContent = 'Denominator cannot be zero.';
            errBox.style.display = 'block';
            return;
        }

        // Convert mixed to improper
        let num1 = (Math.abs(w1) * d1 + n1) * (w1 < 0 ? -1 : 1);
        let den1 = d1;
        let num2 = (Math.abs(w2) * d2 + n2) * (w2 < 0 ? -1 : 1);
        let den2 = d2;

        let resNum = 0;
        let resDen = 1;
        let steps = '';

        if (op === '+') {
            resNum = (num1 * den2) + (num2 * den1);
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' + ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ' + ' + num2 + '×' + den1 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '-') {
            resNum = (num1 * den2) - (num2 * den1);
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' − ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ' − ' + num2 + '×' + den1 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '*') {
            resNum = num1 * num2;
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' × ' + num2 + '/' + den2 + ' = (' + num1 + '×' + num2 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '/') {
            if (num2 === 0) {
                errBox.textContent = 'Cannot divide by a fraction equal to zero.';
                errBox.style.display = 'block';
                return;
            }
            resNum = num1 * den2;
            resDen = den1 * num2;
            steps = num1 + '/' + den1 + ' ÷ ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ') / (' + den1 + '×' + num2 + ') = ' + resNum + '/' + resDen;
        }

        if (resDen < 0) {
            resNum = -resNum;
            resDen = -resDen;
        }

        const commonDiv = gcd(resNum, resDen);
        const simpNum = resNum / commonDiv;
        const simpDen = resDen / commonDiv;

        if (commonDiv > 1) {
            steps += ' = ' + simpNum + '/' + simpDen + ' (reduced by ' + commonDiv + ')';
        }

        resSimple.textContent = (simpDen === 1) ? simpNum.toString() : (simpNum + ' / ' + simpDen);
        resDec.textContent = (simpNum / simpDen).toFixed(4);

        // Mixed number
        if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
            const whole = Math.trunc(simpNum / simpDen);
            const rem = Math.abs(simpNum % simpDen);
            resMixed.textContent = whole + ' ' + rem + '/' + simpDen;
        } else {
            resMixed.textContent = 'N/A';
        }

        resSteps.textContent = steps;
    }

    [f1w, f1n, f1d, opSel, f2w, f2n, f2d].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        f1w.value = '0';
        f1n.value = '1';
        f1d.value = '2';
        opSel.value = '+';
        f2w.value = '0';
        f2n.value = '1';
        f2d.value = '3';
        calculate();
    });

    calculate();
}
