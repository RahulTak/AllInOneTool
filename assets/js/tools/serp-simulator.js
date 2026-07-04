export function init() {
    const title = document.getElementById('serp-title');
    const desc = document.getElementById('serp-desc');
    const url = document.getElementById('serp-url');
    
    const pTitle = document.getElementById('preview-title');
    const pDesc = document.getElementById('preview-desc');
    const pUrl = document.getElementById('preview-url');

    const titleCount = document.getElementById('serp-title-counter');
    const descCount = document.getElementById('serp-desc-counter');

    if (!title) return;

    function render() {
        const tVal = title.value;
        const dVal = desc.value;
        const uVal = url.value;

        pTitle.textContent = tVal.slice(0, 60) + (tVal.length > 60 ? '...' : '');
        pDesc.textContent = dVal.slice(0, 160) + (dVal.length > 160 ? '...' : '');
        pUrl.textContent = uVal;

        titleCount.textContent = 'Length: ' + tVal.length + ' / 60';
        titleCount.style.color = tVal.length > 60 ? 'var(--error-color)' : 'var(--text-secondary)';

        descCount.textContent = 'Length: ' + dVal.length + ' / 160';
        descCount.style.color = dVal.length > 160 ? 'var(--error-color)' : 'var(--text-secondary)';
    }

    [title, desc, url].forEach(el => el.addEventListener('input', render));
    render();
}
