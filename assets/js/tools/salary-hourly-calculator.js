export function init() {
    const amountInput = document.getElementById('sal-amount');
    const currSelect = document.getElementById('sal-currency');
    const hDayInput = document.getElementById('sal-hours-day');
    const dWeekInput = document.getElementById('sal-days-week');
    const wYearInput = document.getElementById('sal-weeks-year');
    const calcBtn = document.getElementById('sal-calc');
    const resetBtn = document.getElementById('sal-reset');
    const errBox = document.getElementById('sal-error');

    const resHourly = document.getElementById('sal-res-hourly');
    const resMonthly = document.getElementById('sal-res-monthly');
    const resAnnualHrs = document.getElementById('sal-res-annual-hrs');
    const schHour = document.getElementById('sal-sch-hour');
    const schDay = document.getElementById('sal-sch-day');
    const schWeek = document.getElementById('sal-sch-week');
    const schBiweek = document.getElementById('sal-sch-biweek');
    const schMonth = document.getElementById('sal-sch-month');
    const schYear = document.getElementById('sal-sch-year');

    if (!amountInput || !calcBtn) return;

    function formatVal(sym, val) {
        return sym + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const salary = parseFloat(amountInput.value);
        const hDay = parseFloat(hDayInput.value);
        const dWeek = parseFloat(dWeekInput.value);
        const wYear = parseFloat(wYearInput.value);
        const sym = currSelect.value;

        if (isNaN(salary) || salary <= 0) {
            errBox.textContent = 'Please enter an annual salary greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(hDay) || hDay <= 0 || hDay > 24) {
            errBox.textContent = 'Hours per day must be between 1 and 24.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(dWeek) || dWeek < 1 || dWeek > 7) {
            errBox.textContent = 'Days per week must be between 1 and 7.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(wYear) || wYear < 1 || wYear > 52) {
            errBox.textContent = 'Working weeks per year must be between 1 and 52.';
            errBox.style.display = 'block';
            return;
        }

        const annualHours = hDay * dWeek * wYear;
        const hourlyRate = salary / annualHours;
        const dailyRate = hourlyRate * hDay;
        const weeklyRate = salary / wYear;
        const biWeeklyRate = weeklyRate * 2;
        const monthlyRate = salary / 12;

        resHourly.textContent = formatVal(sym, hourlyRate);
        resMonthly.textContent = formatVal(sym, monthlyRate);
        resAnnualHrs.textContent = annualHours.toLocaleString() + ' working hours / year';

        schHour.textContent = formatVal(sym, hourlyRate);
        schDay.textContent = formatVal(sym, dailyRate);
        schWeek.textContent = formatVal(sym, weeklyRate);
        schBiweek.textContent = formatVal(sym, biWeeklyRate);
        schMonth.textContent = formatVal(sym, monthlyRate);
        schYear.textContent = formatVal(sym, salary);
    }

    [amountInput, currSelect, hDayInput, dWeekInput, wYearInput].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        amountInput.value = '65000';
        currSelect.value = '$';
        hDayInput.value = '8';
        dWeekInput.value = '5';
        wYearInput.value = '52';
        calculate();
    });

    calculate();
}
