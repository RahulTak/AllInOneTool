export function init() {
    const input = document.getElementById('wfc-input');
    const sortSelect = document.getElementById('wfc-sort');
    const minLenInput = document.getElementById('wfc-min-len');
    const stopWordsCheckbox = document.getElementById('wfc-stop-words');
    const totalWordsEl = document.getElementById('wfc-total-words');
    const uniqueWordsEl = document.getElementById('wfc-unique-words');
    const totalCharsEl = document.getElementById('wfc-total-chars');
    const topWordEl = document.getElementById('wfc-top-word');
    const tableBody = document.getElementById('wfc-table-body');
    const clearBtn = document.getElementById('wfc-btn-clear');
    const resetBtn = document.getElementById('wfc-btn-reset');
    const copyBtn = document.getElementById('wfc-btn-copy');

    if (!input || !tableBody) return;

    const STOP_WORDS = new Set([
        'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
        'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
        'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
        'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in',
        'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not',
        'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over',
        'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
        'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
        'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
        'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
    ]);

    let lastCalculatedData = [];

    function analyze() {
        const text = input.value;
        if (!text.trim()) {
            totalWordsEl.textContent = '0';
            uniqueWordsEl.textContent = '0';
            totalCharsEl.textContent = '0';
            topWordEl.textContent = '-';
            tableBody.innerHTML = '<tr><td colspan="4" style="padding:2rem; text-align:center; color:var(--text-secondary);">No words analyzed yet</td></tr>';
            lastCalculatedData = [];
            return;
        }

        totalCharsEl.textContent = text.length.toLocaleString();

        // Extract words, lowercased, removing standalone numbers and punctuation
        const rawTokens = text.toLowerCase().match(/[\p{L}\p{N}'-]+/gu) || [];
        const minLen = parseInt(minLenInput.value, 10) || 1;
        const ignoreStop = stopWordsCheckbox.checked;

        const filteredWords = [];
        rawTokens.forEach(raw => {
            const cleaned = raw.replace(/^['"-]+|['"-]+$/g, '');
            if (cleaned.length >= minLen && (!ignoreStop || !STOP_WORDS.has(cleaned))) {
                filteredWords.push(cleaned);
            }
        });

        const totalFiltered = filteredWords.length;
        totalWordsEl.textContent = totalFiltered.toLocaleString();

        if (totalFiltered === 0) {
            uniqueWordsEl.textContent = '0';
            topWordEl.textContent = '-';
            tableBody.innerHTML = '<tr><td colspan="4" style="padding:2rem; text-align:center; color:var(--text-secondary);">No words match the current filter criteria</td></tr>';
            lastCalculatedData = [];
            return;
        }

        const counts = {};
        filteredWords.forEach(w => {
            counts[w] = (counts[w] || 0) + 1;
        });

        const uniqueKeys = Object.keys(counts);
        uniqueWordsEl.textContent = uniqueKeys.length.toLocaleString();

        let entries = uniqueKeys.map(word => ({
            word: word,
            count: counts[word],
            percentage: ((counts[word] / totalFiltered) * 100).toFixed(1)
        }));

        const sortMode = sortSelect.value;
        if (sortMode === 'freq-desc') {
            entries.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
        } else if (sortMode === 'freq-asc') {
            entries.sort((a, b) => a.count - b.count || a.word.localeCompare(b.word));
        } else if (sortMode === 'alpha-asc') {
            entries.sort((a, b) => a.word.localeCompare(b.word));
        } else if (sortMode === 'alpha-desc') {
            entries.sort((a, b) => b.word.localeCompare(a.word));
        }

        topWordEl.textContent = entries.length > 0 ? entries[0].word + ' (' + entries[0].count + ')' : '-';
        lastCalculatedData = entries;

        let rowsHtml = '';
        entries.forEach(e => {
            rowsHtml += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.6rem 1rem; font-weight: 600; font-family: var(--font-mono);">${e.word}</td>
                <td style="padding: 0.6rem 1rem;">${e.count}</td>
                <td style="padding: 0.6rem 1rem;">${e.percentage}%</td>
                <td style="padding: 0.6rem 1rem;">
                    <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); height: 8px; width: 100%; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${Math.min(100, e.percentage * 2)}%;"></div>
                    </div>
                </td>
            </tr>`;
        });

        tableBody.innerHTML = rowsHtml;
    }

    [input, sortSelect, minLenInput, stopWordsCheckbox].forEach(el => {
        el.addEventListener('input', analyze);
        el.addEventListener('change', analyze);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        analyze();
        input.focus();
    });

    resetBtn.addEventListener('click', () => {
        input.value = `Hello world.
Hello everyone.
HELLO to the entire world!`;
        analyze();
    });

    copyBtn.addEventListener('click', () => {
        if (!lastCalculatedData || lastCalculatedData.length === 0) return;
        let textTable = 'Word\tCount\tPercentage\n';
        lastCalculatedData.forEach(item => {
            textTable += item.word + '\t' + item.count + '\t' + item.percentage + '%\n';
        });
        navigator.clipboard.writeText(textTable).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        });
    });

    if (input.value) analyze();
}
