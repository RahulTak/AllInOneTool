export function init() {
    const loadingBlock = document.getElementById('unlock-loading');
    const dropzone = document.getElementById('unlock-dropzone');
    const input = document.getElementById('unlock-input');
    const workspace = document.getElementById('unlock-workspace');
    const fileName = document.getElementById('unlock-file-name');
    const passInput = document.getElementById('unlock-pass');
    const reset = document.getElementById('unlock-btn-reset');
    const action = document.getElementById('unlock-btn-action');

    if (!input) return;
    let pdfBytes = null;
    let isLoading = false;

    checkLibs();

    async function loadScriptText(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load ' + url);
        return await res.text();
    }

    async function loadSecureLibraries() {
        if (window.exports && window.exports.encryptPDF && window.exports.decryptPDF) {
            return;
        }
        const urls = [
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-encrypt-lite@1.0.2/dist/crypto-minimal.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-encrypt-lite@1.0.2/dist/pdf-encrypt.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-encrypt-lite@1.0.2/dist/index.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-decrypt@1.0.1/dist/crypto-rc4.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-decrypt@1.0.1/dist/crypto-aes.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-decrypt@1.0.1/dist/pdf-decrypt.js',
            'https://cdn.jsdelivr.net/npm/@pdfsmaller/pdf-decrypt@1.0.1/dist/index.js'
        ];

        const localExports = {};
        const localModule = { exports: localExports };
        const localRequire = function(moduleName) {
            if (moduleName === 'pdf-lib') return window.PDFLib;
            return localExports;
        };

        for (const url of urls) {
            const code = await loadScriptText(url);
            const fn = new Function('exports', 'module', 'require', code);
            fn(localExports, localModule, localRequire);
        }

        window.exports = window.exports || {};
        Object.assign(window.exports, localExports, localModule.exports);
    }

    async function checkLibs() {
        if (window.exports && window.exports.encryptPDF && window.exports.decryptPDF) {
            loadingBlock.style.display = 'none';
            dropzone.style.display = 'flex';
            action.disabled = false;
            return;
        }
        if (isLoading) return;
        isLoading = true;
        try {
            await loadSecureLibraries();
            loadingBlock.style.display = 'none';
            dropzone.style.display = 'flex';
            action.disabled = false;
        } catch (err) {
            console.error(err);
            loadingBlock.querySelector('span').textContent = 'Error initializing secure handler: ' + err.message;
        }
    }

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
        if (!pass) {
            alert('Please enter the password to unlock this document.');
            return;
        }

        try {
            const isEncrypted = exports.isEncrypted ? exports.isEncrypted(pdfBytes) : true;
            if (!isEncrypted) {
                alert('This document does not appear to be encrypted/password protected.');
                return;
            }

            const decrypted = await exports.decryptPDF(pdfBytes, pass);
            const blob = new Blob([decrypted], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'unlocked_document.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            const msg = err.message || '';
            if (msg.includes('corrupt') || msg.includes('header')) {
                alert('Error: The uploaded file is corrupted or not a valid PDF.');
            } else if (msg.includes('supported')) {
                alert('Error: Unsupported encryption algorithm format.');
            } else {
                alert('Incorrect password. Please verify and try again.');
            }
        }
    });
}
