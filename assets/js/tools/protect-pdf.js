export function init() {
    const dropzone = document.getElementById('protect-dropzone');
    const input = document.getElementById('protect-input');
    const workspace = document.getElementById('protect-workspace');
    const fileName = document.getElementById('protect-file-name');
    const passInput = document.getElementById('protect-pass');
    const passConfirm = document.getElementById('protect-pass-confirm');
    const reset = document.getElementById('protect-btn-reset');
    const action = document.getElementById('protect-btn-action');

    if (!input) return;
    let pdfBytes = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        passInput.value = '';
        passConfirm.value = '';
        pdfBytes = null;
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
        const pass = passInput.value;
        const confirm = passConfirm.value;

        if (!pass) {
            alert('Please enter a password.');
            return;
        }
        if (pass !== confirm) {
            alert('Passwords do not match. Please verify.');
            return;
        }

        try {
            if (typeof exports === 'undefined' || !exports.encryptPDF) {
                alert('Encryption libraries are still loading. Please try again.');
                return;
            }
            
            // Call exports.encryptPDF from our loaded CDN bundle
            const encrypted = await exports.encryptPDF(pdfBytes, pass);
            const blob = new Blob([encrypted], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'protected_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to encrypt PDF: ' + err.message);
        }
    });
}
