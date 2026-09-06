export function init() {
    let mode = 'metric';
    const tabMetric = document.getElementById('bmr-tab-metric');
    const tabImp = document.getElementById('bmr-tab-imperial');
    const metricUnits = document.querySelectorAll('.bmr-metric-unit');
    const impUnits = document.querySelectorAll('.bmr-imperial-unit');
    const genderSel = document.getElementById('bmr-gender');
    const ageInput = document.getElementById('bmr-age');
    const wKg = document.getElementById('bmr-weight-kg');
    const hCm = document.getElementById('bmr-height-cm');
    const wLb = document.getElementById('bmr-weight-lb');
    const hFt = document.getElementById('bmr-height-ft');
    const hIn = document.getElementById('bmr-height-in');
    const actSel = document.getElementById('bmr-activity');
    const calcBtn = document.getElementById('bmr-calc');
    const resetBtn = document.getElementById('bmr-reset');
    const errBox = document.getElementById('bmr-error');
    const resBmr = document.getElementById('bmr-res-val');
    const resTdee = document.getElementById('bmr-res-tdee');
    const goalMaintain = document.getElementById('bmr-goal-maintain');
    const goalMildLoss = document.getElementById('bmr-goal-mild-loss');
    const goalLoss = document.getElementById('bmr-goal-loss');
    const goalGain = document.getElementById('bmr-goal-gain');

    if (!tabMetric || !calcBtn) return;

    tabMetric.addEventListener('click', () => {
        mode = 'metric';
        tabMetric.classList.replace('btn-secondary', 'btn-primary');
        tabImp.classList.replace('btn-primary', 'btn-secondary');
        metricUnits.forEach(el => el.style.display = 'block');
        impUnits.forEach(el => el.style.display = 'none');
        calculate();
    });

    tabImp.addEventListener('click', () => {
        mode = 'imperial';
        tabImp.classList.replace('btn-secondary', 'btn-primary');
        tabMetric.classList.replace('btn-primary', 'btn-secondary');
        metricUnits.forEach(el => el.style.display = 'none');
        impUnits.forEach(el => el.style.display = 'block');
        calculate();
    });

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const gender = genderSel.value;
        const age = parseInt(ageInput.value, 10);
        const activity = parseFloat(actSel.value);

        if (isNaN(age) || age < 15 || age > 120) {
            errBox.textContent = 'Please enter an age between 15 and 120.';
            errBox.style.display = 'block';
            return;
        }

        let weightKg = 0;
        let heightCm = 0;

        if (mode === 'metric') {
            weightKg = parseFloat(wKg.value);
            heightCm = parseFloat(hCm.value);
            if (isNaN(weightKg) || weightKg <= 0) {
                errBox.textContent = 'Please enter a valid weight in kg.';
                errBox.style.display = 'block';
                return;
            }
            if (isNaN(heightCm) || heightCm <= 0) {
                errBox.textContent = 'Please enter a valid height in cm.';
                errBox.style.display = 'block';
                return;
            }
        } else {
            const lb = parseFloat(wLb.value);
            const ft = parseFloat(hFt.value) || 0;
            const inch = parseFloat(hIn.value) || 0;
            const totalInches = (ft * 12) + inch;

            if (isNaN(lb) || lb <= 0) {
                errBox.textContent = 'Please enter a valid weight in pounds.';
                errBox.style.display = 'block';
                return;
            }
            if (totalInches <= 0) {
                errBox.textContent = 'Please enter a valid height in feet and inches.';
                errBox.style.display = 'block';
                return;
            }
            weightKg = lb * 0.45359237;
            heightCm = totalInches * 2.54;
        }

        // Mifflin-St Jeor formula
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const tdee = bmr * activity;

        resBmr.textContent = Math.round(bmr).toLocaleString() + ' kcal';
        resTdee.textContent = Math.round(tdee).toLocaleString() + ' kcal';
        goalMaintain.textContent = Math.round(tdee).toLocaleString() + ' kcal';
        goalMildLoss.textContent = Math.max(1000, Math.round(tdee - 250)).toLocaleString() + ' kcal';
        goalLoss.textContent = Math.max(1000, Math.round(tdee - 500)).toLocaleString() + ' kcal';
        goalGain.textContent = Math.round(tdee + 500).toLocaleString() + ' kcal';
    }

    [genderSel, ageInput, wKg, hCm, wLb, hFt, hIn, actSel].forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
            input.addEventListener('change', calculate);
        }
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        genderSel.value = 'male';
        ageInput.value = '28';
        wKg.value = '75';
        hCm.value = '178';
        wLb.value = '165';
        hFt.value = '5';
        hIn.value = '10';
        actSel.value = '1.375';
        calculate();
    });

    calculate();
}
