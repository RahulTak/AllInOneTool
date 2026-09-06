export function init() {
    const inputArea = document.getElementById('mmm-input');
    const calcBtn = document.getElementById('mmm-calc');
    const resetBtn = document.getElementById('mmm-reset');
    const errBox = document.getElementById('mmm-error');
    const meanEl = document.getElementById('mmm-res-mean');
    const medianEl = document.getElementById('mmm-res-median');
    const modeEl = document.getElementById('mmm-res-mode');
    const countEl = document.getElementById('mmm-count');
    const sumEl = document.getElementById('mmm-sum');
    const minEl = document.getElementById('mmm-min');
    const maxEl = document.getElementById('mmm-max');
    const rangeEl = document.getElementById('mmm-range');
    const sortedEl = document.getElementById('mmm-sorted');

    if (!inputArea || !calcBtn) return;

    function parseNumbers(raw) {
        return raw
            .replace(/[,;]/g, ' ')
            .trim()
            .split(/\s+/)
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const nums = parseNumbers(inputArea.value);
        if (nums.length === 0) {
            errBox.textContent = 'Please enter at least one valid number.';
            errBox.style.display = 'block';
            return;
        }

        const sorted = [...nums].sort((a, b) => a - b);
        const count = sorted.length;
        const sum = sorted.reduce((acc, v) => acc + v, 0);
        const mean = sum / count;

        // Median
        let median = 0;
        const mid = Math.floor(count / 2);
        if (count % 2 === 0) {
            median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            median = sorted[mid];
        }

        // Mode
        const freqs = {};
        let maxFreq = 0;
        sorted.forEach(n => {
            freqs[n] = (freqs[n] || 0) + 1;
            if (freqs[n] > maxFreq) maxFreq = freqs[n];
        });

        let modes = [];
        if (maxFreq > 1) {
            for (const key in freqs) {
                if (freqs[key] === maxFreq) {
                    modes.push(parseFloat(key));
                }
            }
        }

        let modeText = 'No Mode';
        if (modes.length > 0) {
            modeText = modes.join(', ') + ' (' + maxFreq + '×)';
        }

        const min = sorted[0];
        const max = sorted[count - 1];
        const range = max - min;

        meanEl.textContent = Number(mean.toFixed(3)).toString();
        medianEl.textContent = Number(median.toFixed(3)).toString();
        modeEl.textContent = modeText;
        countEl.textContent = count.toString();
        sumEl.textContent = Number(sum.toFixed(3)).toString();
        minEl.textContent = min.toString();
        maxEl.textContent = max.toString();
        rangeEl.textContent = Number(range.toFixed(3)).toString();
        sortedEl.textContent = sorted.join(', ');
    }

    inputArea.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        inputArea.value = '12, 15, 12, 19, 24, 15, 30, 12';
        calculate();
    });

    calculate();
}
