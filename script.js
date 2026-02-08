(async function() {
    const mN = document.getElementById('mobileNbr'), fn = document.getElementById('fullName');
    
    /* --- PART 1: TRUECALLER BUBBLES --- */
    (async function() {
        if (mN && fn) {
            const v = mN.value.replace(/\D/g, '').slice(-10);
            if (v.length === 10) {
                const c = document.createElement('div');
                c.style.cssText = 'display:block;white-space:nowrap;overflow-x:auto;padding:8px 0;width:100%;scrollbar-width:none;border-bottom:1px solid #eee;margin-bottom:10px;';
                const s = document.createElement('span');
                s.innerText = 'Truecaller: Searching...';
                s.style.cssText = 'font-size:12px;color:#0087ff;margin-right:10px;font-style:italic;';
                c.appendChild(s);
                fn.parentNode.insertBefore(c, fn.nextSibling);
                try {
                    const r = await fetch(`https://shy-grass-9a16.vikashthevivi.workers.dev/api?number=${v}`).then(res => res.json());
                    if (r.ok && r.data && r.data.success) {
                        aNames = [r.data.name, r.data.callapp].filter(Boolean);
                        const u = [...new Set(aNames.map(name => name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')))];
                        s.innerText = 'Truecaller: ';
                        u.forEach(x => {
                            const b = document.createElement('div');
                            b.innerText = x;
                            b.style.cssText = 'display:inline-block;background:#0087ff;color:white;padding:4px 12px;border-radius:20px;margin-right:8px;font-size:13px;font-family:sans-serif;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);vertical-align:middle;';
                            b.onclick = () => {
                                let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
                                d.call(fn, x);
                                fn.dispatchEvent(new Event('input', { bubbles: true }));
                                c.remove();
                            };
                            c.appendChild(b);
                        });
                    } else { s.innerText = 'No names found.'; setTimeout(() => c.remove(), 2000); }
                } catch (e) { c.remove(); }
            }
        }
    })();

    /* --- PART 2: MAIN SCRAPER --- */
    const FB_URL = 'https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines.json',
          API_BASE = "https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=";

    let statusBox = document.getElementById('med-scraper-status');
    if (!statusBox) {
        statusBox = document.createElement('div');
        statusBox.id = 'med-scraper-status';
        Object.assign(statusBox.style, { position: 'fixed', top: '20px', right: '20px', padding: '12px 18px', zIndex: '10000', backgroundColor: 'rgba(0,0,0,0.9)', color: 'white', borderRadius: '8px', fontFamily: 'sans-serif', fontSize: '13px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', borderLeft: '5px solid #00E676' });
        document.body.appendChild(statusBox);
    }

    const log = (m) => statusBox.innerText = m;
    const w = (ms) => new Promise(r => setTimeout(r, ms));
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

    function sV(q, v) {
        let e = typeof q === 'string' ? document.querySelector(q) : q;
        if (e) {
            e.focus(); e.click();
            let d = (Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')).set;
            d.call(e, v);
            e.dispatchEvent(new Event('input', { bubbles: true }));
            e.dispatchEvent(new Event('change', { bubbles: true }));
            e.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
    }

    log('📡 Fetching Database...');
    let dbRes = {}; try { dbRes = await fetch(FB_URL).then(r => r.json()) || {}; } catch (e) {}
    const normalizedDb = {}; for (let key in dbRes) { normalizedDb[normalize(key)] = dbRes[key]; }

    const tableRows = Array.from(document.querySelectorAll('table tr')).slice(1);
    let symptomsSet = new Set(), unmappedMeds = [];

    tableRows.forEach(r => {
        let m = r.cells[3]?.innerText?.toLowerCase() || '', norm = normalize(m);
        if (m) {
            if (normalizedDb[norm]) symptomsSet.add(normalizedDb[norm]);
            else unmappedMeds.push(m.trim());
        }
    });

    const sBox = document.getElementById('symptoms/complaints') || document.querySelector('[name="symptoms/complaints"]');
    const updateField = () => {
        let list = Array.from(symptomsSet).filter(x => x.length > 2);
        let str = list.length > 1 ? list.slice(0, -1).join(', ') + ' and ' + list.slice(-1) : list[0] || '';
        if (sBox && str) sV(sBox, str);
    };

    updateField();
    log('🚀 Running Automation...');
    
    // Logic for gender, callback, etc. (Same as your working code)
    let g = document.querySelector('input[name="gender"][value="1"]'); if (g) g.click();
    await w(500);
    
    // AI Sync for unmapped meds
    let patchData = {};
    for (const med of unmappedMeds) {
        log('🤖 AI: ' + med.substring(0, 10));
        try {
            const p = encodeURIComponent('Medicine: ' + med + '. Primary clinical indication? Reply ONLY with the diagnosis name.');
            const aiRes = await fetch(API_BASE + p).then(r => r.json());
            const txt = aiRes.response || aiRes.reply || "";
            let clean = txt.replace(/[#*{}":.!]/g, '').trim();
            if (clean && clean.length > 3) {
                symptomsSet.add(clean);
                patchData[normalize(med)] = clean;
                updateField();
            }
            await w(2000);
        } catch (e) {}
    }
    if (Object.keys(patchData).length > 0) await fetch(FB_URL, { method: 'PATCH', body: JSON.stringify(patchData) });

    log('✅ DONE!');
    setTimeout(() => { if (statusBox) statusBox.remove(); }, 3000);
})();
