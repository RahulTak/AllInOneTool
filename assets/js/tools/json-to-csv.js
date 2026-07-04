export function init() {
    const json = document.getElementById('json-val-input');
    const csv = document.getElementById('csv-val-output');
    const convert = document.getElementById('json-btn-convert');

    if (!convert) return;

    convert.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(json.value.trim());
            if (!Array.isArray(parsed) || parsed.length === 0) {
                alert('Please check input array structure.');
                return;
            }

            const headers = Object.keys(parsed[0]);
            let csvStr = headers.join(',') + '\n';

            parsed.forEach(obj => {
                const row = headers.map(h => {
                    const cellVal = obj[h] || '';
                    return cellVal.toString().includes(',') ? '"' + cellVal + '"' : cellVal;
                }).join(',');
                csvStr += row + '\n';
            });

            csv.value = csvStr;
        } catch(e) {
            alert('Invalid JSON array input formatting: ' + e.message);
        }
    });
}
