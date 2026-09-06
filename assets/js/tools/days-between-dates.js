export function init() {
    const startInput = document.getElementById('dbd-start');
    const endInput = document.getElementById('dbd-end');
    const incEndCheck = document.getElementById('dbd-include-end');
    const calcBtn = document.getElementById('dbd-calc');
    const resetBtn = document.getElementById('dbd-reset');
    const errBox = document.getElementById('dbd-error');
    const resDays = document.getElementById('dbd-res-days');
    const resWeeks = document.getElementById('dbd-res-weeks');
    const calBreak = document.getElementById('dbd-cal-break');
    const hoursEl = document.getElementById('dbd-hours');
    const minutesEl = document.getElementById('dbd-minutes');
    const bizDaysEl = document.getElementById('dbd-biz-days');

    if (!startInput || !calcBtn) return;

    // Default dates
    const today = new Date();
    startInput.value = today.toISOString().split('T')[0];
    const endDef = new Date();
    endDef.setDate(today.getDate() + 45);
    endInput.value = endDef.toISOString().split('T')[0];

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        if (!startInput.value || !endInput.value) {
            errBox.textContent = 'Please select both a Start Date and an End Date.';
            errBox.style.display = 'block';
            return;
        }

        const d1 = new Date(startInput.value + 'T00:00:00');
        const d2 = new Date(endInput.value + 'T00:00:00');

        let diffMs = d2.getTime() - d1.getTime();
        let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const isNegative = totalDays < 0;
        totalDays = Math.abs(totalDays);

        if (incEndCheck.checked) {
            totalDays += 1;
        }

        const weeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;

        resDays.textContent = totalDays.toLocaleString() + ' Days' + (isNegative ? ' (reversed)' : '');
        resWeeks.textContent = weeks + ' wks, ' + remDays + ' day(s)';

        // Business days
        let bizDays = 0;
        const cur = new Date(Math.min(d1.getTime(), d2.getTime()));
        const endLimit = new Date(Math.max(d1.getTime(), d2.getTime()));
        if (incEndCheck.checked) {
            endLimit.setDate(endLimit.getDate() + 1);
        }
        while (cur < endLimit) {
            const dayOfWeek = cur.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                bizDays++;
            }
            cur.setDate(cur.getDate() + 1);
        }

        // Calendar breakdown
        let dStart = new Date(Math.min(d1.getTime(), d2.getTime()));
        let dEnd = new Date(Math.max(d1.getTime(), d2.getTime()));
        if (incEndCheck.checked) {
            dEnd.setDate(dEnd.getDate() + 1);
        }
        let calY = dEnd.getFullYear() - dStart.getFullYear();
        let calM = dEnd.getMonth() - dStart.getMonth();
        let calD = dEnd.getDate() - dStart.getDate();
        if (calD < 0) {
            calM--;
            const prevMonthDays = new Date(dEnd.getFullYear(), dEnd.getMonth(), 0).getDate();
            calD += prevMonthDays;
        }
        if (calM < 0) {
            calY--;
            calM += 12;
        }
        let calStr = '';
        if (calY > 0) calStr += calY + ' yr(s) ';
        if (calM > 0) calStr += calM + ' mo(s) ';
        calStr += calD + ' day(s)';

        calBreak.textContent = calStr.trim();
        hoursEl.textContent = (totalDays * 24).toLocaleString() + ' hrs';
        minutesEl.textContent = (totalDays * 24 * 60).toLocaleString() + ' mins';
        bizDaysEl.textContent = bizDays.toLocaleString() + ' days';
    }

    [startInput, endInput, incEndCheck].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        startInput.value = new Date().toISOString().split('T')[0];
        const endD = new Date();
        endD.setDate(endD.getDate() + 45);
        endInput.value = endD.toISOString().split('T')[0];
        incEndCheck.checked = false;
        calculate();
    });

    calculate();
}
