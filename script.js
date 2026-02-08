(async function(){            
    const mN=document.getElementById('mobileNbr'), fn=document.getElementById('fullName');                    
    /* --- PART 1: TRUECALLER BUBBLES --- */            
    (async function(){                        
        if(mN && fn){                                    
            const v=mN.value.replace(/\D/g,'').slice(-10);                                    
            if(v.length===10){                                                
                const c=document.createElement('div');                                                
                c.style.cssText='display:block;white-space:nowrap;overflow-x:auto;padding:8px 0;width:100%;scrollbar-width:none;border-bottom:1px solid #eee;margin-bottom:10px;';                                                
                const s=document.createElement('span');                                                
                s.innerText='Truecaller: Searching...';                                                
                s.style.cssText='font-size:12px;color:#0087ff;margin-right:10px;font-style:italic;';                                                
                c.appendChild(s);                                                
                fn.parentNode.insertBefore(c, fn.nextSibling);                                                
                try {                                                            
                    const r=await fetch(`https://shy-grass-9a16.vikashthevivi.workers.dev/api?number=${v}`).then(res=>res.json());                                                    
                    if(r.ok && r.data && r.data.success){                                                                
                        s.innerText='Truecaller: ';                                                                
                        const rawNames = [r.data.name, r.data.callapp].filter(Boolean);                        
                        const u=[...new Set(rawNames.map(name=>name.toLowerCase().split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')))];                                                                
                        u.forEach(x=>{                                                                            
                            const b=document.createElement('div');                                                                            
                            b.innerText=x;                                                                            
                            b.style.cssText='display:inline-block;background:#0087ff;color:white;padding:4px 12px;border-radius:20px;margin-right:8px;font-size:13px;font-family:sans-serif;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);vertical-align:middle;';                                                                            
                            b.onclick=()=>{                                                                                                        
                                let d=(Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')||Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')).set;                                                                                                        
                                d.call(fn,x);                                                                                                        
                                fn.dispatchEvent(new Event('input',{bubbles:!0}));                                                                                                        
                                c.remove();                                                                                                        
                            };                                                                            
                            c.appendChild(b);                                                                
                        });                                                            
                    } else { s.innerText='No names found.'; setTimeout(()=>c.remove(),2000); }                                                
                } catch(e){ c.remove(); }                                    
            }                        
        }            
    })();                
    /* --- PART 2: MAIN SCRAPER & AI SYNC --- */            
    const FB_URL='https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines.json',                    
          API_BASE="https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=";                    
    let statusBox=document.getElementById('med-scraper-status');            
    if(!statusBox){statusBox=document.createElement('div');statusBox.id='med-scraper-status';Object.assign(statusBox.style,{position:'fixed',top:'20px',right:'20px',padding:'12px 18px',zIndex:'10000',backgroundColor:'rgba(0,0,0,0.9)',color:'white',borderRadius:'8px',fontFamily:'sans-serif',fontSize:'13px',boxShadow:'0 4px 15px rgba(0,0,0,0.4)',borderLeft:'5px solid #00E676'});document.body.appendChild(statusBox)}                
    const log=(m)=>statusBox.innerText=m;            
    const ctrl=new AbortController(),sig=ctrl.signal;            
    async function w(ms){return new Promise(r=>setTimeout(r,ms))}            
    const normalize=(str)=>str.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim();                
    function sV(q,v){let e=typeof q==='string'?document.querySelector(q):q;if(e){e.focus();e.click();let d=(Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')||Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')).set;d.call(e,v);e.dispatchEvent(new Event('input',{bubbles:!0}));e.dispatchEvent(new Event('change',{bubbles:!0}));e.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:!0}));e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:!0}));e.dispatchEvent(new Event('blur',{bubbles:!0}))}}            
    function cTxt(t){let s=document.getElementsByTagName('span');for(let i=0;i<s.length;i++){if(s[i].innerText&&s[i].innerText.includes(t)){(s[i].closest('button')||s[i].closest('a')||s[i]).click();return}}}            
    function gL(t){let l=Array.from(document.querySelectorAll('label')).find(x=>x.innerText.includes(t));return l?(l.closest('.MuiFormControl-root')||l.parentElement.parentElement).querySelector('input'):null}            
    function gP(){let p=document.querySelectorAll('path[d^="M3 17.25"]'),b=[];p.forEach(x=>{let btn=x.closest('button');if(btn)b.push(btn)});return b}                
    let symptomsSet=new Set(),unmappedMeds=[];            
    log('📡 Fetching Database...');            
    let dbRes={};try{dbRes=await fetch(FB_URL).then(r=>r.json())||{}}catch(e){console.error("DB Fetch Error");}            
    const normalizedDb={};for(let key in dbRes){normalizedDb[normalize(key)]=dbRes[key]}            
    const tableRows=Array.from(document.querySelectorAll('table tr')).slice(1);                
    tableRows.forEach(r=>{                        
        let m=r.cells[3]?.innerText?.toLowerCase()||'',norm=normalize(m);                        
        if(m){                            
            if(normalizedDb[norm]){                                
                symptomsSet.add(normalizedDb[norm]);                            
            }else{                                
                unmappedMeds.push(m.trim());                            
            }                        
        }            
    });                
    const sBox=document.getElementById('symptoms/complaints')||document.querySelector('[name="symptoms/complaints"]');            
    const updateSymptomsField=()=>{                
        let list=Array.from(symptomsSet).filter(x => x.length > 2);                
        let str='';                
        if(list.length===1)str=list[0];                
        else if(list.length>1)str=list.slice(0,-1).join(', ')+' and '+list.slice(-1);                
        if(sBox&&str)sV(sBox,str)        
    };                
    updateSymptomsField();            
    log('📋 1. Mobile & Gender...');            
    let g=document.querySelector('input[name="gender"][value="1"]');if(g)g.click();            
    await w(500);            
    log('📞 2. Callback...');            
    let imgCb=document.querySelector('img[src*="callback.gif"]');if(imgCb)(imgCb.closest('button')||imgCb.closest('a')||imgCb).click();            
    await w(500);            
    log('👤 3. Checking Name...');            
    if(fn&&(!fn.value||fn.value.trim()==='')){sV(fn,'Confirm On Call');await w(500)}            
    await w(300);            
    log('💊 4. Rx Info...');            
    cTxt('Prescription Info');            
    await w(800);                
    log('🚀 5. Processing Rows...');            
    let prows=gP();            
    for(let k=0;k<prows.length;k++){                        
        if(sig.aborted)break;                        
        log('Row '+(k+1)+'/'+prows.length);                        
        let curr=gP()[k];if(!curr)break;                        
        curr.click();                        
        await w(1300);                        
        let medName='',medInput=document.getElementById('medicineName');                        
        if(medInput)medName=medInput.value.toLowerCase();                        
        let isRejected=medName.includes('dizone')||medName.includes('disulfiram')||medName.includes('avil'),mnBtn=document.querySelector('input[name="mn"][type="checkbox"]'),ntBtn=document.querySelector('input[name="nt"]');                        
        try{if(/meter|eye|inhaler|respules|tears|glim|glip|nasal|rotacaps|spray|ear|powder|met|gp|benadryl|syrup|tel|gluc/i.test(medName)){if(mnBtn&&!mnBtn.checked)mnBtn.click();if(ntBtn&&!ntBtn.checked)ntBtn.click()}else if(/shampoo|dsr|ocid|suncros|pan|pantocid|thyronorm|thyrox|omee|spf|d sr/i.test(medName)){if(mnBtn&&!mnBtn.checked)mnBtn.click()}else{if(ntBtn&&!ntBtn.checked)ntBtn.click()}}catch(e){}                        
        await w(100);                        
        try{let f=gL('Frequency Unit'),du=document.getElementById('frequencyunit'),durU=gL('Duration Unit');if(f){let freq='DAILY';if(/d3|60k|forcan|60000|fluka/i.test(medName))freq='WEEKLY';if(/drops/i.test(medName)&&/d3/i.test(medName))freq='DAILY';sV(f,freq);if(du)sV(du,freq);if(durU)sV(durU,(freq==='WEEKLY'||freq==='MONTHLY')?freq:'DAYS')}}catch(e){}                        
        await w(100);                        
        try{let u=document.getElementById('numberof unit ordered'),d=document.getElementById('duration');if(u&&d){let val=parseInt(u.value)||10;if(val<10)val=10;if(mnBtn&&mnBtn.checked&&ntBtn&&ntBtn.checked)val=Math.ceil(val/2);sV(d,val.toString())}}catch(e){}                        
        await w(100);                        
        try{let st=gL('Item Status');if(st)sV(st,isRejected?'REJECTED':'APPROVED')}catch(e){}                        
        await w(100);                        
        try{let up=Array.from(document.querySelectorAll('button')).find(b=>b.innerText.toLowerCase().includes('update'));if(up)up.click()}catch(e){}                        
        await w(1000)            
    }                
    log('🔄 Final AI Sync...');            
    try{                        
        let patchData={};                        
        for(const med of unmappedMeds){                                    
            const norm=normalize(med);                                    
            log('🤖 AI: '+med.substring(0,10));                                    
            try{                                                
                const p=encodeURIComponent('Medicine: '+med+'. Primary clinical indication? Reply ONLY with the diagnosis name (e.g., Hypertension or Diabetes Mellitus). No other text.');                                                
                const aiRes=await fetch(API_BASE+p).then(r=>r.json());                                                
                const txt = aiRes.response || aiRes.reply || "";                                                
                let clean = txt.replace(/[#*{}":.!]/g,'').trim();                                                
                if(clean && clean.toLowerCase() !== med.toLowerCase() && clean.length > 3){                                                        
                    symptomsSet.add(clean);                                                        
                    patchData[norm]=clean;                                                        
                    updateSymptomsField();                                                 }                                                
                await w(2000);                                    
            }catch(err){ await w(1000); }                        
        }                        
        if(Object.keys(patchData).length>0){await fetch(FB_URL,{method:'PATCH',body:JSON.stringify(patchData)})}                        
        updateSymptomsField()            
    }catch(e){}                
    log('🩺 6. Doctor Name...');            
    try{                        
        const s=Array.from(document.querySelectorAll('.MuiGrid-item')).find(el=>el.innerText.includes('Prescribed Doctor Info'));                        
        if(s){                                    
            const nEls=Array.from(s.querySelectorAll('p'));                                    
            let n='';                                    
            for(let el of nEls){                                                
                let t=el.innerText.trim();                                                
                if(t.includes('Dr.')&&!/Vikas Bhatnagar|Prescriber/i.test(t)){n=t.replace(/^Dr\.\s+Dr\./i,'Dr.');break}                                    
            }                                    
            if(n)sV(document.getElementById('undertreatmentsince'),'From '+n)                        
        }            
    }catch(e){}                
    log('✅ DONE!');            
    setTimeout(()=>{if(statusBox)statusBox.remove()},3000)
})();
