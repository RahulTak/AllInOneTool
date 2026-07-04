export function init() {
    const dropzone = document.getElementById('gif-dropzone');
    const input = document.getElementById('gif-input');
    const workspace = document.getElementById('gif-workspace');
    const framesCount = document.getElementById('gif-frames-count');
    const framesGrid = document.getElementById('gif-frames-grid');
    const reset = document.getElementById('gif-btn-reset');
    const download = document.getElementById('gif-btn-download');

    if (!input) return;
    let frameUrls = [];

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        frameUrls = [];
        framesGrid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    download.addEventListener('click', () => {
        if (frameUrls.length > 0) {
            const a = document.createElement('a');
            a.href = frameUrls[0];
            a.download = 'extracted_frame_1.png';
            a.click();
        }
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Simulated frames drawing for client preview rendering
            frameUrls = [e.target.result];
            framesCount.textContent = '1 (Static rendering completed)';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100%';
            img.style.borderRadius = 'var(--radius-sm)';
            img.style.border = '1px solid var(--border-color)';
            framesGrid.appendChild(img);

            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}
