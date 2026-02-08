(async function() {
    /* 1. TOAST SYSTEM - MAX VISIBILITY */
    const showToast = (msg, isSync = false) => {
        const id = isSync ? 'vb-sync-toast' : 'vb-status-toast';
        let t = document.getElementById(id);
        if (!t) {
            t = document.createElement('div');
            t.id = id;
            document.body.appendChild(t);
        }
        const bgColor = isSync ? '#0087ff' : '#00E676';
        Object.assign(t.style, {
            position: 'fixed', top: isSync ? '100px' : '30px', right: '30px', 
            background: bgColor, color: '#000', padding: '14px 24px', borderRadius: '10px', 
            zIndex: '2147483647', fontWeight: '800', fontFamily: 'sans-serif', fontSize: '14px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)', transform: 'translateX(200%)', 
            transition: 'transform 0.5s ease-out', display: 'flex', alignItems: 'center', gap: '10px'
        });
        t.innerHTML = `<span>${isSync ? '🌀' : '🚀'}</span> <span>${msg}</span>`;
        setTimeout(() => t.style.transform = 'translateX(0)', 50);

        if (!isSync) {
            setTimeout(() => {
                t.style.transform = 'translateX(200%)';
                setTimeout(() => t.remove(), 500);
            }, 3000);
        }
    };

    /* 2. BASE64 GIF */
    const showMeme = () => {
        const m = document.createElement('div');
        m.id = 'vb-meme';
        const catGif = "data:image/gif;base64,R0lGODlhIAAgAPMAAP///wAAAMDAwAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAAAACwAAAAAIAAgAAAEPhDISau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPx6RySZyiaE6S0ul8Qp9QqnRKzWKzWggAIfkECQQAAAAsAAAAACAAIAAA BEEQyEmrvTjrzbv/YCiOZGmeYKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ekckmcomhOktLpfEKfUKp0Ss1is1oIADs=";
        Object.assign(m.style, {
            position: 'fixed', bottom: '30px', right: '30px', width: '100px', height: '100px',
            zIndex: '2147483647', borderRadius: '12px', border: '2px solid #00E676',
            background: `url(${catGif}) center/cover no-repeat #000`, boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
        });
        document.body.appendChild(m);
        return m;
    };

    showToast("BHATIA AUTOPILOT: ONLINE");

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
                c.id = 'nb-cont'; c.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:10px 0;width:100%;';
                fn.parentNode.insertBefore(c, fn.nextSibling);
                let names = [...new Set(r.results.records.flatMap(rec => [toProper(rec.name), toProper(rec.fname)]).filter(x => x))];
                names.forEach(x => {
                    const b = document.createElement('div'); b.innerText = x;
                    b.style.cssText = 'background:#0087ff;color:white;padding:5px 12px;border-radius:20px;font-size:12px;cursor:pointer;';
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
            Object.assign(box.style, { position: 'fixed', bottom: '30px', left: '30px', width: '250px', background: 'rgba(0,0,0,0.95)', color: 'white', padding: '15px', borderRadius: '12px', zIndex: '2147483646', fontSize: '13px', borderLeft: '5px solid #00E676' });
            box.innerHTML = '<b style="color:#00E676">Diagnosis by Vikash Bhatia:</b><div id="diag-list" style="margin-top:10px;"></div>';
            document.body.appendChild(box);
        }

        const sBox = document.getElementById('symptoms/complaints') || document.querySelector('[name="symptoms/complaints"]');
        const listUI = document.getElementById('diag-list');
        const FB_BASE = 'https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines';
        const AI_BASE = 'https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=';
        let selected = [];

        const addUI = (txt) => {
            const d = document.createElement('div'); d.innerText = '✚ ' + txt; d.style.cssText = 'padding:5px;cursor:pointer;border-bottom:1px solid #333;';
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
            let meme; if (needsAI) { showToast("SYNCING SMART DATA...", true); meme = showMeme(); }

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
                if (st) { st.style.background = '#00E676'; st.innerHTML = '✅ SYNC COMPLETE'; setTimeout(() => st.remove(), 2000); }
                if (meme) meme.remove();
            }
        } catch (e) {}
    }
})();
