export function init() {
    const dec = document.getElementById('num-dec');
    const bin = document.getElementById('num-bin');
    const oct = document.getElementById('num-oct');
    const hex = document.getElementById('num-hex');
    const errorMsg = document.getElementById('num-error-msg');

    if (!dec) return;

    function convert(val, base, triggerEl) {
        errorMsg.textContent = '';
        if (val === '') {
            dec.value = ''; bin.value = ''; oct.value = ''; hex.value = '';
            return;
        }

        try {
            // Validate input characters for the given base
            let validator = /^[0-9]+$/;
            if (base === 2) validator = /^[01]+$/;
            else if (base === 8) validator = /^[0-7]+$/;
            else if (base === 16) validator = /^[0-9a-fA-F]+$/;

            if (!validator.test(val)) {
                throw new Error('Invalid characters for Selected Base.');
            }

            const intVal = parseInt(val, base);
            if (isNaN(intVal)) {
                throw new Error('Invalid formatting.');
            }

            if (triggerEl !== dec) dec.value = intVal.toString(10);
            if (triggerEl !== bin) bin.value = intVal.toString(2);
            if (triggerEl !== oct) oct.value = intVal.toString(8);
            if (triggerEl !== hex) hex.value = intVal.toString(16).toUpperCase();
        } catch(e) {
            errorMsg.textContent = e.message;
        }
    }

    dec.addEventListener('input', () => convert(dec.value, 10, dec));
    bin.addEventListener('input', () => convert(bin.value, 2, bin));
    oct.addEventListener('input', () => convert(oct.value, 8, oct));
    hex.addEventListener('input', () => convert(hex.value, 16, hex));
}
