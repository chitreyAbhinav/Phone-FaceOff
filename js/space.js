// Space background, tuned for smooth scrolling: planet is pre-rendered sprites (no per-frame blur), canvas idles at ~15fps when you are not scrolling,
// and scroll progress is written only to the nebula + progress bar (never to the whole page).
(()=>{const cv=document.getElementById('space'),x=cv.getContext('2d'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,neb=document.querySelector('.neb'),pg=document.getElementById('pg');
let max=1,lsp=-1,scr=0,slow=0,idleF=0,lite=false,mx=.5,my=.5,W,H,D,stars=[],shoot=[],lastY=scrollY,vel=0,sp=0,tl=0,spr=[];
const LAY=[{n:90,r:.7,k:.12,a:.55},{n:50,r:1.1,k:.3,a:.8},{n:22,r:1.7,k:.6,a:1}];
const root=document.documentElement,meas=()=>{max=Math.max(1,root.scrollHeight-innerHeight)};
function init(){meas();D=Math.min(devicePixelRatio||1,1.5);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;spr=[];stars=[];
 LAY.forEach((L,li)=>{for(let i=0;i<L.n;i++){const h=Math.random()<.3?200+Math.random()*60:Math.random()<.2?30+Math.random()*25:0;stars.push({x:Math.random()*W,y:Math.random()*H,l:li,p:Math.random()*6.28,c:h?`hsl(${h} 90% 80%)`:'#fff'})}})}
function mk(b){const R=Math.min(W,H)*.13,S=Math.ceil(R*4.4),c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),m=S/2,h=165+b*9;
 const ha=g.createRadialGradient(m,m,R*.9,m,m,R*1.8);ha.addColorStop(0,`hsla(${h} 90% 60% / .35)`);ha.addColorStop(1,'transparent');g.fillStyle=ha;g.fillRect(0,0,S,S);
 const gr=g.createRadialGradient(m-R*.4,m-R*.4,R*.1,m,m,R);gr.addColorStop(0,`hsl(${h} 80% 70%)`);gr.addColorStop(.6,`hsl(${h+30} 70% 38%)`);gr.addColorStop(1,`hsl(${h+60} 70% 8%)`);
 g.fillStyle=gr;g.beginPath();g.arc(m,m,R,0,6.283);g.fill();g.strokeStyle=`hsla(${h+20} 80% 75% / .5)`;
 g.lineWidth=R*.07;g.beginPath();g.ellipse(m,m,R*1.7,R*.4,-.35,0,6.283);g.stroke();g.lineWidth=R*.03;g.beginPath();g.ellipse(m,m,R*2,R*.5,-.35,0,6.283);g.stroke();return[c,S]}
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth;my=e.clientY/innerHeight},{passive:true});
function draw(t,y,v,dt){x.clearRect(0,0,W,H);
 const b=Math.round(sp*6),R=Math.min(W,H)*.13,px=W*(.82-sp*.7)-(mx-.5)*W*.03,py=H*(.2+sp*.55)+Math.sin(t*.0006)*H*.012-(my-.5)*H*.02,[c,S]=spr[b]||(spr[b]=mk(b)),a=sp*6+t*.0004;
 x.globalAlpha=.9;x.drawImage(c,px-S/2,py-S/2);x.globalAlpha=1;x.fillStyle='#cfd6ff';x.beginPath();x.arc(px-R*2.4*Math.cos(a),py+R*.9*Math.sin(a),R*.14,0,6.283);x.fill();
 for(let q=0;q<stars.length;q++){if(lite&&q&1)continue;const s=stars[q];const L=LAY[s.l],yy=((s.y-y*D*L.k-t*.012*D*(L.k+.15))%H+H)%H,ox=(.5-mx)*40*L.k*D,sx=((s.x+ox)%W+W)%W,len=v*L.k*1.6;
  x.globalAlpha=RM?L.a:L.a*(.55+.45*Math.sin(t*.002+s.p));x.fillStyle=x.strokeStyle=s.c;
  if(Math.abs(len)>1.5){x.lineWidth=L.r*D;x.beginPath();x.moveTo(sx,yy);x.lineTo(sx,yy+len);x.stroke()}else x.fillRect(sx,yy,L.r*2*D,L.r*2*D)}
 x.globalAlpha=1;
 shoot=shoot.filter(s=>{s.x+=s.vx*dt/16;s.y+=s.vy*dt/16;s.l-=.016*dt/16;if(s.l<=0)return false;
  const g=x.createLinearGradient(s.x,s.y,s.x-s.vx*9,s.y-s.vy*9);g.addColorStop(0,`rgba(255,255,255,${s.l})`);g.addColorStop(1,'transparent');
  x.strokeStyle=g;x.lineWidth=2*D;x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x-s.vx*9,s.y-s.vy*9);x.stroke();return true})}
function frame(t){requestAnimationFrame(frame);if(document.hidden)return;const y=scrollY;vel+=((y-lastY)-vel)*.15;lastY=y;
 const idle=Math.abs(vel)<.3&&!shoot.length;if(idle&&t-tl<33)return;const dt=Math.min(t-tl,50);tl=t;
 sp=Math.min(1,y/max);if(Math.abs(sp-lsp)>.0008){lsp=sp;neb.style.setProperty('--sp',sp.toFixed(3));pg.style.transform=`scaleX(${sp.toFixed(3)})`}
 if(Math.abs(vel)>.5){idleF=0;if(!scr){scr=1;root.classList.add('scr')}if(!lite){if(dt>34)slow++;else if(slow>0)slow-=.5;if(slow>40){lite=true;root.classList.add('lite')}}}else if(scr&&++idleF>10){scr=0;root.classList.remove('scr')}
 if(Math.random()<.012)shoot.push({x:Math.random()*W,y:Math.random()*H*.5,vx:(6+Math.random()*6)*D,vy:(3+Math.random()*3)*D,l:1});
 draw(t,y,Math.max(-80,Math.min(80,vel))*D,dt)}
init();addEventListener('resize',init);addEventListener('load',meas);if(window.ResizeObserver)new ResizeObserver(meas).observe(document.body);
if(RM)draw(0,0,0,0);else requestAnimationFrame(frame)})();
