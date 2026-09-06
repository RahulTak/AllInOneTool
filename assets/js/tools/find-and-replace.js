export function init() {
    const input = document.getElementById('far-input');
    const findInput = document.getElementById('far-find');
    const replaceInput = document.getElementById('far-replace');
    const caseCheckbox = document.getElementById('far-case');
    const wholeCheckbox = document.getElementById('far-whole');
    const countBadge = document.getElementById('far-count-badge');
    const output = document.getElementById('far-output');
    const btnAll = document.getElementById('far-btn-all');
    const btnFirst = document.getElementById('far-btn-first');
    const clearBtn = document.getElementById('far-btn-clear');
    const resetBtn = document.getElementById('far-btn-reset');
    const copyBtn = document.getElementById('far-btn-copy');

    if (!input || !output) return;

    function escapeRegex(str) {
        return str.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
    }

    function buildRegex(isGlobal) {
        const query = findInput.value;
        if (!query) return null;

        let pattern = escapeRegex(query);
        if (wholeCheckbox.checked) {
            pattern = '\\b' + pattern + '\\b';
        }

        let flags = isGlobal ? 'g' : '';
        if (!caseCheckbox.checked) flags += 'i';

        return new RegExp(pattern, flags);
    }

    function updateMatchCount() {
        const text = input.value;
        const re = buildRegex(true);
        if (!re || !text) {
            countBadge.textContent = '0 matches';
            return;
        }
        const matches = text.match(re);
        const count = matches ? matches.length : 0;
        countBadge.textContent = count + (count === 1 ? ' match' : ' matches');
    }

    function performReplace(replaceAll) {
        const text = input.value;
        const rep = replaceInput.value || '';
        const re = buildRegex(replaceAll);

        if (!re || !text) {
            output.value = text;
            countBadge.textContent = '0 replacements';
            return;
        }

        const matches = text.match(buildRegex(true));
        const totalMatches = matches ? matches.length : 0;

        output.value = text.replace(re, rep);

        if (replaceAll) {
            countBadge.textContent = totalMatches + (totalMatches === 1 ? ' replacement made' : ' replacements made');
        } else {
            const count = totalMatches > 0 ? 1 : 0;
            countBadge.textContent = count + ' replacement made';
        }
    }

    btnAll.addEventListener('click', () => performReplace(true));
    btnFirst.addEventListener('click', () => performReplace(false));

    [input, findInput, caseCheckbox, wholeCheckbox].forEach(el => {
        el.addEventListener('input', updateMatchCount);
        el.addEventListener('change', updateMatchCount);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        findInput.value = '';
        replaceInput.value = '';
        output.value = '';
        countBadge.textContent = '0 matches';
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = `Hello Rahul.
Hello John.
Hello Sarah.`;
        findInput.value = 'Hello';
        replaceInput.value = 'Hi';
        caseCheckbox.checked = false;
        wholeCheckbox.checked = false;
        updateMatchCount();
        performReplace(true);
    });

    copyBtn.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    updateMatchCount();
}
