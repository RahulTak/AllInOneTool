export function init() {
    const container = document.getElementById('red-chain-container');
    const addHopBtn = document.getElementById('red-add-hop');
    const analysis = document.getElementById('red-analysis');
    const flow = document.getElementById('red-visual-flow');
    const checklists = document.getElementById('red-checklists');

    if (!container) return;

    let hops = [];

    function render() {
        if (hops.length === 0) {
            analysis.style.display = 'none';
            return;
        }

        analysis.style.display = 'block';

        let flowHtml = '';
        hops.forEach((h, idx) => {
            const urlText = h.url.trim() || '(Empty URL)';
            flowHtml += `<div style="padding:0.5rem; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-sm);">${urlText}</div>`;
            if (idx < hops.length - 1) {
                flowHtml += `<div style="color:var(--accent-color); font-weight:700;">-- ${h.code} --></div>`;
            }
        });
        flow.innerHTML = flowHtml;

        let checks = [];
        let isLoop = false;
        const visitedUrls = new Set();
        
        for (let i = 0; i < hops.length; i++) {
            const u = hops[i].url.trim().toLowerCase();
            if (u) {
                if (visitedUrls.has(u)) {
                    isLoop = true;
                    break;
                }
                visitedUrls.add(u);
            }
        }

        if (isLoop) {
            checks.push(`<span style="color:var(--error-color); font-weight:700;">⚠️ REDIRECT LOOP DETECTED:</span> Infinite loop identified. Search engine crawlers will drop this request and fail indexation.`);
        } else {
            checks.push(`<span style="color:var(--success-color); font-weight:700;">✅ No Loops:</span> Redirect chain terminates successfully.`);
        }

        if (hops.length > 5) {
            checks.push(`<span style="color:var(--error-color); font-weight:700;">⚠️ CHAIN TOO LONG:</span> Chain has ${hops.length} hops. Search engines (like Google) follow at most 5 redirection hops before failing.`);
        } else {
            checks.push(`<span style="color:var(--success-color); font-weight:700;">✅ Length OK:</span> Chain has ${hops.length} hops (under maximum limit of 5).`);
        }

        let isDowngrade = false;
        for (let i = 0; i < hops.length - 1; i++) {
            const current = hops[i].url.trim().toLowerCase();
            const next = hops[i+1].url.trim().toLowerCase();
            if (current.startsWith('https://') && next.startsWith('http://')) {
                isDowngrade = true;
            }
        }
        if (isDowngrade) {
            checks.push(`<span style="color:var(--error-color); font-weight:700;">⚠️ SECURITY DOWNGRADE:</span> Redirect redirects secure HTTPS to insecure HTTP. Vulnerable to interception.`);
        } else {
            checks.push(`<span style="color:var(--success-color); font-weight:700;">✅ Protocol Security:</span> Redirection contains no HTTPS-to-HTTP downgrades.`);
        }

        checklists.innerHTML = checks.map(c => `<div style="padding:0.4rem 0;">${c}</div>`).join('');
    }

    function addHopRow(urlVal = '', codeVal = '301') {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        row.style.alignItems = 'center';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.className = 'input-control';
        urlInput.style.flex = '1';
        urlInput.placeholder = 'https://example.com/target-path';
        urlInput.value = urlVal;

        const codeSel = document.createElement('select');
        codeSel.className = 'input-control';
        codeSel.style.width = '140px';
        codeSel.innerHTML = `
            <option value="301">301 Permanent</option>
            <option value="302">302 Found</option>
            <option value="307">307 Temporary</option>
            <option value="308">308 Permanent</option>
            <option value="200">200 OK (End)</option>
        `;
        codeSel.value = codeVal;

        const remBtn = document.createElement('button');
        remBtn.className = 'btn btn-secondary';
        remBtn.textContent = '✖';
        remBtn.type = 'button';

        row.appendChild(urlInput);
        row.appendChild(codeSel);
        row.appendChild(remBtn);
        container.appendChild(row);

        const hopObj = { url: urlVal, code: codeVal };
        hops.push(hopObj);

        const update = () => {
            hopObj.url = urlInput.value;
            hopObj.code = codeSel.value;
            render();
        };

        urlInput.addEventListener('input', update);
        codeSel.addEventListener('change', update);
        remBtn.addEventListener('click', () => {
            row.remove();
            hops = hops.filter(h => h !== hopObj);
            render();
        });

        render();
    }

    addHopBtn.addEventListener('click', () => addHopRow());

    addHopRow('http://example.com/', '301');
    addHopRow('https://example.com/', '302');
    addHopRow('https://example.com/landing', '200');
    render();
}
