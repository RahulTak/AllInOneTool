export function init() {
    const input = document.getElementById('nato-input');
    const output = document.getElementById('nato-output');
    const pronounceCheckbox = document.getElementById('nato-pronounce-nums');
    const clearBtn = document.getElementById('nato-clear');
    const resetBtn = document.getElementById('nato-reset');
    const copyBtn = document.getElementById('nato-copy');

    const dict = {
        'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot',
        'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima',
        'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo',
        'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
        'Y': 'Yankee', 'Z': 'Zulu'
    };
    const numDict = {
        '0': 'Zero', '1': 'Wun', '2': 'Too', '3': 'Tree', '4': 'Fower',
        '5': 'Fife', '6': 'Six', '7': 'Seven', '8': 'Ait', '9': 'Niner'
    };

    if (!input) return;

    function translateWord(word, pronounceNumbers) {
        let tokens = [];
        let currentPhonetic = '';
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const upperChar = char.toUpperCase();
            
            if (dict[upperChar]) {
                if (currentPhonetic) {
                    tokens.push(currentPhonetic);
                    currentPhonetic = '';
                }
                tokens.push(dict[upperChar]);
            } else if (numDict[upperChar]) {
                if (currentPhonetic) {
                    tokens.push(currentPhonetic);
                    currentPhonetic = '';
                }
                tokens.push(pronounceNumbers ? numDict[upperChar] : upperChar);
            } else {
                currentPhonetic += char;
            }
        }
        if (currentPhonetic) {
            tokens.push(currentPhonetic);
        }
        
        let formatted = '';
        for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            const isPunct = !/\w/.test(tok);
            
            if (i === 0) {
                formatted = tok;
            } else {
                const prevTok = tokens[i - 1];
                const prevIsPunct = !/\w/.test(prevTok);
                
                if (isPunct) {
                    formatted += tok;
                } else if (prevIsPunct && i === 1) {
                    formatted += tok;
                } else {
                    formatted += ' ' + tok;
                }
            }
        }
        return formatted;
    }

    function render() {
        const text = input.value;
        if (!text.trim()) {
            output.textContent = '-';
            return;
        }

        const pronounceNumbers = pronounceCheckbox.checked;
        const lines = text.split('\n');
        const outputLines = [];

        lines.forEach(line => {
            const words = line.split(/\s+/);
            const lineWords = [];

            words.forEach(word => {
                if (!word) return;
                const translated = translateWord(word, pronounceNumbers);
                if (translated) {
                    lineWords.push(translated);
                }
            });

            if (lineWords.length > 0) {
                outputLines.push(lineWords.join('\n'));
            }
        });

        output.textContent = outputLines.length > 0 ? outputLines.join('\n\n') : '-';
    }

    [input, pronounceCheckbox].forEach(el => el.addEventListener('input', render));
    pronounceCheckbox.addEventListener('change', render);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '-';
    });

    resetBtn.addEventListener('click', () => {
        input.value = 'hello';
        pronounceCheckbox.checked = false;
        render();
    });

    copyBtn.addEventListener('click', () => {
        if (output.textContent === '-') return;
        navigator.clipboard.writeText(output.textContent).then(() => alert('Copied NATO speller output!'));
    });

    render();
}
