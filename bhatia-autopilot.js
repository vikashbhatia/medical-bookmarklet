(async function() {
    /* 1. PREMIUM NOTIFICATION SYSTEM */
    const showToast = (msg, isSync = false) => {
        const id = isSync ? 'vb-sync-toast' : 'vb-status-toast';
        let t = document.getElementById(id);
        if (!t) {
            t = document.createElement('div');
            t.id = id;
            document.body.appendChild(t);
        }
        
        const bgColor = isSync ? 'rgba(0, 135, 255, 0.95)' : 'rgba(0, 230, 118, 0.95)';
        const icon = isSync ? '🌀' : '🚀';
        
        Object.assign(t.style, {
            position: 'fixed', top: isSync ? '80px' : '20px', right: '20px', 
            background: bgColor, color: '#000',
            padding: '12px 24px', borderRadius: '12px', zIndex: '100000',
            fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)', transform: 'translateX(150%)',
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex', alignItems: 'center', gap: '10px'
        });
        
        t.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
        setTimeout(() => t.style.transform = 'translateX(0)', 100);
        
        if (!isSync) {
            setTimeout(() => {
                t.style.transform = 'translateX(150%)';
                setTimeout(() => t.remove(), 500);
            }, 3000);
        }
    };

    /* 2. FUNNY LOADING GIF SYSTEM */
    const showFunnyMeme = () => {
        const m = document.createElement('div');
        m.id = 'vb-meme';
        // A funny "intense thinking" or "hacking" gif
        const gifs = [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JnB0PWEmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/26tn33aiTi1jkl6H6/giphy.gif', // Cat hacking
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JnB0PWEmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKSjP6VT51D33SE/giphy.gif'  // Brain blast
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        
        Object.assign(m.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '150px',
            zIndex: '100001', borderRadius: '15px', overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '2px solid #00E676'
        });
        m.innerHTML = `<img src="${randomGif}" style="width:100%; display:block;">`;
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
                let allNames = [];
                r.results.records.forEach(rec => {
                    if (rec.name) allNames.push(toProper(rec.name.trim()));
                    if (rec.fname) allNames.push(toProper(rec.fname.trim()));
                });
                [...new Set(allNames)].forEach(x => {
                    const b = document.createElement('div');
                    b.innerText = x;
                    b.style.cssText = 'display:inline-block;background:#0087ff;color:white;padding:5px 14px;border-radius:20px;font-size:13px;cursor:pointer;font-family:sans-serif;';
                    b.onclick = (e) => {
                        e.preventDefault();
                        let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
                        d.call(fn, x);
                        fn.dispatchEvent(new Event('input', { bubbles: true }));
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
            box = document.createElement('div');
            box.id = 'diag-float-box';
            Object.assign(box.style, {
                position: 'fixed', bottom: '20px', left: '20px', width: '250px',
                background: 'rgba(0,0,0,0.95)', color: 'white', padding: '12px',
                borderRadius: '8px', zIndex: '99999', fontSize: '13px', borderLeft: '4px solid #00E676', maxHeight: '40vh', overflowY: 'auto'
            });
            box.innerHTML = '<b style="color:#00E676">Diagnosis by Vikash Bhatia:</b><div id="diag-list" style="margin-top:8px;"></div>';
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
            d.call(sBox, str);
            sBox.dispatchEvent(new Event('input', { bubbles: true }));
        };

        const addUI = (txt) => {
            const d = document.createElement('div');
            d.innerText = '✚ ' + txt;
            d.style.cssText = 'padding:5px;cursor:pointer;border-bottom:1px solid #333;';
            d.onclick = () => {
                if (!selected.includes(txt)) {
                    selected.push(txt);
                    upd();
                    d.style.color = '#00E676';
                    d.innerText = '✔ ' + txt;
                }
            };
            listUI.appendChild(d);
        };

        try {
            const dbRes = await fetch(`${FB_BASE}.json`).then(r => r.json()) || {};
            const rows = Array.from(document.querySelectorAll('table tr')).slice(1);
            
            // IF WE NEED AI, SHOW SYNCING
            let needsAI = rows.some(r => !dbRes[normalize(r.cells[3]?.innerText || '')]);
            let memeImg;
            if (needsAI) {
                showToast("SYNCING SMART DATA...", true);
                memeImg = showFunnyMeme();
            }

            for (let r of rows) {
                let m = r.cells[3]?.innerText?.trim() || '';
                if (!m) continue;
                let nrm = normalize(m);
                if (dbRes[nrm]) {
                    addUI(dbRes[nrm]);
                } else {
                    const p = encodeURIComponent('Medicine: ' + m + '. Primary clinical indication? Reply ONLY with the diagnosis name.');
                    const aiRes = await fetch(AI_BASE + p).then(res => res.json());
                    let raw = aiRes.response || aiRes.reply || '';
                    let clean = raw.replace(/[#*{}":.!]/g, '').split('\n').filter(l => l.trim().length > 0).pop().trim();
                    if (clean.length > 25) clean = clean.split(' ').pop();
                    if (clean && clean.length > 2) {
                        addUI(clean);
                        fetch(`${FB_BASE}/${nrm}.json`, { method: 'PUT', body: JSON.stringify(clean) });
                    }
                }
            }
            // HIDE SYNCING WHEN DONE
            const st = document.getElementById('vb-sync-toast');
            if (st) {
                st.style.background = '#00E676';
                st.innerHTML = '✅ SYNC COMPLETE';
                setTimeout(() => { st.style.transform = 'translateX(150%)'; setTimeout(() => st.remove(), 500); }, 2000);
            }
            if (memeImg) memeImg.remove();
        } catch (e) {}
    }
})();
