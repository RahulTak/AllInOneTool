export function init() {
    const min = document.getElementById('cron-min');
    const hour = document.getElementById('cron-hour');
    const dom = document.getElementById('cron-dom');
    const month = document.getElementById('cron-month');
    const dow = document.getElementById('cron-dow');
    const expr = document.getElementById('cron-expression');
    const desc = document.getElementById('cron-desc');

    if (!min) return;

    function render() {
        const m = min.value.trim() || '*';
        const h = hour.value.trim() || '*';
        const d = dom.value.trim() || '*';
        const mo = month.value.trim() || '*';
        const w = dow.value.trim() || '*';

        const cronStr = m + ' ' + h + ' ' + d + ' ' + mo + ' ' + w;
        expr.textContent = cronStr;

        let explanation = 'Runs ';
        if (m === '*' && h === '*') explanation += 'every minute of every day.';
        else if (m === '0' && h === '*') explanation += 'at minute 0 past every hour.';
        else explanation += 'at specific cron scheduling intervals: "' + cronStr + '".';

        desc.textContent = explanation;
    }

    [min, hour, dom, month, dow].forEach(el => el.addEventListener('input', render));
}
