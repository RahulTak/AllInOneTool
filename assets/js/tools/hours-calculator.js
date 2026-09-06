export function init() {
    const rowsBody = document.getElementById('hc-shift-rows');
    const addBtn = document.getElementById('hc-add-shift');
    const rateInput = document.getElementById('hc-hourly-rate');
    const otInput = document.getElementById('hc-ot-threshold');
    const calcBtn = document.getElementById('hc-calc');
    const resetBtn = document.getElementById('hc-reset');
    const errBox = document.getElementById('hc-error');
    const totHoursEl = document.getElementById('hc-tot-hours');
    const regOtEl = document.getElementById('hc-reg-ot-hours');
    const estPayEl = document.getElementById('hc-est-pay');

    if (!rowsBody || !calcBtn) return;

    function createShiftRow(dayName, inTime, outTime, breakMins) {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color)';
        tr.innerHTML = '<td style="padding:0.4rem 0.6rem;"><input type="text" class="input-control hc-day" value="' + dayName + '" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem;"><input type="time" class="input-control hc-in" value="' + inTime + '" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem;"><input type="time" class="input-control hc-out" value="' + outTime + '" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem;"><input type="number" class="input-control hc-break" value="' + breakMins + '" min="0" max="720" step="5" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem; font-weight:700;" class="hc-row-total">0.00h</td>' +
            '<td style="padding:0.4rem 0.6rem; text-align:center;"><button type="button" class="btn btn-secondary hc-del" style="padding:0.25rem 0.5rem; font-size:0.8rem;">✕</button></td>';

        tr.querySelector('.hc-del').addEventListener('click', () => {
            if (rowsBody.children.length > 1) {
                tr.remove();
                calculate();
            } else {
                alert('At least one shift entry is required.');
            }
        });

        tr.querySelectorAll('input').forEach(el => {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        });

        rowsBody.appendChild(tr);
    }

    function initDefaults() {
        rowsBody.innerHTML = '';
        createShiftRow('Monday', '09:00', '17:00', 30);
        createShiftRow('Tuesday', '09:00', '17:00', 30);
        createShiftRow('Wednesday', '09:00', '17:00', 30);
        createShiftRow('Thursday', '09:00', '17:00', 30);
        createShiftRow('Friday', '22:00', '06:00', 0); // overnight shift: 8 hrs
    }

    function timeToMinutes(tStr) {
        if (!tStr) return 0;
        const parts = tStr.split(':');
        return (parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10);
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const inInputs = rowsBody.querySelectorAll('.hc-in');
        const outInputs = rowsBody.querySelectorAll('.hc-out');
        const breakInputs = rowsBody.querySelectorAll('.hc-break');
        const totalCells = rowsBody.querySelectorAll('.hc-row-total');

        let totalMinutes = 0;

        for (let i = 0; i < inInputs.length; i++) {
            const inM = timeToMinutes(inInputs[i].value);
            const outM = timeToMinutes(outInputs[i].value);
            const brk = parseInt(breakInputs[i].value, 10) || 0;

            if (!inInputs[i].value || !outInputs[i].value) {
                totalCells[i].textContent = '0.00h';
                continue;
            }

            // Overnight shift support: if out < in, add 24 hours (1440 mins)
            let diff = outM - inM;
            if (diff < 0) {
                diff += 1440;
            }
            let net = diff - brk;
            if (net < 0) net = 0;

            totalMinutes += net;
            const rowHrs = (net / 60);
            totalCells[i].textContent = rowHrs.toFixed(2) + 'h';
        }

        const totalHours = totalMinutes / 60;
        const otThreshold = parseFloat(otInput.value) || 40;
        const rate = parseFloat(rateInput.value) || 0;

        let regHours = Math.min(totalHours, otThreshold);
        let otHours = Math.max(0, totalHours - otThreshold);

        totHoursEl.textContent = totalHours.toFixed(2) + ' hrs';
        regOtEl.textContent = regHours.toFixed(2) + ' reg / ' + otHours.toFixed(2) + ' OT';

        // 1.5x overtime multiplier
        const pay = (regHours * rate) + (otHours * rate * 1.5);
        estPayEl.textContent = '$' + pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    addBtn.addEventListener('click', () => {
        createShiftRow('Extra Shift', '09:00', '17:00', 30);
        calculate();
    });

    [rateInput, otInput].forEach(el => el.addEventListener('input', calculate));
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        rateInput.value = '25';
        otInput.value = '40';
        initDefaults();
        calculate();
    });

    initDefaults();
    calculate();
}
