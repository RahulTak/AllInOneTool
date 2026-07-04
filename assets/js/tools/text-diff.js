export function init() {
    const leftText = document.getElementById('diff-text-left');
    const rightText = document.getElementById('diff-text-right');
    const diffMode = document.getElementById('diff-mode');
    const swapBtn = document.getElementById('diff-btn-swap');
    const clearBtn = document.getElementById('diff-btn-clear');
    const resultsPanel = document.getElementById('diff-results');
    const similarityEl = document.getElementById('diff-stat-similarity');
    const diffsEl = document.getElementById('diff-stat-diffs');
    const outputContainer = document.getElementById('diff-output-container');

    if (!leftText) return;

    function compare() {
        const text1 = leftText.value;
        const text2 = rightText.value;

        if (!text1 && !text2) {
            resultsPanel.style.display = 'none';
            return;
        }

        const mode = diffMode.value;
        let htmlResult = '';
        let diffCount = 0;
        let matches = 0;

        if (mode === 'line') {
            const lines1 = text1.split('\n');
            const lines2 = text2.split('\n');

            let i = 0, j = 0;

            while (i < lines1.length || j < lines2.length) {
                if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
                    htmlResult += '<div>  ' + escapeHtml(lines1[i]) + '</div>';
                    matches++;
                    i++; j++;
                } else if (j < lines2.length && (i >= lines1.length || !lines1.slice(i).includes(lines2[j]))) {
                    htmlResult += '<div style="background-color:#e6ffec; color:#1a7f37; font-weight:bold;">+ ' + escapeHtml(lines2[j]) + '</div>';
                    diffCount++;
                    j++;
                } else {
                    htmlResult += '<div style="background-color:#ffebe9; color:#cf222e; font-weight:bold;">- ' + escapeHtml(lines1[i]) + '</div>';
                    diffCount++;
                    i++;
                }
            }

            const total = Math.max(lines1.length, lines2.length);
            similarityEl.textContent = total > 0 ? Math.round((matches / total) * 100) + '%' : '100%';
        } else {
            const words1 = text1.match(/\s+|\S+/g) || [];
            const words2 = text2.match(/\s+|\S+/g) || [];

            let i = 0, j = 0;

            while (i < words1.length || j < words2.length) {
                if (i < words1.length && j < words2.length && words1[i] === words2[j]) {
                    htmlResult += escapeHtml(words1[i]);
                    matches++;
                    i++; j++;
                } else if (j < words2.length && (i >= words1.length || !words1.slice(i).includes(words2[j]))) {
                    htmlResult += '<span style="background-color:#acf2bd; color:#115e24; font-weight:bold; padding:0 2px;">' + escapeHtml(words2[j]) + '</span>';
                    diffCount++;
                    j++;
                } else {
                    htmlResult += '<span style="background-color:#fdb8c0; color:#820e12; font-weight:bold; padding:0 2px; text-decoration:line-through;">' + escapeHtml(words1[i]) + '</span>';
                    diffCount++;
                    i++;
                }
            }

            const total = Math.max(words1.length, words2.length);
            similarityEl.textContent = total > 0 ? Math.round((matches / total) * 100) + '%' : '100%';
        }

        diffsEl.textContent = diffCount;
        outputContainer.innerHTML = htmlResult;
        resultsPanel.style.display = 'block';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    leftText.addEventListener('input', compare);
    rightText.addEventListener('input', compare);
    diffMode.addEventListener('change', compare);

    swapBtn.addEventListener('click', () => {
        const temp = leftText.value;
        leftText.value = rightText.value;
        rightText.value = temp;
        compare();
    });

    clearBtn.addEventListener('click', () => {
        leftText.value = '';
        rightText.value = '';
        outputContainer.innerHTML = '';
        resultsPanel.style.display = 'none';
    });
}
