export function init() {
    const input = document.getElementById('sql-input');
    const output = document.getElementById('sql-output');
    const beautyUpper = document.getElementById('sql-beautify-upper');
    const beautyLower = document.getElementById('sql-beautify-lower');
    const mini = document.getElementById('sql-minify');

    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE'];

    if (!input) return;

    function formatSQL(caseType) {
        let val = input.value.trim();
        keywords.forEach(w => {
            const regex = new RegExp('\\b' + w + '\\b', 'gi');
            val = val.replace(regex, caseType === 'upper' ? w.toUpperCase() : w.toLowerCase());
        });

        let formatted = val
            .replace(/\bSELECT\b/gi, 'SELECT\n ')
            .replace(/\bFROM\b/gi, '\nFROM')
            .replace(/\bWHERE\b/gi, '\nWHERE')
            .replace(/\bAND\b/gi, '\n  AND')
            .replace(/\bOR\b/gi, '\n  OR')
            .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
            .replace(/\bORDER BY\b/gi, '\nORDER BY');

        output.value = formatted;
    }

    beautyUpper.addEventListener('click', () => formatSQL('upper'));
    beautyLower.addEventListener('click', () => formatSQL('lower'));

    mini.addEventListener('click', () => {
        output.value = input.value.replace(/\s+/g, ' ').trim();
    });
}
