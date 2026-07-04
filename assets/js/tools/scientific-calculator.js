export function init() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');
    
    let expr = '';
    let memory = 0;

    if (!display) return;

    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        const key = e.key;
        if (/[0-9./*+-%()]/.test(key)) {
            expr += key;
            display.value = expr;
        } else if (key === 'Enter') {
            evaluate();
        } else if (key === 'Backspace') {
            expr = expr.slice(0, -1);
            display.value = expr;
        } else if (key === 'Escape') {
            expr = '';
            display.value = '';
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            if (val === 'C') {
                expr = '';
                display.value = '';
            } else if (val === '=') {
                evaluate();
            } else if (val === 'M+') {
                memory += parseFloat(display.value) || 0;
            } else if (val === 'M-') {
                memory -= parseFloat(display.value) || 0;
            } else if (val === 'MR') {
                expr += String(memory);
                display.value = expr;
            } else if (val === 'MC') {
                memory = 0;
            } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(val)) {
                expr += val + '(';
                display.value = expr;
            } else if (val === 'pow') {
                expr += '**';
                display.value = expr;
            } else if (val === 'sq') {
                expr += '**2';
                display.value = expr;
            } else if (val === 'fact') {
                const n = parseInt(display.value) || 0;
                let f = 1;
                for (let i = 1; i <= n; i++) f *= i;
                display.value = f;
                expr = String(f);
            } else if (val === 'pi') {
                expr += 'Math.PI';
                display.value = expr;
            } else if (val === 'e') {
                expr += 'Math.E';
                display.value = expr;
            } else {
                expr += val;
                display.value = expr;
            }
        });
    });

    function evaluate() {
        try {
            let query = expr
                .replace(/sin(/g, 'Math.sin(')
                .replace(/cos(/g, 'Math.cos(')
                .replace(/tan(/g, 'Math.tan(')
                .replace(/log(/g, 'Math.log10(')
                .replace(/ln(/g, 'Math.log(')
                .replace(/sqrt(/g, 'Math.sqrt(');
            
            const result = eval(query);
            display.value = result;
            expr = String(result);
        } catch (e) {
            display.value = 'Error';
            expr = '';
        }
    }
}
