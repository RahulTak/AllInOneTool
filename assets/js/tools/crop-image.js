export function init() {
    const dropzone = document.getElementById('crop-dropzone');
    const input = document.getElementById('crop-input');
    const workspace = document.getElementById('crop-workspace');
    const wrapper = document.getElementById('crop-wrapper');
    const img = document.getElementById('crop-target-img');
    const cropBox = document.getElementById('crop-box');
    const aspectSelect = document.getElementById('crop-aspect');
    const previewCanvas = document.getElementById('crop-preview-canvas');
    const reset = document.getElementById('crop-btn-reset');
    const action = document.getElementById('crop-btn-action');

    if (!input) return;

    let naturalW = 0, naturalH = 0;
    let dragMode = null; // 'move', 'tl', 'tr', 'bl', 'br'
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0, startWidth = 0, startHeight = 0;

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    aspectSelect.addEventListener('change', () => {
        applyAspect();
        updatePreview();
    });

    function applyAspect() {
        const aspect = aspectSelect.value;
        const rect = wrapper.getBoundingClientRect();
        let w = rect.width * 0.8;
        let h = rect.height * 0.8;

        if (aspect === '1:1') {
            const size = Math.min(w, h);
            w = size;
            h = size;
        } else if (aspect === '16:9') {
            h = w * (9/16);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (16/9);
            }
        } else if (aspect === '4:3') {
            h = w * (3/4);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (4/3);
            }
        } else if (aspect === '3:2') {
            h = w * (2/3);
            if (h > rect.height) {
                h = rect.height * 0.8;
                w = h * (3/2);
            }
        }

        cropBox.style.width = Math.round(w) + 'px';
        cropBox.style.height = Math.round(h) + 'px';
        cropBox.style.left = Math.round((rect.width - w) / 2) + 'px';
        cropBox.style.top = Math.round((rect.height - h) / 2) + 'px';
    }

    // Drag / Resize bindings
    cropBox.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    // Touch support
    cropBox.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', stopDrag);

    function startDrag(e) {
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const target = e.target;
        if (target.classList.contains('crop-handle')) {
            dragMode = target.getAttribute('data-handle');
        } else {
            dragMode = 'move';
        }

        startX = clientX;
        startY = clientY;
        startLeft = parseFloat(cropBox.style.left) || 0;
        startTop = parseFloat(cropBox.style.top) || 0;
        startWidth = parseFloat(cropBox.style.width) || 0;
        startHeight = parseFloat(cropBox.style.height) || 0;
    }

    function drag(e) {
        if (!dragMode) return;
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const dx = clientX - startX;
        const dy = clientY - startY;

        const rect = wrapper.getBoundingClientRect();
        const maxW = rect.width;
        const maxH = rect.height;

        let left = startLeft;
        let top = startTop;
        let w = startWidth;
        let h = startHeight;

        if (dragMode === 'move') {
            left = Math.max(0, Math.min(maxW - w, startLeft + dx));
            top = Math.max(0, Math.min(maxH - h, startTop + dy));
        } else {
            const aspect = aspectSelect.value;
            let ratio = null;
            if (aspect === '1:1') ratio = 1;
            else if (aspect === '16:9') ratio = 16/9;
            else if (aspect === '4:3') ratio = 4/3;
            else if (aspect === '3:2') ratio = 3/2;

            if (dragMode === 'br') {
                w = Math.max(30, Math.min(maxW - left, startWidth + dx));
                h = ratio ? w / ratio : Math.max(30, Math.min(maxH - top, startHeight + dy));
                if (ratio && h + top > maxH) {
                    h = maxH - top;
                    w = h * ratio;
                }
            } else if (dragMode === 'bl') {
                const newLeft = Math.max(0, Math.min(startLeft + startWidth - 30, startLeft + dx));
                w = startLeft + startWidth - newLeft;
                h = ratio ? w / ratio : Math.max(30, Math.min(maxH - top, startHeight + dy));
                if (ratio && h + top > maxH) {
                    h = maxH - top;
                    w = h * ratio;
                    left = startLeft + startWidth - w;
                } else {
                    left = newLeft;
                }
            } else if (dragMode === 'tr') {
                const newTop = Math.max(0, Math.min(startTop + startHeight - 30, startTop + dy));
                h = startTop + startHeight - newTop;
                w = ratio ? h * ratio : Math.max(30, Math.min(maxW - left, startWidth + dx));
                if (ratio && w + left > maxW) {
                    w = maxW - left;
                    h = w / ratio;
                    top = startTop + startHeight - h;
                } else {
                    top = newTop;
                }
            } else if (dragMode === 'tl') {
                const newLeft = Math.max(0, Math.min(startLeft + startWidth - 30, startLeft + dx));
                const newTop = Math.max(0, Math.min(startTop + startHeight - 30, startTop + dy));
                
                if (ratio) {
                    w = startLeft + startWidth - newLeft;
                    h = w / ratio;
                    if (startTop + startHeight - h < 0) {
                        h = startTop + startHeight;
                        w = h * ratio;
                    }
                    left = startLeft + startWidth - w;
                    top = startTop + startHeight - h;
                } else {
                    w = startLeft + startWidth - newLeft;
                    h = startTop + startHeight - newTop;
                    left = newLeft;
                    top = newTop;
                }
            }
        }

        cropBox.style.left = Math.round(left) + 'px';
        cropBox.style.top = Math.round(top) + 'px';
        cropBox.style.width = Math.round(w) + 'px';
        cropBox.style.height = Math.round(h) + 'px';

        updatePreview();
    }

    function stopDrag() {
        dragMode = null;
    }

    function updatePreview() {
        if (!img.src) return;
        const rect = wrapper.getBoundingClientRect();
        const left = parseFloat(cropBox.style.left) || 0;
        const top = parseFloat(cropBox.style.top) || 0;
        const w = parseFloat(cropBox.style.width) || rect.width;
        const h = parseFloat(cropBox.style.height) || rect.height;

        const scaleX = naturalW / rect.width;
        const scaleY = naturalH / rect.height;

        const cropX = left * scaleX;
        const cropY = top * scaleY;
        const cropW = w * scaleX;
        const cropH = h * scaleY;

        previewCanvas.width = cropW;
        previewCanvas.height = cropH;
        const ctx = previewCanvas.getContext('2d');
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    }

    action.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = previewCanvas.toDataURL('image/png');
        a.download = 'cropped_output.png';
        a.click();
    });

    function process(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                naturalW = img.naturalWidth;
                naturalH = img.naturalHeight;
                dropzone.style.display = 'none';
                workspace.style.display = 'flex';
                applyAspect();
                setTimeout(updatePreview, 100);
            };
        };
        reader.readAsDataURL(file);
    }
}
