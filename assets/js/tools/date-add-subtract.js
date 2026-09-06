export function init() {
    const startInput = document.getElementById('date-start');
    const opInput = document.getElementById('date-op');
    const yInput = document.getElementById('date-years');
    const mInput = document.getElementById('date-months');
    const wInput = document.getElementById('date-weeks');
    const dInput = document.getElementById('date-days');
    const calcBtn = document.getElementById('date-calc');
    const resetBtn = document.getElementById('date-reset');
    const errBox = document.getElementById('date-calc-error');
    const resMain = document.getElementById('date-res-main');
    const resIso = document.getElementById('date-res-iso');

    if (!startInput || !calcBtn) return;

    // Set today as default start
    const today = new Date();
    startInput.value = today.toISOString().split('T')[0];

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const startVal = startInput.value;
        if (!startVal) {
            errBox.textContent = 'Please choose a valid Start Date.';
            errBox.style.display = 'block';
            return;
        }

        const isAdd = opInput.value === 'add';
        const sign = isAdd ? 1 : -1;

        const years = (parseInt(yInput.value, 10) || 0) * sign;
        const months = (parseInt(mInput.value, 10) || 0) * sign;
        const weeks = (parseInt(wInput.value, 10) || 0) * sign;
        const days = (parseInt(dInput.value, 10) || 0) * sign;

        const parts = startVal.split('-');
        let year = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1; // 0-indexed
        let day = parseInt(parts[2], 10);

        // Add/subtract years and months
        year += years;
        month += months;

        // Normalize year and month
        const tempDate = new Date(year, month, 1);
        year = tempDate.getFullYear();
        month = tempDate.getMonth();

        // Clamp day of month if necessary (e.g. Jan 31 + 1 month -> Feb 28/29)
        const daysInTargetMonth = new Date(year, month + 1, 0).getDate();
        day = Math.min(day, daysInTargetMonth);

        // Add weeks and days
        const totalDays = (weeks * 7) + days;
        const finalDate = new Date(year, month, day);
        finalDate.setDate(finalDate.getDate() + totalDays);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        resMain.textContent = finalDate.toLocaleDateString('en-US', options);
        resIso.textContent = finalDate.toISOString().split('T')[0];
    }

    [startInput, opInput, yInput, mInput, wInput, dInput].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        startInput.value = new Date().toISOString().split('T')[0];
        opInput.value = 'add';
        yInput.value = '0';
        mInput.value = '2';
        wInput.value = '0';
        dInput.value = '10';
        calculate();
    });

    calculate();
}
