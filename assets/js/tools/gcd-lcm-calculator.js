export function init() {
    const num1Input = document.getElementById('gcd-num1');
    const num2Input = document.getElementById('gcd-num2');
    const calcBtn = document.getElementById('gcd-calc');
    const resetBtn = document.getElementById('gcd-reset');
    const errBox = document.getElementById('gcd-error');
    const resGcd = document.getElementById('gcd-res-gcd');
    const resLcm = document.getElementById('gcd-res-lcm');
    const stepsDiv = document.getElementById('gcd-steps');

    if (!num1Input || !calcBtn) return;

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const aRaw = parseInt(num1Input.value, 10);
        const bRaw = parseInt(num2Input.value, 10);

        if (isNaN(aRaw) || isNaN(bRaw)) {
            errBox.textContent = 'Please enter two valid integer values.';
            errBox.style.display = 'block';
            return;
        }

        let a = Math.abs(aRaw);
        let b = Math.abs(bRaw);

        if (a === 0 && b === 0) {
            errBox.textContent = 'Both numbers cannot be zero.';
            errBox.style.display = 'block';
            return;
        }

        let stepLines = [];
        let numA = Math.max(a, b);
        let numB = Math.min(a, b);

        while (numB > 0) {
            const quotient = Math.floor(numA / numB);
            const rem = numA % numB;
            stepLines.push(numA + ' = (' + numB + ' × ' + quotient + ') + ' + rem);
            numA = numB;
            numB = rem;
        }

        const gcd = numA;
        const lcm = (a === 0 || b === 0) ? 0 : (a / gcd) * b;

        resGcd.textContent = gcd.toLocaleString();
        resLcm.textContent = lcm.toLocaleString();

        stepLines.push('Result: GCD(' + aRaw + ', ' + bRaw + ') = ' + gcd);
        stepLines.push('LCM Formula: LCM(a, b) = |a × b| / GCD = (' + a + ' × ' + b + ') / ' + gcd + ' = ' + lcm);
        stepsDiv.innerHTML = stepLines.map(s => '<div>' + s + '</div>').join('');
    }

    [num1Input, num2Input].forEach(el => el.addEventListener('input', calculate));
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        num1Input.value = '48';
        num2Input.value = '180';
        calculate();
    });

    calculate();
}
