export function init() {
    const valInput = document.getElementById('unix-val');
    const local = document.getElementById('unix-local');
    const utc = document.getElementById('unix-utc');
    const dateInput = document.getElementById('unix-date-input');
    const resSec = document.getElementById('unix-result-seconds');

    if (!valInput) return;

    const now = new Date();
    dateInput.value = now.toISOString().substring(0, 16);

    function computeTs() {
        const val = parseInt(valInput.value);
        if (isNaN(val)) return;

        const ms = val > 99999999999 ? val : val * 1000;
        const d = new Date(ms);

        local.textContent = d.toString();
        utc.textContent = d.toUTCString();
    }

    function computeDate() {
        const val = dateInput.value;
        if (!val) return;
        const d = new Date(val);
        resSec.textContent = Math.round(d.getTime() / 1000);
    }

    valInput.addEventListener('input', computeTs);
    dateInput.addEventListener('input', computeDate);

    computeTs();
    computeDate();
}
