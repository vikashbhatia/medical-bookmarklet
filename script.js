(async function(){
    const e=document.getElementById('mobileNbr'),t=document.getElementById('fullName');
    (async function(){
        if(e&&t){
            const n=e.value.replace(/\D/g,'').slice(-10);
            if(10===n.length){
                const o=document.createElement('div');
                o.style.cssText='display:block;white-space:nowrap;overflow-x:auto;padding:8px 0;width:100%;scrollbar-width:none;border-bottom:1px solid #eee;margin-bottom:10px;';
                const a=document.createElement('span');
                a.innerText='Truecaller: Searching...',a.style.cssText='font-size:12px;color:#0087ff;margin-right:10px;font-style:italic;',o.appendChild(a),t.parentNode.insertBefore(o,t.nextSibling);
                try{
                    const r=await fetch(`https://shy-grass-9a16.vikashthevivi.workers.dev/api?number=${n}`).then(e=>e.json());
                    if(r.ok&&r.data&&r.data.success){
                        a.innerText='Truecaller: ';
                        const e=[...new Set([r.data.name,r.data.callapp].filter(Boolean).map(e=>e.toLowerCase().split(' ').map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(' ')))];
                        e.forEach(e=>{
                            const n=document.createElement('div');
                            n.innerText=e,n.style.cssText='display:inline-block;background:#0087ff;color:white;padding:4px 12px;border-radius:20px;margin-right:8px;font-size:13px;font-family:sans-serif;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);vertical-align:middle;',n.onclick=()=>{let r=(Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')||Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')).set;r.call(t,e),t.dispatchEvent(new Event('input',{bubbles:!0})),o.remove()},o.appendChild(n)
                        })
                    }else a.innerText='No names found.',setTimeout(()=>o.remove(),2e3)
                }catch(i){o.remove()}
            }
        }
    })();
    const n='https://medical-database-189bc-default-rtdb.asia-southeast1.firebasedatabase.app/medicines.json',o='https://shy-grass-9a16.vikashthevivi.workers.dev/prompt?prompt=';
    let a=document.getElementById('med-scraper-status');
    a||(a=document.createElement('div'),a.id='med-scraper-status',Object.assign(a.style,{position:'fixed',top:'20px',right:'20px',padding:'12px 18px',zIndex:'10000',backgroundColor:'rgba(0,0,0,0.9)',color:'white',borderRadius:'8px',fontFamily:'sans-serif',fontSize:'13px',boxShadow:'0 4px 15px rgba(0,0,0,0.4)',borderLeft:'5px solid #00E676'}),document.body.appendChild(a));
    const r=e=>a.innerText=e,i=new AbortController,s=i.signal,c=e=>new Promise(t=>setTimeout(t,e)),l=e=>e.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim();
    function d(e,t){let n='string'==typeof e?document.querySelector(e):e;if(n){n.focus(),n.click();let o=(Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')||Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value')).set;o.call(n,t),n.dispatchEvent(new Event('input',{bubbles:!0})),n.dispatchEvent(new Event('change',{bubbles:!0})),n.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:!0})),n.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:!0})),n.dispatchEvent(new Event('blur',{bubbles:!0}))}}
    function p(e){let t=document.getElementsByTagName('span');for(let n=0;n<t.length;n++)if(t[n].innerText&&t[n].innerText.includes(e))return void(t[n].closest('button')||t[n].closest('a')||t[n]).click()}
    function u(e){let t=Array.from(document.querySelectorAll('label')).find(t=>t.innerText.includes(e));return t?(t.closest('.MuiFormControl-root')||t.parentElement.parentElement).querySelector('input'):null}
    function g(){let e=document.querySelectorAll('path[d^="M3 17.25"]'),t=[];return e.forEach(e=>{let n=e.closest('button');n&&t.push(n)}),t}
    let m=new Set,f=[];r('📡 Fetching Database...');let h={};try{h=await fetch(n).then(e=>e.json())||{}}catch(y){console.error('DB Fetch Error')}
    const v={};for(let x in h)v[l(x)]=h[x];
    const b=Array.from(document.querySelectorAll('table tr')).slice(1);
    b.forEach(e=>{let t=e.cells[3]?.innerText?.toLowerCase()||'',n=l(t);t&&(v[n]?m.add(v[n]):f.push(t.trim()))});
    const w=document.getElementById('symptoms/complaints')||document.querySelector('[name="symptoms/complaints"]'),E=()=>{let e=Array.from(m).filter(e=>e.length>2),t='';1===e.length?t=e[0]:e.length>1&&(t=e.slice(0,-1).join(', ')+' and '+e.slice(-1)),w&&t&&d(w,t)};
    E(),r('📋 1. Mobile & Gender...');
    let k=document.querySelector('input[name="gender"][value="1"]');k&&k.click(),await c(500),r('📞 2. Callback...');
    let S=document.querySelector('img[src*="callback.gif"]');S&&(S.closest('button')||S.closest('a')||S).click(),await c(500),r('👤 3. Checking Name...'),t&&(!t.value||''===t.value.trim())&&(d(t,'Confirm On Call'),await c(500)),await c(300),r('💊 4. Rx Info...'),p('Prescription Info'),await c(800),r('🚀 5. Processing Rows...');
    let q=g();for(let L=0;L<q.length;L++){if(s.aborted)break;r('Row '+(L+1)+'/'+q.length);let M=g()[L];if(!M)break;M.click(),await c(1300);let N='',I=document.getElementById('medicineName');I&&(N=I.value.toLowerCase());let C=N.includes('dizone')||N.includes('disulfiram')||N.includes('avil'),A=document.querySelector('input[name="mn"][type="checkbox"]'),B=document.querySelector('input[name="nt"]');try{/meter|eye|inhaler|respules|tears|glim|glip|nasal|rotacaps|spray|ear|powder|met|gp|benadryl|syrup|tel|gluc/i.test(N)?(A&&!A.checked&&A.click(),B&&!B.checked&&B.click()):/shampoo|dsr|ocid|suncros|pan|pantocid|thyronorm|thyrox|omee|spf|d sr/i.test(N)?A&&!A.checked&&A.click():B&&!B.checked&&B.click()}catch(y){}await c(100);try{let j=u('Frequency Unit'),P=document.getElementById('frequencyunit'),T=u('Duration Unit');if(j){let U='DAILY';/d3|60k|forcan|60000|fluka/i.test(N)&&(U='WEEKLY'),/drops/i.test(N)&&/d3/i.test(N)&&(U='DAILY'),d(j,U),P&&d(P,U),T&&d(T,'WEEKLY'===U||'MONTHLY'===U?U:'DAYS')}}catch(y){}await c(100);try{let F=document.getElementById('numberof unit ordered'),G=document.getElementById('duration');if(F&&G){let H=parseInt(F.value)||10;H<10&&(H=10),A&&A.checked&&B&&B.checked&&(H=Math.ceil(H/2)),d(G,H.toString())}}catch(y){}await c(100);try{let J=u('Item Status');J&&d(J,C?'REJECTED':'APPROVED')}catch(y){}await c(100);try{let K=Array.from(document.querySelectorAll('button')).find(e=>e.innerText.toLowerCase().includes('update'));K&&K.click()}catch(y){}await c(1e3)}r('🔄 Final AI Sync...');
    try{let O={};for(const R of f){const V=l(R);r('🤖 AI: '+R.substring(0,10));try{const W=encodeURIComponent('Medicine: '+R+'. Primary clinical indication? Reply ONLY with the diagnosis name (e.g., Hypertension or Diabetes Mellitus). No other text.'),X=await fetch(o+W).then(e=>e.json()),Y=X.response||X.reply||'';let Z=Y.replace(/[#*{}":.!]/g,'').trim();Z&&Z.toLowerCase()!==R.toLowerCase()&&Z.length>3&&(m.add(Z),O[V]=Z,E()),await c(2e3)}catch(y){await c(1e3)}}Object.keys(O).length>0&&await fetch(n,{method:'PATCH',body:JSON.stringify(O)}),E()}catch(y){}r('预 6. Doctor Name...');
    try{const $=(Array.from(document.querySelectorAll('.MuiGrid-item')).find(e=>e.innerText.includes('Prescribed Doctor Info')));if($){const _=Array.from($.querySelectorAll('p'));let aa='';for(let ab of _){let ac=ab.innerText.trim();if(ac.includes('Dr.')&&!/Vikas Bhatnagar|Prescriber/i.test(ac)){aa=ac.replace(/^Dr\.\s+Dr\./i,'Dr.');break}}aa&&d(document.getElementById('undertreatmentsince'),'From '+aa)}}catch(y){}r('✅ DONE!'),setTimeout(()=>{a&&a.remove()},3e3)
})();
