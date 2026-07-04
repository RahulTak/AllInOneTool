export function init() {
    const coin = document.getElementById('coin-visual-flip');
    const stats = document.getElementById('coin-totals');
    const flipBtn = document.getElementById('coin-btn-flip-action');

    let heads = 0, tails = 0;

    if (!flipBtn) return;

    flipBtn.addEventListener('click', () => {
        coin.style.transform = 'rotateY(1800deg)';
        setTimeout(() => {
            const result = Math.random() >= 0.5 ? 'Heads' : 'Tails';
            coin.textContent = result;
            coin.style.transform = 'none';
            if(result === 'Heads') {
                heads++;
                coin.style.background = '#f59e0b';
                coin.style.borderColor = '#d97706';
                coin.style.color = '#ffffff';
            } else {
                tails++;
                coin.style.background = '#94a3b8';
                coin.style.borderColor = '#475569';
                coin.style.color = '#ffffff';
            }
            stats.textContent = 'Heads: ' + heads + ' | Tails: ' + tails;
        }, 300);
    });
}
