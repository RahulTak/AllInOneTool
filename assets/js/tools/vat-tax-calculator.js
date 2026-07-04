export function init() {
    const amount = document.getElementById('vat-amount');
    const rate = document.getElementById('vat-rate');
    const modes = document.getElementsByName('vat-mode');
    const netEl = document.getElementById('vat-net');
    const taxEl = document.getElementById('vat-tax');
    const grossEl = document.getElementById('vat-gross');
    const reset = document.getElementById('vat-reset');
    const copy = document.getElementById('vat-copy');

    if (!amount) return;

    function calculate() {
        const amt = parseFloat(amount.value) || 0;
        const r = parseFloat(rate.value) || 0;
        let mode = 'exclude';
        modes.forEach(m => { if (m.checked) mode = m.value; });

        let net = 0, tax = 0, gross = 0;
        if (mode === 'exclude') {
            net = amt;
            tax = amt * (r / 100);
            gross = net + tax;
        } else {
            net = amt / (1 + r / 100);
            tax = amt - net;
            gross = amt;
        }

        netEl.textContent = '$' + net.toFixed(2);
        taxEl.textContent = '$' + tax.toFixed(2);
        grossEl.textContent = '$' + gross.toFixed(2);
    }

    amount.addEventListener('input', calculate);
    rate.addEventListener('input', calculate);
    modes.forEach(m => m.addEventListener('change', calculate));

    reset.addEventListener('click', () => {
        amount.value = '100';
        rate.value = '20';
        modes[0].checked = true;
        calculate();
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(grossEl.textContent).then(() => alert('Copied Gross Price!'));
    });

    calculate();
}
