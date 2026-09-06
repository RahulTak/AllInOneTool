export function init() {
    const amountInput = document.getElementById('lt-amount');
    const rateInput = document.getElementById('lt-rate');
    const emiInput = document.getElementById('lt-emi');
    const calcBtn = document.getElementById('lt-calc');
    const resetBtn = document.getElementById('lt-reset');
    const errBox = document.getElementById('lt-error');
    const resTenure = document.getElementById('lt-res-tenure');
    const resMonths = document.getElementById('lt-res-months');
    const resInterest = document.getElementById('lt-res-interest');
    const resTotal = document.getElementById('lt-res-total');
    const minEmiEl = document.getElementById('lt-min-emi');
    const breakP = document.getElementById('lt-break-p');
    const breakR = document.getElementById('lt-break-r');

    if (!amountInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const P = parseFloat(amountInput.value);
        const rAnnual = parseFloat(rateInput.value);
        const EMI = parseFloat(emiInput.value);

        if (isNaN(P) || P <= 0) {
            errBox.textContent = 'Please enter a valid loan amount greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(rAnnual) || rAnnual < 0) {
            errBox.textContent = 'Please enter an annual interest rate (0% or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(EMI) || EMI <= 0) {
            errBox.textContent = 'Please enter a monthly EMI payment greater than 0.';
            errBox.style.display = 'block';
            return;
        }

        const r = (rAnnual / 100) / 12;
        const initialMonthlyInterest = P * r;
        minEmiEl.textContent = '>' + formatCurrency(initialMonthlyInterest);
        breakP.textContent = formatCurrency(P);
        breakR.textContent = (r * 100).toFixed(4) + '% / mo';

        if (r > 0 && EMI <= initialMonthlyInterest) {
            errBox.textContent = 'EMI is too low to repay this loan. The monthly interest alone is ' + formatCurrency(initialMonthlyInterest) + '. Please enter an EMI greater than ' + formatCurrency(initialMonthlyInterest) + '.';
            errBox.style.display = 'block';
            resTenure.textContent = 'Indefinite';
            resMonths.textContent = 'EMI ≤ monthly interest';
            resInterest.textContent = '--';
            resTotal.textContent = '--';
            return;
        }

        let totalMonths = 0;
        if (r === 0) {
            totalMonths = Math.ceil(P / EMI);
        } else {
            // n = -ln(1 - P*r/EMI) / ln(1 + r)
            const n = -Math.log(1 - (P * r) / EMI) / Math.log(1 + r);
            totalMonths = Math.ceil(n);
        }

        const years = Math.floor(totalMonths / 12);
        const remMonths = totalMonths % 12;
        let tenureLabel = '';
        if (years > 0) tenureLabel += years + ' yr(s) ';
        if (remMonths > 0) tenureLabel += remMonths + ' mo(s)';
        if (!tenureLabel) tenureLabel = totalMonths + ' Month(s)';

        const totalPayment = EMI * totalMonths;
        const totalInterest = totalPayment - P;

        resTenure.textContent = tenureLabel;
        resMonths.textContent = totalMonths + ' total month(s)';
        resInterest.textContent = formatCurrency(totalInterest);
        resTotal.textContent = formatCurrency(totalPayment);
    }

    [amountInput, rateInput, emiInput].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        amountInput.value = '50000';
        rateInput.value = '8.5';
        emiInput.value = '1000';
        calculate();
    });

    calculate();
}
