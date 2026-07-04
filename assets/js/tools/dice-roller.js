export function init() {
    const qty = document.getElementById('dice-qty-select');
    const type = document.getElementById('dice-type-select');
    const output = document.getElementById('dice-rolling-result');
    const rollBtn = document.getElementById('dice-btn-action');

    if (!rollBtn) return;

    rollBtn.addEventListener('click', () => {
        const count = parseInt(qty.value) || 2;
        const faces = parseInt(type.value) || 6;

        let rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * faces) + 1;
            rolls.push(roll);
            total += roll;
        }

        output.textContent = 'Rolls: ' + rolls.join(', ') + ' (Total: ' + total + ')';
    });
}
