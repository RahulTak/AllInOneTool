export function init() {
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
