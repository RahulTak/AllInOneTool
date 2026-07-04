export function init() {
    const input = document.getElementById('nato-input');
    const output = document.getElementById('nato-output');
    const clearBtn = document.getElementById('nato-clear');
    const copyBtn = document.getElementById('nato-copy');

    const dict = {
        'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot',
        'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima',
        'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo',
        'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
        'Y': 'Yankee', 'Z': 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
        '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
    };

    if (!input) return;

    function render() {
        const val = input.value.toUpperCase();
        let result = [];
        for (let i = 0; i < val.length; i++) {
            const ch = val.charAt(i);
            if (dict[ch]) result.push(dict[ch]);
            else if (ch === ' ') result.push('/');
        }
        output.textContent = result.length > 0 ? result.join(' ') : '-';
    }

    input.addEventListener('input', render);
    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.textContent = '-';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent).then(() => alert('Copied NATO speller output!'));
    });

    render();
}
