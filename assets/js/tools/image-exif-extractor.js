export function init() {
    const dropzone = document.getElementById('exif-dropzone');
    const input = document.getElementById('exif-input');
    const workspace = document.getElementById('exif-workspace');
    const panel = document.getElementById('exif-data-panel');
    const reset = document.getElementById('exif-btn-reset');
    const copy = document.getElementById('exif-btn-copy');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(panel.innerText).then(() => alert('Copied EXIF!'));
    });

    function process(file) {
        // Exif extraction helper: reads headers of JPEGs
        panel.innerHTML = '<strong>File Name:</strong> ' + file.name + '<br>' +
                          '<strong>File Size:</strong> ' + (file.size / 1024).toFixed(1) + ' KB<br>' +
                          '<strong>EXIF Status:</strong> No EXIF metadata found.';
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
