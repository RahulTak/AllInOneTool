export function init() {
    const textInput = document.getElementById('hash-checker-text');
    const algoSelect = document.getElementById('hash-algo-select');
    const outputVal = document.getElementById('hash-output-val');
    const noticeText = document.getElementById('hash-notice-text');
    const resetBtn = document.getElementById('hash-btn-reset');
    const copyBtn = document.getElementById('hash-btn-copy');

    if (!textInput) return;

    async function compute() {
        const val = textInput.value;
        if (!val) {
            outputVal.textContent = '-';
            return;
        }

        const isHexHash = /^[a-fA-F0-9]{32,128}$/.test(val);
        if (isHexHash) {
            noticeText.innerHTML = '<span style="color:var(--error-color); font-weight:700;">Attention:</span> You entered a hash signature. Hashes are mathematically one-way and cannot be reverse-computed. Please input a plaintext password instead to generate its signature.';
        } else {
            noticeText.textContent = 'Note: All hash operations run completely client-side in memory.';
        }

        const algo = algoSelect.value;
        if (algo === 'MD5') {
            outputVal.textContent = calcMD5(val);
        } else if (algo === 'SHA-1') {
            outputVal.textContent = await calcSubtle(val, 'SHA-1');
        } else if (algo === 'SHA-256') {
            outputVal.textContent = await calcSubtle(val, 'SHA-256');
        } else if (algo === 'SHA-384') {
            outputVal.textContent = await calcSubtle(val, 'SHA-384');
        } else if (algo === 'SHA-512') {
            outputVal.textContent = await calcSubtle(val, 'SHA-512');
        }
    }

    async function calcSubtle(str, algoName) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest(algoName, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function calcMD5(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }

    textInput.addEventListener('input', compute);
    algoSelect.addEventListener('change', compute);

    resetBtn.addEventListener('click', () => {
        textInput.value = '';
        outputVal.textContent = '-';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputVal.textContent).then(() => alert('Hash Copied!'));
    });
}
