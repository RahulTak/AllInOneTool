export function init() {
    const pInput = document.getElementById('si-principal');
    const rInput = document.getElementById('si-rate');
    const tInput = document.getElementById('si-time');
    const uInput = document.getElementById('si-unit');
    const calcBtn = document.getElementById('si-calc');
    const resetBtn = document.getElementById('si-reset');
    const errBox = document.getElementById('si-error');
    const resInterest = document.getElementById('si-res-interest');
    const resTotal = document.getElementById('si-res-total');
    const breakP = document.getElementById('si-break-p');
    const breakR = document.getElementById('si-break-r');
    const breakT = document.getElementById('si-break-t');

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
        const unit = uInput.value;

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

        let timeInYears = T;
        let timeLabel = T + ' year(s)';
        if (unit === 'months') {
            timeInYears = T / 12;
            timeLabel = T + ' month(s) (' + timeInYears.toFixed(3) + ' yrs)';
        } else if (unit === 'days') {
            timeInYears = T / 365;
            timeLabel = T + ' day(s) (' + timeInYears.toFixed(3) + ' yrs)';
        }

        const SI = P * (R / 100) * timeInYears;
        const total = P + SI;

        resInterest.textContent = formatCurrency(SI);
        resTotal.textContent = formatCurrency(total);
        breakP.textContent = formatCurrency(P);
        breakR.textContent = R + '% per year';
        breakT.textContent = timeLabel;
    }

    calcBtn.addEventListener('click', calculate);
    pInput.addEventListener('input', calculate);
    rInput.addEventListener('input', calculate);
    tInput.addEventListener('input', calculate);
    uInput.addEventListener('change', calculate);

    resetBtn.addEventListener('click', () => {
        pInput.value = '10000';
        rInput.value = '5';
        tInput.value = '3';
        uInput.value = 'years';
        calculate();
    });

    calculate();
}
