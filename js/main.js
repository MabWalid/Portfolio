const $=id=>document.getElementById(id),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let calm=RM;const setCalm=()=>{$("calm").textContent=calm?"Réactiver les effets":"Calmer les effets";$("calm").setAttribute("aria-pressed",calm)};setCalm();
$("calm").onclick=()=>{calm=!calm;setCalm()};
// ====== TES PROJETS : modifie ici ======
const P=[["FitAI","E-commerce, 2026","Catalogue de mode, panier et styliste : une tenue selon l’occasion, la météo et le budget.",["Java","Spring","React","Docker"],260,"https://github.com/MabWalid/FitAI"],
["Passerelle","Fidélité digitale","Carte par enseigne, aperçu et mise à jour vers Apple Wallet et Google Wallet.",["Node","Express","PassKit"],190,"https://github.com/MabWalid/passerelle"],
["Conserval","Stage, Safi, 2026","Traçabilité des lots de production et des stocks, avec des API REST.",["Spring","Angular","Postgres"],40,"mailto:mabroukwalid0@gmail.com"]];
$("gr").innerHTML=P.map(p=>`<article class="card fx" style="--h:${p[4]}"><div class="art"></div><h3>${p[0]}</h3><p>${p[1]}. ${p[2]}</p><div class="chips">${p[3].map(t=>`<code>${t}</code>`).join("")}</div><a href="${p[5]}">${p[5].startsWith("mailto:")?"Écrire":"Voir le code"}</a></article>`).join("");
document.querySelectorAll(".card").forEach(c=>{
 c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  if(!RM)c.style.transform=`perspective(900px) rotateY(${(x-.5)*24}deg) rotateX(${(.5-y)*24}deg) scale(1.03)`;
  c.style.setProperty("--gx",x*100);c.style.setProperty("--gy",y*100)});
 c.addEventListener("pointerleave",()=>{c.style.transform="";c.style.setProperty("--gx",50);c.style.setProperty("--gy",50)})});
const FX=[...document.querySelectorAll(".fx")];
// ====== Fond WebGL : 6 illusions qui se fondent au scroll ======
const VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,M;uniform float T,S,K;
const vec3 UV=vec3(.0,.16,.1),CY=vec3(.0,.82,.62),MG=vec3(.75,.04,.14);
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
 return mix(vec3(.02,.03,.03),vec3(.04,.28,.2),c)*(1.1-.5*r);}
vec3 spi(vec2 p){float r=length(p)+.001,a=atan(p.y,p.x);
 float s=sin(a*5.+log(r)*7.-T*2.2),b=smoothstep(-.08,.08,s);
 return mix(vec3(.02,.01,.06),mix(CY,MG,.5+.5*sin(T*.5+r*3.)),b)*(.4+.9*smoothstep(.0,.35,r));}
vec3 grd(vec2 p){p+=M*.05;vec2 g=abs(fract(p*7.+T*.02)-.5);float l=smoothstep(.47,.5,max(g.x,g.y));
 return vec3(.03,.035,.09)+vec3(.14,.12,.4)*l*.6;}
vec3 lav(vec2 p){float n=sin(p.x*3.+T*.7+sin(p.y*4.-T*.5))+sin(p.y*3.-T*.6+sin(p.x*5.+T*.4));n=.5+.25*n;
 return mix(vec3(.02,.05,.04),vec3(.05,.32,.18),n)*(1.1-.4*length(p));}
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
// ====== Boucle principale ======
let tx=0,ty=0,mx=0,my=0,Tt=0,Ss=0,lt=0;
addEventListener("pointermove",e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5});
function loop(t){const T=t/1000,dt=Math.min(.05,T-lt);lt=T;
 mx+=(tx-mx)*.08;my+=(ty-my)*.08;document.documentElement.style.setProperty("--dx",(mx*18).toFixed(2));Tt+=dt*(calm?.25:1)*(RM?.2:1);Ss+=(sceneS()-Ss)*.08;
 if(gl){const w=innerWidth*.7|0,h=innerHeight*.7|0;if(bg.width!=w||bg.height!=h){bg.width=w;bg.height=h;gl.viewport(0,0,w,h)}
  gl.uniform2f(U.R,w,h);gl.uniform1f(U.T,Tt);gl.uniform2f(U.M,mx*innerWidth/innerHeight,-my);gl.uniform1f(U.S,Ss);gl.uniform1f(U.K,calm?.35:1);gl.drawArrays(gl.TRIANGLES,0,3)}
 FX.forEach(e=>{const r=e.getBoundingClientRect();if(r.bottom<-300||r.top>innerHeight+300)return;const q=(r.top+r.height/2-innerHeight/2)/innerHeight,a=Math.abs(q),o=1-Math.max(0,Math.min(1,(a-.62)/.38));
  e.style.opacity=o.toFixed(3);e.style.translate=`0 ${(q*16).toFixed(1)}px`});
 requestAnimationFrame(loop)}
// ====== Intro ======
function decode(){const h=$("nm"),tg=h.dataset.t,s=performance.now();(function f(){const p=(performance.now()-s)/1500;
 h.textContent=RM?tg:[...tg].map((c,i)=>c==" "?" ":(p>i/tg.length*.8+.2?c:"▓▒░#/<>"[Math.random()*7|0])).join("");if(p<1.2&&!RM)requestAnimationFrame(f);else h.textContent=tg})()}
(()=>{const full=["> initializing...","> mounting living world","walid@lille:~$ ./enter","stack     java · react · node","world     online","_"].join("\n"),bt=$("bt"),bootMs=2000;
 const finish=()=>{$("boot").classList.add("out");dispatchEvent(new Event("world-ready"));setTimeout(decode,300);setTimeout(()=>$("boot").remove(),850)};
 if(RM){bt.textContent=full;finish();return}
 const start=performance.now();let n=-1;
 (function tick(now){const elapsed=now-start,target=Math.min(full.length,(elapsed/14)|0);
  if(target!==n){n=target;bt.textContent=full.slice(0,n)+(n<full.length?"▌":"")}
  if(elapsed<bootMs)requestAnimationFrame(tick);else{bt.textContent=full;finish()}})(start)})();
document.addEventListener("visibilitychange",()=>{document.title=document.hidden?"Reviens, j’ai pas fini 👀":"Walid Mabrouk — Architecte d’illusions"});
requestAnimationFrame(loop);
