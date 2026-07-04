export function init() {
    const dropzone = document.getElementById('gif-dropzone');
    const input = document.getElementById('gif-input');
    const loader = document.getElementById('gif-loader');
    const workspace = document.getElementById('gif-workspace');
    const framesCount = document.getElementById('gif-frames-count');
    const framesGrid = document.getElementById('gif-frames-grid');
    const reset = document.getElementById('gif-btn-reset');
    const downloadAll = document.getElementById('gif-btn-download');

    if (!input) return;
    let framesList = []; // Array of canvas references

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) process(e.target.files[0]);
    });

    reset.addEventListener('click', () => {
        input.value = '';
        framesList = [];
        framesGrid.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    downloadAll.addEventListener('click', async () => {
        if (framesList.length === 0) return;
        const zip = new JSZip();
        for (let i = 0; i < framesList.length; i++) {
            const dataUrl = framesList[i].toDataURL('image/png');
            const data = dataUrl.split(',')[1];
            zip.file('frame_' + (i+1) + '.png', data, { base64: true });
        }
        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'gif_frames.zip';
        a.click();
    });

    function process(file) {
        dropzone.style.display = 'none';
        loader.style.display = 'flex';
        framesList = [];
        framesGrid.innerHTML = '';

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const arrayBuffer = e.target.result;
                const gifReader = new gifuct.GifReader(new Uint8Array(arrayBuffer));
                const numFrames = gifReader.numFrames();
                const width = gifReader.width;
                const height = gifReader.height;

                framesCount.textContent = numFrames;

                // Temporary buffer to handle disposal modes between frames
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');

                for (let i = 0; i < numFrames; i++) {
                    const frameInfo = gifReader.frameInfo(i);
                    const imgData = tempCtx.createImageData(width, height);
                    
                    // Decodes raw LZW pixels directly into RGBA bytes
                    gifReader.decodeAndBlitFrameRGBA(i, imgData.data);
                    
                    const frameCanvas = document.createElement('canvas');
                    frameCanvas.width = width;
                    frameCanvas.height = height;
                    const frameCtx = frameCanvas.getContext('2d');
                    frameCtx.putImageData(imgData, 0, 0);

                    framesList.push(frameCanvas);

                    // Add to previews grid
                    const cell = document.createElement('div');
                    cell.style.textAlign = 'center';
                    cell.style.border = '1px solid var(--border-color)';
                    cell.style.borderRadius = 'var(--radius-sm)';
                    cell.style.padding = '0.5rem';
                    cell.style.background = 'var(--bg-primary)';

                    const preview = document.createElement('img');
                    preview.src = frameCanvas.toDataURL('image/png');
                    preview.style.maxWidth = '100%';
                    preview.style.height = '60px';
                    preview.style.objectFit = 'contain';

                    const label = document.createElement('div');
                    label.textContent = '#' + (i + 1);
                    label.style.fontSize = '0.75rem';
                    label.style.fontWeight = 'bold';
                    label.style.margin = '0.25rem 0';

                    const dlLink = document.createElement('a');
                    dlLink.href = preview.src;
                    dlLink.download = 'frame_' + (i+1) + '.png';
                    dlLink.textContent = 'Save';
                    dlLink.style.fontSize = '0.7rem';
                    dlLink.style.color = 'var(--primary-color)';
                    dlLink.style.fontWeight = '600';

                    cell.appendChild(preview);
                    cell.appendChild(label);
                    cell.appendChild(dlLink);
                    framesGrid.appendChild(cell);
                }

                loader.style.display = 'none';
                workspace.style.display = 'flex';
            } catch (err) {
                alert('Failed to parse animated GIF. File may be corrupt or standard format violated.');
                loader.style.display = 'none';
                dropzone.style.display = 'flex';
            }
        };
        reader.readAsArrayBuffer(file);
    }
}
