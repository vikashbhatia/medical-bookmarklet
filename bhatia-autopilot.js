(async function() {
    const TARGET_URL = 'crm.gudmed.in/amazoneRxDetails/patDetails';
    
    // 1. THE CLEANER: Kills all Bhatia UI elements instantly
    const purgeUI = () => {
        document.querySelectorAll('.vb-ui-element, #diag-float-box, #vb-sync-host, #vb-status-host, #nb-cont, [id^="vb-"]').forEach(el => el.remove());
    };

    // 2. THE CHECKER: Returns true only if we are on the specific patient page
    const isTargetPage = () => window.location.href.includes(TARGET_URL);

    // 3. SHADOW DOM TOAST SYSTEM
    const showToast = (msg, isSync = false) => {
        if (!isTargetPage()) return; 
        const id = isSync ? 'vb-sync-host' : 'vb-status-host';
        let host = document.getElementById(id);
        if (!host) {
            host = document.createElement('div');
            host.id = id;
            host.className = 'vb-ui-element';
            document.body.appendChild(host);
        }
        const shadow = host.shadowRoot || host.attachShadow({mode: 'open'});
        const bgColor = isSync ? '#0087ff' : '#00E676';
        
        shadow.innerHTML = `
        <style>
            .toast {
                position: fixed; top: ${isSync ? '70px' : '20px'}; right: 20px;
                background: ${bgColor}; color: #000; padding: 8px 14px;
                border-radius: 8px; font-family: sans-serif; font-size: 12px; font-weight: 800;
                z-index: 2147483647; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                display: flex; align-items: center; gap: 8px;
                transform: translateX(150%); transition: transform 0.4s ease-out;
            }
            .visible { transform: translateX(0); }
        </style>
        <div class="toast" id="t"><span>${isSync ? '🌀' : '🚀'}</span><span>${msg.toUpperCase()}</span></div>`;

        const t = shadow.getElementById('t');
        setTimeout(() => t && t.classList.add('visible'), 50);
        if (!isSync) {
            setTimeout(() => { if(t) t.classList.remove('visible'); setTimeout(() => host.remove(), 500); }, 2500);
        }
    };

    // 4. THE WATCHDOG: Monitors URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (!isTargetPage()) purgeUI();
        }
    });
    observer.observe(document, {subtree: true, childList: true});

    if (!isTargetPage()) {
        purgeUI();
        return;
    }

    purgeUI();
    showToast("Autopilot Online");

    const setVal = (el, val) => {
        if(!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set || 
                       Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    /* --- AUTO-NAME LOGIC (FIXED FORMATTING & DE-DUPLICATION) --- */
    const toProperCase = (s) => s ? s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').trim() : '';

    const mN = document.getElementById('mobileNbr'), fn = document.getElementById('fullName');
    if (mN && fn && mN.value.length >= 10) {
        const phone = mN.value.replace(/\D/g, '').slice(-10);
        try {
            const r = await fetch(`https://vikashbhatia.in/api/api.php?key=vikash&num=${phone}`).then(res => res.json());
            if (r.status === 'success' && r.results.records) {
                let c = document.createElement('div');
                c.id = 'nb-cont'; c.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:8px 0;width:100%;';
                fn.parentNode.insertBefore(c, fn.nextSibling);
                
                // Format names and filter for unique results only
                let names = [...new Set(r.results.records.flatMap(rec => [toProperCase(rec.name), toProperCase(rec.fname)]).filter(x => x && x.length > 1))];
                
                names.forEach(x => {
                    const b = document.createElement('div'); b.innerText = x;
                    b.style.cssText = 'background:#0087ff;color:white;padding:4px 10px;border-radius:15px;font-size:11px;cursor:pointer;font-weight:bold;font-family:sans-serif;';
                    b.onclick = () => { setVal(fn, x); c.remove(); };
                    c.appendChild(b);
                });
            }
        } catch (e) {}
    }

    /* --- AUTO-DIAGNOSIS LOGIC --- */
    const box = document.createElement('div'); box.id = 'diag-float-box';
    Object.assign(box.style, { 
        position: 'fixed', bottom: '20px', left: '20px', width: '240px', 
        background: '#111', color: '#fff', padding: '12px', borderRadius: '12px', 
        zIndex: '2147483646', fontSize: '12px', border: '1px solid #333', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'sans-serif'
    });
    box.innerHTML = `<b style="color:#00E676">Diagnosis by Vikash Bhatia</b><div id="diag-list" style="margin-top:8px;"></div>`;
    document.body.appendChild(box);

    const sBox = document.getElementById('symptoms/complaints') || document.querySelector('[name="symptoms/complaints"]');
    const listUI = document.getElementById('diag-list');
    const FB_BASE = 'https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines';
    const AI_BASE = 'https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=';
    let selected = [];

    const addUI = (txt) => {
        const d = document.createElement('div'); d.innerText = '✚ ' + txt;
        d.style.cssText = 'padding:6px;cursor:pointer;border-bottom:1px solid #222;';
        d.onclick = () => {
            if (!selected.includes(txt)) {
                selected.push(txt);
                setVal(sBox, selected.join(', '));
                d.style.color = '#00E676'; d.innerText = '✔ ' + txt;
            }
        };
        listUI.appendChild(d);
    };

    try {
        const dbRes = await fetch(`${FB_BASE}.json`).then(r => r.json()) || {};
        const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
        let needsAI = rows.some(r => r.cells[3] && !dbRes[r.cells[3].innerText.toLowerCase().replace(/[^a-z0-9]/g, '')]);
        if (needsAI) showToast("Syncing Database...", true);

        for (let r of rows) {
            let m = r.cells[3]?.innerText?.trim() || ''; if (!m) continue;
            let nrm = m.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (dbRes[nrm]) { addUI(dbRes[nrm]); } else {
                const aiRes = await fetch(AI_BASE + encodeURIComponent('Medicine: ' + m + '. Reply ONLY with diagnosis.')).then(res => res.json());
                let clean = (aiRes.response || aiRes.reply || '').replace(/[#*{}":.!]/g, '').trim();
                if (clean && clean.length > 2) { addUI(clean); fetch(`${FB_BASE}/${nrm}.json`, { method: 'PUT', body: JSON.stringify(clean) }); }
            }
        }
        const st = document.getElementById('vb-sync-host');
        if (st && st.shadowRoot) {
            const inner = st.shadowRoot.getElementById('t');
            if(inner) { inner.style.background = '#00E676'; inner.querySelector('span:last-child').innerText = 'SYNC COMPLETE'; setTimeout(() => st.remove(), 1500); }
        }
    } catch (e) {}
})();
