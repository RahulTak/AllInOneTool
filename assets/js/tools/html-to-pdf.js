export function init() {
    const textarea = document.getElementById('html-val');
    const previewBtn = document.getElementById('html-btn-preview');
    const renderContainer = document.getElementById('html-render-container');
    const action = document.getElementById('html-btn-action');

    if (!textarea || !renderContainer || !action) return;

    // Set sample HTML template
    textarea.value = `<h1>Hello World</h1>
<p>This is a PDF test generated directly from client-side HTML.</p>
<p>Item One</p>
<p>Item Two</p>
<table style="width:100%; border-collapse:collapse; margin-top:15px;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th style="border:1px solid #cbd5e1; padding:8px 12px; text-align:left;">Item Name</th>
      <th style="border:1px solid #cbd5e1; padding:8px 12px; text-align:left;">Quantity</th>
      <th style="border:1px solid #cbd5e1; padding:8px 12px; text-align:left;">Unit Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">Product Alpha</td>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">2</td>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">$45.00</td>
    </tr>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">Product Beta</td>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">1</td>
      <td style="border:1px solid #cbd5e1; padding:8px 12px;">$99.00</td>
    </tr>
  </tbody>
</table>`;

    updatePreview();

    textarea.addEventListener('input', updatePreview);
    previewBtn.addEventListener('click', updatePreview);

    function updatePreview() {
        renderContainer.innerHTML = textarea.value;
    }

    action.addEventListener('click', async () => {
        const val = textarea.value;
        if (!val.trim()) {
            alert('Please enter HTML code before compiling to PDF.');
            return;
        }

        updatePreview();

        // 1. Verify actual preview DOM element is populated
        if (!renderContainer.innerHTML.trim() || (!renderContainer.firstElementChild && !renderContainer.textContent.trim())) {
            alert('Preview container is empty. Please enter valid HTML.');
            return;
        }

        // 2. Wait for all images inside render container to complete loading
        const images = Array.from(renderContainer.querySelectorAll('img'));
        if (images.length > 0) {
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(res => {
                    img.onload = res;
                    img.onerror = () => {
                        console.warn('Image failed to load or blocked by CORS:', img.src);
                        res();
                    };
                    setTimeout(res, 3000); // 3s timeout guard
                });
            }));
        }

        // 3. Wait for web fonts if available
        if (document.fonts && document.fonts.ready) {
            try {
                await document.fonts.ready;
            } catch (e) {
                // Ignore font ready errors
            }
        }

        // Brief delay to allow layout calculation
        await new Promise(res => setTimeout(res, 100));

        action.disabled = true;
        action.textContent = 'Generating PDF...';

        // 4. Save scroll and style states
        const prevScrollX = window.scrollX || window.pageXOffset || 0;
        const prevScrollY = window.scrollY || window.pageYOffset || 0;
        const origOverflowY = renderContainer.style.overflowY;
        const origOverflow = renderContainer.style.overflow;
        const origMaxHeight = renderContainer.style.maxHeight;
        const origHeight = renderContainer.style.height;
        const origBorder = renderContainer.style.border;

        try {
            // Scroll to top to eliminate html2canvas scroll offset blank region bug
            window.scrollTo(0, 0);

            // Temporarily unconstrain renderContainer so html2canvas captures full content without scroll clipping
            renderContainer.style.overflowY = 'visible';
            renderContainer.style.overflow = 'visible';
            renderContainer.style.maxHeight = 'none';
            renderContainer.style.height = 'auto';
            renderContainer.style.border = 'none';

            const opt = {
                margin:       [0.4, 0.4, 0.4, 0.4],
                filename:     'html_converted.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                    scrollX: 0,
                    logging: false,
                    backgroundColor: '#ffffff'
                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Generate the PDF blob and validate it is non-empty before downloading
            let pdfBlob = null;
            try {
                pdfBlob = await new Promise((resolve, reject) => {
                    html2pdf()
                        .set(opt)
                        .from(renderContainer)
                        .toPdf()
                        .outputPdf('blob')
                        .then(resolve)
                        .catch(reject);
                });
            } catch (workerErr) {
                // Fallback to output('blob') if outputPdf is unavailable
                pdfBlob = await new Promise((resolve, reject) => {
                    html2pdf()
                        .set(opt)
                        .from(renderContainer)
                        .output('blob')
                        .then(resolve)
                        .catch(reject);
                });
            }

            if (!pdfBlob || pdfBlob.size < 500) {
                throw new Error('Generated PDF file is empty or invalid.');
            }

            // Download the verified PDF Blob
            const downloadUrl = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'html_converted.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
        } catch (err) {
            console.error('HTML to PDF compilation error:', err);
            alert('Failed to generate PDF from HTML: ' + err.message);
        } finally {
            // Always restore original container styles and window scroll
            renderContainer.style.overflowY = origOverflowY;
            renderContainer.style.overflow = origOverflow;
            renderContainer.style.maxHeight = origMaxHeight;
            renderContainer.style.height = origHeight;
            renderContainer.style.border = origBorder;
            window.scrollTo(prevScrollX, prevScrollY);

            action.disabled = false;
            action.textContent = 'Compile HTML to PDF';
        }
    });
}
