export function init() {
    const inputArea = document.getElementById('sd-input');
    const calcBtn = document.getElementById('sd-calc');
    const resetBtn = document.getElementById('sd-reset');
    const errBox = document.getElementById('sd-error');
    const sValEl = document.getElementById('sd-sample-val');
    const sVarEl = document.getElementById('sd-sample-var');
    const pValEl = document.getElementById('sd-pop-val');
    const pVarEl = document.getElementById('sd-pop-var');
    const countEl = document.getElementById('sd-count');
    const meanEl = document.getElementById('sd-mean');
    const ssEl = document.getElementById('sd-ss');
    const seEl = document.getElementById('sd-se');

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
        if (nums.length < 2) {
            errBox.textContent = 'Please enter at least 2 numbers to compute standard deviation.';
            errBox.style.display = 'block';
            return;
        }

        const N = nums.length;
        const sum = nums.reduce((acc, v) => acc + v, 0);
        const mean = sum / N;

        let ss = 0;
        nums.forEach(x => {
            const diff = x - mean;
            ss += (diff * diff);
        });

        const popVar = ss / N;
        const popSd = Math.sqrt(popVar);

        const sampleVar = ss / (N - 1);
        const sampleSd = Math.sqrt(sampleVar);
        const se = sampleSd / Math.sqrt(N);

        sValEl.textContent = Number(sampleSd.toFixed(3)).toString();
        sVarEl.textContent = 'Variance (s²): ' + Number(sampleVar.toFixed(3)).toString();
        pValEl.textContent = Number(popSd.toFixed(3)).toString();
        pVarEl.textContent = 'Variance (σ²): ' + Number(popVar.toFixed(3)).toString();

        countEl.textContent = N.toString();
        meanEl.textContent = Number(mean.toFixed(3)).toString();
        ssEl.textContent = Number(ss.toFixed(3)).toString();
        seEl.textContent = Number(se.toFixed(3)).toString();
    }

    inputArea.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        inputArea.value = '10, 12, 23, 23, 16, 23, 21, 16';
        calculate();
    });

    calculate();
}
