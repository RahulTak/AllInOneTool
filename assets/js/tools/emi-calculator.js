export function init() {
    const amountInput = document.getElementById('emi-amount');
    const rateInput = document.getElementById('emi-rate');
    const tenureInput = document.getElementById('emi-tenure');
    const tenureType = document.getElementById('emi-tenure-type');
    const panel = document.getElementById('emi-results-panel');
    const monthlyVal = document.getElementById('emi-monthly-val');
    const totInterest = document.getElementById('emi-tot-interest');
    const totPayment = document.getElementById('emi-tot-payment');
    const tableBody = document.getElementById('emi-table-body');

    if (!amountInput) return;

    function calculate() {
        const P = parseFloat(amountInput.value) || 0;
        const rAnnual = parseFloat(rateInput.value) || 0;
        const tenure = parseFloat(tenureInput.value) || 0;

        if (P <= 0 || rAnnual <= 0 || tenure <= 0) return;

        const r = rAnnual / 12 / 100;
        const n = tenureType.value === 'years' ? tenure * 12 : tenure;

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = emi * n;
        const interest = total - P;

        monthlyVal.textContent = '$' + emi.toFixed(2);
        totInterest.textContent = '$' + interest.toFixed(2);
        totPayment.textContent = '$' + total.toFixed(2);

        let balance = P;
        let tableHTML = '';
        for (let i = 1; i <= n; i++) {
            const interestPaid = balance * r;
            const principalPaid = emi - interestPaid;
            balance -= principalPaid;

            tableHTML += '<tr>' +
                '<td style="padding:0.5rem;">' + i + '</td>' +
                '<td style="padding:0.5rem;">$' + emi.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + principalPaid.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + interestPaid.toFixed(2) + '</td>' +
                '<td style="padding:0.5rem;">$' + Math.max(0, balance).toFixed(2) + '</td>' +
                '</tr>';
        }
        tableBody.innerHTML = tableHTML;
        panel.style.display = 'block';
    }

    [amountInput, rateInput, tenureInput, tenureType].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calculate();
}
