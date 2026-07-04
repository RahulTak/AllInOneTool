export function init() {
    const dropzone = document.getElementById('word-dropzone');
    const input = document.getElementById('word-input');
    const loader = document.getElementById('word-loader');
    const workspace = document.getElementById('word-workspace');
    const fileName = document.getElementById('word-file-name');
    const fileSize = document.getElementById('word-file-size');
    const previewContainer = document.getElementById('word-preview-container');
    const reset = document.getElementById('word-btn-reset');
    const action = document.getElementById('word-btn-action');

    if (!input) return;
    let fileBuffer = null;

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            process(file);
        }
    });

    reset.addEventListener('click', () => {
        input.value = '';
        fileBuffer = null;
        previewContainer.innerHTML = '';
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
        loader.style.display = 'none';
    });

    async function process(file) {
        const nameLower = file.name.toLowerCase();
        if (nameLower.endsWith('.doc')) {
            alert('Legacy .doc formats are not supported. Please upload modern .docx documents.');
            input.value = '';
            return;
        }
        if (!nameLower.endsWith('.docx')) {
            alert('Please select a valid Microsoft Word (.docx) document.');
            input.value = '';
            return;
        }

        dropzone.style.display = 'none';
        loader.style.display = 'flex';

        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';

        const reader = new FileReader();
        reader.onload = function(e) {
            fileBuffer = e.target.result;
            mammoth.convertToHtml({ arrayBuffer: fileBuffer })
                .then(function(result) {
                    previewContainer.innerHTML = result.value || '<p>No readable text content found in document.</p>';
                    loader.style.display = 'none';
                    workspace.style.display = 'flex';
                })
                .catch(function(err) {
                    alert('Error parsing Word document: ' + err.message);
                    reset.click();
                });
        };
        reader.readAsArrayBuffer(file);
    }

    action.addEventListener('click', () => {
        if (!previewContainer.innerHTML) return;
        
        loader.style.display = 'flex';
        workspace.style.display = 'none';

        const opt = {
            margin:       0.5,
            filename:     'word_converted.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const clone = previewContainer.cloneNode(true);
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.height = 'auto';

        html2pdf().set(opt).from(clone).save().then(() => {
            loader.style.display = 'none';
            workspace.style.display = 'flex';
        }).catch(err => {
            alert('Failed to compile PDF: ' + err.message);
            loader.style.display = 'none';
            workspace.style.display = 'flex';
        });
    });
}
