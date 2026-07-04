export function init() {
    const input = document.getElementById('uuid-val-input');
    const status = document.getElementById('uuid-status-label');
    const details = document.getElementById('uuid-details');

    if (!input) return;

    function validate() {
        const val = input.value.trim();
        const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const generalUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidV4.test(val)) {
            status.textContent = 'Valid UUID v4';
            status.style.color = 'var(--success-color)';
            details.textContent = 'Complies with standard version-4 (random) RFC 4122 specifications.';
        } else if (generalUuid.test(val)) {
            status.textContent = 'Valid General UUID';
            status.style.color = 'var(--success-color)';
            details.textContent = 'Correct format, but version digit is not RFC 4122 version-4.';
        } else {
            status.textContent = 'Invalid Format';
            status.style.color = 'var(--error-color)';
            details.textContent = 'Length or characters do not match standard hexadecimal segments (8-4-4-4-12).';
        }
    }

    input.addEventListener('input', validate);
    validate();
}
