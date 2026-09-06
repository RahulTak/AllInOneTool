export function init() {
    const billInput = document.getElementById('tip-bill');
    const customPctInput = document.getElementById('tip-custom-pct');
    const peopleInput = document.getElementById('tip-people');
    const presetBtns = document.querySelectorAll('.tip-btn');
    const calcBtn = document.getElementById('tip-calc');
    const resetBtn = document.getElementById('tip-reset');
    const errBox = document.getElementById('tip-error');
    const totalBillEl = document.getElementById('tip-total-bill');
    const totalTipEl = document.getElementById('tip-total-tip');
    const perPersonTotalEl = document.getElementById('tip-per-person-total');
    const perPersonTipEl = document.getElementById('tip-per-person-tip');

    if (!billInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const bill = parseFloat(billInput.value);
        const tipPct = parseFloat(customPctInput.value);
        const people = parseInt(peopleInput.value, 10);

        if (isNaN(bill) || bill < 0) {
            errBox.textContent = 'Please enter a valid bill amount.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(tipPct) || tipPct < 0) {
            errBox.textContent = 'Please enter a valid tip percentage (0 or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(people) || people < 1) {
            errBox.textContent = 'Number of people must be at least 1.';
            errBox.style.display = 'block';
            return;
        }

        const tipAmount = bill * (tipPct / 100);
        const totalBill = bill + tipAmount;
        const perPersonTotal = totalBill / people;
        const perPersonTip = tipAmount / people;

        totalBillEl.textContent = formatCurrency(totalBill);
        totalTipEl.textContent = formatCurrency(tipAmount);
        perPersonTotalEl.textContent = formatCurrency(perPersonTotal);
        perPersonTipEl.textContent = formatCurrency(perPersonTip);
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            customPctInput.value = btn.getAttribute('data-val');
            calculate();
        });
    });

    customPctInput.addEventListener('input', () => {
        presetBtns.forEach(b => {
            if (b.getAttribute('data-val') === customPctInput.value) {
                b.classList.remove('btn-secondary');
                b.classList.add('btn-primary');
            } else {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            }
        });
        calculate();
    });

    billInput.addEventListener('input', calculate);
    peopleInput.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);

    resetBtn.addEventListener('click', () => {
        billInput.value = '85.00';
        customPctInput.value = '18';
        peopleInput.value = '2';
        presetBtns.forEach(b => {
            if (b.getAttribute('data-val') === '18') {
                b.classList.remove('btn-secondary');
                b.classList.add('btn-primary');
            } else {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            }
        });
        calculate();
    });

    calculate();
}
