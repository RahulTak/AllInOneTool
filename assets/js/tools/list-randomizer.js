export function init() {
    const input = document.getElementById('list-input');
    const output = document.getElementById('list-output');
    const randomBtn = document.getElementById('list-randomize');
    const azBtn = document.getElementById('list-sort-az');
    const zaBtn = document.getElementById('list-sort-za');
    const dedupeBtn = document.getElementById('list-dedupe');
    const resetBtn = document.getElementById('list-reset');
    const copyBtn = document.getElementById('list-copy');

    if (!input) return;

    function getLines() {
        return input.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    }

    randomBtn.addEventListener('click', () => {
        const lines = getLines();
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        output.value = lines.join('\n');
    });

    azBtn.addEventListener('click', () => {
        const lines = getLines().sort((a,b) => a.localeCompare(b));
        output.value = lines.join('\n');
    });

    zaBtn.addEventListener('click', () => {
        const lines = getLines().sort((a,b) => b.localeCompare(a));
        output.value = lines.join('\n');
    });

    dedupeBtn.addEventListener('click', () => {
        const lines = [...new Set(getLines())];
        output.value = lines.join('\n');
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied Output!'));
    });
}
