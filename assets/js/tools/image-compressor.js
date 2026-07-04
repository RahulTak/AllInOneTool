export function init() {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    const workspace = document.getElementById('compress-workspace');
    const canvas = document.getElementById('compress-canvas');
    const levelSelect = document.getElementById('compress-level');
    const sizeOrig = document.getElementById('c-size-orig');
    const sizeComp = document.getElementById('c-size-comp');
    const savings = document.getElementById('c-savings');
    const percentage = document.getElementById('c-percentage');
    const banner = document.getElementById('c-status-banner');
    const reset = document.getElementById('compress-btn-reset');
    const download = document.getElementById('compress-btn-download');

    if (!input) return;
    let img = new Image();
    let originalSize = 0;
    let compressedBlob = null;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            const file = e.target.files[0];
            originalSize = file.size;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        compressedBlob = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    levelSelect.addEventListener('change', compress);

    function draw() {
        if (!img.src) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        ctx.drawImage(img, 0, 0);
    }

    function compress() {
        if (!img.src) return;
        const level = levelSelect.value;
        let quality = 0.6;
        if (level === 'low') quality = 0.85;
        if (level === 'high') quality = 0.25;

        canvas.toBlob((blob) => {
            compressedBlob = blob;
            const compSize = blob.size;

            sizeOrig.textContent = (originalSize / 1024).toFixed(1) + ' KB';
            sizeComp.textContent = (compSize / 1024).toFixed(1) + ' KB';

            if (compSize >= originalSize) {
                // If larger, notify and keep original
                savings.textContent = '0 KB';
                percentage.textContent = '0%';
                banner.textContent = '⚠️ Lossless compression limits reached. Output size is optimized to original.';
                banner.style.color = 'var(--warning-color)';
                
                // Set downloadable blob to original file reference (to avoid delivering larger files)
                fetch(img.src).then(res => res.blob()).then(originalBlob => {
                    compressedBlob = originalBlob;
                });
            } else {
                const diff = originalSize - compSize;
                const percent = Math.round((diff / originalSize) * 100);
                savings.textContent = (diff / 1024).toFixed(1) + ' KB';
                percentage.textContent = percent + '%';
                banner.textContent = '🎉 Successfully compressed by ' + percent + '%!';
                banner.style.color = 'var(--success-color)';
            }
        }, 'image/jpeg', quality);
    }

    download.addEventListener('click', () => {
        if (!compressedBlob) return;
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_image.jpg';
        a.click();
        URL.revokeObjectURL(url);
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                draw();
                compress();
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
            };
        };
        reader.readAsDataURL(file);
    }
}
