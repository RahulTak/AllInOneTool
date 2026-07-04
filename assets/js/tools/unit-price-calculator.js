export function init() {
    const priceA = document.getElementById('p-price-a');
    const qtyA = document.getElementById('p-qty-a');
    const priceB = document.getElementById('p-price-b');
    const qtyB = document.getElementById('p-qty-b');

    const costA = document.getElementById('unit-cost-a');
    const costB = document.getElementById('unit-cost-b');
    const rec = document.getElementById('cheaper-recommendation');

    if (!priceA) return;

    function calculate() {
        const pA = parseFloat(priceA.value) || 0;
        const qA = parseFloat(qtyA.value) || 0;
        const pB = parseFloat(priceB.value) || 0;
        const qB = parseFloat(qtyB.value) || 0;

        if (qA <= 0 || qB <= 0) return;

        const uA = pA / qA;
        const uB = pB / qB;

        costA.textContent = '$' + uA.toFixed(2);
        costB.textContent = '$' + uB.toFixed(2);

        if (uA === uB) {
            rec.textContent = 'Both packages have identical unit pricing.';
            rec.style.color = 'var(--text-secondary)';
        } else if (uA < uB) {
            const diff = ((uB - uA) / uB * 100).toFixed(1);
            rec.textContent = 'Package A is ' + diff + '% cheaper!';
            rec.style.color = 'var(--success-color)';
        } else {
            const diff = ((uA - uB) / uA * 100).toFixed(1);
            rec.textContent = 'Package B is ' + diff + '% cheaper!';
            rec.style.color = 'var(--success-color)';
        }
    }

    [priceA, qtyA, priceB, qtyB].forEach(el => el.addEventListener('input', calculate));
    calculate();
}
