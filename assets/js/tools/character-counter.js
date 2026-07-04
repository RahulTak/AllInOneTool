export function init() {
    const area = document.getElementById('cc-text-area');
    const total = document.getElementById('cc-char-total');
    const nosp = document.getElementById('cc-char-nospaces');
    const words = document.getElementById('cc-words-total');
    const read = document.getElementById('cc-read-time');

    if (!area) return;

    area.addEventListener('input', () => {
        const val = area.value;
        const count = val.length;
        const noSpaceCount = val.replace(/\s/g, '').length;
        const wordsArr = val.trim().split(/\s+/).filter(w => w.length > 0);
        const wCount = wordsArr.length;
        const minutes = Math.ceil(wCount / 200);

        total.textContent = count;
        nosp.textContent = noSpaceCount;
        words.textContent = wCount;
        read.textContent = minutes + 'm';
    });
}
