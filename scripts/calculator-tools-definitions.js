module.exports = {
    // 1. SIMPLE INTEREST CALCULATOR
    'simple-interest-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="si-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="si-principal">Principal Amount ($)</label>
                    <input type="number" id="si-principal" class="input-control" value="10000" min="0" step="any" placeholder="e.g. 10000">
                </div>
                <div class="form-group">
                    <label for="si-rate">Annual Interest Rate (%)</label>
                    <input type="number" id="si-rate" class="input-control" value="5" min="0" step="0.01" placeholder="e.g. 5">
                </div>
                <div class="form-group">
                    <label for="si-time">Time Duration</label>
                    <div style="display:flex; gap:0.5rem;">
                        <input type="number" id="si-time" class="input-control" value="3" min="0" step="any" style="flex:1;">
                        <select id="si-unit" class="input-control" style="width:110px;">
                            <option value="years" selected>Years</option>
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="si-reset">Reset</button>
                <button class="btn btn-primary" id="si-calc">Calculate Interest</button>
            </div>

            <div id="si-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Interest Earned</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="si-res-interest">$0.00</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Amount (Principal + Interest)</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="si-res-total">$0.00</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Calculation Breakdown</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Principal (P): <strong id="si-break-p">$0.00</strong></div>
                        <div>Interest Rate (R): <strong id="si-break-r">0% per year</strong></div>
                        <div>Time Period (T): <strong id="si-break-t">0 years</strong></div>
                        <div>Formula: <strong style="font-family:var(--font-mono);">SI = P × R × T</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const pInput = document.getElementById('si-principal');
    const rInput = document.getElementById('si-rate');
    const tInput = document.getElementById('si-time');
    const uInput = document.getElementById('si-unit');
    const calcBtn = document.getElementById('si-calc');
    const resetBtn = document.getElementById('si-reset');
    const errBox = document.getElementById('si-error');
    const resInterest = document.getElementById('si-res-interest');
    const resTotal = document.getElementById('si-res-total');
    const breakP = document.getElementById('si-break-p');
    const breakR = document.getElementById('si-break-r');
    const breakT = document.getElementById('si-break-t');

    if (!pInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const P = parseFloat(pInput.value);
        const R = parseFloat(rInput.value);
        const T = parseFloat(tInput.value);
        const unit = uInput.value;

        if (isNaN(P) || P <= 0) {
            errBox.textContent = 'Please enter a valid Principal Amount greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(R) || R < 0) {
            errBox.textContent = 'Please enter a valid Interest Rate (0% or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(T) || T <= 0) {
            errBox.textContent = 'Please enter a valid Time Duration greater than 0.';
            errBox.style.display = 'block';
            return;
        }

        let timeInYears = T;
        let timeLabel = T + ' year(s)';
        if (unit === 'months') {
            timeInYears = T / 12;
            timeLabel = T + ' month(s) (' + timeInYears.toFixed(3) + ' yrs)';
        } else if (unit === 'days') {
            timeInYears = T / 365;
            timeLabel = T + ' day(s) (' + timeInYears.toFixed(3) + ' yrs)';
        }

        const SI = P * (R / 100) * timeInYears;
        const total = P + SI;

        resInterest.textContent = formatCurrency(SI);
        resTotal.textContent = formatCurrency(total);
        breakP.textContent = formatCurrency(P);
        breakR.textContent = R + '% per year';
        breakT.textContent = timeLabel;
    }

    calcBtn.addEventListener('click', calculate);
    pInput.addEventListener('input', calculate);
    rInput.addEventListener('input', calculate);
    tInput.addEventListener('input', calculate);
    uInput.addEventListener('change', calculate);

    resetBtn.addEventListener('click', () => {
        pInput.value = '10000';
        rInput.value = '5';
        tInput.value = '3';
        uInput.value = 'years';
        calculate();
    });

    calculate();
}
`
    }),

    // 2. COMPOUND INTEREST CALCULATOR
    'compound-interest-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="ci-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="ci-principal">Initial Principal ($)</label>
                    <input type="number" id="ci-principal" class="input-control" value="10000" min="0" step="any" placeholder="e.g. 10000">
                </div>
                <div class="form-group">
                    <label for="ci-rate">Annual Interest Rate (%)</label>
                    <input type="number" id="ci-rate" class="input-control" value="7" min="0" step="0.01" placeholder="e.g. 7">
                </div>
                <div class="form-group">
                    <label for="ci-time">Investment Time (Years)</label>
                    <input type="number" id="ci-time" class="input-control" value="5" min="0.1" max="100" step="any" placeholder="e.g. 5">
                </div>
                <div class="form-group">
                    <label for="ci-freq">Compounding Frequency</label>
                    <select id="ci-freq" class="input-control">
                        <option value="1">Annually (1/yr)</option>
                        <option value="2">Semi-annually (2/yr)</option>
                        <option value="4">Quarterly (4/yr)</option>
                        <option value="12" selected>Monthly (12/yr)</option>
                        <option value="365">Daily (365/yr)</option>
                    </select>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="ci-reset">Reset</button>
                <button class="btn btn-primary" id="ci-calc">Calculate Compound Interest</button>
            </div>

            <div id="ci-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Final Future Value</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="ci-res-final">$0.00</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Compound Interest</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="ci-res-interest">$0.00</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Effective Annual Rate</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="ci-res-ear">0.00%</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:1.5rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Formula Reference</h4>
                    <p style="font-family:var(--font-mono); font-size:0.9rem; margin:0;">A = P × (1 + r/n)<sup>n·t</sup></p>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.25rem;">Where P = Principal, r = annual rate (decimal), n = compounding times per year, t = years.</p>
                </div>

                <h4 style="margin-bottom:0.5rem; font-size:1rem;">Year-by-Year Growth Schedule</h4>
                <div style="max-height:280px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                    <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                        <thead>
                            <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                                <th style="padding:0.6rem;">Year</th>
                                <th style="padding:0.6rem;">Starting Balance</th>
                                <th style="padding:0.6rem;">Interest Earned</th>
                                <th style="padding:0.6rem;">Ending Balance</th>
                            </tr>
                        </thead>
                        <tbody id="ci-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const pInput = document.getElementById('ci-principal');
    const rInput = document.getElementById('ci-rate');
    const tInput = document.getElementById('ci-time');
    const fInput = document.getElementById('ci-freq');
    const calcBtn = document.getElementById('ci-calc');
    const resetBtn = document.getElementById('ci-reset');
    const errBox = document.getElementById('ci-error');
    const resFinal = document.getElementById('ci-res-final');
    const resInterest = document.getElementById('ci-res-interest');
    const resEar = document.getElementById('ci-res-ear');
    const tableBody = document.getElementById('ci-table-body');

    if (!pInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const P = parseFloat(pInput.value);
        const R = parseFloat(rInput.value);
        const T = parseFloat(tInput.value);
        const N = parseInt(fInput.value, 10);

        if (isNaN(P) || P <= 0) {
            errBox.textContent = 'Please enter a valid Principal Amount greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(R) || R < 0) {
            errBox.textContent = 'Please enter a valid Interest Rate (0% or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(T) || T <= 0) {
            errBox.textContent = 'Please enter a valid Time Duration greater than 0.';
            errBox.style.display = 'block';
            return;
        }

        const r = R / 100;
        const finalAmount = P * Math.pow(1 + (r / N), N * T);
        const totalInterest = finalAmount - P;
        const EAR = (Math.pow(1 + (r / N), N) - 1) * 100;

        resFinal.textContent = formatCurrency(finalAmount);
        resInterest.textContent = formatCurrency(totalInterest);
        resEar.textContent = EAR.toFixed(2) + '%';

        // Year-by-year table
        tableBody.innerHTML = '';
        const fullYears = Math.min(Math.ceil(T), 100);
        let currBalance = P;

        for (let yr = 1; yr <= fullYears; yr++) {
            const yrTime = (yr === fullYears && T % 1 !== 0) ? T : yr;
            const endBal = P * Math.pow(1 + (r / N), N * yrTime);
            const yrInterest = endBal - currBalance;

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = '<td style="padding:0.5rem 0.6rem; font-weight:600;">Year ' + yr + '</td>' +
                '<td style="padding:0.5rem 0.6rem;">' + formatCurrency(currBalance) + '</td>' +
                '<td style="padding:0.5rem 0.6rem; color:#1a7f37;">+' + formatCurrency(yrInterest) + '</td>' +
                '<td style="padding:0.5rem 0.6rem; font-weight:700;">' + formatCurrency(endBal) + '</td>';
            tableBody.appendChild(tr);

            currBalance = endBal;
        }
    }

    calcBtn.addEventListener('click', calculate);
    pInput.addEventListener('input', calculate);
    rInput.addEventListener('input', calculate);
    tInput.addEventListener('input', calculate);
    fInput.addEventListener('change', calculate);

    resetBtn.addEventListener('click', () => {
        pInput.value = '10000';
        rInput.value = '7';
        tInput.value = '5';
        fInput.value = '12';
        calculate();
    });

    calculate();
}
`
    }),

    // 3. DISCOUNT CALCULATOR
    'discount-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="disc-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="disc-price">Original Price ($)</label>
                    <input type="number" id="disc-price" class="input-control" value="120" min="0" step="any" placeholder="e.g. 120">
                </div>
                <div class="form-group">
                    <label for="disc-percent">Discount (%)</label>
                    <input type="number" id="disc-percent" class="input-control" value="25" min="0" max="100" step="any" placeholder="e.g. 25">
                </div>
                <div class="form-group">
                    <label for="disc-tax">Sales Tax % (Optional)</label>
                    <input type="number" id="disc-tax" class="input-control" value="0" min="0" max="100" step="any" placeholder="e.g. 8">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="disc-reset">Reset</button>
                <button class="btn btn-primary" id="disc-calc">Calculate Discount</button>
            </div>

            <div id="disc-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Final Price</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="disc-res-final">$90.00</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">You Save (Discount)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="disc-res-savings">$30.00</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Summary Breakdown</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Original Price: <strong id="disc-break-orig">$120.00</strong></div>
                        <div>Discount Applied: <strong id="disc-break-pct">25%</strong></div>
                        <div>Discount Amount: <strong id="disc-break-amt">-$30.00</strong></div>
                        <div>Sales Tax Added: <strong id="disc-break-tax">$0.00</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const priceInput = document.getElementById('disc-price');
    const pctInput = document.getElementById('disc-percent');
    const taxInput = document.getElementById('disc-tax');
    const calcBtn = document.getElementById('disc-calc');
    const resetBtn = document.getElementById('disc-reset');
    const errBox = document.getElementById('disc-error');
    const resFinal = document.getElementById('disc-res-final');
    const resSavings = document.getElementById('disc-res-savings');
    const breakOrig = document.getElementById('disc-break-orig');
    const breakPct = document.getElementById('disc-break-pct');
    const breakAmt = document.getElementById('disc-break-amt');
    const breakTax = document.getElementById('disc-break-tax');

    if (!priceInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const price = parseFloat(priceInput.value);
        const discountPct = parseFloat(pctInput.value);
        const taxPct = parseFloat(taxInput.value) || 0;

        if (isNaN(price) || price < 0) {
            errBox.textContent = 'Please enter a valid original price (0 or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(discountPct) || discountPct < 0 || discountPct > 100) {
            errBox.textContent = 'Please enter a discount percentage between 0% and 100%.';
            errBox.style.display = 'block';
            return;
        }
        if (taxPct < 0 || taxPct > 100) {
            errBox.textContent = 'Sales tax percentage must be between 0% and 100%.';
            errBox.style.display = 'block';
            return;
        }

        const discountAmt = price * (discountPct / 100);
        const discountedPrice = price - discountAmt;
        const taxAmt = discountedPrice * (taxPct / 100);
        const finalPrice = discountedPrice + taxAmt;

        resFinal.textContent = formatCurrency(finalPrice);
        resSavings.textContent = formatCurrency(discountAmt);
        breakOrig.textContent = formatCurrency(price);
        breakPct.textContent = discountPct + '%';
        breakAmt.textContent = '-' + formatCurrency(discountAmt);
        breakTax.textContent = taxAmt > 0 ? '+' + formatCurrency(taxAmt) + ' (' + taxPct + '%)' : '$0.00';
    }

    calcBtn.addEventListener('click', calculate);
    priceInput.addEventListener('input', calculate);
    pctInput.addEventListener('input', calculate);
    taxInput.addEventListener('input', calculate);

    resetBtn.addEventListener('click', () => {
        priceInput.value = '120';
        pctInput.value = '25';
        taxInput.value = '0';
        calculate();
    });

    calculate();
}
`
    }),

    // 4. TIP CALCULATOR
    'tip-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="tip-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="tip-bill">Bill Amount ($)</label>
                    <input type="number" id="tip-bill" class="input-control" value="85.00" min="0" step="any" placeholder="e.g. 85.00">
                </div>
                <div class="form-group">
                    <label>Select Tip Percentage</label>
                    <div style="display:flex; flex-wrap:wrap; gap:0.4rem;" id="tip-preset-btns">
                        <button type="button" class="btn btn-secondary tip-btn" data-val="10" style="flex:1; min-width:50px;">10%</button>
                        <button type="button" class="btn btn-secondary tip-btn" data-val="15" style="flex:1; min-width:50px;">15%</button>
                        <button type="button" class="btn btn-primary tip-btn" data-val="18" style="flex:1; min-width:50px;">18%</button>
                        <button type="button" class="btn btn-secondary tip-btn" data-val="20" style="flex:1; min-width:50px;">20%</button>
                        <button type="button" class="btn btn-secondary tip-btn" data-val="25" style="flex:1; min-width:50px;">25%</button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="tip-custom-pct">Custom Tip %</label>
                    <input type="number" id="tip-custom-pct" class="input-control" value="18" min="0" max="1000" step="any">
                </div>
                <div class="form-group">
                    <label for="tip-people">Number of People (Split)</label>
                    <input type="number" id="tip-people" class="input-control" value="2" min="1" max="100" step="1">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="tip-reset">Reset</button>
                <button class="btn btn-primary" id="tip-calc">Calculate Tip</button>
            </div>

            <div id="tip-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Bill (with Tip)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="tip-total-bill">$100.30</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Tip Amount</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="tip-total-tip">$15.30</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Per Person</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="tip-per-person-total">$50.15</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Tip Per Person</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--text-secondary); margin-top:0.25rem;" id="tip-per-person-tip">$7.65</h2>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const billInput = document.getElementById('tip-bill');
    const customPctInput = document.getElementById('tip-custom-pct');
    const peopleInput = document.getElementById('tip-people');
    const presetBtns = document.querySelectorAll('.tip-btn');
    const calcBtn = document.getElementById('tip-calc');
    const resetBtn = document.getElementById('tip-reset');
    const errBox = document.getElementById('tip-error');
    const totalBillEl = document.getElementById('tip-total-bill');
    const totalTipEl = document.getElementById('tip-total-tip');
    const perPersonTotalEl = document.getElementById('tip-per-person-total');
    const perPersonTipEl = document.getElementById('tip-per-person-tip');

    if (!billInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const bill = parseFloat(billInput.value);
        const tipPct = parseFloat(customPctInput.value);
        const people = parseInt(peopleInput.value, 10);

        if (isNaN(bill) || bill < 0) {
            errBox.textContent = 'Please enter a valid bill amount.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(tipPct) || tipPct < 0) {
            errBox.textContent = 'Please enter a valid tip percentage (0 or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(people) || people < 1) {
            errBox.textContent = 'Number of people must be at least 1.';
            errBox.style.display = 'block';
            return;
        }

        const tipAmount = bill * (tipPct / 100);
        const totalBill = bill + tipAmount;
        const perPersonTotal = totalBill / people;
        const perPersonTip = tipAmount / people;

        totalBillEl.textContent = formatCurrency(totalBill);
        totalTipEl.textContent = formatCurrency(tipAmount);
        perPersonTotalEl.textContent = formatCurrency(perPersonTotal);
        perPersonTipEl.textContent = formatCurrency(perPersonTip);
    }

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            customPctInput.value = btn.getAttribute('data-val');
            calculate();
        });
    });

    customPctInput.addEventListener('input', () => {
        presetBtns.forEach(b => {
            if (b.getAttribute('data-val') === customPctInput.value) {
                b.classList.remove('btn-secondary');
                b.classList.add('btn-primary');
            } else {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            }
        });
        calculate();
    });

    billInput.addEventListener('input', calculate);
    peopleInput.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);

    resetBtn.addEventListener('click', () => {
        billInput.value = '85.00';
        customPctInput.value = '18';
        peopleInput.value = '2';
        presetBtns.forEach(b => {
            if (b.getAttribute('data-val') === '18') {
                b.classList.remove('btn-secondary');
                b.classList.add('btn-primary');
            } else {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            }
        });
        calculate();
    });

    calculate();
}
`
    }),

    // 5. BMI CALCULATOR
    'bmi-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="bmi-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
                <button type="button" class="btn btn-primary" id="bmi-tab-metric">Metric Units (kg, cm)</button>
                <button type="button" class="btn btn-secondary" id="bmi-tab-imperial">Imperial Units (lb, ft/in)</button>
            </div>

            <!-- Metric Inputs -->
            <div class="options-grid" id="bmi-metric-fields">
                <div class="form-group">
                    <label for="bmi-weight-metric">Weight (kg)</label>
                    <input type="number" id="bmi-weight-metric" class="input-control" value="70" min="1" max="500" step="0.1">
                </div>
                <div class="form-group">
                    <label for="bmi-height-metric">Height (cm)</label>
                    <input type="number" id="bmi-height-metric" class="input-control" value="175" min="30" max="300" step="0.5">
                </div>
            </div>

            <!-- Imperial Inputs -->
            <div class="options-grid" id="bmi-imperial-fields" style="display:none;">
                <div class="form-group">
                    <label for="bmi-weight-imp">Weight (lbs)</label>
                    <input type="number" id="bmi-weight-imp" class="input-control" value="154" min="2" max="1000" step="0.5">
                </div>
                <div class="form-group">
                    <label>Height (Feet & Inches)</label>
                    <div style="display:flex; gap:0.5rem;">
                        <input type="number" id="bmi-height-ft" class="input-control" value="5" min="1" max="9" placeholder="Feet">
                        <input type="number" id="bmi-height-in" class="input-control" value="9" min="0" max="11" placeholder="Inches">
                    </div>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="bmi-reset">Reset</button>
                <button class="btn btn-primary" id="bmi-calc">Calculate BMI</button>
            </div>

            <div id="bmi-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Your BMI Score</span>
                        <h2 style="font-size:2.5rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="bmi-score">22.9</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Weight Classification</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="bmi-category">Normal Weight</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Healthy Weight Range</span>
                        <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-primary); margin-top:0.5rem;" id="bmi-healthy-range">56.7 kg – 76.3 kg</h3>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">WHO BMI Reference Scale</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.5rem; font-size:0.85rem;">
                        <div style="padding:0.5rem; border-radius:var(--radius-xs); background:rgba(0,123,255,0.08); border:1px solid rgba(0,123,255,0.2);"><strong>&lt; 18.5:</strong> Underweight</div>
                        <div style="padding:0.5rem; border-radius:var(--radius-xs); background:rgba(40,167,69,0.08); border:1px solid rgba(40,167,69,0.2);"><strong>18.5 – 24.9:</strong> Normal</div>
                        <div style="padding:0.5rem; border-radius:var(--radius-xs); background:rgba(255,193,7,0.08); border:1px solid rgba(255,193,7,0.2);"><strong>25.0 – 29.9:</strong> Overweight</div>
                        <div style="padding:0.5rem; border-radius:var(--radius-xs); background:rgba(220,53,69,0.08); border:1px solid rgba(220,53,69,0.2);"><strong>≥ 30.0:</strong> Obesity</div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 6. BMR CALCULATOR
    'bmr-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="bmr-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
                <button type="button" class="btn btn-primary" id="bmr-tab-metric">Metric (kg, cm)</button>
                <button type="button" class="btn btn-secondary" id="bmr-tab-imperial">Imperial (lb, ft/in)</button>
            </div>

            <div class="options-grid">
                <div class="form-group">
                    <label for="bmr-gender">Biological Sex</label>
                    <select id="bmr-gender" class="input-control">
                        <option value="male" selected>Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="bmr-age">Age (Years)</label>
                    <input type="number" id="bmr-age" class="input-control" value="28" min="15" max="120">
                </div>
                
                <!-- Metric input block -->
                <div class="form-group bmr-metric-unit">
                    <label for="bmr-weight-kg">Weight (kg)</label>
                    <input type="number" id="bmr-weight-kg" class="input-control" value="75" min="20" max="400" step="0.1">
                </div>
                <div class="form-group bmr-metric-unit">
                    <label for="bmr-height-cm">Height (cm)</label>
                    <input type="number" id="bmr-height-cm" class="input-control" value="178" min="50" max="260" step="0.5">
                </div>

                <!-- Imperial input block -->
                <div class="form-group bmr-imperial-unit" style="display:none;">
                    <label for="bmr-weight-lb">Weight (lb)</label>
                    <input type="number" id="bmr-weight-lb" class="input-control" value="165" min="40" max="900" step="0.5">
                </div>
                <div class="form-group bmr-imperial-unit" style="display:none;">
                    <label>Height (Ft & In)</label>
                    <div style="display:flex; gap:0.5rem;">
                        <input type="number" id="bmr-height-ft" class="input-control" value="5" min="1" max="8">
                        <input type="number" id="bmr-height-in" class="input-control" value="10" min="0" max="11">
                    </div>
                </div>

                <div class="form-group" style="grid-column:1/-1;">
                    <label for="bmr-activity">Daily Activity Level</label>
                    <select id="bmr-activity" class="input-control">
                        <option value="1.2">Sedentary (desk job, little or no exercise)</option>
                        <option value="1.375" selected>Lightly Active (light exercise 1-3 days/week)</option>
                        <option value="1.55">Moderately Active (moderate workout 3-5 days/week)</option>
                        <option value="1.725">Very Active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Extra Active (very intense daily exercise or physical job)</option>
                    </select>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="bmr-reset">Reset</button>
                <button class="btn btn-primary" id="bmr-calc">Calculate BMR & TDEE</button>
            </div>

            <div id="bmr-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Basal Metabolic Rate (BMR)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="bmr-res-val">1,735</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Calories/day at complete rest</span>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Daily Calorie Need (TDEE)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="bmr-res-tdee">2,386</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">To maintain current weight</span>
                    </div>
                </div>

                <h4 style="margin-bottom:0.75rem; font-size:1rem;">Calorie Intake for Weight Goals</h4>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem;">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Maintain Weight</span>
                        <h3 id="bmr-goal-maintain" style="margin-top:0.2rem; font-size:1.2rem;">2,386 kcal</h3>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem;">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Mild Weight Loss (-0.25 kg/wk)</span>
                        <h3 id="bmr-goal-mild-loss" style="margin-top:0.2rem; font-size:1.2rem; color:#1a7f37;">2,136 kcal</h3>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem;">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Weight Loss (-0.5 kg/wk)</span>
                        <h3 id="bmr-goal-loss" style="margin-top:0.2rem; font-size:1.2rem; color:#d97706;">1,886 kcal</h3>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem;">
                        <span style="font-size:0.8rem; color:var(--text-secondary);">Weight Gain (+0.5 kg/wk)</span>
                        <h3 id="bmr-goal-gain" style="margin-top:0.2rem; font-size:1.2rem; color:#007bff;">2,886 kcal</h3>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 7. GPA CALCULATOR
    'gpa-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="gpa-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h4 style="font-size:1rem; margin:0;">Course Schedule & Grades</h4>
                <button type="button" class="btn btn-secondary" id="gpa-add-row" style="font-size:0.85rem; padding:0.4rem 0.8rem;">+ Add Course</button>
            </div>

            <div style="overflow-x:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-primary);">
                <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
                    <thead>
                        <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                            <th style="padding:0.6rem;">Course Name</th>
                            <th style="padding:0.6rem; width:120px;">Credits / Hours</th>
                            <th style="padding:0.6rem; width:160px;">Grade</th>
                            <th style="padding:0.6rem; width:60px; text-align:center;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="gpa-course-rows"></tbody>
                </table>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="gpa-reset">Reset</button>
                <button class="btn btn-primary" id="gpa-calc">Calculate GPA</button>
            </div>

            <div id="gpa-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Cumulative GPA (4.0 Scale)</span>
                        <h2 style="font-size:2.5rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="gpa-res-val">3.65</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Credits Attempted</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="gpa-res-credits">15</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Grade Points</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="gpa-res-points">54.75</h2>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const rowsBody = document.getElementById('gpa-course-rows');
    const addRowBtn = document.getElementById('gpa-add-row');
    const calcBtn = document.getElementById('gpa-calc');
    const resetBtn = document.getElementById('gpa-reset');
    const errBox = document.getElementById('gpa-error');
    const resGpa = document.getElementById('gpa-res-val');
    const resCredits = document.getElementById('gpa-res-credits');
    const resPoints = document.getElementById('gpa-res-points');

    if (!rowsBody || !calcBtn) return;

    const grades = [
        { label: 'A+ (4.0)', val: 4.0 },
        { label: 'A (4.0)', val: 4.0 },
        { label: 'A- (3.7)', val: 3.7 },
        { label: 'B+ (3.3)', val: 3.3 },
        { label: 'B (3.0)', val: 3.0 },
        { label: 'B- (2.7)', val: 2.7 },
        { label: 'C+ (2.3)', val: 2.3 },
        { label: 'C (2.0)', val: 2.0 },
        { label: 'C- (1.7)', val: 1.7 },
        { label: 'D (1.0)', val: 1.0 },
        { label: 'F (0.0)', val: 0.0 }
    ];

    function createRow(name, credits, gradeVal) {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-color)';
        
        let gradeOpts = '';
        grades.forEach(g => {
            const sel = (g.val === gradeVal) ? 'selected' : '';
            gradeOpts += '<option value="' + g.val + '" ' + sel + '>' + g.label + '</option>';
        });

        tr.innerHTML = '<td style="padding:0.4rem 0.6rem;"><input type="text" class="input-control gpa-name" value="' + name + '" placeholder="e.g. English 101" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem;"><input type="number" class="input-control gpa-credits" value="' + credits + '" min="0.5" max="20" step="0.5" style="padding:0.4rem 0.6rem;"></td>' +
            '<td style="padding:0.4rem 0.6rem;"><select class="input-control gpa-grade" style="padding:0.4rem 0.6rem;">' + gradeOpts + '</select></td>' +
            '<td style="padding:0.4rem 0.6rem; text-align:center;"><button type="button" class="btn btn-secondary gpa-del" style="padding:0.25rem 0.5rem; font-size:0.8rem;">✕</button></td>';

        tr.querySelector('.gpa-del').addEventListener('click', () => {
            if (rowsBody.children.length > 1) {
                tr.remove();
                calculate();
            } else {
                alert('At least one course is required.');
            }
        });

        tr.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        });

        rowsBody.appendChild(tr);
    }

    function initDefaults() {
        rowsBody.innerHTML = '';
        createRow('Computer Science I', 4, 4.0);
        createRow('Calculus I', 4, 3.7);
        createRow('Physics I', 4, 3.3);
        createRow('English Composition', 3, 4.0);
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const creditInputs = rowsBody.querySelectorAll('.gpa-credits');
        const gradeSelects = rowsBody.querySelectorAll('.gpa-grade');

        let totalCredits = 0;
        let totalPoints = 0;

        for (let i = 0; i < creditInputs.length; i++) {
            const cr = parseFloat(creditInputs[i].value);
            const gr = parseFloat(gradeSelects[i].value);

            if (isNaN(cr) || cr <= 0) {
                errBox.textContent = 'Please enter a valid credit number (> 0) for each course.';
                errBox.style.display = 'block';
                return;
            }
            totalCredits += cr;
            totalPoints += (cr * gr);
        }

        if (totalCredits === 0) {
            resGpa.textContent = '0.00';
            resCredits.textContent = '0';
            resPoints.textContent = '0.00';
            return;
        }

        const gpa = totalPoints / totalCredits;
        resGpa.textContent = gpa.toFixed(2);
        resCredits.textContent = totalCredits.toString();
        resPoints.textContent = totalPoints.toFixed(2);
    }

    addRowBtn.addEventListener('click', () => {
        createRow('Elective Course', 3, 3.0);
        calculate();
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        initDefaults();
        calculate();
    });

    initDefaults();
    calculate();
}
`
    }),

    // 8. DATE ADD / SUBTRACT
    'date-add-subtract': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="date-calc-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="date-start">Start Date</label>
                    <input type="date" id="date-start" class="input-control">
                </div>
                <div class="form-group">
                    <label for="date-op">Operation</label>
                    <select id="date-op" class="input-control">
                        <option value="add" selected>Add (+) to Date</option>
                        <option value="subtract">Subtract (−) from Date</option>
                    </select>
                </div>
            </div>

            <div class="options-grid" style="grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));">
                <div class="form-group">
                    <label for="date-years">Years</label>
                    <input type="number" id="date-years" class="input-control" value="0" min="0" step="1">
                </div>
                <div class="form-group">
                    <label for="date-months">Months</label>
                    <input type="number" id="date-months" class="input-control" value="2" min="0" step="1">
                </div>
                <div class="form-group">
                    <label for="date-weeks">Weeks</label>
                    <input type="number" id="date-weeks" class="input-control" value="0" min="0" step="1">
                </div>
                <div class="form-group">
                    <label for="date-days">Days</label>
                    <input type="number" id="date-days" class="input-control" value="10" min="0" step="1">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="date-reset">Reset</button>
                <button class="btn btn-primary" id="date-calc">Calculate Target Date</button>
            </div>

            <div id="date-results" style="margin-top:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.5rem; text-align:center;">
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Calculated Result Date</span>
                    <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin:0.5rem 0;" id="date-res-main">--</h2>
                    <p style="font-family:var(--font-mono); font-size:1rem; color:var(--text-secondary); margin:0;" id="date-res-iso">YYYY-MM-DD</p>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 9. DAYS BETWEEN DATES
    'days-between-dates': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="dbd-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="dbd-start">Start Date</label>
                    <input type="date" id="dbd-start" class="input-control">
                </div>
                <div class="form-group">
                    <label for="dbd-end">End Date</label>
                    <input type="date" id="dbd-end" class="input-control">
                </div>
            </div>

            <div style="margin-top:0.75rem;">
                <label style="cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; font-size:0.95rem;">
                    <input type="checkbox" id="dbd-include-end"> Include End Date in Calculation (+1 day)
                </label>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="dbd-reset">Reset</button>
                <button class="btn btn-primary" id="dbd-calc">Calculate Duration</button>
            </div>

            <div id="dbd-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Days</span>
                        <h2 style="font-size:2.5rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="dbd-res-days">0</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Weeks & Days</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="dbd-res-weeks">0 wks, 0 days</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Alternative Time Units</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Calendar Duration: <strong id="dbd-cal-break">0 days</strong></div>
                        <div>Total Hours: <strong id="dbd-hours">0 hrs</strong></div>
                        <div>Total Minutes: <strong id="dbd-minutes">0 mins</strong></div>
                        <div>Business Days: <strong id="dbd-biz-days">0 days</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 10. LOAN TENURE CALCULATOR
    'loan-tenure-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="lt-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="lt-amount">Loan Amount ($)</label>
                    <input type="number" id="lt-amount" class="input-control" value="50000" min="1" step="any" placeholder="e.g. 50000">
                </div>
                <div class="form-group">
                    <label for="lt-rate">Annual Interest Rate (%)</label>
                    <input type="number" id="lt-rate" class="input-control" value="8.5" min="0" step="0.01" placeholder="e.g. 8.5">
                </div>
                <div class="form-group">
                    <label for="lt-emi">Desired Monthly EMI Payment ($)</label>
                    <input type="number" id="lt-emi" class="input-control" value="1000" min="1" step="any" placeholder="e.g. 1000">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="lt-reset">Reset</button>
                <button class="btn btn-primary" id="lt-calc">Calculate Loan Tenure</button>
            </div>

            <div id="lt-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Repayment Period (Tenure)</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="lt-res-tenure">--</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);" id="lt-res-months">-- months</span>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Interest Payable</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="lt-res-interest">$0.00</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Loan Payment</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="lt-res-total">$0.00</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Amortization Details</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Minimum EMI Required: <strong id="lt-min-emi">$0.00</strong></div>
                        <div>Principal Amount: <strong id="lt-break-p">$0.00</strong></div>
                        <div>Monthly Interest Rate: <strong id="lt-break-r">0.00%</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const amountInput = document.getElementById('lt-amount');
    const rateInput = document.getElementById('lt-rate');
    const emiInput = document.getElementById('lt-emi');
    const calcBtn = document.getElementById('lt-calc');
    const resetBtn = document.getElementById('lt-reset');
    const errBox = document.getElementById('lt-error');
    const resTenure = document.getElementById('lt-res-tenure');
    const resMonths = document.getElementById('lt-res-months');
    const resInterest = document.getElementById('lt-res-interest');
    const resTotal = document.getElementById('lt-res-total');
    const minEmiEl = document.getElementById('lt-min-emi');
    const breakP = document.getElementById('lt-break-p');
    const breakR = document.getElementById('lt-break-r');

    if (!amountInput || !calcBtn) return;

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const P = parseFloat(amountInput.value);
        const rAnnual = parseFloat(rateInput.value);
        const EMI = parseFloat(emiInput.value);

        if (isNaN(P) || P <= 0) {
            errBox.textContent = 'Please enter a valid loan amount greater than 0.';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(rAnnual) || rAnnual < 0) {
            errBox.textContent = 'Please enter an annual interest rate (0% or greater).';
            errBox.style.display = 'block';
            return;
        }
        if (isNaN(EMI) || EMI <= 0) {
            errBox.textContent = 'Please enter a monthly EMI payment greater than 0.';
            errBox.style.display = 'block';
            return;
        }

        const r = (rAnnual / 100) / 12;
        const initialMonthlyInterest = P * r;
        minEmiEl.textContent = '>' + formatCurrency(initialMonthlyInterest);
        breakP.textContent = formatCurrency(P);
        breakR.textContent = (r * 100).toFixed(4) + '% / mo';

        if (r > 0 && EMI <= initialMonthlyInterest) {
            errBox.textContent = 'EMI is too low to repay this loan. The monthly interest alone is ' + formatCurrency(initialMonthlyInterest) + '. Please enter an EMI greater than ' + formatCurrency(initialMonthlyInterest) + '.';
            errBox.style.display = 'block';
            resTenure.textContent = 'Indefinite';
            resMonths.textContent = 'EMI ≤ monthly interest';
            resInterest.textContent = '--';
            resTotal.textContent = '--';
            return;
        }

        let totalMonths = 0;
        if (r === 0) {
            totalMonths = Math.ceil(P / EMI);
        } else {
            // n = -ln(1 - P*r/EMI) / ln(1 + r)
            const n = -Math.log(1 - (P * r) / EMI) / Math.log(1 + r);
            totalMonths = Math.ceil(n);
        }

        const years = Math.floor(totalMonths / 12);
        const remMonths = totalMonths % 12;
        let tenureLabel = '';
        if (years > 0) tenureLabel += years + ' yr(s) ';
        if (remMonths > 0) tenureLabel += remMonths + ' mo(s)';
        if (!tenureLabel) tenureLabel = totalMonths + ' Month(s)';

        const totalPayment = EMI * totalMonths;
        const totalInterest = totalPayment - P;

        resTenure.textContent = tenureLabel;
        resMonths.textContent = totalMonths + ' total month(s)';
        resInterest.textContent = formatCurrency(totalInterest);
        resTotal.textContent = formatCurrency(totalPayment);
    }

    [amountInput, rateInput, emiInput].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        amountInput.value = '50000';
        rateInput.value = '8.5';
        emiInput.value = '1000';
        calculate();
    });

    calculate();
}
`
    }),

    // 11. SALARY TO HOURLY CALCULATOR
    'salary-hourly-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="sal-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="sal-amount">Annual Salary</label>
                    <input type="number" id="sal-amount" class="input-control" value="65000" min="0" step="any" placeholder="e.g. 65000">
                </div>
                <div class="form-group">
                    <label for="sal-currency">Currency Symbol</label>
                    <select id="sal-currency" class="input-control">
                        <option value="$" selected>$ (USD, CAD, AUD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="£">£ (GBP)</option>
                        <option value="₹">₹ (INR)</option>
                        <option value="¥">¥ (JPY)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sal-hours-day">Hours / Day</label>
                    <input type="number" id="sal-hours-day" class="input-control" value="8" min="1" max="24" step="0.5">
                </div>
                <div class="form-group">
                    <label for="sal-days-week">Days / Week</label>
                    <input type="number" id="sal-days-week" class="input-control" value="5" min="1" max="7" step="1">
                </div>
                <div class="form-group">
                    <label for="sal-weeks-year">Working Weeks / Year</label>
                    <input type="number" id="sal-weeks-year" class="input-control" value="52" min="1" max="52" step="1">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="sal-reset">Reset</button>
                <button class="btn btn-primary" id="sal-calc">Calculate Hourly Equivalent</button>
            </div>

            <div id="sal-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Hourly Wage Equivalent</span>
                        <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="sal-res-hourly">$31.25</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);" id="sal-res-annual-hrs">2,080 hours / year</span>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Monthly Salary Equivalent</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="sal-res-monthly">$5,416.67</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Comprehensive Pay Schedule</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Hourly: <strong id="sal-sch-hour">$31.25</strong></div>
                        <div>Daily: <strong id="sal-sch-day">$250.00</strong></div>
                        <div>Weekly: <strong id="sal-sch-week">$1,250.00</strong></div>
                        <div>Bi-Weekly: <strong id="sal-sch-biweek">$2,500.00</strong></div>
                        <div>Monthly: <strong id="sal-sch-month">$5,416.67</strong></div>
                        <div>Annual: <strong id="sal-sch-year">$65,000.00</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 12. HOURS CARD CALCULATOR
    'hours-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="hc-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid" style="grid-template-columns:1fr 1fr; margin-bottom:1rem;">
                <div class="form-group">
                    <label for="hc-hourly-rate">Hourly Pay Rate ($ / hr, Optional)</label>
                    <input type="number" id="hc-hourly-rate" class="input-control" value="25" min="0" step="any" placeholder="e.g. 25">
                </div>
                <div class="form-group">
                    <label for="hc-ot-threshold">Weekly Overtime Threshold (Hours)</label>
                    <input type="number" id="hc-ot-threshold" class="input-control" value="40" min="0" max="168" step="1">
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <h4 style="font-size:1rem; margin:0;">Shift Time Card Entries</h4>
                <button type="button" class="btn btn-secondary" id="hc-add-shift" style="font-size:0.85rem; padding:0.4rem 0.8rem;">+ Add Shift</button>
            </div>

            <div style="overflow-x:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-primary);">
                <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
                    <thead>
                        <tr style="background:var(--bg-secondary); border-bottom:1px solid var(--border-color);">
                            <th style="padding:0.6rem;">Day / Date</th>
                            <th style="padding:0.6rem; width:130px;">Clock In</th>
                            <th style="padding:0.6rem; width:130px;">Clock Out</th>
                            <th style="padding:0.6rem; width:100px;">Break (min)</th>
                            <th style="padding:0.6rem; width:110px;">Total</th>
                            <th style="padding:0.6rem; width:50px; text-align:center;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="hc-shift-rows"></tbody>
                </table>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="hc-reset">Reset</button>
                <button class="btn btn-primary" id="hc-calc">Calculate Total Hours</button>
            </div>

            <div id="hc-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Total Hours Worked</span>
                        <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="hc-tot-hours">0.00 hrs</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Regular vs Overtime Hours</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="hc-reg-ot-hours">0 / 0 hrs</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Estimated Gross Pay</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="hc-est-pay">$0.00</h2>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
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
`
    }),

    // 13. FRACTION CALCULATOR
    'fraction-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="frac-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:1.5rem; margin:1rem 0;">
                <!-- Fraction 1 -->
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <div class="form-group" style="width:70px;">
                        <label style="font-size:0.75rem; text-align:center;">Whole</label>
                        <input type="number" id="f1-whole" class="input-control" value="0" step="1" style="text-align:center;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.3rem; width:80px;">
                        <input type="number" id="f1-num" class="input-control" value="1" step="1" style="text-align:center;" placeholder="Num">
                        <div style="height:2px; background:var(--border-color); width:100%;"></div>
                        <input type="number" id="f1-den" class="input-control" value="2" step="1" style="text-align:center;" placeholder="Den">
                    </div>
                </div>

                <!-- Operator -->
                <div class="form-group" style="width:90px;">
                    <label style="font-size:0.75rem; text-align:center;">Operator</label>
                    <select id="frac-op" class="input-control" style="text-align:center; font-size:1.25rem; font-weight:700;">
                        <option value="+" selected>+</option>
                        <option value="-">−</option>
                        <option value="*">×</option>
                        <option value="/">÷</option>
                    </select>
                </div>

                <!-- Fraction 2 -->
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <div class="form-group" style="width:70px;">
                        <label style="font-size:0.75rem; text-align:center;">Whole</label>
                        <input type="number" id="f2-whole" class="input-control" value="0" step="1" style="text-align:center;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.3rem; width:80px;">
                        <input type="number" id="f2-num" class="input-control" value="1" step="1" style="text-align:center;" placeholder="Num">
                        <div style="height:2px; background:var(--border-color); width:100%;"></div>
                        <input type="number" id="f2-den" class="input-control" value="3" step="1" style="text-align:center;" placeholder="Den">
                    </div>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="frac-reset">Reset</button>
                <button class="btn btn-primary" id="frac-calc">Calculate Fraction</button>
            </div>

            <div id="frac-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; text-align:center;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Simplified Fraction</span>
                        <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="frac-res-simple">5 / 6</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; text-align:center;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Mixed Number</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="frac-res-mixed">N/A</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; text-align:center;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Decimal Value</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="frac-res-dec">0.8333</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Step-by-Step Calculation</h4>
                    <p id="frac-res-steps" style="font-family:var(--font-mono); font-size:0.95rem; margin:0; line-height:1.6;">1/2 + 1/3 = (1×3 + 1×2) / (2×3) = 5/6</p>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const f1w = document.getElementById('f1-whole');
    const f1n = document.getElementById('f1-num');
    const f1d = document.getElementById('f1-den');
    const opSel = document.getElementById('frac-op');
    const f2w = document.getElementById('f2-whole');
    const f2n = document.getElementById('f2-num');
    const f2d = document.getElementById('f2-den');
    const calcBtn = document.getElementById('frac-calc');
    const resetBtn = document.getElementById('frac-reset');
    const errBox = document.getElementById('frac-error');
    const resSimple = document.getElementById('frac-res-simple');
    const resMixed = document.getElementById('frac-res-mixed');
    const resDec = document.getElementById('frac-res-dec');
    const resSteps = document.getElementById('frac-res-steps');

    if (!f1n || !calcBtn) return;

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const w1 = parseInt(f1w.value, 10) || 0;
        let n1 = parseInt(f1n.value, 10);
        const d1 = parseInt(f1d.value, 10);

        const w2 = parseInt(f2w.value, 10) || 0;
        let n2 = parseInt(f2n.value, 10);
        const d2 = parseInt(f2d.value, 10);
        const op = opSel.value;

        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
            errBox.textContent = 'Please enter integer numerators and denominators for both fractions.';
            errBox.style.display = 'block';
            return;
        }

        if (d1 === 0 || d2 === 0) {
            errBox.textContent = 'Denominator cannot be zero.';
            errBox.style.display = 'block';
            return;
        }

        // Convert mixed to improper
        let num1 = (Math.abs(w1) * d1 + n1) * (w1 < 0 ? -1 : 1);
        let den1 = d1;
        let num2 = (Math.abs(w2) * d2 + n2) * (w2 < 0 ? -1 : 1);
        let den2 = d2;

        let resNum = 0;
        let resDen = 1;
        let steps = '';

        if (op === '+') {
            resNum = (num1 * den2) + (num2 * den1);
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' + ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ' + ' + num2 + '×' + den1 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '-') {
            resNum = (num1 * den2) - (num2 * den1);
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' − ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ' − ' + num2 + '×' + den1 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '*') {
            resNum = num1 * num2;
            resDen = den1 * den2;
            steps = num1 + '/' + den1 + ' × ' + num2 + '/' + den2 + ' = (' + num1 + '×' + num2 + ') / (' + den1 + '×' + den2 + ') = ' + resNum + '/' + resDen;
        } else if (op === '/') {
            if (num2 === 0) {
                errBox.textContent = 'Cannot divide by a fraction equal to zero.';
                errBox.style.display = 'block';
                return;
            }
            resNum = num1 * den2;
            resDen = den1 * num2;
            steps = num1 + '/' + den1 + ' ÷ ' + num2 + '/' + den2 + ' = (' + num1 + '×' + den2 + ') / (' + den1 + '×' + num2 + ') = ' + resNum + '/' + resDen;
        }

        if (resDen < 0) {
            resNum = -resNum;
            resDen = -resDen;
        }

        const commonDiv = gcd(resNum, resDen);
        const simpNum = resNum / commonDiv;
        const simpDen = resDen / commonDiv;

        if (commonDiv > 1) {
            steps += ' = ' + simpNum + '/' + simpDen + ' (reduced by ' + commonDiv + ')';
        }

        resSimple.textContent = (simpDen === 1) ? simpNum.toString() : (simpNum + ' / ' + simpDen);
        resDec.textContent = (simpNum / simpDen).toFixed(4);

        // Mixed number
        if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
            const whole = Math.trunc(simpNum / simpDen);
            const rem = Math.abs(simpNum % simpDen);
            resMixed.textContent = whole + ' ' + rem + '/' + simpDen;
        } else {
            resMixed.textContent = 'N/A';
        }

        resSteps.textContent = steps;
    }

    [f1w, f1n, f1d, opSel, f2w, f2n, f2d].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        f1w.value = '0';
        f1n.value = '1';
        f1d.value = '2';
        opSel.value = '+';
        f2w.value = '0';
        f2n.value = '1';
        f2d.value = '3';
        calculate();
    });

    calculate();
}
`
    }),

    // 14. MATRIX CALCULATOR
    'matrix-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="mat-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid">
                <div class="form-group">
                    <label for="mat-size">Matrix Size</label>
                    <select id="mat-size" class="input-control">
                        <option value="2" selected>2 × 2 Matrix</option>
                        <option value="3">3 × 3 Matrix</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mat-op">Operation</label>
                    <select id="mat-op" class="input-control">
                        <option value="add" selected>Matrix Addition (A + B)</option>
                        <option value="sub">Matrix Subtraction (A − B)</option>
                        <option value="mul">Matrix Multiplication (A × B)</option>
                        <option value="detA">Determinant of A (|A|)</option>
                        <option value="detB">Determinant of B (|B|)</option>
                        <option value="transA">Transpose of A (Aᵀ)</option>
                        <option value="invA">Inverse of A (A⁻¹)</option>
                    </select>
                </div>
            </div>

            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:2rem; margin:1.5rem 0;">
                <!-- Matrix A -->
                <div style="display:flex; flex-direction:column; align-items:center;">
                    <h4 style="margin-bottom:0.5rem;">Matrix A</h4>
                    <div id="mat-grid-a" style="display:grid; gap:0.4rem; padding:0.5rem; border-left:3px solid var(--text-primary); border-right:3px solid var(--text-primary); border-radius:var(--radius-xs);"></div>
                </div>

                <!-- Matrix B -->
                <div id="mat-wrapper-b" style="display:flex; flex-direction:column; align-items:center;">
                    <h4 style="margin-bottom:0.5rem;">Matrix B</h4>
                    <div id="mat-grid-b" style="display:grid; gap:0.4rem; padding:0.5rem; border-left:3px solid var(--text-primary); border-right:3px solid var(--text-primary); border-radius:var(--radius-xs);"></div>
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="mat-reset">Reset</button>
                <button class="btn btn-primary" id="mat-calc">Calculate Matrix</button>
            </div>

            <div id="mat-results" style="margin-top:1.5rem; text-align:center;">
                <h4 style="margin-bottom:0.75rem; font-size:1rem;">Result</h4>
                
                <!-- Scalar result (for determinant) -->
                <div id="mat-scalar-res" style="display:none; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; max-width:280px; margin:0 auto;">
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Determinant Value</span>
                    <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="mat-scalar-val">0</h2>
                </div>

                <!-- Matrix result grid -->
                <div id="mat-grid-res-wrap" style="display:inline-flex; flex-direction:column; align-items:center; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.5rem;">
                    <div id="mat-grid-res" style="display:grid; gap:0.5rem; padding:0.5rem; border-left:3px solid var(--primary-color); border-right:3px solid var(--primary-color); border-radius:var(--radius-xs);"></div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const sizeSel = document.getElementById('mat-size');
    const opSel = document.getElementById('mat-op');
    const gridA = document.getElementById('mat-grid-a');
    const gridB = document.getElementById('mat-grid-b');
    const wrapB = document.getElementById('mat-wrapper-b');
    const calcBtn = document.getElementById('mat-calc');
    const resetBtn = document.getElementById('mat-reset');
    const errBox = document.getElementById('mat-error');
    const scalarRes = document.getElementById('mat-scalar-res');
    const scalarVal = document.getElementById('mat-scalar-val');
    const gridResWrap = document.getElementById('mat-grid-res-wrap');
    const gridRes = document.getElementById('mat-grid-res');

    if (!sizeSel || !calcBtn) return;

    function renderGrids() {
        const n = parseInt(sizeSel.value, 10);
        gridA.style.gridTemplateColumns = 'repeat(' + n + ', 60px)';
        gridB.style.gridTemplateColumns = 'repeat(' + n + ', 60px)';
        gridRes.style.gridTemplateColumns = 'repeat(' + n + ', 70px)';

        gridA.innerHTML = '';
        gridB.innerHTML = '';

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const valA = (r === c) ? '1' : '0';
                const valB = (r === c) ? '2' : '1';

                const inA = document.createElement('input');
                inA.type = 'number';
                inA.className = 'input-control mat-cell-a';
                inA.value = valA;
                inA.style.textAlign = 'center';
                inA.style.padding = '0.4rem 0.2rem';
                inA.setAttribute('data-r', r);
                inA.setAttribute('data-c', c);
                gridA.appendChild(inA);

                const inB = document.createElement('input');
                inB.type = 'number';
                inB.className = 'input-control mat-cell-b';
                inB.value = valB;
                inB.style.textAlign = 'center';
                inB.style.padding = '0.4rem 0.2rem';
                inB.setAttribute('data-r', r);
                inB.setAttribute('data-c', c);
                gridB.appendChild(inB);
            }
        }

        updateOpVisibility();
    }

    function updateOpVisibility() {
        const op = opSel.value;
        const singleAOps = ['detA', 'transA', 'invA'];
        const singleBOps = ['detB'];

        if (singleAOps.includes(op)) {
            wrapB.style.display = 'none';
        } else {
            wrapB.style.display = 'flex';
        }
    }

    function getMatrix(cls, n) {
        const cells = document.querySelectorAll(cls);
        const m = [];
        for (let r = 0; r < n; r++) {
            m[r] = [];
            for (let c = 0; c < n; c++) {
                const idx = (r * n) + c;
                const v = parseFloat(cells[idx].value);
                if (isNaN(v)) return null;
                m[r][c] = v;
            }
        }
        return m;
    }

    function det2(m) {
        return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
    }

    function det3(m) {
        return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
               m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
               m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const n = parseInt(sizeSel.value, 10);
        const op = opSel.value;

        const A = getMatrix('.mat-cell-a', n);
        const B = getMatrix('.mat-cell-b', n);

        if (!A || (wrapB.style.display !== 'none' && !B)) {
            errBox.textContent = 'Please fill all matrix cells with valid numbers.';
            errBox.style.display = 'block';
            return;
        }

        scalarRes.style.display = 'none';
        gridResWrap.style.display = 'none';

        if (op === 'detA' || op === 'detB') {
            const target = (op === 'detA') ? A : B;
            const val = (n === 2) ? det2(target) : det3(target);
            scalarVal.textContent = Number(val.toFixed(4)).toString();
            scalarRes.style.display = 'block';
            return;
        }

        let resM = [];
        for (let r = 0; r < n; r++) resM[r] = [];

        if (op === 'add') {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    resM[r][c] = A[r][c] + B[r][c];
                }
            }
        } else if (op === 'sub') {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    resM[r][c] = A[r][c] - B[r][c];
                }
            }
        } else if (op === 'mul') {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    let sum = 0;
                    for (let k = 0; k < n; k++) {
                        sum += A[r][k] * B[k][c];
                    }
                    resM[r][c] = sum;
                }
            }
        } else if (op === 'transA') {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    resM[r][c] = A[c][r];
                }
            }
        } else if (op === 'invA') {
            const det = (n === 2) ? det2(A) : det3(A);
            if (Math.abs(det) < 1e-10) {
                errBox.textContent = 'Matrix A is singular (determinant is 0). It has no inverse.';
                errBox.style.display = 'block';
                return;
            }
            if (n === 2) {
                resM[0][0] = A[1][1] / det;
                resM[0][1] = -A[0][1] / det;
                resM[1][0] = -A[1][0] / det;
                resM[1][1] = A[0][0] / det;
            } else {
                // 3x3 Inverse = adj(A) / det
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        const sub = [];
                        for (let sr = 0; sr < 3; sr++) {
                            if (sr === r) continue;
                            const row = [];
                            for (let sc = 0; sc < 3; sc++) {
                                if (sc === c) continue;
                                row.push(A[sr][sc]);
                            }
                            sub.push(row);
                        }
                        const sign = ((r + c) % 2 === 0) ? 1 : -1;
                        // Transpose cofactor to adjugate
                        resM[c][r] = (sign * det2(sub)) / det;
                    }
                }
            }
        }

        // Render result matrix
        gridRes.innerHTML = '';
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const div = document.createElement('div');
                div.style.padding = '0.5rem';
                div.style.background = 'var(--bg-secondary)';
                div.style.border = '1px solid var(--border-color)';
                div.style.borderRadius = 'var(--radius-xs)';
                div.style.fontWeight = '700';
                div.style.textAlign = 'center';
                const v = resM[r][c];
                div.textContent = Number(v.toFixed(3)).toString();
                gridRes.appendChild(div);
            }
        }
        gridResWrap.style.display = 'inline-flex';
    }

    sizeSel.addEventListener('change', () => {
        renderGrids();
        calculate();
    });

    opSel.addEventListener('change', () => {
        updateOpVisibility();
        calculate();
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        sizeSel.value = '2';
        opSel.value = 'add';
        renderGrids();
        calculate();
    });

    renderGrids();
    calculate();
}
`
    }),

    // 15. PRIME NUMBER CHECKER
    'prime-number-checker': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="pnc-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid" style="grid-template-columns:1fr;">
                <div class="form-group">
                    <label for="pnc-input">Enter an Integer to Check</label>
                    <input type="number" id="pnc-input" class="input-control" value="29" step="1" placeholder="e.g. 29">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="pnc-reset">Reset</button>
                <button class="btn btn-primary" id="pnc-calc">Check Primality</button>
            </div>

            <div id="pnc-results" style="margin-top:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.5rem; text-align:center; margin-bottom:1.5rem;">
                    <span style="font-size:0.85rem; color:var(--text-secondary);" id="pnc-res-num-label">Number: 29</span>
                    <h2 style="font-size:2.5rem; font-weight:800; color:#1a7f37; margin:0.4rem 0;" id="pnc-status">Prime Number</h2>
                    <p style="font-size:0.95rem; color:var(--text-secondary); margin:0;" id="pnc-desc">29 has exactly two positive divisors: 1 and 29.</p>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Divisors & Factorization</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Total Factors Count: <strong id="pnc-factor-count">2</strong></div>
                        <div>Prime Factorization: <strong id="pnc-factorization">29</strong></div>
                        <div style="grid-column:1/-1;">All Divisors: <strong id="pnc-all-factors" style="word-break:break-all;">1, 29</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const numInput = document.getElementById('pnc-input');
    const calcBtn = document.getElementById('pnc-calc');
    const resetBtn = document.getElementById('pnc-reset');
    const errBox = document.getElementById('pnc-error');
    const numLabel = document.getElementById('pnc-res-num-label');
    const statusEl = document.getElementById('pnc-status');
    const descEl = document.getElementById('pnc-desc');
    const countEl = document.getElementById('pnc-factor-count');
    const factorizeEl = document.getElementById('pnc-factorization');
    const allFactorsEl = document.getElementById('pnc-all-factors');

    if (!numInput || !calcBtn) return;

    function getFactors(n) {
        const factors = [];
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                factors.push(i);
                if (i !== n / i) {
                    factors.push(n / i);
                }
            }
        }
        return factors.sort((a, b) => a - b);
    }

    function getPrimeFactors(n) {
        const pFactors = [];
        let d = 2;
        let temp = n;
        while (d * d <= temp) {
            if (temp % d === 0) {
                pFactors.push(d);
                temp /= d;
            } else {
                d++;
            }
        }
        if (temp > 1) pFactors.push(temp);
        return pFactors;
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const val = numInput.value.trim();
        const n = parseInt(val, 10);

        if (isNaN(n)) {
            errBox.textContent = 'Please enter a valid whole integer.';
            errBox.style.display = 'block';
            return;
        }
        if (Math.abs(n) > Number.MAX_SAFE_INTEGER) {
            errBox.textContent = 'Number is too large for safe integer calculation.';
            errBox.style.display = 'block';
            return;
        }

        numLabel.textContent = 'Inspected Number: ' + n.toLocaleString();

        if (n <= 1) {
            statusEl.textContent = 'Not a Prime Number';
            statusEl.style.color = '#cf222e';
            descEl.textContent = (n === 0 || n === 1) ? (n + ' is neither prime nor composite by mathematical definition.') : 'Negative numbers are not considered prime numbers.';
            countEl.textContent = (n === 0) ? 'Infinite' : (n === 1 ? '1' : 'None');
            factorizeEl.textContent = 'None';
            allFactorsEl.textContent = (n === 1) ? '1' : 'None';
            return;
        }

        const factors = getFactors(n);
        const isPrime = (factors.length === 2);

        if (isPrime) {
            statusEl.textContent = 'Prime Number';
            statusEl.style.color = '#1a7f37';
            descEl.textContent = n + ' is only divisible by 1 and itself (' + n + ').';
            factorizeEl.textContent = n.toString();
        } else {
            statusEl.textContent = 'Composite Number (Not Prime)';
            statusEl.style.color = '#d97706';
            descEl.textContent = n + ' has ' + factors.length + ' positive divisors.';
            
            const pf = getPrimeFactors(n);
            const counts = {};
            pf.forEach(p => counts[p] = (counts[p] || 0) + 1);
            factorizeEl.textContent = Object.entries(counts).map(([p, c]) => c > 1 ? p + '^' + c : p).join(' × ');
        }

        countEl.textContent = factors.length.toString();
        allFactorsEl.textContent = factors.slice(0, 100).join(', ') + (factors.length > 100 ? '... (' + factors.length + ' total)' : '');
    }

    numInput.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        numInput.value = '29';
        calculate();
    });

    calculate();
}
`
    }),

    // 16. GCD AND LCM CALCULATOR
    'gcd-lcm-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="gcd-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid" style="grid-template-columns:1fr 1fr;">
                <div class="form-group">
                    <label for="gcd-num1">First Integer (A)</label>
                    <input type="number" id="gcd-num1" class="input-control" value="48" step="1" placeholder="e.g. 48">
                </div>
                <div class="form-group">
                    <label for="gcd-num2">Second Integer (B)</label>
                    <input type="number" id="gcd-num2" class="input-control" value="180" step="1" placeholder="e.g. 180">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="gcd-reset">Reset</button>
                <button class="btn btn-primary" id="gcd-calc">Calculate GCD & LCM</button>
            </div>

            <div id="gcd-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Greatest Common Divisor (GCD / HCF)</span>
                        <h2 style="font-size:2.25rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="gcd-res-gcd">12</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Least Common Multiple (LCM)</span>
                        <h2 style="font-size:2.25rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="gcd-res-lcm">720</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Euclidean Algorithm Steps</h4>
                    <div id="gcd-steps" style="font-family:var(--font-mono); font-size:0.9rem; line-height:1.6;"></div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const num1Input = document.getElementById('gcd-num1');
    const num2Input = document.getElementById('gcd-num2');
    const calcBtn = document.getElementById('gcd-calc');
    const resetBtn = document.getElementById('gcd-reset');
    const errBox = document.getElementById('gcd-error');
    const resGcd = document.getElementById('gcd-res-gcd');
    const resLcm = document.getElementById('gcd-res-lcm');
    const stepsDiv = document.getElementById('gcd-steps');

    if (!num1Input || !calcBtn) return;

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const aRaw = parseInt(num1Input.value, 10);
        const bRaw = parseInt(num2Input.value, 10);

        if (isNaN(aRaw) || isNaN(bRaw)) {
            errBox.textContent = 'Please enter two valid integer values.';
            errBox.style.display = 'block';
            return;
        }

        let a = Math.abs(aRaw);
        let b = Math.abs(bRaw);

        if (a === 0 && b === 0) {
            errBox.textContent = 'Both numbers cannot be zero.';
            errBox.style.display = 'block';
            return;
        }

        let stepLines = [];
        let numA = Math.max(a, b);
        let numB = Math.min(a, b);

        while (numB > 0) {
            const quotient = Math.floor(numA / numB);
            const rem = numA % numB;
            stepLines.push(numA + ' = (' + numB + ' × ' + quotient + ') + ' + rem);
            numA = numB;
            numB = rem;
        }

        const gcd = numA;
        const lcm = (a === 0 || b === 0) ? 0 : (a / gcd) * b;

        resGcd.textContent = gcd.toLocaleString();
        resLcm.textContent = lcm.toLocaleString();

        stepLines.push('Result: GCD(' + aRaw + ', ' + bRaw + ') = ' + gcd);
        stepLines.push('LCM Formula: LCM(a, b) = |a × b| / GCD = (' + a + ' × ' + b + ') / ' + gcd + ' = ' + lcm);
        stepsDiv.innerHTML = stepLines.map(s => '<div>' + s + '</div>').join('');
    }

    [num1Input, num2Input].forEach(el => el.addEventListener('input', calculate));
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        num1Input.value = '48';
        num2Input.value = '180';
        calculate();
    });

    calculate();
}
`
    }),

    // 17. QUADRATIC EQUATION SOLVER
    'quadratic-equation': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="quad-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div style="text-align:center; font-size:1.2rem; font-family:var(--font-mono); margin-bottom:1rem;">
                <strong>a</strong>x² + <strong>b</strong>x + <strong>c</strong> = 0
            </div>

            <div class="options-grid" style="grid-template-columns:repeat(3, 1fr);">
                <div class="form-group">
                    <label for="quad-a">Coefficient (a)</label>
                    <input type="number" id="quad-a" class="input-control" value="1" step="any" placeholder="a ≠ 0">
                </div>
                <div class="form-group">
                    <label for="quad-b">Coefficient (b)</label>
                    <input type="number" id="quad-b" class="input-control" value="-5" step="any" placeholder="e.g. -5">
                </div>
                <div class="form-group">
                    <label for="quad-c">Constant (c)</label>
                    <input type="number" id="quad-c" class="input-control" value="6" step="any" placeholder="e.g. 6">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="quad-reset">Reset</button>
                <button class="btn btn-primary" id="quad-calc">Solve Quadratic Equation</button>
            </div>

            <div id="quad-results" style="margin-top:1.5rem;">
                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:1.5rem; text-align:center;">
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Formatted Equation</span>
                    <h3 style="font-size:1.5rem; font-family:var(--font-mono); margin:0.4rem 0;" id="quad-formatted-eq">x² − 5x + 6 = 0</h3>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Root 1 (x₁)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="quad-root1">3</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Root 2 (x₂)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="quad-root2">2</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Discriminant (D = b² − 4ac)</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="quad-disc">1</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Parabola Properties & Steps</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Nature of Roots: <strong id="quad-nature">Two distinct real roots</strong></div>
                        <div>Parabola Vertex: <strong id="quad-vertex">(2.5, -0.25)</strong></div>
                        <div>Opens: <strong id="quad-direction">Upwards (minimum at vertex)</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const aInput = document.getElementById('quad-a');
    const bInput = document.getElementById('quad-b');
    const cInput = document.getElementById('quad-c');
    const calcBtn = document.getElementById('quad-calc');
    const resetBtn = document.getElementById('quad-reset');
    const errBox = document.getElementById('quad-error');
    const eqDisplay = document.getElementById('quad-formatted-eq');
    const r1El = document.getElementById('quad-root1');
    const r2El = document.getElementById('quad-root2');
    const discEl = document.getElementById('quad-disc');
    const natureEl = document.getElementById('quad-nature');
    const vertexEl = document.getElementById('quad-vertex');
    const dirEl = document.getElementById('quad-direction');

    if (!aInput || !calcBtn) return;

    function formatEq(a, b, c) {
        let s = '';
        if (a === 1) s += 'x²';
        else if (a === -1) s += '-x²';
        else s += a + 'x²';

        if (b > 0) s += ' + ' + (b === 1 ? '' : b) + 'x';
        else if (b < 0) s += ' − ' + (b === -1 ? '' : Math.abs(b)) + 'x';

        if (c > 0) s += ' + ' + c;
        else if (c < 0) s += ' − ' + Math.abs(c);

        return s + ' = 0';
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const a = parseFloat(aInput.value);
        const b = parseFloat(bInput.value);
        const c = parseFloat(cInput.value);

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            errBox.textContent = 'Please enter valid numeric coefficients for a, b, and c.';
            errBox.style.display = 'block';
            return;
        }

        if (a === 0) {
            errBox.textContent = 'Coefficient "a" cannot be 0 in a quadratic equation (ax² + bx + c = 0). When a = 0, this is a linear equation.';
            errBox.style.display = 'block';
            return;
        }

        eqDisplay.textContent = formatEq(a, b, c);

        const D = (b * b) - (4 * a * c);
        discEl.textContent = Number(D.toFixed(4)).toString();

        const vertexX = -b / (2 * a);
        const vertexY = (a * vertexX * vertexX) + (b * vertexX) + c;
        vertexEl.textContent = '(' + Number(vertexX.toFixed(3)) + ', ' + Number(vertexY.toFixed(3)) + ')';
        dirEl.textContent = (a > 0) ? 'Upwards (min vertex)' : 'Downwards (max vertex)';

        if (D > 0) {
            const sqrtD = Math.sqrt(D);
            const x1 = (-b + sqrtD) / (2 * a);
            const x2 = (-b - sqrtD) / (2 * a);
            r1El.textContent = Number(x1.toFixed(4)).toString();
            r2El.textContent = Number(x2.toFixed(4)).toString();
            natureEl.textContent = 'Two distinct real roots';
        } else if (D === 0) {
            const x = -b / (2 * a);
            r1El.textContent = Number(x.toFixed(4)).toString();
            r2El.textContent = Number(x.toFixed(4)).toString();
            natureEl.textContent = 'One repeated real root (D = 0)';
        } else {
            // Complex roots
            const real = -b / (2 * a);
            const imag = Math.sqrt(-D) / (2 * Math.abs(a));
            const realStr = (Math.abs(real) < 1e-10) ? '0' : Number(real.toFixed(4)).toString();
            const imagStr = Number(imag.toFixed(4)).toString();

            r1El.textContent = realStr + ' + ' + imagStr + 'i';
            r2El.textContent = realStr + ' − ' + imagStr + 'i';
            natureEl.textContent = 'Two complex conjugate roots (D < 0)';
        }
    }

    [aInput, bInput, cInput].forEach(el => el.addEventListener('input', calculate));
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        aInput.value = '1';
        bInput.value = '-5';
        cInput.value = '6';
        calculate();
    });

    calculate();
}
`
    }),

    // 18. MEAN, MEDIAN, MODE
    'mean-median-mode': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="mmm-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="form-group">
                <label for="mmm-input">Enter Dataset Numbers (separated by commas, spaces, or newlines)</label>
                <textarea id="mmm-input" class="input-control" style="min-height:110px;" placeholder="e.g. 12, 15, 12, 19, 24, 15, 30, 12">12, 15, 12, 19, 24, 15, 30, 12</textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="mmm-reset">Reset</button>
                <button class="btn btn-primary" id="mmm-calc">Calculate Statistics</button>
            </div>

            <div id="mmm-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Mean (Average)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="mmm-res-mean">17.38</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Median (Middle Value)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="mmm-res-median">15</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Mode (Most Frequent)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="mmm-res-mode">12</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Statistical Properties</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Count (N): <strong id="mmm-count">8</strong></div>
                        <div>Sum (Σx): <strong id="mmm-sum">139</strong></div>
                        <div>Minimum: <strong id="mmm-min">12</strong></div>
                        <div>Maximum: <strong id="mmm-max">30</strong></div>
                        <div>Range (Max − Min): <strong id="mmm-range">18</strong></div>
                    </div>
                    <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-color); font-size:0.85rem;">
                        <span>Sorted Values:</span>
                        <div id="mmm-sorted" style="font-family:var(--font-mono); margin-top:0.25rem; word-break:break-all;">12, 12, 12, 15, 15, 19, 24, 30</div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const inputArea = document.getElementById('mmm-input');
    const calcBtn = document.getElementById('mmm-calc');
    const resetBtn = document.getElementById('mmm-reset');
    const errBox = document.getElementById('mmm-error');
    const meanEl = document.getElementById('mmm-res-mean');
    const medianEl = document.getElementById('mmm-res-median');
    const modeEl = document.getElementById('mmm-res-mode');
    const countEl = document.getElementById('mmm-count');
    const sumEl = document.getElementById('mmm-sum');
    const minEl = document.getElementById('mmm-min');
    const maxEl = document.getElementById('mmm-max');
    const rangeEl = document.getElementById('mmm-range');
    const sortedEl = document.getElementById('mmm-sorted');

    if (!inputArea || !calcBtn) return;

    function parseNumbers(raw) {
        return raw
            .replace(/[,;]/g, ' ')
            .trim()
            .split(/\\s+/)
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const nums = parseNumbers(inputArea.value);
        if (nums.length === 0) {
            errBox.textContent = 'Please enter at least one valid number.';
            errBox.style.display = 'block';
            return;
        }

        const sorted = [...nums].sort((a, b) => a - b);
        const count = sorted.length;
        const sum = sorted.reduce((acc, v) => acc + v, 0);
        const mean = sum / count;

        // Median
        let median = 0;
        const mid = Math.floor(count / 2);
        if (count % 2 === 0) {
            median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            median = sorted[mid];
        }

        // Mode
        const freqs = {};
        let maxFreq = 0;
        sorted.forEach(n => {
            freqs[n] = (freqs[n] || 0) + 1;
            if (freqs[n] > maxFreq) maxFreq = freqs[n];
        });

        let modes = [];
        if (maxFreq > 1) {
            for (const key in freqs) {
                if (freqs[key] === maxFreq) {
                    modes.push(parseFloat(key));
                }
            }
        }

        let modeText = 'No Mode';
        if (modes.length > 0) {
            modeText = modes.join(', ') + ' (' + maxFreq + '×)';
        }

        const min = sorted[0];
        const max = sorted[count - 1];
        const range = max - min;

        meanEl.textContent = Number(mean.toFixed(3)).toString();
        medianEl.textContent = Number(median.toFixed(3)).toString();
        modeEl.textContent = modeText;
        countEl.textContent = count.toString();
        sumEl.textContent = Number(sum.toFixed(3)).toString();
        minEl.textContent = min.toString();
        maxEl.textContent = max.toString();
        rangeEl.textContent = Number(range.toFixed(3)).toString();
        sortedEl.textContent = sorted.join(', ');
    }

    inputArea.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        inputArea.value = '12, 15, 12, 19, 24, 15, 30, 12';
        calculate();
    });

    calculate();
}
`
    }),

    // 19. STANDARD DEVIATION
    'standard-deviation': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="sd-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="form-group">
                <label for="sd-input">Dataset Values (separated by commas, spaces, or newlines)</label>
                <textarea id="sd-input" class="input-control" style="min-height:100px;" placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16">10, 12, 23, 23, 16, 23, 21, 16</textarea>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="sd-reset">Reset</button>
                <button class="btn btn-primary" id="sd-calc">Calculate Standard Deviation</button>
            </div>

            <div id="sd-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Sample Standard Deviation (s)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="sd-sample-val">5.04</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);" id="sd-sample-var">Variance (s²): 25.41</span>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Population Standard Deviation (σ)</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="sd-pop-val">4.71</h2>
                        <span style="font-size:0.85rem; color:var(--text-secondary);" id="sd-pop-var">Variance (σ²): 22.23</span>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Summary Statistics</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;">
                        <div>Sample Size (N): <strong id="sd-count">8</strong></div>
                        <div>Mean (x̄): <strong id="sd-mean">18.0</strong></div>
                        <div>Sum of Squares (SS): <strong id="sd-ss">177.88</strong></div>
                        <div>Standard Error (SE): <strong id="sd-se">1.78</strong></div>
                    </div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const inputArea = document.getElementById('sd-input');
    const calcBtn = document.getElementById('sd-calc');
    const resetBtn = document.getElementById('sd-reset');
    const errBox = document.getElementById('sd-error');
    const sValEl = document.getElementById('sd-sample-val');
    const sVarEl = document.getElementById('sd-sample-var');
    const pValEl = document.getElementById('sd-pop-val');
    const pVarEl = document.getElementById('sd-pop-var');
    const countEl = document.getElementById('sd-count');
    const meanEl = document.getElementById('sd-mean');
    const ssEl = document.getElementById('sd-ss');
    const seEl = document.getElementById('sd-se');

    if (!inputArea || !calcBtn) return;

    function parseNumbers(raw) {
        return raw
            .replace(/[,;]/g, ' ')
            .trim()
            .split(/\\s+/)
            .map(s => parseFloat(s))
            .filter(n => !isNaN(n));
    }

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const nums = parseNumbers(inputArea.value);
        if (nums.length < 2) {
            errBox.textContent = 'Please enter at least 2 numbers to compute standard deviation.';
            errBox.style.display = 'block';
            return;
        }

        const N = nums.length;
        const sum = nums.reduce((acc, v) => acc + v, 0);
        const mean = sum / N;

        let ss = 0;
        nums.forEach(x => {
            const diff = x - mean;
            ss += (diff * diff);
        });

        const popVar = ss / N;
        const popSd = Math.sqrt(popVar);

        const sampleVar = ss / (N - 1);
        const sampleSd = Math.sqrt(sampleVar);
        const se = sampleSd / Math.sqrt(N);

        sValEl.textContent = Number(sampleSd.toFixed(3)).toString();
        sVarEl.textContent = 'Variance (s²): ' + Number(sampleVar.toFixed(3)).toString();
        pValEl.textContent = Number(popSd.toFixed(3)).toString();
        pVarEl.textContent = 'Variance (σ²): ' + Number(popVar.toFixed(3)).toString();

        countEl.textContent = N.toString();
        meanEl.textContent = Number(mean.toFixed(3)).toString();
        ssEl.textContent = Number(ss.toFixed(3)).toString();
        seEl.textContent = Number(se.toFixed(3)).toString();
    }

    inputArea.addEventListener('input', calculate);
    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        inputArea.value = '10, 12, 23, 23, 16, 23, 21, 16';
        calculate();
    });

    calculate();
}
`
    }),

    // 20. PROBABILITY CALCULATOR
    'probability-calculator': () => ({
        workspaceHTML: `
        <div class="tool-workspace">
            <div id="prob-error" style="display:none; color:var(--error-color); background:rgba(255,0,0,0.1); border:1px solid var(--error-color); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.9rem;"></div>
            
            <div class="options-grid" style="grid-template-columns:1fr; margin-bottom:1rem;">
                <div class="form-group">
                    <label for="prob-mode">Calculation Mode</label>
                    <select id="prob-mode" class="input-control">
                        <option value="single" selected>Single Event: P(A) = Favorable / Total</option>
                        <option value="two">Two Independent Events: P(A) & P(B)</option>
                        <option value="series">Event in N Attempts (at least once)</option>
                    </select>
                </div>
            </div>

            <!-- Single Event Mode -->
            <div class="options-grid" id="prob-single-fields">
                <div class="form-group">
                    <label for="prob-favorable">Number of Favorable Outcomes</label>
                    <input type="number" id="prob-favorable" class="input-control" value="1" min="0" step="1">
                </div>
                <div class="form-group">
                    <label for="prob-total">Total Possible Outcomes</label>
                    <input type="number" id="prob-total" class="input-control" value="6" min="1" step="1">
                </div>
            </div>

            <!-- Two Independent Events Mode -->
            <div class="options-grid" id="prob-two-fields" style="display:none;">
                <div class="form-group">
                    <label for="prob-pa">Probability of Event A (0 to 1, or %)</label>
                    <input type="number" id="prob-pa" class="input-control" value="0.5" min="0" max="1" step="0.01">
                </div>
                <div class="form-group">
                    <label for="prob-pb">Probability of Event B (0 to 1, or %)</label>
                    <input type="number" id="prob-pb" class="input-control" value="0.5" min="0" max="1" step="0.01">
                </div>
            </div>

            <!-- Series Mode -->
            <div class="options-grid" id="prob-series-fields" style="display:none;">
                <div class="form-group">
                    <label for="prob-single-p">Probability of Success Per Trial (0 to 1)</label>
                    <input type="number" id="prob-single-p" class="input-control" value="0.2" min="0" max="1" step="0.01">
                </div>
                <div class="form-group">
                    <label for="prob-trials">Number of Trials (n)</label>
                    <input type="number" id="prob-trials" class="input-control" value="5" min="1" max="1000" step="1">
                </div>
            </div>

            <div class="action-row">
                <button class="btn btn-secondary" id="prob-reset">Reset</button>
                <button class="btn btn-primary" id="prob-calc">Calculate Probability</button>
            </div>

            <div id="prob-results" style="margin-top:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Primary Probability</span>
                        <h2 style="font-size:2rem; font-weight:800; color:var(--primary-color); margin-top:0.25rem;" id="prob-res-dec">0.1667</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Percentage Likelihood</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#1a7f37; margin-top:0.25rem;" id="prob-res-pct">16.67%</h2>
                    </div>
                    <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                        <span style="font-size:0.85rem; color:var(--text-secondary);">Odds Representation</span>
                        <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-top:0.25rem;" id="prob-res-odds">1 in 6</h2>
                    </div>
                </div>

                <div style="background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:1.25rem;">
                    <h4 style="margin-bottom:0.75rem; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-secondary);">Associated Probabilities</h4>
                    <div id="prob-breakdown" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-size:0.9rem;"></div>
                </div>
            </div>
        </div>
        `,
        logicJS: `export function init() {
    const modeSel = document.getElementById('prob-mode');
    const singleFields = document.getElementById('prob-single-fields');
    const twoFields = document.getElementById('prob-two-fields');
    const seriesFields = document.getElementById('prob-series-fields');

    const favInput = document.getElementById('prob-favorable');
    const totInput = document.getElementById('prob-total');
    const paInput = document.getElementById('prob-pa');
    const pbInput = document.getElementById('prob-pb');
    const spInput = document.getElementById('prob-single-p');
    const trialsInput = document.getElementById('prob-trials');

    const calcBtn = document.getElementById('prob-calc');
    const resetBtn = document.getElementById('prob-reset');
    const errBox = document.getElementById('prob-error');

    const resDec = document.getElementById('prob-res-dec');
    const resPct = document.getElementById('prob-res-pct');
    const resOdds = document.getElementById('prob-res-odds');
    const breakdownEl = document.getElementById('prob-breakdown');

    if (!modeSel || !calcBtn) return;

    modeSel.addEventListener('change', () => {
        const m = modeSel.value;
        singleFields.style.display = (m === 'single') ? 'grid' : 'none';
        twoFields.style.display = (m === 'two') ? 'grid' : 'none';
        seriesFields.style.display = (m === 'series') ? 'grid' : 'none';
        calculate();
    });

    function calculate() {
        errBox.style.display = 'none';
        errBox.textContent = '';

        const m = modeSel.value;
        let p = 0;
        let breakdown = [];

        if (m === 'single') {
            const fav = parseFloat(favInput.value);
            const tot = parseFloat(totInput.value);

            if (isNaN(fav) || isNaN(tot) || fav < 0 || tot <= 0) {
                errBox.textContent = 'Favorable outcomes must be ≥ 0 and Total outcomes must be > 0.';
                errBox.style.display = 'block';
                return;
            }
            if (fav > tot) {
                errBox.textContent = 'Favorable outcomes cannot exceed total possible outcomes.';
                errBox.style.display = 'block';
                return;
            }

            p = fav / tot;
            breakdown.push({ label: 'Complement P(not A)', val: 1 - p });
            breakdown.push({ label: 'Odds in Favor', valText: fav + ' : ' + (tot - fav) });
            breakdown.push({ label: 'Odds Against', valText: (tot - fav) + ' : ' + fav });
        } else if (m === 'two') {
            const pA = parseFloat(paInput.value);
            const pB = parseFloat(pbInput.value);

            if (isNaN(pA) || pA < 0 || pA > 1 || isNaN(pB) || pB < 0 || pB > 1) {
                errBox.textContent = 'Probabilities must be numbers between 0 and 1.';
                errBox.style.display = 'block';
                return;
            }

            // Both A and B occur
            p = pA * pB;
            const pOr = pA + pB - (pA * pB);
            const pOnlyA = pA * (1 - pB);
            const pNeither = (1 - pA) * (1 - pB);

            breakdown.push({ label: 'P(Both A and B)', val: p });
            breakdown.push({ label: 'P(A or B or Both)', val: pOr });
            breakdown.push({ label: 'P(A but not B)', val: pOnlyA });
            breakdown.push({ label: 'P(Neither A nor B)', val: pNeither });
        } else {
            const sP = parseFloat(spInput.value);
            const n = parseInt(trialsInput.value, 10);

            if (isNaN(sP) || sP < 0 || sP > 1) {
                errBox.textContent = 'Trial probability must be between 0 and 1.';
                errBox.style.display = 'block';
                return;
            }
            if (isNaN(n) || n < 1) {
                errBox.textContent = 'Number of trials must be at least 1.';
                errBox.style.display = 'block';
                return;
            }

            // At least once: 1 - (1 - p)^n
            const pNone = Math.pow(1 - sP, n);
            p = 1 - pNone;

            breakdown.push({ label: 'P(At least once)', val: p });
            breakdown.push({ label: 'P(Never in ' + n + ' trials)', val: pNone });
            breakdown.push({ label: 'P(Every single trial)', val: Math.pow(sP, n) });
        }

        resDec.textContent = p.toFixed(4);
        resPct.textContent = (p * 100).toFixed(2) + '%';
        if (p > 0) {
            const oneIn = (1 / p).toFixed(1);
            resOdds.textContent = '1 in ' + oneIn;
        } else {
            resOdds.textContent = 'Impossible (0%)';
        }

        breakdownEl.innerHTML = breakdown.map(item => {
            const vStr = (item.val !== undefined) ? Number(item.val.toFixed(4)) + ' (' + (item.val * 100).toFixed(1) + '%)' : item.valText;
            return '<div>' + item.label + ': <strong>' + vStr + '</strong></div>';
        }).join('');
    }

    [favInput, totInput, paInput, pbInput, spInput, trialsInput].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calcBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        modeSel.value = 'single';
        singleFields.style.display = 'grid';
        twoFields.style.display = 'none';
        seriesFields.style.display = 'none';
        favInput.value = '1';
        totInput.value = '6';
        paInput.value = '0.5';
        pbInput.value = '0.5';
        spInput.value = '0.2';
        trialsInput.value = '5';
        calculate();
    });

    calculate();
}
`
    })
};
