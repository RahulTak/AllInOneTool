export function init() {
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
