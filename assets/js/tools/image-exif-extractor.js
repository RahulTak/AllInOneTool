export function init() {
    const dropzone = document.getElementById('exif-dropzone');
    const input = document.getElementById('exif-input');
    const workspace = document.getElementById('exif-workspace');
    const table = document.getElementById('exif-results-table');
    const reset = document.getElementById('exif-btn-reset');
    const copy = document.getElementById('exif-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        table.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        let txt = '';
        table.querySelectorAll('tr').forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length === 2) {
                txt += cols[0].innerText + ': ' + cols[1].innerText + '\n';
            }
        });
        navigator.clipboard.writeText(txt).then(() => alert('EXIF metadata copied!'));
    });

    function process(file) {
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
        table.innerHTML = '<tr><td colspan="2" style="text-align:center;">Extracting EXIF...</td></tr>';

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                EXIF.getData(img, function() {
                    const tags = EXIF.getAllTags(img);
                    if (Object.keys(tags).length === 0) {
                        table.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:1.5rem; color:var(--text-tertiary);">No EXIF metadata available.</td></tr>';
                        return;
                    }

                    const rows = [
                        ['File Name', file.name],
                        ['File Size', (file.size / 1024).toFixed(1) + ' KB'],
                        ['Camera Manufacturer', tags.Make || '-'],
                        ['Camera Model', tags.Model || '-'],
                        ['Software', tags.Software || '-'],
                        ['Aperture', tags.ApertureValue || tags.FNumber || '-'],
                        ['ISO Speed', tags.ISOSpeedRatings || '-'],
                        ['Focal Length', tags.FocalLength ? tags.FocalLength + 'mm' : '-'],
                        ['Date Taken', tags.DateTimeOriginal || tags.DateTime || '-'],
                        ['Orientation', tags.Orientation || '-'],
                        ['Resolution', img.naturalWidth + ' x ' + img.naturalHeight + ' px']
                    ];

                    table.innerHTML = rows.map(r => {
                        return '<tr style="border-bottom:1px solid var(--border-color);"><td style="padding:0.6rem; font-weight:700; width:40%;">' + r[0] + '</td><td style="padding:0.6rem; color:var(--text-secondary);">' + r[1] + '</td></tr>';
                    }).join('');
                });
            };
        };
        reader.readAsDataURL(file);
    }
}
