export function init() {
    const modeSel = document.getElementById('prob-mode');
    const singleFields = document.getElementById('prob-single-fields');
    const twoFields = document.getElementById('prob-two-fields');
    const seriesFields = document.getElementById('prob-series-fields');

    const favInput = document.getElementById('prob-favorable');
    const totInput = document.getElementById('prob-total');
    const paInput = document.getElementById('prob-pa');
    const pbInput = document.getElementById('prob-pb');
    const spInput = document.getElementById('prob-single-p');
    const trialsInput = document.getElementById('prob-trials');

    const calcBtn = document.getElementById('prob-calc');
    const resetBtn = document.getElementById('prob-reset');
    const errBox = document.getElementById('prob-error');

    const resDec = document.getElementById('prob-res-dec');
    const resPct = document.getElementById('prob-res-pct');
    const resOdds = document.getElementById('prob-res-odds');
    const breakdownEl = document.getElementById('prob-breakdown');

    if (!modeSel || !calcBtn) return;

    modeSel.addEventListener('change', () => {
        const m = modeSel.value;
        singleFields.style.display = (m === 'single') ? 'grid' : 'none';
        twoFields.style.display = (m === 'two') ? 'grid' : 'none';
        seriesFields.style.display = (m === 'series') ? 'grid' : 'none';
        calculate();
    });

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const m = modeSel.value;
        let p = 0;
        let breakdown = [];

        if (m === 'single') {
            const fav = parseFloat(favInput.value);
            const tot = parseFloat(totInput.value);

            if (isNaN(fav) || isNaN(tot) || fav < 0 || tot <= 0) {
                errBox.textContent = 'Favorable outcomes must be ≥ 0 and Total outcomes must be > 0.';
                errBox.style.display = 'block';
                return;
            }
            if (fav > tot) {
                errBox.textContent = 'Favorable outcomes cannot exceed total possible outcomes.';
                errBox.style.display = 'block';
                return;
            }

            p = fav / tot;
            breakdown.push({ label: 'Complement P(not A)', val: 1 - p });
            breakdown.push({ label: 'Odds in Favor', valText: fav + ' : ' + (tot - fav) });
            breakdown.push({ label: 'Odds Against', valText: (tot - fav) + ' : ' + fav });
        } else if (m === 'two') {
            const pA = parseFloat(paInput.value);
            const pB = parseFloat(pbInput.value);

            if (isNaN(pA) || pA < 0 || pA > 1 || isNaN(pB) || pB < 0 || pB > 1) {
                errBox.textContent = 'Probabilities must be numbers between 0 and 1.';
                errBox.style.display = 'block';
                return;
            }

            // Both A and B occur
            p = pA * pB;
            const pOr = pA + pB - (pA * pB);
            const pOnlyA = pA * (1 - pB);
            const pNeither = (1 - pA) * (1 - pB);

            breakdown.push({ label: 'P(Both A and B)', val: p });
            breakdown.push({ label: 'P(A or B or Both)', val: pOr });
            breakdown.push({ label: 'P(A but not B)', val: pOnlyA });
            breakdown.push({ label: 'P(Neither A nor B)', val: pNeither });
        } else {
            const sP = parseFloat(spInput.value);
            const n = parseInt(trialsInput.value, 10);

            if (isNaN(sP) || sP < 0 || sP > 1) {
                errBox.textContent = 'Trial probability must be between 0 and 1.';
                errBox.style.display = 'block';
                return;
            }
            if (isNaN(n) || n < 1) {
                errBox.textContent = 'Number of trials must be at least 1.';
                errBox.style.display = 'block';
                return;
            }

            // At least once: 1 - (1 - p)^n
            const pNone = Math.pow(1 - sP, n);
            p = 1 - pNone;

            breakdown.push({ label: 'P(At least once)', val: p });
            breakdown.push({ label: 'P(Never in ' + n + ' trials)', val: pNone });
            breakdown.push({ label: 'P(Every single trial)', val: Math.pow(sP, n) });
        }

        resDec.textContent = p.toFixed(4);
        resPct.textContent = (p * 100).toFixed(2) + '%';
        if (p > 0) {
            const oneIn = (1 / p).toFixed(1);
            resOdds.textContent = '1 in ' + oneIn;
        } else {
            resOdds.textContent = 'Impossible (0%)';
        }

        breakdownEl.innerHTML = breakdown.map(item => {
            const vStr = (item.val !== undefined) ? Number(item.val.toFixed(4)) + ' (' + (item.val * 100).toFixed(1) + '%)' : item.valText;
            return '<div>' + item.label + ': <strong>' + vStr + '</strong></div>';
        }).join('');
    }

    [favInput, totInput, paInput, pbInput, spInput, trialsInput].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        modeSel.value = 'single';
        singleFields.style.display = 'grid';
        twoFields.style.display = 'none';
        seriesFields.style.display = 'none';
        favInput.value = '1';
        totInput.value = '6';
        paInput.value = '0.5';
        pbInput.value = '0.5';
        spInput.value = '0.2';
        trialsInput.value = '5';
        calculate();
    });

    calculate();
}
