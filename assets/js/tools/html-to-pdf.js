export function init() {
    const textarea = document.getElementById('html-val');
    const previewBtn = document.getElementById('html-btn-preview');
    const renderContainer = document.getElementById('html-render-container');
    const action = document.getElementById('html-btn-action');

    if (!textarea || !renderContainer) return;

    // Set sample HTML template
    textarea.value = `<h1>Hello World</h1>
<p>This is a PDF test generated directly from client-side HTML.</p>
<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>
<table style="width:100%; border-collapse:collapse; margin-top:15px;">
  <thead>
    <tr style="background:#f1f5f9;">
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Item Name</th>
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Quantity</th>
      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Unit Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px;">Product Alpha</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">2</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">$45.00</td>
    </tr>
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px;">Product Beta</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">1</td>
      <td style="border:1px solid #cbd5e1; padding:8px;">$99.00</td>
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

        // Wait for all images inside render container to complete loading
        const images = Array.from(renderContainer.querySelectorAll('img'));
        if (images.length > 0) {
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(res => {
                    img.onload = res;
                    img.onerror = res;
                });
            }));
        }

        // Brief delay to allow DOM styles and web fonts to settle
        await new Promise(res => setTimeout(res, 150));

        action.disabled = true;
        action.textContent = 'Generating PDF...';

        try {
            const opt = {
                margin:       [0.4, 0.4, 0.4, 0.4],
                filename:     'html_converted.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(renderContainer).save();
        } catch (err) {
            alert('Failed to generate PDF from HTML: ' + err.message);
        } finally {
            action.disabled = false;
            action.textContent = 'Compile HTML to PDF';
        }
    });
}
