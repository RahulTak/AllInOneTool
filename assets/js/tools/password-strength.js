export function init() {
    const pass = document.getElementById('strength-pass');
    const label = document.getElementById('strength-label');
    const bar = document.getElementById('strength-bar');
    const suggestions = document.getElementById('strength-suggestions');

    if (!pass) return;

    pass.addEventListener('input', () => {
        const val = pass.value;
        if(!val) {
            label.textContent = 'Very Weak';
            bar.style.width = '0%';
            bar.style.backgroundColor = 'var(--error-color)';
            suggestions.textContent = 'Type a password to check suggestions.';
            return;
        }

        let score = 0;
        let tips = [];

        if (val.length >= 8) score++; else tips.push("Length should be at least 8 characters.");
        if (val.length >= 12) score++;
        if (/[A-Z]/.test(val)) score++; else tips.push("Include uppercase letters.");
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++; else tips.push("Include numeric digits.");
        if (/[^A-Za-z0-9]/.test(val)) score++; else tips.push("Include symbols (e.g. !@#$).");

        let strClass = 'Very Weak';
        let color = 'var(--error-color)';
        let percent = '10%';

        if (score >= 5) { strClass = 'Very Strong'; color = 'var(--success-color)'; percent = '100%'; }
        else if (score >= 4) { strClass = 'Strong'; color = 'var(--success-color)'; percent = '75%'; }
        else if (score >= 3) { strClass = 'Medium'; color = 'var(--primary-color)'; percent = '50%'; }
        else if (score >= 2) { strClass = 'Weak'; color = 'var(--accent-color)'; percent = '25%'; }

        label.textContent = strClass;
        bar.style.width = percent;
        bar.style.backgroundColor = color;
        suggestions.innerHTML = tips.length > 0 ? '<ul>' + tips.map(t => `<li>${t}</li>`).join('') + '</ul>' : '✅ Secure Password!';
    });
}
