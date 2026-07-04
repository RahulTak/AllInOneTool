export function init() {
    const input = document.getElementById('sort-input-text');
    const output = document.getElementById('sort-output-text');
    const az = document.getElementById('sort-btn-az');
    const za = document.getElementById('sort-btn-za');
    const num = document.getElementById('sort-btn-num');
    const shuffle = document.getElementById('sort-btn-shuffle');

    if (!input) return;

    function getLines() {
        return input.value.split('\n').filter(l => l.length > 0);
    }

    az.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => a.localeCompare(b)).join('\n');
    });

    za.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => b.localeCompare(a)).join('\n');
    });

    num.addEventListener('click', () => {
        output.value = getLines().sort((a,b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join('\n');
    });

    shuffle.addEventListener('click', () => {
        const arr = getLines();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        output.value = arr.join('\n');
    });
}
