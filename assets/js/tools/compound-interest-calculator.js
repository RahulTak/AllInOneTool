export function init() {
    const pInput = document.getElementById('ci-principal');
    const rInput = document.getElementById('ci-rate');
    const tInput = document.getElementById('ci-time');
    const fInput = document.getElementById('ci-freq');
    const calcBtn = document.getElementById('ci-calc');
    const resetBtn = document.getElementById('ci-reset');
    const errBox = document.getElementById('ci-error');
    const resFinal = document.getElementById('ci-res-final');
    const resInterest = document.getElementById('ci-res-interest');
    const resEar = document.getElementById('ci-res-ear');
    const tableBody = document.getElementById('ci-table-body');

    if (!pInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const P = parseFloat(pInput.value);
        const R = parseFloat(rInput.value);
        const T = parseFloat(tInput.value);
        const N = parseInt(fInput.value, 10);

        if (isNaN(P) || P <= 0) {
            errBox.textContent = 'Please enter a valid Principal Amount greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(R) || R < 0) {
            errBox.textContent = 'Please enter a valid Interest Rate (0% or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(T) || T <= 0) {
            errBox.textContent = 'Please enter a valid Time Duration greater than 0.';
            errBox.style.display = 'block';
            return;
        }

        const r = R / 100;
        const finalAmount = P * Math.pow(1 + (r / N), N * T);
        const totalInterest = finalAmount - P;
        const EAR = (Math.pow(1 + (r / N), N) - 1) * 100;

        resFinal.textContent = formatCurrency(finalAmount);
        resInterest.textContent = formatCurrency(totalInterest);
        resEar.textContent = EAR.toFixed(2) + '%';

        // Year-by-year table
        tableBody.innerHTML = '';
        const fullYears = Math.min(Math.ceil(T), 100);
        let currBalance = P;

        for (let yr = 1; yr <= fullYears; yr++) {
            const yrTime = (yr === fullYears && T % 1 !== 0) ? T : yr;
            const endBal = P * Math.pow(1 + (r / N), N * yrTime);
            const yrInterest = endBal - currBalance;

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = '<td style="padding:0.5rem 0.6rem; font-weight:600;">Year ' + yr + '</td>' +
                '<td style="padding:0.5rem 0.6rem;">' + formatCurrency(currBalance) + '</td>' +
                '<td style="padding:0.5rem 0.6rem; color:#1a7f37;">+' + formatCurrency(yrInterest) + '</td>' +
                '<td style="padding:0.5rem 0.6rem; font-weight:700;">' + formatCurrency(endBal) + '</td>';
            tableBody.appendChild(tr);

            currBalance = endBal;
        }
    }

    calcBtn.addEventListener('click', calculate);
    pInput.addEventListener('input', calculate);
    rInput.addEventListener('input', calculate);
    tInput.addEventListener('input', calculate);
    fInput.addEventListener('change', calculate);

    resetBtn.addEventListener('click', () => {
        pInput.value = '10000';
        rInput.value = '7';
        tInput.value = '5';
        fInput.value = '12';
        calculate();
    });

    calculate();
}
