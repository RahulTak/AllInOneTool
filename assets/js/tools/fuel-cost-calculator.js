export function init() {
    const dist = document.getElementById('fuel-distance');
    const cons = document.getElementById('fuel-consumption');
    const price = document.getElementById('fuel-price');
    const round = document.getElementById('fuel-round-trip');

    const fuelVal = document.getElementById('total-fuel-needed');
    const costVal = document.getElementById('total-fuel-cost');

    if (!dist) return;

    function calculate() {
        const d = parseFloat(dist.value) || 0;
        const c = parseFloat(cons.value) || 0;
        const p = parseFloat(price.value) || 0;
        const multiplier = round.checked ? 2 : 1;

        const totalDist = d * multiplier;
        const fuelNeeded = (totalDist / 100) * c;
        const cost = fuelNeeded * p;

        fuelVal.textContent = fuelNeeded.toFixed(2) + ' L';
        costVal.textContent = '$' + cost.toFixed(2);
    }

    [dist, cons, price].forEach(el => el.addEventListener('input', calculate));
    round.addEventListener('change', calculate);
    calculate();
}
