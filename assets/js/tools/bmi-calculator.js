export function init() {
    let mode = 'metric';
    const tabMetric = document.getElementById('bmi-tab-metric');
    const tabImp = document.getElementById('bmi-tab-imperial');
    const metricFields = document.getElementById('bmi-metric-fields');
    const impFields = document.getElementById('bmi-imperial-fields');
    const wMetric = document.getElementById('bmi-weight-metric');
    const hMetric = document.getElementById('bmi-height-metric');
    const wImp = document.getElementById('bmi-weight-imp');
    const hFt = document.getElementById('bmi-height-ft');
    const hIn = document.getElementById('bmi-height-in');
    const calcBtn = document.getElementById('bmi-calc');
    const resetBtn = document.getElementById('bmi-reset');
    const errBox = document.getElementById('bmi-error');
    const bmiScoreEl = document.getElementById('bmi-score');
    const bmiCatEl = document.getElementById('bmi-category');
    const bmiRangeEl = document.getElementById('bmi-healthy-range');

    if (!tabMetric || !calcBtn) return;

    tabMetric.addEventListener('click', () => {
        mode = 'metric';
        tabMetric.classList.replace('btn-secondary', 'btn-primary');
        tabImp.classList.replace('btn-primary', 'btn-secondary');
        metricFields.style.display = 'grid';
        impFields.style.display = 'none';
        calculate();
    });

    tabImp.addEventListener('click', () => {
        mode = 'imperial';
        tabImp.classList.replace('btn-secondary', 'btn-primary');
        tabMetric.classList.replace('btn-primary', 'btn-secondary');
        metricFields.style.display = 'none';
        impFields.style.display = 'grid';
        calculate();
    });

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        let bmi = 0;
        let minHealthyKg = 0;
        let maxHealthyKg = 0;
        let isMetric = (mode === 'metric');

        if (isMetric) {
            const w = parseFloat(wMetric.value);
            const h = parseFloat(hMetric.value);
            if (isNaN(w) || w <= 0) {
                errBox.textContent = 'Please enter a valid weight in kg.';
                errBox.style.display = 'block';
                return;
            }
            if (isNaN(h) || h <= 0) {
                errBox.textContent = 'Please enter a valid height in cm.';
                errBox.style.display = 'block';
                return;
            }
            const hMeters = h / 100;
            bmi = w / (hMeters * hMeters);
            minHealthyKg = 18.5 * (hMeters * hMeters);
            maxHealthyKg = 24.9 * (hMeters * hMeters);
            bmiRangeEl.textContent = minHealthyKg.toFixed(1) + ' kg – ' + maxHealthyKg.toFixed(1) + ' kg';
        } else {
            const w = parseFloat(wImp.value);
            const ft = parseFloat(hFt.value) || 0;
            const inches = parseFloat(hIn.value) || 0;
            const totalInches = (ft * 12) + inches;

            if (isNaN(w) || w <= 0) {
                errBox.textContent = 'Please enter a valid weight in lbs.';
                errBox.style.display = 'block';
                return;
            }
            if (totalInches <= 0) {
                errBox.textContent = 'Please enter a valid height in feet and inches.';
                errBox.style.display = 'block';
                return;
            }
            bmi = (w / (totalInches * totalInches)) * 703;
            const minHealthyLb = (18.5 * (totalInches * totalInches)) / 703;
            const maxHealthyLb = (24.9 * (totalInches * totalInches)) / 703;
            bmiRangeEl.textContent = minHealthyLb.toFixed(1) + ' lbs – ' + maxHealthyLb.toFixed(1) + ' lbs';
        }

        bmiScoreEl.textContent = bmi.toFixed(1);

        if (bmi < 18.5) {
            bmiCatEl.textContent = 'Underweight';
            bmiCatEl.style.color = '#007bff';
        } else if (bmi < 25) {
            bmiCatEl.textContent = 'Normal Weight';
            bmiCatEl.style.color = '#1a7f37';
        } else if (bmi < 30) {
            bmiCatEl.textContent = 'Overweight';
            bmiCatEl.style.color = '#d97706';
        } else {
            bmiCatEl.textContent = 'Obesity';
            bmiCatEl.style.color = '#cf222e';
        }
    }

    [wMetric, hMetric, wImp, hFt, hIn].forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        wMetric.value = '70';
        hMetric.value = '175';
        wImp.value = '154';
        hFt.value = '5';
        hIn.value = '9';
        calculate();
    });

    calculate();
}
