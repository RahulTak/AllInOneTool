export function init() {
    const pattern = document.getElementById('regex-pattern');
    const text = document.getElementById('regex-text');
    const highlights = document.getElementById('regex-highlights');
    const groupsDiv = document.getElementById('regex-groups-val');
    const flags = document.querySelectorAll('.regex-flag');

    if (!pattern) return;

    function getFlagsString() {
        let f = '';
        flags.forEach(ch => {
            if(ch.checked) f += ch.value;
        });
        return f;
    }

    function evaluate() {
        const pVal = pattern.value;
        const tVal = text.value;
        const fVal = getFlagsString();

        if(!pVal || !tVal) {
            highlights.innerHTML = tVal || 'Matches highlight preview...';
            groupsDiv.textContent = 'Enter expression and test text.';
            return;
        }

        try {
            const finalFlags = fVal.includes('g') ? fVal : fVal + 'g';
            const re = new RegExp(pVal, finalFlags);
            const matches = [...tVal.matchAll(re)];

            if (matches.length === 0) {
                highlights.textContent = tVal;
                groupsDiv.textContent = 'No matches found.';
                return;
            }

            let lastIdx = 0;
            let html = '';
            let groupsText = [];

            matches.forEach((match, idx) => {
                const start = match.index;
                const end = start + match[0].length;
                html += tVal.substring(lastIdx, start);
                html += '<span style="background:yellow; color:black; font-weight:700;">' + match[0] + '</span>';
                lastIdx = end;
                groupsText.push('Match #' + (idx + 1) + ': "' + match[0] + '" at index ' + start + (match.length > 1 ? ' (Groups: ' + match.slice(1).join(', ') + ')' : ''));
            });
            html += tVal.substring(lastIdx);
            highlights.innerHTML = html;
            groupsDiv.innerHTML = groupsText.join('<br>');
        } catch(e) {
            highlights.textContent = 'Syntax Error: ' + e.message;
            groupsDiv.textContent = '-';
        }
    }

    [pattern, text].forEach(el => el.addEventListener('input', evaluate));
    flags.forEach(el => el.addEventListener('change', evaluate));
}
