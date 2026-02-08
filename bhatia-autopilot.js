(async function() {
    /* 1. COMPACT NOTIFICATION SYSTEM */
    const showToast = (msg, isSync = false) => {
        const id = isSync ? 'vb-sync-toast' : 'vb-status-toast';
        let t = document.getElementById(id);
        if (!t) {
            t = document.createElement('div');
            t.id = id;
            document.body.appendChild(t);
        }
        const bgColor = isSync ? '#0087ff' : '#00E676';
        
        // "all: initial" resets CRM styles so the toast stays small
        Object.assign(t.style, {
            all: 'initial',
            position: 'fixed', top: isSync ? '70px' : '20px', right: '20px', 
            background: bgColor, color: '#000', padding: '8px 16px', borderRadius: '8px', 
            zIndex: '2147483647', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '12px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transform: 'translateX(200%)', 
            transition: 'transform 0.4s ease-out', display: 'flex', alignItems: 'center', 
            gap: '8px', pointerEvents: 'none'
        });
        
        t.innerHTML = `<span style="font-size:14px">${isSync ? '🌀' : '🚀'}</span> <span style="font-family:sans-serif">${msg}</span>`;
        setTimeout(() => t.style.transform = 'translateX(0)', 50);

        if (!isSync) {
            setTimeout(() => {
                t.style.transform = 'translateX(200%)';
                setTimeout(() => t.remove(), 500);
            }, 2500);
        }
    };

    /* 2. COMPACT GIF */
    const showMeme = () => {
        const m = document.createElement('div');
        m.id = 'vb-meme';
        const catGif = "data:image/gif;base64,R0lGODlhIAAgAPMAAP///wAAAMDAwAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAAAACwAAAAAIAAgAAAEPhDISau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPx6RySZyiaE6S0ul8Qp9QqnRKzWKzWggAIfkECQQAAAAsAAAAACAAIAAA BEEQyEmrvTjrzbv/YCiOZGmeYKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ekckmcomhOktLpfEKfUKp0Ss1is1oIADs=";
        Object.assign(m.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '80px', height: '80px',
            zIndex: '2147483647', borderRadius: '10px', border: '1px solid #00E676',
            background: `url(${catGif}) center/cover no-repeat #000`, boxShadow: '0 5px 15px rgba(0,0,0,0.4)'
        });
        document.body.appendChild(m);
        return m;
    };

    showToast("AUTOPILOT: ONLINE");

    /* 3. CORE LOGIC */
    const unlock = () => { window.onbeforeunload = null; if (window.jQuery) jQuery(window).off('beforeunload'); };
    unlock(); setInterval(unlock, 1000);

    const isRx = () => window.location.href.includes('patDetails');
    const mN = document.getElementById('mobileNbr'), fn = document.getElementById('fullName');
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const toProper = (s) => s ? s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

    // IDENTITY LOOKUP
    if (mN && fn && mN.value.length >= 10) {
        const phone = mN.value.replace(/\D/g, '').slice(-10);
        try {
            const r = await fetch(`https://vikashbhatia.in/api/api.php?key=vikash&num=${phone}`).then(res => res.json());
            if (r.status === 'success' && r.results.records) {
                let c = document.getElementById('nb-cont') || document.createElement('div');
                c.id = 'nb-cont'; c.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:8px 0;width:100%;';
                fn.parentNode.insertBefore(c, fn.nextSibling);
                let names = [...new Set(r.results.records.flatMap(rec => [toProper(rec.name), toProper(rec.fname)]).filter(x => x))];
                names.forEach(x => {
                    const b = document.createElement('div'); b.innerText = x;
                    b.style.cssText = 'background:#0087ff;color:white;padding:4px 10px;border-radius:15px;font-size:11px;cursor:pointer;font-family:sans-serif;';
                    b.onclick = () => {
                        let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
                        d.call(fn, x); fn.dispatchEvent(new Event('input', { bubbles: true }));
                        c.remove();
                    };
                    c.appendChild(b);
                });
            }
        } catch (e) {}
    }

    // DIAGNOSIS SYSTEM
    if (isRx()) {
        let box = document.getElementById('diag-float-box');
        if (!box) {
            box = document.createElement('div'); box.id = 'diag-float-box';
            Object.assign(box.style, { position: 'fixed', bottom: '20px', left: '20px', width: '220px', background: 'rgba(0,0,0,0.95)', color: 'white', padding: '12px', borderRadius: '10px', zIndex: '2147483646', fontSize: '12px', borderLeft: '4px solid #00E676', fontFamily: 'sans-serif' });
            box.innerHTML = '<b style="color:#00E676">Diagnosis by Vikash Bhatia:</b><div id="diag-list" style="margin-top:8px;"></div>';
            document.body.appendChild(box);
        }

        const sBox = document.getElementById('symptoms/complaints') || document.querySelector('[name="symptoms/complaints"]');
        const listUI = document.getElementById('diag-list');
        const FB_BASE = 'https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines';
        const AI_BASE = 'https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=';
        let selected = [];

        const addUI = (txt) => {
            const d = document.createElement('div'); d.innerText = '✚ ' + txt; d.style.cssText = 'padding:4px;cursor:pointer;border-bottom:1px solid #333;';
            d.onclick = () => {
                if (!selected.includes(txt)) {
                    selected.push(txt);
                    let str = selected.length > 1 ? selected.slice(0, -1).join(', ') + ' and ' + selected.slice(-1) : selected[0];
                    let set = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
                    set.call(sBox, str); sBox.dispatchEvent(new Event('input', { bubbles: true }));
                    d.style.color = '#00E676'; d.innerText = '✔ ' + txt;
                }
            };
            listUI.appendChild(d);
        };

        try {
            const dbRes = await fetch(`${FB_BASE}.json`).then(r => r.json()) || {};
            const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
            let needsAI = rows.some(r => r.cells[3] && !dbRes[normalize(r.cells[3].innerText)]);
            let meme; if (needsAI) { showToast("SYNCING...", true); meme = showMeme(); }

            for (let r of rows) {
                let m = r.cells[3]?.innerText?.trim() || ''; if (!m) continue;
                let nrm = normalize(m);
                if (dbRes[nrm]) { addUI(dbRes[nrm]); } else {
                    const p = encodeURIComponent('Medicine: ' + m + '. Reply with ONLY the diagnosis name.');
                    const aiRes = await fetch(AI_BASE + p).then(res => res.json());
                    let clean = (aiRes.response || aiRes.reply || '').replace(/[#*{}":.!]/g, '').trim();
                    if (clean && clean.length > 2) { addUI(clean); fetch(`${FB_BASE}/${nrm}.json`, { method: 'PUT', body: JSON.stringify(clean) }); }
                }
            }
            if (needsAI) {
                const st = document.getElementById('vb-sync-toast');
                if (st) { st.style.background = '#00E676'; st.innerHTML = '✅ DONE'; setTimeout(() => st.remove(), 1500); }
                if (meme) meme.remove();
            }
        } catch (e) {}
    }
})();
