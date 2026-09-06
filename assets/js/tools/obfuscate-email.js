export function init() {
    const input = document.getElementById('obf-input');
    const output = document.getElementById('obf-output');
    const mode = document.getElementById('obf-mode');
    const clearBtn = document.getElementById('obf-btn-clear');
    const resetBtn = document.getElementById('obf-btn-reset');
    const copyBtn = document.getElementById('obf-btn-copy');

    if (!input || !output) return;

    function obfuscateEmail(email, selectedMode) {
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const [user, domain] = parts;

        switch (selectedMode) {
            case 'readable':
                return user + ' [at] ' + domain.replace(/\./g, ' [dot] ');
            case 'entities':
                return email.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('');
            case 'mailto': {
                const encodedMailto = encodeURIComponent(email);
                return '<a href="mailto:' + encodedMailto + '">' + email.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('') + '</a>';
            }
            case 'js': {
                const half1 = user;
                const half2 = domain;
                return '<script>document.write(\'' + half1 + '\'+\'@\'+\'' + half2 + '\');<\\/script>';
            }
            default:
                return email;
        }
    }

    function process() {
        const text = input.value;
        if (!text) {
            output.value = '';
            return;
        }

        const selectedMode = mode.value;
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

        if (emailRegex.test(text)) {
            output.value = text.replace(emailRegex, (match) => obfuscateEmail(match, selectedMode));
        } else if (text.includes('@')) {
            output.value = obfuscateEmail(text.trim(), selectedMode);
        } else {
            output.value = text;
        }
    }

    input.addEventListener('input', process);
    mode.addEventListener('change', process);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'hello@example.com';
        process();
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) process();
}
