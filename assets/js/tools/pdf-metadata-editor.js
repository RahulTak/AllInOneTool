export function init() {
    const dropzone = document.getElementById('meta-dropzone');
    const input = document.getElementById('meta-input');
    const workspace = document.getElementById('meta-workspace');
    const fileName = document.getElementById('meta-file-name');
    const titleInput = document.getElementById('meta-title');
    const authorInput = document.getElementById('meta-author');
    const subjectInput = document.getElementById('meta-subject');
    const keywordsInput = document.getElementById('meta-keywords');
    const creatorInput = document.getElementById('meta-creator');
    const producerInput = document.getElementById('meta-producer');
    const reset = document.getElementById('meta-btn-reset');
    const action = document.getElementById('meta-btn-action');

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
        pdfBytes = null;
        workspace.style.display = 'none';
        dropzone.style.display = 'flex';
    });

    async function process(file) {
        pdfBytes = await file.arrayBuffer();
        
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            titleInput.value = doc.getTitle() || '';
            authorInput.value = doc.getAuthor() || '';
            subjectInput.value = doc.getSubject() || '';
            keywordsInput.value = (doc.getKeywords() || '').split(';').join(', ');
            creatorInput.value = doc.getCreator() || 'AllInOneTool';
            producerInput.value = doc.getProducer() || 'pdf-lib (v1.17.1)';

            dropzone.style.display = 'none';
            workspace.style.display = 'flex';
        } catch (err) {
            alert('Failed to load PDF metadata.');
        }
    }

    action.addEventListener('click', async () => {
        if (!pdfBytes) return;
        try {
            const doc = await PDFLib.PDFDocument.load(pdfBytes);
            doc.setTitle(titleInput.value);
            doc.setAuthor(authorInput.value);
            doc.setSubject(subjectInput.value);
            
            const kwArray = keywordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            doc.setKeywords(kwArray);

            const savedBytes = await doc.save();
            const blob = new Blob([savedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'updated_metadata.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to save metadata.');
        }
    });
}
