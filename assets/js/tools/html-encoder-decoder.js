export function init() {
    const input = document.getElementById('html-ed-input');
    const output = document.getElementById('html-ed-output');
    const encodeBtn = document.getElementById('html-ed-encode');
    const decodeBtn = document.getElementById('html-ed-decode');
    const clearBtn = document.getElementById('html-ed-clear');

    if (!input) return;

    encodeBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.textContent = input.value;
        output.value = div.innerHTML;
    });

    decodeBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.innerHTML = input.value;
        output.value = div.textContent;
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
}
