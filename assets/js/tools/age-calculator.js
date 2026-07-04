export function init() {
    const dob = document.getElementById('age-dob');
    const targetDate = document.getElementById('age-today');
    const panel = document.getElementById('age-results-panel');
    const exactAge = document.getElementById('age-exact');
    const totMonths = document.getElementById('age-tot-months');
    const totWeeks = document.getElementById('age-tot-weeks');
    const totDays = document.getElementById('age-tot-days');
    const totHours = document.getElementById('age-tot-hours');
    const totMinutes = document.getElementById('age-tot-minutes');
    const totSeconds = document.getElementById('age-tot-seconds');
    const countdown = document.getElementById('age-birthday-countdown');

    if (!dob) return;

    const today = new Date().toISOString().split('T')[0];
    targetDate.value = today;

    function calculate() {
        const d1 = new Date(dob.value);
        const d2 = new Date(targetDate.value);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

        if (d1 > d2) {
            alert('Date of birth cannot be after calculation date.');
            return;
        }

        let yDiff = d2.getFullYear() - d1.getFullYear();
        let mDiff = d2.getMonth() - d1.getMonth();
        let dDiff = d2.getDate() - d1.getDate();

        if (dDiff < 0) {
            mDiff--;
            const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            dDiff += prevMonth.getDate();
        }
        if (mDiff < 0) {
            yDiff--;
            mDiff += 12;
        }

        exactAge.textContent = `${yDiff} Years, ${mDiff} Months, ${dDiff} Days`;

        const timeDiff = Math.abs(d2.getTime() - d1.getTime());
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalWeeks = (totalDays / 7).toFixed(1);
        const totalMonths = (yDiff * 12 + mDiff).toFixed(0);

        totDays.textContent = totalDays.toLocaleString();
        totWeeks.textContent = totalWeeks.toLocaleString();
        totMonths.textContent = totalMonths.toLocaleString();
        totHours.textContent = (totalDays * 24).toLocaleString();
        totMinutes.textContent = (totalDays * 24 * 60).toLocaleString();
        totSeconds.textContent = (totalDays * 24 * 60 * 60).toLocaleString();

        let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
        if (d2 > nextBday) {
            nextBday.setFullYear(d2.getFullYear() + 1);
        }
        const diffToBday = Math.ceil((nextBday.getTime() - d2.getTime()) / (1000 * 3600 * 24));
        countdown.innerHTML = 'Days until next birthday: <strong>' + diffToBday + ' days</strong>';

        panel.style.display = 'block';
    }

    dob.addEventListener('change', calculate);
    targetDate.addEventListener('change', calculate);
}
