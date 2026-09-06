export function init() {
    const priceInput = document.getElementById('disc-price');
    const pctInput = document.getElementById('disc-percent');
    const taxInput = document.getElementById('disc-tax');
    const calcBtn = document.getElementById('disc-calc');
    const resetBtn = document.getElementById('disc-reset');
    const errBox = document.getElementById('disc-error');
    const resFinal = document.getElementById('disc-res-final');
    const resSavings = document.getElementById('disc-res-savings');
    const breakOrig = document.getElementById('disc-break-orig');
    const breakPct = document.getElementById('disc-break-pct');
    const breakAmt = document.getElementById('disc-break-amt');
    const breakTax = document.getElementById('disc-break-tax');

    if (!priceInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const price = parseFloat(priceInput.value);
        const discountPct = parseFloat(pctInput.value);
        const taxPct = parseFloat(taxInput.value) || 0;

        if (isNaN(price) || price < 0) {
            errBox.textContent = 'Please enter a valid original price (0 or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(discountPct) || discountPct < 0 || discountPct > 100) {
            errBox.textContent = 'Please enter a discount percentage between 0% and 100%.';
            errBox.style.display = 'block';
            return;
        }
        if (taxPct < 0 || taxPct > 100) {
            errBox.textContent = 'Sales tax percentage must be between 0% and 100%.';
            errBox.style.display = 'block';
            return;
        }

        const discountAmt = price * (discountPct / 100);
        const discountedPrice = price - discountAmt;
        const taxAmt = discountedPrice * (taxPct / 100);
        const finalPrice = discountedPrice + taxAmt;

        resFinal.textContent = formatCurrency(finalPrice);
        resSavings.textContent = formatCurrency(discountAmt);
        breakOrig.textContent = formatCurrency(price);
        breakPct.textContent = discountPct + '%';
        breakAmt.textContent = '-' + formatCurrency(discountAmt);
        breakTax.textContent = taxAmt > 0 ? '+' + formatCurrency(taxAmt) + ' (' + taxPct + '%)' : '$0.00';
    }

    calcBtn.addEventListener('click', calculate);
    priceInput.addEventListener('input', calculate);
    pctInput.addEventListener('input', calculate);
    taxInput.addEventListener('input', calculate);

    resetBtn.addEventListener('click', () => {
        priceInput.value = '120';
        pctInput.value = '25';
        taxInput.value = '0';
        calculate();
    });

    calculate();
}
