export function init() {
    const dropzone = document.getElementById('wm-dropzone');
    const input = document.getElementById('wm-input');
    const workspace = document.getElementById('wm-workspace');
    const fileName = document.getElementById('wm-file-name');
    const typeSelect = document.getElementById('wm-type');
    const textBlock = document.getElementById('wm-text-block');
    const textInput = document.getElementById('wm-text');
    const imageBlock = document.getElementById('wm-image-block');
    const imageInput = document.getElementById('wm-image');
    const posSelect = document.getElementById('wm-pos');
    const opacitySelect = document.getElementById('wm-opacity');
    const rotateSelect = document.getElementById('wm-rotate');
    const colorBlock = document.getElementById('wm-color-block');
    const colorInput = document.getElementById('wm-color');
    const reset = document.getElementById('wm-btn-reset');
    const action = document.getElementById('wm-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let imgDataUrl = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            process(file);
        }
    });

    typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'text') {
            textBlock.style.display = 'block';
            colorBlock.style.display = 'block';
            imageBlock.style.display = 'none';
        } else {
            textBlock.style.display = 'none';
            colorBlock.style.display = 'none';
            imageBlock.style.display = 'block';
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgDataUrl = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        imageInput.value = '';
        pdfBytes = null;
        imgDataUrl = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        dropzone.style.display = 'none';
        workspace.style.display = 'flex';
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = doc.getPages();

            const isText = typeSelect.value === 'text';
            const opacity = parseFloat(opacitySelect.value) || 0.4;
            const rotateDeg = parseInt(rotateSelect.value) || 0;
            const pos = posSelect.value;

            let imageRef = null;
            if (!isText && imgDataUrl) {
                const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
                if (imgDataUrl.includes('image/png')) {
                    imageRef = await doc.embedPng(imgBytes);
                } else {
                    imageRef = await doc.embedJpg(imgBytes);
                }
            }

            for (const page of pages) {
                const { width, height } = page.getSize();
                
                let x = width / 2;
                let y = height / 2;

                if (pos === 'top-left') { x = 60; y = height - 60; }
                else if (pos === 'top-right') { x = width - 150; y = height - 60; }
                else if (pos === 'bottom-left') { x = 60; y = 60; }
                else if (pos === 'bottom-right') { x = width - 150; y = 60; }

                if (isText) {
                    const hexColor = colorInput.value;
                    const r = parseInt(hexColor.slice(1,3), 16) / 255;
                    const g = parseInt(hexColor.slice(3,5), 16) / 255;
                    const b = parseInt(hexColor.slice(5,7), 16) / 255;

                    page.drawText(textInput.value || 'COPYRIGHT', {
                        x,
                        y,
                        size: 36,
                        opacity,
                        color: PDFLib.rgb(r, g, b),
                        rotate: PDFLib.degrees(rotateDeg)
                    });
                } else if (imageRef) {
                    const imgW = 120;
                    const imgH = 60;
                    page.drawImage(imageRef, {
                        x: x - imgW / 2,
                        y: y - imgH / 2,
                        width: imgW,
                        height: imgH,
                        opacity
                    });
                }
            }

            const stamped = await doc.save();
            const blob = new Blob([stamped], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'watermarked_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Failed to stamp watermark onto PDF.');
        }
    });
}
