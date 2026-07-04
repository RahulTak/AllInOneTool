export function init() {
    const qty = document.getElementById('uuid-quantity');
    const output = document.getElementById('uuid-output');
    const genBtn = document.getElementById('uuid-btn-generate');
    const copyBtn = document.getElementById('uuid-btn-copy');
    const download = document.getElementById('uuid-btn-download');

    if (!genBtn) return;

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function render() {
        const count = parseInt(qty.value) || 5;
        let uuids = [];
        for (let i = 0; i < count; i++) {
            uuids.push(generateUUID());
        }
        output.value = uuids.join('\n');
    }

    genBtn.addEventListener('click', render);
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.value).then(() => alert('UUIDs Copied!'));
    });

    download.addEventListener('click', () => {
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    render();
}
