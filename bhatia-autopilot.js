(async function() {
    /* 1. FIXED NOTIFICATION SYSTEM */
    const showToast = (msg, isSync = false) => {
        const id = isSync ? 'vb-sync-toast' : 'vb-status-toast';
        let t = document.getElementById(id);
        if (!t) {
            t = document.createElement('div');
            t.id = id;
            document.body.appendChild(t);
        }
        const bgColor = isSync ? 'rgba(0, 135, 255, 0.95)' : 'rgba(0, 230, 118, 0.95)';
        Object.assign(t.style, {
            position: 'fixed', 
            top: isSync ? '100px' : '40px', // Pushed down slightly for better visibility
            right: '25px', 
            background: bgColor, 
            color: '#000', 
            padding: '16px 28px', 
            borderRadius: '12px', 
            zIndex: '2147483647', // Maximum z-index
            fontWeight: '900', 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            fontSize: '15px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
            transform: 'translateX(180%)', // Start further off-screen
            transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            pointerEvents: 'none'
        });
        t.innerHTML = `<span>${isSync ? '🌀' : '🚀'}</span> <span>${msg}</span>`;
        
        // Use requestAnimationFrame for smoother entry
        requestAnimationFrame(() => {
            t.style.transform = 'translateX(0)';
        });

        if (!isSync) {
            setTimeout(() => {
                t.style.transform = 'translateX(180%)';
                setTimeout(() => t.remove(), 600);
            }, 4000);
        }
    };

    /* 2. BASE64 GIF SYSTEM */
    const showFunnyMeme = () => {
        const m = document.createElement('div');
        m.id = 'vb-meme';
        const catGif = "data:image/gif;base64,R0lGODlhIAAgAPMAAP///wAAAMDAwAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAAAACwAAAAAIAAgAAAEPhDISau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPx6RySZyiaE6S0ul8Qp9QqnRKzWKzWggAIfkECQQAAAAsAAAAACAAIAAA BEEQyEmrvTjrzbv/YCiOZGmeYKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ekckmcomhOktLpfEKfUKp0Ss1is1oIADs=";
        Object.assign(m.style, {
            position: 'fixed', bottom: '25px', right: '25px', width: '130px', height: '130px',
            zIndex: '2147483647', borderRadius: '15px', overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '3px solid #00E676',
            background: `url(${catGif}) center/cover no-repeat #000`
        });
        document.body.appendChild(m);
        return m;
    };

    showToast("BHATIA AUTOPILOT: ONLINE");

    /* 3. CORE LOGIC */
    const unlock = () => { window.onbeforeunload = null; if (window.jQuery) jQuery(window).off('beforeunload'); };
    unlock(); setInterval(unlock, 1000);

    const isRx = () => window.location.href.includes('crm.gudmed.in/amazoneRxDetails/patDetails');
    const mN = document.getElementById('mobileNbr'), fn = document.getElementById('fullName');
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const toProper = (s) => s ? s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

    if (mN && fn && mN.value.length >= 10) {
        const phone = mN.value.replace(/\D/g, '').slice(-10);
        try {
            const r = await fetch(`https://vikashbhatia.in/api/api.php?key=vikash&num=${phone}`).then(res => res.json());
            if (r.status === 'success' && r.results.records) {
                let c = document.getElementById('nb-cont') || document.createElement('div');
                c.id = 'nb-cont';
                c.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;padding:10px 0;width:100%;border-bottom:1px solid #eee;margin-bottom:10px;';
                fn.parentNode.insertBefore(c, fn.nextSibling);
                c.innerHTML = '';
                let names = [...new Set(r.results.records.flatMap(rec => [toProper(rec.name), toProper(rec.fname)]).filter(x => x))];
                names.forEach(x => {
                    const b = document.createElement('div');
                    b.innerText = x;
                    b.style.cssText = 'display:inline-block;background:#0087ff;color:white;padding:5px 14px;border-radius:20px;font-size:13px;cursor:pointer;';
                    b.onclick = (e) => {
                        e.preventDefault();
                        let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
                        d.call(fn, x); fn.dispatchEvent(new Event('input', { bubbles: true }));
                        c.remove();
                    };
                    c.appendChild(b);
                });
            }
        } catch (e) {}
    }

    if (isRx()) {
        let box = document.getElementById('diag-float-box');
        if (!box) {
            box = document.createElement('div'); box.id = 'diag-float-box';
            Object.assign(box.style, { position: 'fixed', bottom: '25px', left: '25px', width: '260px', background: 'rgba(0,0,0,0.96)', color: 'white', padding: '14px', borderRadius: '12px', zIndex: '2147483646', fontSize: '13px', borderLeft: '5px solid #00E676', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxHeight: '45vh', overflowY: 'auto' });
            box.innerHTML = '<b style="color:#00E676; font-size:14px;">Diagnosis by Vikash Bhatia:</b><div id="diag-list" style="margin-top:10px;"></div>';
            document.body.appendChild(box);
        }

        const sBox = document.getElementById('symptoms/complaints') || document.querySelector('[name="symptoms/complaints"]');
        const listUI = document.getElementById('diag-list');
        const FB_BASE = 'https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines';
        const AI_BASE = 'https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=';
        let selected = [];

        const upd = () => {
            if (!sBox) return;
            let str = selected.length > 1 ? selected.slice(0, -1).join(', ') + ' and ' + selected.slice(-1) : (selected[0] || '');
            let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
            d.call(sBox, str); sBox.dispatchEvent(new Event('input', { bubbles: true }));
        };

        const addUI = (txt) => {
            const d = document.createElement('div');
            d.innerText = '✚ ' + txt; d.style.cssText = 'padding:6px;cursor:pointer;border-bottom:1px solid #333; transition: color 0.2s;';
            d.onmouseover = () => { d.style.background = 'rgba(255,255,255,0.05)'; };
            d.onmouseout = () => { d.style.background = 'transparent'; };
            d.onclick = () => { if (!selected.includes(txt)) { selected.push(txt); upd(); d.style.color = '#00E676'; d.innerText = '✔ ' + txt; } };
            listUI.appendChild(d);
        };

        try {
            const dbRes = await fetch(`${FB_BASE}.json`).then(r => r.json()) || {};
            const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
            let needsAI = rows.some(r => !dbRes[normalize(r.cells[3]?.innerText || '')]);
            let memeImg;
            if (needsAI) { showToast("SYNCING SMART DATA...", true); memeImg = showFunnyMeme(); }

            for (let r of rows) {
                let m = r.cells[3]?.innerText?.trim() || ''; if (!m) continue;
                let nrm = normalize(m);
                if (dbRes[nrm]) { addUI(dbRes[nrm]); } else {
                    const p = encodeURIComponent('Medicine: ' + m + '. Primary clinical indication? Reply ONLY with the diagnosis name.');
                    const aiRes = await fetch(AI_BASE + p).then(res => res.json());
                    let raw = aiRes.response || aiRes.reply || '';
                    let clean = raw.replace(/[#*{}":.!]/g, '').split('\n').filter(l => l.trim().length > 0).pop().trim();
                    if (clean && clean.length > 2) { addUI(clean); fetch(`${FB_BASE}/${nrm}.json`, { method: 'PUT', body: JSON.stringify(clean) }); }
                }
            }
            if (needsAI) {
                const st = document.getElementById('vb-sync-toast');
                if (st) { st.style.background = '#00E676'; st.innerHTML = '✅ SYNC COMPLETE'; setTimeout(() => { st.style.transform = 'translateX(180%)'; setTimeout(() => st.remove(), 600); }, 2500); }
                if (memeImg) memeImg.remove();
            }
        } catch (e) {}
    }
})();
