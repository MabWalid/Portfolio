const $=id=>document.getElementById(id),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let calm=RM;const setCalm=()=>{$("calm").textContent=calm?"Réactiver les effets":"Calmer les effets";$("calm").setAttribute("aria-pressed",calm)};setCalm();
$("calm").onclick=()=>{calm=!calm;setCalm()};
// ====== TES PROJETS : modifie ici ======
const P=[["Nuage de Papier","Application web, 2025","Recherche instantanée dans des milliers de documents d’équipe.",["React","Node","Postgres"],260],
["Café Compta","Tableau de bord, 2025","Une vue en direct des finances, sans export Excel.",["Vue","D3","Firebase"],190],
["Salle de Pause","Jeu mobile, 2024","Des parties de deux minutes pour les trajets et les pauses.",["Unity","C#"],310],
["Open Data Lab","Visualisation 3D, 2023","Des données publiques à explorer comme une carte du ciel.",["Python","Three.js"],20]];
$("gr").innerHTML=P.map(p=>`<article class="card fx" style="--h:${p[4]}"><div class="art"></div><h3>${p[0]}</h3><p>${p[1]}. ${p[2]}</p><div class="chips">${p[3].map(t=>`<code>${t}</code>`).join("")}</div><a href="#">Voir le projet</a></article>`).join("");
document.querySelectorAll(".card").forEach(c=>{
 c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  if(!RM)c.style.transform=`perspective(900px) rotateY(${(x-.5)*24}deg) rotateX(${(.5-y)*24}deg) scale(1.03)`;
  c.style.setProperty("--gx",x*100);c.style.setProperty("--gy",y*100)});
 c.addEventListener("pointerleave",()=>{c.style.transform="";c.style.setProperty("--gx",50);c.style.setProperty("--gy",50)})});
const FX=[...document.querySelectorAll(".fx")];
const tst=m=>{const t=$("tst");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),2800)};
// ====== Fond WebGL : 6 illusions qui se fondent au scroll ======
const VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,M;uniform float T,S,K;
const vec3 UV=vec3(.48,.36,1.),CY=vec3(.16,.94,1.),MG=vec3(1.,.24,.65);
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 tun(vec2 p){float r=length(p)+.001,a=atan(p.y,p.x),z=.35/r;
 float ring=.02/(abs(fract(z-T*.5)-.5)+.02),sp=.02/(abs(sin(a*4.+z*.25))+.02),k=smoothstep(.0,.3,r);
 return mix(UV,CY,.5+.5*sin(z*.6+T*.4))*(ring*.55+sp*.4)*k*(1.-.35*r);}
vec3 moi(vec2 p){vec2 c1=vec2(sin(T*.3)*.35,cos(T*.25)*.2),c2=-c1*.6+M*.5;
 float a=step(0.,sin(length(p-c1)*120.)),b=step(0.,sin(length(p-c2)*120.)),v=abs(a-b);
 return mix(vec3(.02,.02,.08),mix(UV,CY,.5+.5*sin(p.x*3.+T)),v)*.85;}
vec3 chk(vec2 p){vec2 q=p-M*.4;float r=length(q);q=rot(T*.12)*q;
 float e=1.45+.55*sin(T*.9);q=normalize(q+1e-5)*pow(r*1.15,e)*.85;
 float c=mod(floor(q.x*9.)+floor(q.y*9.),2.);
 return mix(vec3(.02,.02,.07),vec3(.9,.95,1.),c)*(1.1-.5*r);}
vec3 spi(vec2 p){float r=length(p)+.001,a=atan(p.y,p.x);
 float s=sin(a*5.+log(r)*7.-T*2.2),b=smoothstep(-.08,.08,s);
 return mix(vec3(.02,.01,.06),mix(CY,MG,.5+.5*sin(T*.5+r*3.)),b)*(.4+.9*smoothstep(.0,.35,r));}
vec3 grd(vec2 p){p+=M*.05;vec2 g=abs(fract(p*7.+T*.02)-.5);float l=smoothstep(.47,.5,max(g.x,g.y));
 return vec3(.03,.035,.09)+vec3(.14,.12,.4)*l*.6;}
vec3 lav(vec2 p){float n=sin(p.x*3.+T*.7+sin(p.y*4.-T*.5))+sin(p.y*3.-T*.6+sin(p.x*5.+T*.4));n=.5+.25*n;
 return mix(vec3(.1,.04,.3),vec3(.7,.12,.6),n)*(1.1-.4*length(p));}
void main(){vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 d=p-M;float l=length(d);p+=d/(l+.001)*.07*exp(-l*4.)*K;
 vec3 col=vec3(0.);float w;
 w=max(0.,1.-abs(S));if(w>.001)col+=w*tun(p-M*.12);
 w=max(0.,1.-abs(S-1.));if(w>.001)col+=w*moi(p);
 w=max(0.,1.-abs(S-2.));if(w>.001)col+=w*chk(p);
 w=max(0.,1.-abs(S-3.));if(w>.001)col+=w*spi(p);
 w=max(0.,1.-abs(S-4.));if(w>.001)col+=w*grd(p);
 w=max(0.,1.-abs(S-5.));if(w>.001)col+=w*lav(p);
 col*=.55+.45*K;gl_FragColor=vec4(col,1.);}`;
const bg=$("bg");let gl=null,U={};
try{gl=bg.getContext("webgl",{antialias:false,alpha:false});
 if(gl){const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o},pr=gl.createProgram();
  gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))gl=null;else{gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
   const l=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);["R","T","M","S","K"].forEach(n=>U[n]=gl.getUniformLocation(pr,n))}}}catch(e){gl=null}
const secs=[...document.querySelectorAll("[data-a]")];
function sceneS(){const mid=innerHeight/2;let S=+secs[0].dataset.a;for(const s of secs){const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){const p=(mid-r.top)/r.height,e=Math.min(1,Math.max(0,(p-.3)/.4));S=+s.dataset.a+(+s.dataset.b-+s.dataset.a)*e*e*(3-2*e);break}}return S}
// ====== Zoom arrière infini (effet Droste) + légendes ======
const fr=l=>`<div class="fr" style="--h:${(l*38+250)%360}"><div class="sc"><b>niveau ${l}</b><code>$ ./monde --niveau ${l}\n> tu es dans l’écran</code>${l<9?fr(l+1):""}</div></div>`;
$("zw").innerHTML=fr(0);
const zs=$("z"),zw=$("zw"),zc=$("zc"),hy=$("hy"),hc=$("hc"),capZ=["Tu crois lire un site web.","Tu es dans un écran.","…dans un autre écran.","Je construis des mondes qu’on traverse."],
capH=["Ce damier est plat. Il respire quand même.","Ne bouge pas. Ça se transforme.","Ne cherche pas le centre. Il t’a déjà trouvé."];
const setCap=(el,t)=>{if(el.dataset.t!=t){el.dataset.t=t;el.innerHTML="<span></span>";el.firstChild.textContent=t}};
const prog=el=>{const r=el.getBoundingClientRect();return[r.bottom>0&&r.top<innerHeight,Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)))]};
// ====== Boucle principale ======
let tx=0,ty=0,mx=0,my=0,Tt=0,Ss=0,zp=0,lt=0,best=0,visC=false;
addEventListener("pointermove",e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;document.documentElement.style.setProperty("--dx",(tx*34).toFixed(1))});
function loop(t){const T=t/1000,dt=Math.min(.05,T-lt);lt=T;
 mx+=(tx-mx)*.06;my+=(ty-my)*.06;Tt+=dt*(calm?.25:1)*(RM?.2:1);Ss+=(sceneS()-Ss)*.12;
 if(gl){const w=innerWidth*.7|0,h=innerHeight*.7|0;if(bg.width!=w||bg.height!=h){bg.width=w;bg.height=h;gl.viewport(0,0,w,h)}
  gl.uniform2f(U.R,w,h);gl.uniform1f(U.T,Tt);gl.uniform2f(U.M,mx*innerWidth/innerHeight,-my);gl.uniform1f(U.S,Ss);gl.uniform1f(U.K,calm?.35:1);gl.drawArrays(gl.TRIANGLES,0,3)}
 let[v,p]=prog(zs);if(v){zp+=(p-zp)*.14;zw.style.setProperty("--s",Math.pow(1/.3,3*(1-zp)));zw.style.setProperty("--rot",(1-zp)*28+"deg");setCap(zc,capZ[Math.min(3,zp*4|0)])}
 [v,p]=prog(hy);if(v)setCap(hc,capH[p<.3?0:p<.7?1:2]);
 FX.forEach(e=>{const r=e.getBoundingClientRect();if(r.bottom<-300||r.top>innerHeight+300)return;const q=(r.top+r.height/2-innerHeight/2)/innerHeight,a=Math.abs(q),o=1-Math.max(0,Math.min(1,(a-.5)/.45));
  e.style.opacity=o.toFixed(3);e.style.translate=`0 ${(q*50).toFixed(1)}px`;e.style.scale=(1-a*.07).toFixed(3)});
 game(dt);if(visC)sym(T,dt);
 requestAnimationFrame(loop)}
// ====== Intro ======
function decode(){const h=$("nm"),tg=h.dataset.t,s=performance.now();(function f(){const p=(performance.now()-s)/1500;
 h.textContent=RM?tg:[...tg].map((c,i)=>c==" "?" ":(p>i/tg.length*.8+.2?c:"▓▒░#/<>"[Math.random()*7|0])).join("");if(p<1.2&&!RM)requestAnimationFrame(f);else h.textContent=tg})()}
(()=>{const full=["> boot reality.exe","> chargement des illusions… ok","> perspective : instable","> bienvenue."].join("\n"),bt=$("bt");let n=0;
 const iv=setInterval(()=>{bt.textContent=full.slice(0,++n)+"▌";if(n>=full.length){clearInterval(iv);setTimeout(()=>{$("boot").classList.add("out");setTimeout(decode,300);setTimeout(()=>$("boot").remove(),850)},350)}},RM?1:24)})();
// ====== Jeu : la balle ======
const gm=$("gm"),y=gm.getContext("2d");let HS=0,snd=false,AC=null;try{HS=+localStorage.getItem("hs")||0}catch(e){}
const nG=()=>({on:0,over:0,sc:0,cb:1,lives:3,O:[],P:[],H:[],sp:0,slow:0,shake:0,mx:1,fc:0});
let B={x:480,y:200,vx:0,vy:0,r:18},G=nG(),mp={x:0,y:0,in:0};
function beep(f){if(!snd)return;try{AC=AC||new AudioContext();const t=AC.currentTime,o=AC.createOscillator(),v=AC.createGain();o.type="triangle";o.frequency.value=f;v.gain.setValueAtTime(.07,t);v.gain.exponentialRampToValueAtTime(.0001,t+.18);o.connect(v);v.connect(AC.destination);o.start(t);o.stop(t+.2)}catch(e){}}
$("sn").onclick=()=>{snd=!snd;$("sn").textContent="Son : "+(snd?"on":"off");beep(440)};
function burst(x,yy,c,n){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=80+Math.random()*320;G.P.push({x,y:yy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.5+Math.random()*.4,c})}}
const gpos=e=>{const r=gm.getBoundingClientRect();mp.x=(e.clientX-r.left)*960/r.width;mp.y=(e.clientY-r.top)*540/r.height;mp.in=1};
gm.addEventListener("pointermove",gpos);gm.addEventListener("pointerleave",()=>mp.in=0);
gm.addEventListener("pointerdown",e=>{gpos(e);
 if(!G.on){G=nG();G.on=1;B={x:480,y:180,vx:(Math.random()-.5)*240,vy:0,r:18};$("gi").textContent="Garde la balle en l’air.";return}
 const dx=B.x-mp.x,dy=B.y-mp.y,d=Math.hypot(dx,dy)||1;if(d<210){B.vx+=dx/d*720;B.vy+=dy/d*720-260;G.shake=.14;burst(B.x,B.y,"#fff",10);beep(200)}});
function game(dt0){const r=gm.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 let dt=dt0;if(G.slow>0){G.slow-=dt0;dt*=.4}
 y.setTransform(1,0,0,1,0,0);y.clearRect(0,0,960,540);
 if(G.on){B.vy+=950*dt;B.vx*=1-.2*dt;
  if(mp.in){const dx=B.x-mp.x,dy=B.y-mp.y,d=Math.hypot(dx,dy)||1;if(d<160){const f=(1-d/160)*4200*dt;B.vx+=dx/d*f;B.vy+=dy/d*f}}
  const sp=Math.hypot(B.vx,B.vy);if(sp>1300){B.vx*=1300/sp;B.vy*=1300/sp}
  B.x+=B.vx*dt;B.y+=B.vy*dt;
  if(B.x<B.r){B.x=B.r;B.vx=Math.abs(B.vx)*.92;beep(150)}if(B.x>960-B.r){B.x=960-B.r;B.vx=-Math.abs(B.vx)*.92;beep(150)}
  if(B.y<B.r){B.y=B.r;B.vy=Math.abs(B.vy)*.92}
  G.fc-=dt;
  if(B.y>540-B.r){B.y=540-B.r;B.vy=-Math.max(560,Math.abs(B.vy)*.85);
   if(G.fc<=0){G.fc=.7;G.lives--;G.cb=1;G.shake=.3;burst(B.x,B.y,"#ff3ea5",24);beep(90);
    if(G.lives<=0){G.on=0;G.over=1;best=G.sc;if(G.sc>HS){HS=G.sc;try{localStorage.setItem("hs",HS)}catch(e){}}$("gi").textContent="Perdu. "+G.sc+" points, combo max x"+G.mx+". Clique pour rejouer."}}}
  G.H.push({x:B.x,y:B.y});if(G.H.length>18)G.H.shift();
  G.sp-=dt;if(G.O.length<3&&G.sp<=0){G.O.push({x:90+Math.random()*780,y:70+Math.random()*340,r:17,g:Math.random()<.1,l:7,ph:Math.random()*6});G.sp=1.1}
  G.O.forEach(o=>{o.l-=dt;o.ph+=dt*4;if(Math.hypot(o.x-B.x,o.y-B.y)<o.r+B.r){o.l=-1;G.sc+=(o.g?5:1)*G.cb;G.cb++;G.mx=Math.max(G.mx,G.cb);if(o.g)G.slow=2.4;G.shake=.15;burst(o.x,o.y,o.g?"#ffd84a":"#29f0ff",o.g?36:18);beep(300+Math.min(G.cb,20)*35)}});
  G.O=G.O.filter(o=>o.l>0)}
 G.P.forEach(p=>{p.x+=p.vx*dt0;p.y+=p.vy*dt0;p.vy+=400*dt0;p.l-=dt0});G.P=G.P.filter(p=>p.l>0);if(G.shake>0)G.shake-=dt0;
 const sh=G.shake>0?G.shake*30:0;y.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);
 y.fillStyle="#ff3ea544";y.fillRect(0,531,960,9);
 if(mp.in&&G.on){y.strokeStyle="#ffffff55";y.setLineDash([6,8]);y.lineWidth=2;y.beginPath();y.arc(mp.x,mp.y,160,0,7);y.stroke();y.setLineDash([])}
 G.O.forEach(o=>{const pu=1+Math.sin(o.ph)*.15,c=o.g?"#ffd84a":"#29f0ff";y.fillStyle=c;y.shadowColor=c;y.shadowBlur=22;y.beginPath();y.arc(o.x,o.y,o.r*pu,0,7);y.fill();y.shadowBlur=0;y.strokeStyle="#fff";y.lineWidth=3;y.beginPath();y.arc(o.x,o.y,o.r+7,-1.57,-1.57+6.283*o.l/7);y.stroke()});
 const hue=(190+G.cb*28)%360;
 G.H.forEach((h,i)=>{y.fillStyle=`hsla(${hue},100%,65%,${i/G.H.length*.4})`;y.beginPath();y.arc(h.x,h.y,B.r*i/G.H.length,0,7);y.fill()});
 if(G.on||G.over){const sp=Math.hypot(B.vx,B.vy),sx=1+Math.min(.4,sp/2200),c=`hsl(${hue},100%,65%)`;y.save();y.translate(B.x,B.y);y.rotate(Math.atan2(B.vy,B.vx));y.scale(sx,1/sx);y.fillStyle=c;y.shadowColor=c;y.shadowBlur=28;y.beginPath();y.arc(0,0,B.r,0,7);y.fill();y.restore();y.shadowBlur=0}
 G.P.forEach(p=>{y.globalAlpha=Math.min(1,p.l*2);y.fillStyle=p.c;y.fillRect(p.x-3,p.y-3,6,6)});y.globalAlpha=1;
 y.setTransform(1,0,0,1,0,0);
 y.fillStyle="#eef2ff";y.font="800 34px Unbounded,sans-serif";y.textAlign="left";y.fillText(G.sc,22,50);y.font="600 15px Sora,sans-serif";y.fillStyle="#9aa3dd";y.fillText("Record "+HS,22,74);
 if(G.cb>1){y.textAlign="center";y.font=`800 ${28+Math.min(G.cb,15)*2}px Unbounded,sans-serif`;y.fillStyle=`hsl(${hue},100%,70%)`;y.fillText("x"+G.cb,480,56)}
 for(let i=0;i<3;i++){y.fillStyle=i<G.lives?"#ff3ea5":"#ffffff22";y.beginPath();y.arc(938-i*28,36,9,0,7);y.fill()}
 if(!G.on){y.fillStyle="#05060dcc";y.fillRect(0,0,960,540);y.textAlign="center";y.fillStyle="#eef2ff";y.font="800 32px Unbounded,sans-serif";y.fillText(G.over?"Perdu : "+G.sc+" points":"Garde la balle en l’air",480,225);
  y.font="400 18px Sora,sans-serif";y.fillStyle="#b9c1f5";y.fillText(G.over?"Combo max x"+G.mx+". Record : "+HS:"Ton curseur la repousse. Clique pour la frapper.",480,270);y.fillStyle="#29f0ff";y.fillText("Clique pour "+(G.over?"rejouer":"jouer"),480,315)}}
// ====== Contact : le symbiote ======
const sy=$("sy"),z=sy.getContext("2d"),sg=$("sg"),zg=sg.getContext("2d"),cs=$("contact");
let SW=0,SH=0,pin=false,pxx=0,pyy=0,st=0,gr=0,gst=1,lock=0,cx0=0,cy0=0,R0=60;
const NT=9,SEG=22,TN=[];for(let i=0;i<NT;i++)TN.push({a:i/NT*6.2832+.3,tip:{x:0,y:0},pts:Array.from({length:SEG+1},()=>({x:0,y:0})),ph:Math.random()*6});
function sr(){const r=cs.getBoundingClientRect();SW=sy.width=sg.width=r.width|0;SH=sy.height=sg.height=r.height|0;cx0=SW/2;cy0=SH/2+SH*.05;R0=Math.min(SW,SH)*.11;TN.forEach(t=>{t.tip.x=cx0;t.tip.y=cy0;t.pts.forEach(p=>{p.x=cx0;p.y=cy0})})}
addEventListener("resize",sr);sr();
new IntersectionObserver(es=>{const was=visC;visC=es[0].isIntersecting;if(visC&&!was&&st==0)sr()},{threshold:.01}).observe(cs);
const pp=e=>{const r=cs.getBoundingClientRect();pxx=e.clientX-r.left;pyy=e.clientY-r.top;pin=true};
cs.addEventListener("pointermove",pp);cs.addEventListener("pointerdown",pp);cs.addEventListener("pointerleave",()=>pin=false);
function sym(T,dt){if(!SW)return;
 const dx=pxx-cx0,dy=pyy-cy0,dist=Math.hypot(dx,dy),DR=Math.min(SW,SH)*.8,near=pin&&dist<DR&&st==0;
 z.clearRect(0,0,SW,SH);zg.clearRect(0,0,SW,SH);cs.style.cursor=st==1?"none":"";
 if(st==0){const pa=Math.atan2(dy,dx);let bd=9;TN.forEach((t,i)=>{const d=Math.abs(Math.atan2(Math.sin(pa-t.a),Math.cos(pa-t.a)));if(d<bd){bd=d;lock=i}})}
 TN.forEach((t,i)=>{let X,Y,k=4;
  if(st==0){if(near){const l=i==lock,s=Math.abs(i-lock)*9+16;X=pxx+(l?0:Math.cos(T*2+i)*s);Y=pyy+(l?0:Math.sin(T*2.3+i)*s);k=l?12:7}
   else{const L=R0*(2.1+.7*Math.sin(T*1.4+t.ph)),a=t.a+Math.sin(T*.6+t.ph)*.5;X=cx0+Math.cos(a)*L;Y=cy0+Math.sin(a)*L}}
  else if(st==1){if(i==lock){const ex=cx0-t.tip.x,ey=cy0-t.tip.y,d=Math.hypot(ex,ey)||1,s=Math.min(d,720*dt);t.tip.x+=ex/d*s;t.tip.y+=ey/d*s;X=t.tip.x;Y=t.tip.y;k=0}
   else{X=cx0+Math.cos(t.a+T)*R0*1.6;Y=cy0+Math.sin(t.a+T)*R0*1.6;k=6}}
  else{X=cx0+Math.cos(t.a)*R0*.8;Y=cy0+Math.sin(t.a)*R0*.8;k=8}
  if(k){const f=1-Math.exp(-dt*k);t.tip.x+=(X-t.tip.x)*f;t.tip.y+=(Y-t.tip.y)*f}
  const ox=t.tip.x-cx0,oy=t.tip.y-cy0,ol=Math.hypot(ox,oy),mxl=DR*.98;if(ol>mxl){t.tip.x=cx0+ox/ol*mxl;t.tip.y=cy0+oy/ol*mxl}
  const L=Math.hypot(t.tip.x-cx0,t.tip.y-cy0)||1,nx=-(t.tip.y-cy0)/L,ny=(t.tip.x-cx0)/L,amp=R0*.5*((near||st==1)?.55:1);
  t.pts.forEach((p,j)=>{const u=j/SEG,w=Math.sin(u*5.5-T*7+t.ph)*amp*Math.sin(u*Math.PI),gx=cx0+(t.tip.x-cx0)*u+nx*w,gy=cy0+(t.tip.y-cy0)*u+ny*w,f=1-Math.exp(-dt*(22-14*u));p.x+=(gx-p.x)*f;p.y+=(gy-p.y)*f});
  if(st<2){z.fillStyle="#000";for(let j=1;j<=SEG;j++){const a=t.pts[j-1],b=t.pts[j],u=j/SEG;for(let s=0;s<3;s++){const q=s/3,rr=R0*.5*Math.pow(1-u,.8)+9;z.beginPath();z.arc(a.x+(b.x-a.x)*q,a.y+(b.y-a.y)*q,rr,0,7);z.fill()}}}});
 const pul=1+(near?.12:0)+Math.sin(T*2.2)*.03,Rc=(R0+(st==2?gr:0))*pul;z.fillStyle="#000";z.beginPath();z.arc(cx0,cy0,Rc*.9,0,7);z.fill();
 for(let k=0;k<8;k++){const a=k*.785+T*.4;z.beginPath();z.arc(cx0+Math.cos(a)*Rc*.42*(1+.25*Math.sin(T*1.7+k)),cy0+Math.sin(a)*Rc*.42*(1+.25*Math.sin(T*1.3+k*2)),Rc*.62,0,7);z.fill()}
 if(near){for(let j=0;j<2;j++){const rr=(T*170+j*DR*.45)%(DR*.9);zg.strokeStyle=`rgba(122,92,255,${(1-rr/(DR*.9))*.5})`;zg.lineWidth=2;zg.beginPath();zg.arc(cx0,cy0,rr,0,7);zg.stroke()}
  zg.strokeStyle="rgba(41,240,255,.8)";zg.lineWidth=2;const q=16+6*Math.sin(T*10);zg.beginPath();zg.arc(pxx,pyy,q,0,7);zg.stroke();
  for(let a=0;a<4;a++){const c=Math.cos(a*1.5708),s=Math.sin(a*1.5708);zg.beginPath();zg.moveTo(pxx+c*(q+3),pyy+s*(q+3));zg.lineTo(pxx+c*(q+11),pyy+s*(q+11));zg.stroke()}
  const lt=TN[lock].tip;if(Math.hypot(lt.x-pxx,lt.y-pyy)<20){st=1;gst=Math.hypot(lt.x-cx0,lt.y-cy0)||1}}
 if(st==1){const lt=TN[lock].tip,d=Math.hypot(lt.x-cx0,lt.y-cy0),sc=Math.max(.12,Math.min(1,(d-R0*.5)/(gst-R0*.5)));
  zg.save();zg.translate(lt.x,lt.y);zg.scale(sc*1.1,sc*1.1);zg.fillStyle="#fff";zg.strokeStyle="#000";zg.lineWidth=1.5;zg.beginPath();[[0,0],[0,18],[5,14],[9,22],[12,20],[8,13],[14,13]].forEach(p=>zg.lineTo(p[0],p[1]));zg.closePath();zg.fill();zg.stroke();zg.restore();
  if(d<R0*1){st=2;gr=0;$("rs").textContent="Il fait maintenant partie de moi."+(best?" Tu as marqué "+best+" points à la balle avant de venir.":"")}}
 if(st==2){gr+=dt*(500+gr*2.4);const big=R0+gr>Math.hypot(SW,SH)*.5;$("rv").classList.toggle("on",big);$("ct").style.opacity=0}}
$("rl").onclick=()=>{st=0;gr=0;pin=false;$("rv").classList.remove("on");$("ct").style.opacity=1};
// ====== Surprises ======
let kb="";addEventListener("keydown",e=>{kb=(kb+e.key).slice(-4);if(kb=="sudo")root()});
function root(){const m=$("mx"),c=m.getContext("2d");m.width=innerWidth;m.height=innerHeight;m.style.opacity=1;const cols=Array(Math.ceil(innerWidth/16)).fill(0);let n=0;
 const iv=setInterval(()=>{c.fillStyle="rgba(5,6,13,.15)";c.fillRect(0,0,m.width,m.height);c.fillStyle="#29f0ff";c.font="16px monospace";
  cols.forEach((v,i)=>{c.fillText(String.fromCharCode(0x30a0+Math.random()*96),i*16,v*16);cols[i]=v*16>m.height&&Math.random()>.97?0:v+1});
  if(++n>120){clearInterval(iv);m.style.opacity=0}},33);tst("sudo : accès root accordé")}
document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"Reviens, j’ai pas fini 👀":"Ton Nom — Architecte d’illusions"});
requestAnimationFrame(loop);
