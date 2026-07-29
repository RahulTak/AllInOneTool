export function init() {
    const typeSel = document.getElementById('mac-type');
    const sepSel = document.getElementById('mac-sep');
    const qtyInput = document.getElementById('mac-qty');
    const caseSel = document.getElementById('mac-case');
    
    const output = document.getElementById('mac-output');
    const genBtn = document.getElementById('mac-btn-gen');
    const copyBtn = document.getElementById('mac-btn-copy');
    const downloadBtn = document.getElementById('mac-btn-download');

    if (!genBtn) return;

    function randByte() {
        return Math.floor(Math.random() * 256);
    }

    function makeMAC() {
        const type = typeSel.value;
        const bytes = new Uint8Array(6);
        for(let i=0; i<6; i++) {
            bytes[i] = randByte();
        }

        if (type === 'multicast') {
            bytes[0] |= 0x01;
        } else if (type === 'unicast') {
            bytes[0] &= 0xFE;
        } else if (type === 'local') {
            const localHexChars = [2, 6, 10, 14];
            const firstNibble = Math.floor(Math.random() * 16);
            const secondNibble = localHexChars[Math.floor(Math.random() * 4)];
            bytes[0] = (firstNibble << 4) | secondNibble;
        }

        let macStr = '';
        const sep = sepSel.value;
        const useUpper = caseSel.value === 'upper';

        for (let i = 0; i < 6; i++) {
            let bStr = bytes[i].toString(16).padStart(2, '0');
            if (useUpper) bStr = bStr.toUpperCase();
            macStr += bStr;
            if (i < 5) macStr += sep;
        }

        return macStr;
    }

    function generate() {
        const qty = parseInt(qtyInput.value) || 5;
        const list = [];
        for (let i = 0; i < qty; i++) {
            list.push(makeMAC());
        }
        output.value = list.join('\n');
    }

    [typeSel, sepSel, qtyInput, caseSel].forEach(el => el.addEventListener('change', generate));
    genBtn.addEventListener('click', generate);

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('Copied MAC Addresses!'));
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mac_addresses.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    generate();
}
