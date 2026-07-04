export function init() {
    const minInput = document.getElementById('rand-min');
    const maxInput = document.getElementById('rand-max');
    const qtyInput = document.getElementById('rand-quantity');
    const output = document.getElementById('rand-result');
    const generateBtn = document.getElementById('rand-btn-generate');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        const min = parseInt(minInput.value) || 1;
        const max = parseInt(maxInput.value) || 100;
        const qty = parseInt(qtyInput.value) || 5;

        if (min >= max) {
            alert('Minimum limit must be less than maximum.');
            return;
        }

        let results = [];
        for(let i=0; i<qty; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            results.push(num);
        }
        output.textContent = results.join(', ');
    });
}
