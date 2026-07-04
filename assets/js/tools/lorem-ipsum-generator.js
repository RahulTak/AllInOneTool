export function init() {
    const typeSelect = document.getElementById('lorem-type');
    const countInput = document.getElementById('lorem-count');
    const startCheck = document.getElementById('lorem-start');
    const generateBtn = document.getElementById('lorem-generate');
    const resetBtn = document.getElementById('lorem-reset');
    const outputSection = document.getElementById('lorem-output-section');
    const outputText = document.getElementById('lorem-output');
    const wordsCount = document.getElementById('lorem-words-count');
    const parasCount = document.getElementById('lorem-paras-count');
    const copyBtn = document.getElementById('lorem-copy');
    const downloadBtn = document.getElementById('lorem-download');

    if (!generateBtn) return;

    const wordsList = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
        "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
        "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
        "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
        "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in",
        "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];

    function generate() {
        const type = typeSelect.value;
        const count = parseInt(countInput.value) || 5;
        const startWithLorem = startCheck.checked;

        let result = '';
        if (type === 'words') {
            result = generateWords(count, startWithLorem);
        } else if (type === 'sentences') {
            result = generateSentences(count, startWithLorem);
        } else {
            result = generateParagraphs(count, startWithLorem);
        }

        outputText.value = result;
        wordsCount.textContent = result.trim().split(/\s+/).filter(w => w.length > 0).length;
        parasCount.textContent = type === 'paragraphs' ? count : result.split('\n\n').length;
        outputSection.style.display = 'block';
    }

    function generateWords(n, start) {
        let list = [];
        if (start) {
            list = ["Lorem", "ipsum", "dolor", "sit", "amet"];
            n = Math.max(0, n - 5);
        }
        for (let i = 0; i < n; i++) {
            list.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
        }
        return list.join(' ') + '.';
    }

    function generateSentences(n, start) {
        const sentences = [];
        for (let i = 0; i < n; i++) {
            let sStart = (i === 0 && start);
            let sLen = Math.floor(Math.random() * 8) + 6;
            let sentence = generateWords(sLen, sStart);
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
            sentences.push(sentence);
        }
        return sentences.join(' ');
    }

    function generateParagraphs(n, start) {
        const paragraphs = [];
        for (let i = 0; i < n; i++) {
            let pStart = (i === 0 && start);
            let pLen = Math.floor(Math.random() * 4) + 3;
            paragraphs.push(generateSentences(pLen, pStart));
        }
        return paragraphs.join('\n\n');
    }

    generateBtn.addEventListener('click', generate);

    resetBtn.addEventListener('click', () => {
        countInput.value = '5';
        typeSelect.selectedIndex = 0;
        startCheck.checked = true;
        outputText.value = '';
        outputSection.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.value).then(() => alert('Copied text!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lorem_ipsum.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}
