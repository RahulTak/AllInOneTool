export function init() {
    const input = document.getElementById('hash-text');
    const md5El = document.getElementById('hash-md5');
    const sha256El = document.getElementById('hash-sha256');
    const sha512El = document.getElementById('hash-sha512');

    if (!input) return;

    input.addEventListener('input', async () => {
        const val = input.value;
        if (!val) {
            md5El.value = '';
            sha256El.value = '';
            sha512El.value = '';
            return;
        }

        md5El.value = calcMD5(val);
        sha256El.value = await calcSubtleHash(val, 'SHA-256');
        sha512El.value = await calcSubtleHash(val, 'SHA-512');
    });

    async function calcSubtleHash(text, algo) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
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
}
