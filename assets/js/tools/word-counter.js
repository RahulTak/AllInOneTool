export function init() {
    const input = document.getElementById('text-input');
    const words = document.getElementById('count-words');
    const chars = document.getElementById('count-chars');
    const sentences = document.getElementById('count-sentences');
    const reading = document.getElementById('count-reading');
    const clearBtn = document.getElementById('clear-text');
    const copyBtn = document.getElementById('copy-text');

    if (!input) return;

    input.addEventListener('input', () => {
        const text = input.value;
        const charCount = text.length;
        const wordArr = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = wordArr.length;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

        const readTime = Math.ceil(wordCount / 200);

        words.textContent = wordCount;
        chars.textContent = charCount;
        sentences.textContent = sentenceCount;
        reading.textContent = readTime + 'm';
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(input.value).then(() => {
            alert('Copied to clipboard!');
        });
    });
}
