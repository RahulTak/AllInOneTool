export function init() {
    const textarea = document.getElementById('html-val');
    const previewBtn = document.getElementById('html-btn-preview');
    const iframe = document.getElementById('html-preview-frame');
    const action = document.getElementById('html-btn-action');

    if (!textarea) return;

    // Set sample HTML template
    textarea.value = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #333; }
    h1 { color: #2563eb; }
    p { line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>Interactive HTML Document</h1>
  <p>This PDF was generated client-side from formatted HTML text code inputs.</p>
  <table>
    <tr><th>Item Name</th><th>Quantity</th><th>Unit Price</th></tr>
    <tr><td>Product Alpha</td><td>2</td><td>$45.00</td></tr>
    <tr><td>Product Beta</td><td>1</td><td>$99.00</td></tr>
  </table>
</body>
</html>`;

    updatePreview();

    previewBtn.addEventListener('click', updatePreview);

    function updatePreview() {
        iframe.srcdoc = textarea.value;
    }

    action.addEventListener('click', () => {
        const val = textarea.value;
        if (!val.trim()) return;

        // Render HTML element compilation via html2pdf library
        const element = iframe.contentDocument.body || iframe.contentWindow.document.documentElement;
        const opt = {
            margin:       0.5,
            filename:     'html_converted.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });
}
