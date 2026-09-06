export function init() {
    const numInput = document.getElementById('pnc-input');
    const calcBtn = document.getElementById('pnc-calc');
    const resetBtn = document.getElementById('pnc-reset');
    const errBox = document.getElementById('pnc-error');
    const numLabel = document.getElementById('pnc-res-num-label');
    const statusEl = document.getElementById('pnc-status');
    const descEl = document.getElementById('pnc-desc');
    const countEl = document.getElementById('pnc-factor-count');
    const factorizeEl = document.getElementById('pnc-factorization');
    const allFactorsEl = document.getElementById('pnc-all-factors');

    if (!numInput || !calcBtn) return;

    function getFactors(n) {
        const factors = [];
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                factors.push(i);
                if (i !== n / i) {
                    factors.push(n / i);
                }
            }
        }
        return factors.sort((a, b) => a - b);
    }

    function getPrimeFactors(n) {
        const pFactors = [];
        let d = 2;
        let temp = n;
        while (d * d <= temp) {
            if (temp % d === 0) {
                pFactors.push(d);
                temp /= d;
            } else {
                d++;
            }
        }
        if (temp > 1) pFactors.push(temp);
        return pFactors;
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const val = numInput.value.trim();
        const n = parseInt(val, 10);

        if (isNaN(n)) {
            errBox.textContent = 'Please enter a valid whole integer.';
            errBox.style.display = 'block';
            return;
        }
        if (Math.abs(n) > Number.MAX_SAFE_INTEGER) {
            errBox.textContent = 'Number is too large for safe integer calculation.';
            errBox.style.display = 'block';
            return;
        }

        numLabel.textContent = 'Inspected Number: ' + n.toLocaleString();

        if (n <= 1) {
            statusEl.textContent = 'Not a Prime Number';
            statusEl.style.color = '#cf222e';
            descEl.textContent = (n === 0 || n === 1) ? (n + ' is neither prime nor composite by mathematical definition.') : 'Negative numbers are not considered prime numbers.';
            countEl.textContent = (n === 0) ? 'Infinite' : (n === 1 ? '1' : 'None');
            factorizeEl.textContent = 'None';
            allFactorsEl.textContent = (n === 1) ? '1' : 'None';
            return;
        }

        const factors = getFactors(n);
        const isPrime = (factors.length === 2);

        if (isPrime) {
            statusEl.textContent = 'Prime Number';
            statusEl.style.color = '#1a7f37';
            descEl.textContent = n + ' is only divisible by 1 and itself (' + n + ').';
            factorizeEl.textContent = n.toString();
        } else {
            statusEl.textContent = 'Composite Number (Not Prime)';
            statusEl.style.color = '#d97706';
            descEl.textContent = n + ' has ' + factors.length + ' positive divisors.';
            
            const pf = getPrimeFactors(n);
            const counts = {};
            pf.forEach(p => counts[p] = (counts[p] || 0) + 1);
            factorizeEl.textContent = Object.entries(counts).map(([p, c]) => c > 1 ? p + '^' + c : p).join(' × ');
        }

        countEl.textContent = factors.length.toString();
        allFactorsEl.textContent = factors.slice(0, 100).join(', ') + (factors.length > 100 ? '... (' + factors.length + ' total)' : '');
    }

    numInput.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        numInput.value = '29';
        calculate();
    });

    calculate();
}
