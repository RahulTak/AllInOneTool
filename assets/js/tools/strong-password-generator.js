export function init() {
    const lengthRange = document.getElementById('pwd-length');
    const lengthVal = document.getElementById('pwd-len-val');
    const upperCheck = document.getElementById('pwd-upper');
    const lowerCheck = document.getElementById('pwd-lower');
    const numCheck = document.getElementById('pwd-num');
    const symCheck = document.getElementById('pwd-sym');
    const similarCheck = document.getElementById('pwd-exclude-similar');
    const outputInput = document.getElementById('pwd-output');
    const copyBtn = document.getElementById('pwd-btn-copy');
    const regenBtn = document.getElementById('pwd-btn-regenerate');
    const strengthLabel = document.getElementById('pwd-strength-label');
    const entropyVal = document.getElementById('pwd-entropy-val');

    if (!lengthRange) return;

    lengthRange.addEventListener('input', () => {
        lengthVal.textContent = lengthRange.value;
        generate();
    });

    [upperCheck, lowerCheck, numCheck, symCheck, similarCheck].forEach(el => {
        el.addEventListener('change', generate);
    });

    regenBtn.addEventListener('click', generate);

    function generate() {
        let pool = '';
        if (upperCheck.checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowerCheck.checked) pool += 'abcdefghijklmnopqrstuvwxyz';
        if (numCheck.checked) pool += '0123456789';
        if (symCheck.checked) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (similarCheck.checked) {
            pool = pool.replace(/[il1Lo0O|]/g, '');
        }

        if (!pool) {
            outputInput.value = '';
            strengthLabel.textContent = '-';
            entropyVal.textContent = '0 bits';
            return;
        }

        const len = parseInt(lengthRange.value) || 12;
        let password = '';
        for (let i = 0; i < len; i++) {
            password += pool.charAt(Math.floor(Math.random() * pool.length));
        }

        outputInput.value = password;

        // Entropy and strength checks
        const poolSize = pool.length;
        const entropy = Math.round(len * Math.log2(poolSize));
        entropyVal.textContent = entropy + ' bits';

        let strength = 'Very Weak';
        let color = 'var(--error-color)';
        if (entropy >= 80) { strength = 'Very Strong'; color = 'var(--success-color)'; }
        else if (entropy >= 60) { strength = 'Strong'; color = 'var(--success-color)'; }
        else if (entropy >= 40) { strength = 'Medium'; color = 'var(--primary-color)'; }
        else if (entropy >= 25) { strength = 'Weak'; color = 'var(--accent-color)'; }

        strengthLabel.textContent = strength;
        strengthLabel.style.color = color;
    }

    copyBtn.addEventListener('click', () => {
        if (!outputInput.value) return;
        navigator.clipboard.writeText(outputInput.value).then(() => alert('Password Copied!'));
    });

    generate();
}
