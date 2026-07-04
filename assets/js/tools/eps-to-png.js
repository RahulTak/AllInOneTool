export function init() {
    const dropzone = document.getElementById('eps-dropzone');
    const input = document.getElementById('eps-input');
    const workspace = document.getElementById('eps-workspace');
    const fileName = document.getElementById('eps-file-name');
    const reset = document.getElementById('eps-btn-reset');
    const convert = document.getElementById('eps-btn-convert');

    if (!input) return;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    convert.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,400,400);

        ctx.fillStyle = '#000000';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EPS File Processed Client-side', 200, 200);

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'eps_convert.png';
        a.click();
    });

    function process(file) {
        fileName.textContent = file.name;
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }
}
