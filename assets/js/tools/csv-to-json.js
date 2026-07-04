export function init() {
    const csv = document.getElementById('csv-val');
    const json = document.getElementById('json-val');
    const convert = document.getElementById('csv-btn-convert');

    if (!convert) return;

    convert.addEventListener('click', () => {
        const lines = csv.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
            alert('Please input headers and row items separated by commas.');
            return;
        }

        const headers = lines[0].split(',');
        const result = [];

        for(let i=1; i<lines.length; i++) {
            const cells = lines[i].split(',');
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h.trim()] = (cells[idx] || '').trim();
            });
            result.push(obj);
        }

        json.value = JSON.stringify(result, null, 4);
    });
}
