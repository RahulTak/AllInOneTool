export function init() {
    const input = document.getElementById('ua-input');
    const parseBtn = document.getElementById('ua-btn-parse');
    const currentBtn = document.getElementById('ua-btn-current');
    const resetBtn = document.getElementById('ua-btn-reset');
    const results = document.getElementById('ua-results');
    const container = document.getElementById('ua-details-container');

    if (!parseBtn) return;

    function renderRow(label, value) {
        return `
            <div style="display:grid; grid-template-columns:2fr 4fr; gap:1rem; padding:0.4rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                <strong style="color:var(--text-secondary); text-transform:capitalize;">${label}</strong>
                <span style="font-family:var(--font-mono); word-break:break-all;">${value || 'Unknown'}</span>
            </div>
        `;
    }

    function parse() {
        const ua = input.value.trim();
        if (!ua) return;

        let browser = "Unknown";
        let version = "Unknown";
        let os = "Unknown";
        let osVer = "Unknown";
        let device = "Desktop";
        let engine = "Unknown";
        let platform = "Unknown";

        if (/mobi|android|iphone|ipod/i.test(ua)) {
            device = "Mobile";
        } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
            device = "Tablet";
        }

        if (/windows/i.test(ua)) {
            os = "Windows";
            const match = ua.match(/Windows NT ([\d.]+)/i);
            osVer = match ? match[1] : "Unknown";
            platform = "Windows";
        } else if (/macintosh|mac os x/i.test(ua)) {
            os = "macOS";
            const match = ua.match(/Mac OS X ([\d_.]+)/i);
            osVer = match ? match[1].replace(/_/g, '.') : "Unknown";
            platform = "MacIntel";
        } else if (/iphone|ipad|ipod/i.test(ua)) {
            os = "iOS";
            const match = ua.match(/OS ([\d_.]+)/i);
            osVer = match ? match[1].replace(/_/g, '.') : "Unknown";
            device = /ipad/i.test(ua) ? "Tablet" : "Mobile";
            platform = "Apple Devices";
        } else if (/android/i.test(ua)) {
            os = "Android";
            const match = ua.match(/Android ([\d.]+)/i);
            osVer = match ? match[1] : "Unknown";
            platform = "Linux";
        } else if (/linux/i.test(ua)) {
            os = "Linux";
            platform = "Linux";
        }

        if (/edg\/([\d.]+)/i.test(ua)) {
            browser = "Edge";
            version = ua.match(/edg\/([\d.]+)/i)[1];
        } else if (/chrome\/([\d.]+)/i.test(ua)) {
            browser = "Chrome";
            version = ua.match(/chrome\/([\d.]+)/i)[1];
        } else if (/firefox\/([\d.]+)/i.test(ua)) {
            browser = "Firefox";
            version = ua.match(/firefox\/([\d.]+)/i)[1];
        } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
            browser = "Safari";
            const match = ua.match(/version\/([\d.]+)/i);
            version = match ? match[1] : "Unknown";
        } else if (/trident/i.test(ua)) {
            browser = "Internet Explorer";
            const match = ua.match(/rv:([\d.]+)/i);
            version = match ? match[1] : "Unknown";
        }

        if (/applewebkit/i.test(ua)) {
            engine = "WebKit";
            if (/chrome|edg/i.test(ua)) {
                engine = "Blink";
            }
        } else if (/gecko/i.test(ua)) {
            engine = "Gecko";
        } else if (/trident/i.test(ua)) {
            engine = "Trident";
        }

        let html = '';
        html += renderRow('Browser', browser);
        html += renderRow('Browser Version', version);
        html += renderRow('Operating System', os);
        html += renderRow('OS Version', osVer);
        html += renderRow('Device Type', device);
        html += renderRow('Rendering Engine', engine);
        html += renderRow('Platform', platform);

        container.innerHTML = html;
        results.style.display = 'block';
    }

    parseBtn.addEventListener('click', parse);

    currentBtn.addEventListener('click', () => {
        input.value = navigator.userAgent;
        parse();
    });

    resetBtn.addEventListener('click', () => {
        input.value = '';
        results.style.display = 'none';
    });
}
