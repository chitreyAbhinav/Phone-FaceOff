const $=id=>document.getElementById(id);
const ic=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const HUES=[12,44,140,172,204],COL=HUES.map(h=>`hsl(${h} 85% 62%)`);
// The spreadsheet prices are in US dollars. They are shown in rupees using this rate (change it any time).
const INR=95;
const rs=usd=>'₹'+(Math.round(usd*INR/100)*100).toLocaleString('en-IN');
const M=[
{k:'Price',i:2,inv:1,ico:ic('price'),f:v=>rs(v),p:'Lowest price',c:'Priciest'},
{k:'Rating',i:1,ico:ic('star'),f:v=>v.toFixed(1)+' ★',p:'Top rated',c:'Lowest rated'},
{k:'Camera',i:3,ico:ic('camera'),f:v=>v+' MP',p:'Sharpest camera',c:'Weaker camera'},
{k:'Battery',i:6,ico:ic('battery'),f:v=>v+' mAh',p:'Longest battery',c:'Shortest battery'},
{k:'Storage',i:7,ico:ic('storage'),f:v=>v>=1024?'1 TB':v+' GB',p:'Most storage',c:'Least storage'},
{k:'RAM',i:8,ico:ic('chip'),f:v=>v+' GB',p:'Smooth multitasking',c:'Little memory'},
{k:'Weight',i:9,inv:1,ico:ic('feather'),f:v=>v+' g',p:'Lightest',c:'Heaviest'}];
const PER={'Student':[9,6,4,7,4,5,4],'Gamer':[3,5,3,8,5,10,3],'Photographer':[3,6,10,5,7,4,3],'Traveller':[5,5,5,10,6,4,8],'Budget hunter':[10,5,2,5,3,3,4],'Flagship fan':[1,8,9,7,9,9,3],'Balanced':[5,5,5,5,5,5,5]};
const PI={Student:'cap',Gamer:'pad',Photographer:'camera',Traveller:'plane','Budget hunter':'tag','Flagship fan':'crown',Balanced:'scale'};
// 0..1 scores across all phones (price and weight flipped: cheaper/lighter = higher)
M.forEach(m=>{const v=PHONES.map(p=>p[m.i]);m.lo=Math.min(...v);m.hi=Math.max(...v)});
const NRM=PHONES.map(p=>M.map(m=>{const t=(p[m.i]-m.lo)/(m.hi-m.lo);return m.inv?1-t:t}));
const W=[5,5,5,5,5,5,5];
let sel=[],focus=0,shown=10,follow=true,maxP=115000,list=[],uid=0;
const hue=s=>{let x=0;for(const c of s)x=(x*31+c.charCodeAt(0))%360;return 12+x%180};
const short=n=>n.replace(/\s*\(.*\)$/,'');

// Phone illustration: metal frame, wallpaper screen, punch-hole camera, lock-screen clock
const DT=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
function phoneRaw(h,L,B){const u=++uid;return `<svg viewBox="0 0 100 200"><defs>
<linearGradient id="f${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 25% 85%)"/><stop offset=".5" stop-color="hsl(${h} 15% 45%)"/><stop offset="1" stop-color="hsl(${h} 20% 75%)"/></linearGradient>
<linearGradient id="w${u}" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="hsl(${h} 85% 62%)"/><stop offset=".55" stop-color="hsl(${(h+30)%360} 80% 38%)"/><stop offset="1" stop-color="hsl(${(h+60)%360} 70% 14%)"/></linearGradient></defs>
<rect x="95" y="62" width="3" height="24" rx="1.5" fill="hsl(${h} 15% 55%)"/><rect x="2" y="48" width="3" height="14" rx="1.5" fill="hsl(${h} 15% 55%)"/><rect x="2" y="68" width="3" height="14" rx="1.5" fill="hsl(${h} 15% 55%)"/>
<rect x="4" y="2" width="92" height="196" rx="19" fill="url(#f${u})"/><rect x="6.5" y="4.5" width="87" height="191" rx="16.5" fill="#05060d"/>
<rect x="9" y="7" width="82" height="186" rx="14" fill="url(#w${u})"/>
<path d="M9 120 Q40 90 91 118 V193 H9Z" fill="#fff" opacity=".1"/><path d="M9 150 Q55 120 91 145 V193 H9Z" fill="#fff" opacity=".09"/><circle cx="72" cy="52" r="22" fill="#fff" opacity=".07"/>
<circle cx="50" cy="18" r="3.4" fill="#05060d" stroke="#fff3" stroke-width=".8"/><text x="18" y="20" font-size="6" fill="#fff" font-family="sans-serif">9:41</text><rect x="76" y="15.5" width="10" height="5" rx="1.5" fill="none" stroke="#fff" stroke-width=".8"/><rect x="77.2" y="16.7" width="${B}" height="2.6" rx=".8" fill="#fff"/>
<text x="50" y="72" font-size="27" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">9:41</text><text x="50" y="86" font-size="6" fill="#fff" opacity=".8" text-anchor="middle" font-family="sans-serif">${DT}</text>${Array.from({length:L},(_,i)=>`<circle cx="${50+(i-(L-1)/2)*8}" cy="96" r="2.4" fill="#fff" opacity=".75"/>`).join('')}
${[0,1,2,3].map(i=>`<rect x="${17+i*18}" y="160" width="13" height="13" rx="4" fill="#fff" opacity="${.28+i*.06}"/>`).join('')}
<rect x="38" y="184" width="24" height="2.4" rx="1.2" fill="#fff" opacity=".7"/>
<path d="M12 10 L52 10 L12 80Z" fill="#fff" opacity=".07"/></svg>`}

// Each phone design is defined once as an SVG <symbol> and reused with <use>: far fewer DOM nodes, much smoother scrolling
const sym={};
// The drawing now reflects the spec: lens dots = camera MP, status-bar battery fill = mAh, overall size = screen inches
function phone(h,p){const L=p?(p[3]<=12?1:p[3]<=64?2:3):2,B=p?Math.max(1,Math.round(Math.min(1,p[6]/6000)*6)):4,k=h+'_'+L+'_'+B;
 if(!sym[k]){sym[k]=1;const r=phoneRaw(h,L,B);$('SP').insertAdjacentHTML('beforeend',`<symbol id="p${k}" viewBox="0 0 100 200">${r.slice(r.indexOf('>')+1,r.lastIndexOf('</svg>'))}</symbol>`)}
 const f=p?.84+Math.min(1,Math.max(0,(p[5]-5.3)/1.7))*.16:1,vw=100/f,vh=200/f;
 return `<svg viewBox="${50-vw/2} ${100-vh/2} ${vw} ${vh}"><use href="#p${k}" width="100" height="200"/></svg>`}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),2200)}

// ---- ranking
function compute(){const tot=W.reduce((a,b)=>a+b,0)||1;
 list=[];PHONES.forEach((p,i)=>{if(p[2]*INR>maxP)return;
  let s=0;for(let j=0;j<M.length;j++)s+=W[j]*NRM[i][j];list.push([s/tot,i])});
 list.sort((a,b)=>b[0]-a[0]);
 $('count').textContent=list.length+' phones';
 if(follow)sel=list.slice(0,5).map(e=>e[1])}

function renderRank(){const box=$('rank');
 while(box.children.length<shown){const r=document.createElement('div');r.className='row';
  r.innerHTML='<span class="rk"></span><span class="ph"></span><div class="nm"><b></b><small></small></div><div class="rt"><svg class="ring" viewBox="0 0 40 40"><circle class="t" cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16"/><text x="20" y="24.5" text-anchor="middle" transform="rotate(90 20 20)"></text></svg><button class="add" aria-label="Compare">＋</button></div>';box.appendChild(r)}
 [...box.children].forEach((r,k)=>{const e=list[k];r.style.display=e&&k<shown?'':'none';if(!e||k>=shown)return;
  const [s,i]=e,p=PHONES[i],ch=+r.dataset.i!==i;
  if(ch){r.dataset.i=i;r.querySelector('.ph').innerHTML=phone(hue(p[0]),p);r.querySelector('b').textContent=short(p[0]);
   r.querySelector('small').textContent=`${rs(p[2])}, ${p[3]} MP, ${p[6]} mAh, ${M[4].f(p[7])}`;
   r.classList.remove('sw1');void r.offsetWidth;r.classList.add('sw1')}
  r.querySelector('.rk').textContent=k+1;
  const v=r.querySelector('.v');v.style.strokeDashoffset=100.53*(1-s);v.style.stroke=`hsl(${20+s*150} 85% 58%)`;
  r.querySelector('text').textContent=Math.round(s*100);
  const on=sel.includes(i),a=r.querySelector('.add');a.classList.toggle('on',on);a.textContent=on?'✓':'＋';
  r.classList.toggle('in',on)});
 $('more').style.display=shown>=Math.min(50,list.length)?'none':'block'}

// ---- tiles & personas
$('pre').innerHTML=Object.keys(PER).map(k=>`<button>${ic(PI[k])}${k}</button>`).join('');
$('tiles').innerHTML=M.map((m,j)=>`<div class="tile" data-j="${j}"><div class="h"><span class="ico" title="Click to switch on/off">${m.ico}</span>${m.k}<em></em></div><div class="pips">${Array.from({length:10},(_,v)=>`<i data-v="${v+1}"></i>`).join('')}</div></div>`).join('');
function renderTiles(){document.querySelectorAll('.tile').forEach((t,j)=>{t.classList.toggle('off',!W[j]);t.querySelector('em').textContent=W[j];
 t.querySelectorAll('i').forEach((p,v)=>p.classList.toggle('on',v<W[j]))});
 const m=Object.entries(PER).find(e=>e[1].every((v,j)=>v===W[j]));
 document.querySelectorAll('#pre button').forEach(b=>b.classList.toggle('on',!!m&&b.textContent===m[0]))}

// ---- your five
function renderCards(){$('cards').innerHTML=Array.from({length:5},(_,k)=>{const i=sel[k];
 if(i===undefined)return `<div class="card empty"><span>＋</span></div>`;
 const p=PHONES[i];const proc=p[10]?`<span class="chip-proc" title="${p[10]}">${p[10]}</span>`:`<span class="chip-proc">${p[4]}</span>`;return `<div class="card ${k===focus?'on':''}" data-k="${k}" style="--c:${COL[k]};animation-delay:${k*70}ms"><button class="x" data-k="${k}" aria-label="Remove">✕</button><div class="pw" style="animation-delay:${k*-.7}s">${phone(HUES[k],p)}</div><b>${short(p[0])}</b>${proc}<div class="mini"><span>${ic('price')} ${rs(p[2])}</span><span>${ic('star')} ${p[1].toFixed(1)}</span></div><div class="mb">${[2,3,4,5].map(j=>`<i title="${M[j].k}" style="--w:${NRM[i][j]}"></i>`).join('')}</div></div>`}).join('')}

// ---- compare
const pt=(i,r)=>{const a=(-90+i*360/M.length)*Math.PI/180;return [160+r*Math.cos(a),150+r*Math.sin(a)]};
function renderCompare(){
 if(focus>=sel.length)focus=0;const ak=sel.join(),an=ak!==rk;rk=ak;
 let g=[1,.66,.33].map(f=>`<polygon points="${M.map((_,i)=>pt(i,100*f)).join(' ')}" fill="none" stroke="#fff2"/>`).join('');
 g+=M.map((m,i)=>{const[a,b]=pt(i,100),[x,y]=pt(i,120);return `<line x1="160" y1="150" x2="${a}" y2="${b}" stroke="#fff2"/><text x="${x}" y="${y}" fill="#93b4bd" font-size="11" text-anchor="middle" dominant-baseline="middle">${m.k}</text>`}).join('');
 g+=sel.map((i,k)=>`<polygon class="${an?'rp':''}" style="${k===focus?`filter:drop-shadow(0 0 7px ${COL[k]})`:''}" data-k="${k}" points="${M.map((_,j)=>pt(j,100*Math.max(.06,NRM[i][j]))).join(' ')}" fill="${COL[k]}" stroke="${COL[k]}" fill-opacity="${k===focus?.35:.05}" stroke-width="${k===focus?3:1.5}" opacity="${k===focus?1:.4}"/>`).join('');
 g+=sel[focus]!==undefined?M.map((m,j)=>{const [cx,cy]=pt(j,100*Math.max(.06,NRM[sel[focus]][j]));return `<circle cx="${cx}" cy="${cy}" r="4" fill="${COL[focus]}"><title>${m.k}: ${m.f(PHONES[sel[focus]][m.i])}</title></circle>`}).join(''):'';
 $('radar').innerHTML=g;
 $('leg').innerHTML=sel.map((i,k)=>`<span data-k="${k}" style="border-color:${COL[k]};opacity:${k===focus?1:.55}">${short(PHONES[i][0])}</span>`).join('');
 if(sel.length<2){$('table').innerHTML='<p class="mute">Add at least two phones to compare them.</p>';$('pc').innerHTML='';return}
 let t=`<table><tr><th></th>${sel.map((i,k)=>`<th style="color:${COL[k]}">${short(PHONES[i][0])}</th>`).join('')}</tr>`;
 M.forEach((m,j)=>{const best=Math.max(...sel.map(i=>NRM[i][j])),tie=sel.every(i=>NRM[i][j]===best);
  t+=`<tr><td class="l" title="${m.k}">${m.ico}</td>${sel.map((i,k)=>`<td class="${!tie&&NRM[i][j]===best?'best':''}">${m.f(PHONES[i][m.i])}<div class="b" style="background:${COL[k]};transform:scaleX(${Math.max(.04,NRM[i][j])})"></div></td>`).join('')}</tr>`});
 t+=`<tr><td class="l" title="Display">${ic('phone')}</td>${sel.map(i=>`<td>${PHONES[i][5]}" ${PHONES[i][4]}</td>`).join('')}</tr><tr><td class="l" title="Chip">${ic('chip')}</td>${sel.map(i=>`<td>${PHONES[i][10]||'—'}</td>`).join('')}</tr></table>`;
 $('table').innerHTML=t;
 $('pc').innerHTML=sel.map((i,k)=>{const pros=[],cons=[];
  M.forEach((m,j)=>{const v=sel.map(x=>NRM[x][j]),hi=Math.max(...v),lo=Math.min(...v),n=NRM[i][j],val=m.f(PHONES[i][m.i]);
   if(hi>lo&&n===hi||n>=.85)pros.push(`<span class="chip pro" title="${m.p}">${m.ico} ${val} ▲</span>`);else if(hi>lo&&n===lo||n<=.15)cons.push(`<span class="chip con" title="${m.c}">${m.ico} ${val} ▼</span>`)});
  return `<div class="pcard" style="--c:${COL[k]};animation-delay:${k*70}ms"><div class="ph2">${phone(HUES[k],PHONES[i])}<h3>${short(PHONES[i][0])}</h3></div><div class="chips">${pros.join('')||'<span class="chip pro">—</span>'}</div><div class="chips">${cons.join('')||'<span class="chip con">—</span>'}</div></div>`}).join('')}
let busy=0;function update(){if(busy)return;busy=requestAnimationFrame(()=>{busy=0;compute();renderRank();renderTiles();renderCards();renderCompare();
 document.documentElement.style.setProperty('--nh',HUES[focus])})}

// ---- events
$('pre').onclick=e=>{const b=e.target.closest('button');if(b){PER[b.textContent].forEach((v,j)=>W[j]=v);update()}};
const tiles=$('tiles');
tiles.onclick=e=>{const t=e.target.closest('.tile');if(!t)return;const j=+t.dataset.j,p=e.target.closest('i');
 if(p)W[j]=+p.dataset.v;else if(e.target.closest('.ico'))W[j]=W[j]?0:5;update()};
tiles.onmouseover=e=>{const p=e.target.closest('i');if(!p)return;const v=+p.dataset.v;p.parentNode.querySelectorAll('i').forEach((x,k)=>x.classList.toggle('hv',k<v&&k>=W[+p.closest('.tile').dataset.j]))};
tiles.onmouseout=()=>tiles.querySelectorAll('.hv').forEach(x=>x.classList.remove('hv'));
$('budget').oninput=e=>{maxP=+e.target.value;$('bv').textContent='₹'+maxP.toLocaleString('en-IN');update()};
$('more').onclick=()=>{shown=Math.min(50,shown+10);update()};
$('follow').onchange=e=>{follow=e.target.checked;if(follow)toast('Following your best five');update()};
function manual(){follow=false;$('follow').checked=false}
const rndBtn=$('rnd');if(rndBtn)rndBtn.onclick=()=>{manual();const pool=PHONES.map((_,i)=>i).sort(()=>Math.random()-.5);sel=pool.slice(0,5);focus=0;toast('🎲 Shuffled 5 contenders!');renderRank();renderCards();renderCompare()};
$('rank').onclick=e=>{const r=e.target.closest('.row');if(!r)return;const i=+r.dataset.i,k=sel.indexOf(i);
 if(k>-1){manual();sel.splice(k,1)}else if(sel.length>=5){const c=document.querySelector('.cards');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');toast('Five slots full. Remove one first');return}
 else{manual();sel.push(i);focus=sel.length-1}
 renderRank();renderCards();renderCompare()};
$('cards').onclick=e=>{const x=e.target.closest('.x'),c=e.target.closest('.card[data-k]');
 if(x){manual();sel.splice(+x.dataset.k,1);focus=0}else if(c)focus=+c.dataset.k;else return;
 renderRank();renderCards();renderCompare()};
$('leg').onclick=e=>{const s=e.target.closest('span');if(s){focus=+s.dataset.k;renderCards();renderCompare()}};
let raf=0;$('cards').onmousemove=e=>{const c=e.target.closest('.card[data-k]');if(!c||raf)return;raf=requestAnimationFrame(()=>{raf=0;const b=c.getBoundingClientRect(),s=c.querySelector('svg');
 c.style.setProperty('--mx',e.clientX-b.left+'px');c.style.setProperty('--my',e.clientY-b.top+'px');s.style.setProperty('--ry',((e.clientX-b.left)/b.width-.5)*40+'deg');s.style.setProperty('--rx',-((e.clientY-b.top)/b.height-.5)*30+'deg')})};
$('cards').onmouseout=e=>{const s=e.target.closest('.card svg');if(s){s.style.setProperty('--ry','0deg');s.style.setProperty('--rx','0deg')}};

update();

// ---- search bar: every letter filters by spelling (word start first, then anywhere, then typo-tolerant)
const sb=$('s'),sug=$('sug');let hits=[],hi=0;
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function tokScore(words,t){let b=0;for(const w of words){if(w.startsWith(t))b=Math.max(b,w===words[0]?6:4);else if(w.includes(t))b=Math.max(b,2);else if(t.length>=3&&(lev(t,w.slice(0,t.length))<=1||lev(t,w.slice(0,t.length+1))<=1))b=Math.max(b,1)}return b}
function mark(name,ts){const l=name.toLowerCase(),r=[];ts.forEach(t=>{const k=l.indexOf(t);if(k>-1)r.push([k,k+t.length])});r.sort((a,b)=>a[0]-b[0]);
 let o='',c=0;r.forEach(([a,b])=>{if(a<c)return;o+=name.slice(c,a)+'<mark>'+name.slice(a,b)+'</mark>';c=b});return o+name.slice(c)}
function openSug(){const ts=sb.value.toLowerCase().split(/\s+/).filter(Boolean);
 if(!ts.length){sug.className='';return}
 hits=[];PHONES.forEach((p,i)=>{const w=p[0].toLowerCase().split(/[\s()]+/).filter(Boolean);let s=0;
  for(const t of ts){const x=tokScore(w,t);if(!x){s=0;break}s+=x}if(s)hits.push([s,i])});
 hits.sort((a,b)=>b[0]-a[0]||PHONES[b[1]][1]-PHONES[a[1]][1]);hi=0;
 const shownHits=hits.slice(0,40);
 sug.innerHTML=shownHits.length?`<div class="sh">${hits.length} phones</div><div class="sl">`+shownHits.map(([,i],k)=>{const p=PHONES[i],on=sel.includes(i);
  return `<div class="sg ${k===0?'hi':''} ${on?'done':''}" data-i="${i}">${phone(hue(p[0]),p)}<div><b>${mark(p[0],ts)}</b><small>${rs(p[2])}, ${p[1].toFixed(1)} stars, ${p[3]} MP, ${p[6]} mAh, ${p[8]} GB RAM</small></div><em>${on?'✓':'＋'}</em></div>`}).join('')+'</div>':'<div class="sg none">No phone matches that spelling</div>';
 sug.className='open'}
function pick(i){const k=sel.indexOf(i);
 if(k>-1){focus=k;toast('Selected: '+short(PHONES[i][0]))}
 else if(sel.length>=5){const c=document.querySelector('.cards');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');toast('Five slots full. Remove one first');return}
 else{manual();sel.push(i);focus=sel.length-1;toast('Added: '+short(PHONES[i][0]))}
 sb.value='';sug.className='';renderRank();renderCards();renderCompare()}
sb.oninput=openSug;sb.onfocus=openSug;
sb.onkeydown=e=>{const r=[...sug.querySelectorAll('.sg[data-i]')];
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!r.length)return;hi=(hi+(e.key==='ArrowDown'?1:-1)+r.length)%r.length;r.forEach((x,k)=>x.classList.toggle('hi',k===hi));r[hi].scrollIntoView({block:'nearest'})}
 else if(e.key==='Enter'&&r[hi]){e.preventDefault();pick(+r[hi].dataset.i)}else if(e.key==='Escape')sug.className=''};
sug.onmousedown=e=>{const r=e.target.closest('.sg[data-i]');if(r){e.preventDefault();pick(+r.dataset.i)}};
document.addEventListener('click',e=>{if(!e.target.closest('.find'))sug.className=''});
// brand bubbles: one tap lists every phone of a brand
const br={};PHONES.forEach(p=>{const b=p[0].split(' ')[0];br[b]=(br[b]||0)+1});
$('brands').innerHTML=Object.entries(br).sort((a,b)=>b[1]-a[1]).map(([b,n])=>`<button data-b="${b}" style="--h:${hue(b)}"><i></i>${b}<small>${n}</small></button>`).join('');
$('brands').onclick=e=>{const b=e.target.closest('button');if(b){sb.value=b.dataset.b;sb.focus();openSug()}};
// bouncy reveal as sections scroll into view
const rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});rv.forEach(x=>io.observe(x))}else rv.forEach(x=>x.classList.add('in'));

// ---- v4: hero line, champion verdict, shareable link, section dock, "/" to search
$('hp').textContent=`${PHONES.length} phones. Five slots. One winner.`;
function save(){try{history.replaceState(null,'','#s='+sel.join('.')+'&w='+W.join('.')+'&b='+maxP)}catch(e){}}
(function(){const m=location.hash.match(/s=([\d.]*)&w=([\d.]+)&b=(\d+)/);if(!m)return;
 const l=m[1].split('.').filter(Boolean).map(Number).filter(i=>PHONES[i]).slice(0,5);if(l.length){sel=l;follow=false;$('follow').checked=false}
 m[2].split('.').forEach((v,j)=>{if(j<7)W[j]=Math.min(10,+v||0)});maxP=+m[3];$('budget').value=maxP;$('bv').textContent='₹'+maxP.toLocaleString('en-IN')})();
function tick(el,a,b){const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/600);el.textContent=Math.round(a+(b-a)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
function burst(el){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 for(let i=0;i<26;i++){const d=document.createElement('i');d.className='bi';d.style.background=`hsl(${[45,170,195,25,150][i%5]} 90% 62%)`;el.appendChild(d);const a=Math.random()*6.28,v=90+Math.random()*170;
  d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*v}px,${Math.sin(a)*v+60}px) rotate(${Math.random()*540}deg) scale(.3)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>d.remove()}}
let vc=-1,vn=0,hk='',rk='';
function verdict(){const el=$('vd');if(sel.length<2){el.innerHTML='';vc=-1;return}
 const tot=W.reduce((a,b)=>a+b,0)||1,sc=sel.map(i=>W.reduce((t,w,j)=>t+w*NRM[i][j],0)/tot),o=sc.map((_,k)=>k).sort((a,b)=>sc[b]-sc[a]),k=o[0],r=o[1],c=sel[k],ri=sel[r],n=Math.round(sc[k]*100),gap=Math.round((sc[k]-sc[r])*100),nc=short(PHONES[c][0]),nx=short(PHONES[ri][0]);
 const why=M.map((m,j)=>[W[j]*(NRM[c][j]-sel.reduce((t,i)=>t+NRM[i][j],0)/sel.length),m]).filter(e=>e[0]>0).sort((a,b)=>b[0]-a[0]).slice(0,3).map(e=>`<span title="${e[1].p}">${e[1].ico}</span>`).join('');
 const key=c+'|'+ri,an=key!==hk;hk=key;
 const rows=M.map((m,j)=>{const a=NRM[c][j],b=NRM[ri][j];return `<div class="hr"><span class="${a>b?'w':''}">${m.f(PHONES[c][m.i])}</span><div class="hb l"><i style="--w:${Math.max(.04,a)};--c:${COL[k]}"></i></div><em>${m.ico}</em><div class="hb"><i style="--w:${Math.max(.04,b)};--c:${COL[r]}"></i></div><span class="${b>a?'w':''}">${m.f(PHONES[ri][m.i])}</span></div>`}).join('');
 el.innerHTML=`<div class="vd${an?' go':''}" style="--c:${COL[k]}"><div class="vp">${phone(HUES[k],PHONES[c])}</div><div class="vt"><h3>${ic('trophy')}${nc}</h3><div class="vs"><b>${vn}</b><i>/100</i><u>${gap>0?'+'+gap:'='}</u></div><div class="wy">${why}</div><button id="shr">${ic('share')} Share</button></div><div class="h2h"><div class="hn"><b style="color:${COL[k]}">${nc}</b><b style="color:${COL[r]}">${nx}</b></div>${rows}</div></div>`;
 tick(el.querySelector('b'),vn,n);vn=n;if(c!==vc){vc=c;burst(el.firstChild)}}
$('vd').onclick=e=>{if(!e.target.closest('#shr'))return;save();navigator.clipboard.writeText(location.href).then(()=>toast('Link copied. Your five and priorities are inside it.'),()=>toast('Copy the address bar to share this face-off'))};
const _rc=renderCompare;renderCompare=function(){_rc();verdict();save()};
const dk=[...document.querySelectorAll('#dock a')];
$('dock').onclick=e=>{const a=e.target.closest('a');if(a){e.preventDefault();$(a.getAttribute('href').slice(1)).scrollIntoView({behavior:'smooth'})}};
if('IntersectionObserver' in window){const o2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)dk.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});dk.forEach(a=>o2.observe($(a.getAttribute('href').slice(1))))}
addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();sb.focus();$('five').scrollIntoView({behavior:'smooth'})}});

// ---- v5: ranking rows glide to new places, galaxy map, hero phone
const RMo=matchMedia('(prefers-reduced-motion:reduce)').matches;
const _rr=renderRank;renderRank=function(){const old=new Map();[...$('rank').children].forEach(r=>{if(r.style.display!=='none'&&r.dataset.i)old.set(+r.dataset.i,r.offsetTop)});_rr();
 if(!RMo)[...$('rank').children].forEach(r=>{if(r.style.display==='none')return;const o=old.get(+r.dataset.i),d=o===undefined?0:o-r.offsetTop;if(d&&Math.abs(d)<900)r.animate([{transform:`translateY(${d}px)`},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.8,.2,1)'})});drawGx()};
const gx=$('gx'),gc=gx.getContext('2d'),gt=$('gxt');let gpts=[],gH=null;
function drawGx(hv){const D=Math.min(devicePixelRatio||1,1.5),w=gx.clientWidth,h=gx.clientHeight;if(!w||!list.length)return;if(gx.width!==Math.round(w*D)){gx.width=Math.round(w*D);gx.height=Math.round(h*D)}
 gc.setTransform(D,0,0,D,0,0);gc.clearRect(0,0,w,h);const P=20,sq=Math.sqrt,ps=list.map(e=>PHONES[e[1]][2]),lo=sq(Math.min(...ps)),hi=sq(Math.max(...ps));
 gpts=list.map(([s,i])=>({i,s,x:P+(sq(PHONES[i][2])-lo)/((hi-lo)||1)*(w-2*P),y:h-P-s*(h-2*P)}));
 gc.fillStyle='rgba(160,235,230,.5)';for(const q of gpts)gc.fillRect(q.x-1,q.y-1,2.2,2.2);
 gc.fillStyle='#93b4bd';gc.font='11px system-ui,sans-serif';gc.textAlign='left';gc.fillText('Better match',8,13);gc.fillText('Cheaper',8,h-5);gc.textAlign='right';gc.fillText('Pricier',w-8,h-5);
 sel.forEach((i,k)=>{const q=gpts.find(z=>z.i===i);if(!q)return;gc.fillStyle=COL[k];gc.shadowColor=COL[k];gc.shadowBlur=10;gc.beginPath();gc.arc(q.x,q.y,5,0,6.283);gc.fill()});gc.shadowBlur=0;
 gH=hv||null;if(hv){gc.strokeStyle='#fff';gc.lineWidth=1.5;gc.beginPath();gc.arc(hv.x,hv.y,8,0,6.283);gc.stroke();
  gt.textContent=`${short(PHONES[hv.i][0])}, ${rs(PHONES[hv.i][2])}, ${Math.round(hv.s*100)} match`;gt.style.left=Math.min(w-80,Math.max(80,hv.x))+'px';gt.style.top=hv.y+'px';gt.style.display='block'}else gt.style.display='none'}
const near=e=>{const b=gx.getBoundingClientRect(),mx=e.clientX-b.left,my=e.clientY-b.top;let q=null,d=225;for(const z of gpts){const dd=(z.x-mx)**2+(z.y-my)**2;if(dd<d){d=dd;q=z}}return q};
let gh=0;gx.onmousemove=e=>{if(gh)return;gh=requestAnimationFrame(()=>{gh=0;drawGx(near(e))})};gx.onmouseleave=()=>drawGx();
gx.onclick=e=>{const q=near(e);if(q)pick(q.i)};addEventListener('resize',()=>drawGx());
const hph=$('hph');hph.innerHTML=phone(180,PHONES[0]);let hr=0;
document.querySelector('header').onmousemove=e=>{if(hr)return;hr=requestAnimationFrame(()=>{hr=0;const b=hph.getBoundingClientRect();hph.style.setProperty('--ry',(e.clientX-b.left-b.width/2)/innerWidth*80+'deg');hph.style.setProperty('--rx',-(e.clientY-b.top-b.height/2)/innerHeight*60+'deg')})};
