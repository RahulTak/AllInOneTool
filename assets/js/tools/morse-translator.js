export function init() {
    const text = document.getElementById('morse-text');
    const code = document.getElementById('morse-code');
    const resetBtn = document.getElementById('morse-reset');
    const copyBtn = document.getElementById('morse-btn-copy');

    const morseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
        'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
        'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
    };

    const reverseMap = {};
    Object.keys(morseMap).forEach(k => reverseMap[morseMap[k]] = k);

    if (!text) return;

    function translateText() {
        const val = text.value.toUpperCase();
        let result = [];
        for (let i = 0; i < val.length; i++) {
            const ch = val.charAt(i);
            if (morseMap[ch]) result.push(morseMap[ch]);
        }
        code.value = result.join(' ');
    }

    function translateMorse() {
        const val = code.value.trim().split(/\s+/);
        let result = '';
        for (let symbol of val) {
            if (reverseMap[symbol]) result += reverseMap[symbol];
        }
        text.value = result;
    }

    text.addEventListener('input', translateText);
    code.addEventListener('input', translateMorse);

    resetBtn.addEventListener('click', () => {
        text.value = '';
        code.value = '';
    });

    copyBtn.addEventListener('click', () => {
        const targetText = code.value || text.value;
        navigator.clipboard.writeText(targetText).then(() => alert('Copied Result!'));
    });
}
