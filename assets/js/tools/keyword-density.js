export function init() {
    const textInput = document.getElementById('kd-text');
    const ignoreStop = document.getElementById('kd-ignore-stop');
    const analyzeBtn = document.getElementById('kd-btn-analyze');
    const resultsPanel = document.getElementById('kd-results');
    const tableBody = document.getElementById('kd-table-body');
    const totWords = document.getElementById('kd-tot-words');
    const totChars = document.getElementById('kd-tot-chars');
    const uniqWords = document.getElementById('kd-uniq-words');

    const stopWords = ["the", "and", "a", "of", "to", "is", "in", "it", "you", "that", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i"];

    if (!analyzeBtn) return;

    let analyzedData = [];
    let sortDir = { keyword: 1, count: -1, density: -1 };

    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;

        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const ignore = ignoreStop.checked;

        const counts = {};
        let totalWordsCount = words.length;
        let uniqueCount = 0;

        words.forEach(w => {
            if (ignore && stopWords.includes(w)) return;
            counts[w] = (counts[w] || 0) + 1;
        });

        analyzedData = Object.keys(counts).map(word => {
            uniqueCount++;
            const count = counts[word];
            const pct = totalWordsCount > 0 ? ((count / totalWordsCount) * 100) : 0;
            return { keyword: word, count, density: pct };
        });

        totWords.textContent = totalWordsCount;
        totChars.textContent = text.length;
        uniqWords.textContent = uniqueCount;

        // Sort descending count initially
        sortData('count', -1);
        resultsPanel.style.display = 'block';
    });

    function sortData(key, direction) {
        analyzedData.sort((a, b) => {
            if (typeof a[key] === 'string') {
                return a[key].localeCompare(b[key]) * direction;
            }
            return (a[key] - b[key]) * direction;
        });
        renderTable();
    }

    function renderTable() {
        tableBody.innerHTML = analyzedData.slice(0, 15).map(item => `
            <tr>
                <td style="padding:0.5rem; font-weight:700;">${item.keyword}</td>
                <td style="padding:0.5rem;">${item.count}</td>
                <td style="padding:0.5rem;">${item.density.toFixed(1)}%</td>
            </tr>
        `).join('');
    }

    document.getElementById('th-keyword').addEventListener('click', () => {
        sortDir.keyword = -sortDir.keyword;
        sortData('keyword', sortDir.keyword);
    });

    document.getElementById('th-count').addEventListener('click', () => {
        sortDir.count = -sortDir.count;
        sortData('count', sortDir.count);
    });

    document.getElementById('th-density').addEventListener('click', () => {
        sortDir.density = -sortDir.density;
        sortData('density', sortDir.density);
    });
}
