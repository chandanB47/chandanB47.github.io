(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(pointer:fine)").matches;
const GH = "https://github.com/chandanB47";
$("#year").textContent = new Date().getFullYear();
if (reduce) document.documentElement.classList.add("noanim");

/* ---------- content ---------- */
const what = [["▤","Data Analysis","Clean, explore and analyze data to find meaningful insights."],["▥","Data Visualization","Build dashboards and reports using Power BI and Excel."],["</>","Problem Solving","Write efficient SQL queries and Python scripts to solve real world problems."],["⚙","Continuous Learning","Exploring new tools, working on projects and improving every day."]];
$("#what").innerHTML = what.map(w => `<div class="wc"><span class="ic">${w[0]}</span><h4>${w[1]}</h4><p>${w[2]}</p></div>`).join("");

const skills = [["SQL","SQL","Queries & databases","Joins · CTEs · Window functions","Structured querying and working with relational data."],["Py","Python","Automation & analysis","pandas · OOP · scripts","Automation, data cleaning and exploratory analysis."],["X","Excel","Models & reporting","MIS · Pivots · Power Query","Models, reconciliation and management-friendly KPI reports."],["BI","Power BI","Dashboards & BI","DAX · Reports · Visuals","Interactive dashboards built on clean data models."],["σ","Statistics","Patterns & probability","Distributions · Testing","Finding patterns and quantifying uncertainty."],["AI","AI / ML","Models & experiments","Scikit-learn · Evaluation","Building and testing simple machine learning models."],["✦","GenAI","LLMs & workflows","Prompting · Automation","Using LLMs to speed up analysis and workflows."],["$_","Linux","CLI & systems","Shell · Files · Tools","Comfortable working in the command line."],["⌘","Git / GitHub","Version control","Repos · Branches · Pages","Tracking work and publishing projects."],["SAP","SAP","ERP workflows","Records · Dispatch · MIS","Operating ERP workflows with accurate records."]];
$("#skillgrid").innerHTML = skills.map((s,i) => `<button class="sk rv" data-d="${i%3}" data-i="${i}"><span class="n">${String(i+1).padStart(2,"0")}</span><span class="ic">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p><span class="ex">${s[3]}</span></button>`).join("");
$$(".sk").forEach(c => {
  c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX-r.left+"px"); c.style.setProperty("--my", e.clientY-r.top+"px"); });
  c.addEventListener("click", () => { const s = skills[c.dataset.i]; $("#mi").textContent = s[0]; $("#mt").textContent = s[1]; $("#mp").textContent = s[4] + " — " + s[3]; $("#md").hidden = false; $("#mx").focus(); });
});
const md = $("#md"); md.onclick = e => { if (e.target === md || e.target.id === "mx") md.hidden = true; }; addEventListener("keydown", e => { if (e.key === "Escape") md.hidden = true; });

const P = [
 {t:"Retail Operations SQL Analytics",url:"https://github.com/chandanB47/Data-Science-Learning/tree/main/SQL/Milestone_Project_01_Retail_Operations",c:"sql analytics",ic:"≣",wide:1,f:1,col:"#eaffb0",d:"End-to-end MySQL retail analytics project with a relational database (7 tables) covering customer, product, store, sales, inventory, discounts, profitability, employee hierarchy and order fulfilment analysis.",s:[["7","Tables"],["37","Analytical tasks"],["7","Business questions"],["10","Advanced challenges"]],g:["MySQL","Joins","CTEs","Window Functions","Data Analysis","Business Insights"],det:1},
 {t:"EventSphere — Event Ticket Reservation",c:"python",ic:"▣",col:"#cfe0ff",d:"Console-based event ticket reservation system built with Python, OOP and SQLite. Admins can manage events, users can book and cancel tickets, view booking history and generate revenue reports with CSV export.",g:["Python","SQLite","CRUD","OOP"]},
 {t:"Vehicle Rental Management System",c:"python",ic:"🚗",col:"#ffe2b8",d:"A console-based Vehicle Rental Management System built with Python, OOP and file handling. Separate admin and customer flows, vehicle inventory, availability checks, rentals and returns.",g:["Python","OOP","File Handling","Validation"]},
 {t:"Student Management System",c:"python",ic:"🎓",wide:1,col:"#eaffb0",d:"A Python command-line application for creating, viewing, updating, deleting and searching student records. Demonstrates CRUD operations and menu-driven programming with clean and modular code.",s:[["CRUD","Operations"],["Student","Records"],["CLI","Application"],["Modular","Code structure"]],g:["Python","CRUD","CLI","File Handling","OOP","Data Management"],det:1},
 {t:"Data Science Learning Journey",c:"python sql excel analytics",ic:"📖",wide:1,col:"#e5dcff",d:"My learning journey covering Python, SQL, Excel, Power BI, Statistics, Machine Learning and Gen AI with practice exercises and project documentation.",g:["Python","SQL","Excel","Power BI","Statistics","Machine Learning","Gen AI"]}
];
$("#projects").innerHTML = P.map(p => `<article class="pj ${p.wide?"wide ":""}rv" data-c="${p.c}" style="--t:${p.col}"><header><span class="ic">${p.ic}</span><h3>${p.t}</h3>${p.f?'<span class="feat">★ Featured project</span>':""}</header><p>${p.d}</p>${p.s?`<div class="stats">${p.s.map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join("")}</div>`:""}<div class="tags">${p.g.map(x=>`<span>${x}</span>`).join("")}</div><div class="links">${p.det?`<a class="btn lime" href="${p.url || GH}" target="_blank" rel="noopener">View on GitHub ↗</a><a class="btn ghost" href="${p.url || GH}" target="_blank" rel="noopener">View Project Details ↗</a>`:`<a class="tx" href="${p.url || GH}" target="_blank" rel="noopener">View on GitHub ↗</a>`}</div></article>`).join("");
const F = [["all","All projects"],["sql","SQL"],["python","Python"],["analytics","Analytics"],["excel","Excel"],["other","Other"]];
$("#filters").innerHTML = F.map((f,i) => `<button data-f="${f[0]}" class="${i?"":"on"}">${f[1]}</button>`).join("");
$("#filters").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return;
  $$("#filters button").forEach(x => x.classList.toggle("on", x === b));
  $$(".pj").forEach(p => { const show = b.dataset.f === "all" || p.dataset.c.split(" ").includes(b.dataset.f); p.classList.toggle("hide", !show); if (show) { p.classList.remove("in"); void p.offsetWidth; p.classList.add("in"); } }); });

/* ---------- loader + hero entrance ---------- */
document.body.classList.add("lock");
const words = ["Query","Analyze","Visualize"]; let wi = 0;
const wt = setInterval(() => { wi = (wi+1)%words.length; const w = $("#ldw"); w.textContent = words[wi]; w.style.animation = "none"; w.offsetHeight; w.style.animation = ""; }, 650);
const T = reduce ? 1 : 2100, t0 = performance.now();
(function step(n){ const p = Math.min((n-t0)/T,1), c = Math.round(p*100); $("#ldn").textContent = String(c).padStart(3,"0"); $("#ldb").style.transform = `scaleX(${p})`;
  if (p < 1) return requestAnimationFrame(step);
  clearInterval(wt); setTimeout(() => { $("#loader").classList.add("out"); document.body.classList.remove("lock"); document.body.classList.add("go"); setTimeout(() => $("#loader").remove(), 1000); }, 250); })(t0);
setTimeout(() => { document.body.classList.add("go"); }, 6000); /* safety net */
document.body.addEventListener("transitionend", () => {}, {once:true});
const css = document.createElement("style"); css.textContent = ".go .hero .h-in{opacity:1;transform:none;filter:none}"; document.head.appendChild(css);

/* ---------- typing ---------- */
const lines = ["SELECT insight FROM data;","import pandas as pd","Dashboards people actually use.","Clean data. Clear decisions."], ty = $("#typer"); let li = 0, ci = 0, del = false;
(function tick(){ if (!ty) return; if (reduce) { ty.textContent = lines[0]; return; } const s = lines[li]; ty.textContent = s.slice(0,ci);
  if (!del && ci === s.length) { del = true; return setTimeout(tick, 1500); } if (del && ci === 0) { del = false; li = (li+1)%lines.length; } ci += del ? -1 : 1; setTimeout(tick, del ? 25 : 60);
})();

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -60px 0px",threshold:.05});
$$(".rv").forEach(x => io.observe(x));
const so = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; so.unobserve(e.target); const b = e.target.querySelector("b"), n = +b.dataset.n, s = b.dataset.s || "", t = performance.now();
  (function f(x){ const p = reduce ? 1 : Math.min((x-t)/1800,1); b.textContent = Math.round(n*(1-Math.pow(1-p,3))).toLocaleString() + s; if (p < 1) requestAnimationFrame(f); })(t); }), {threshold:.5});
$$(".stat").forEach(x => so.observe(x));

/* ---------- scroll effects ---------- */
const pn = $("#pn"), prog = $("#prog"), navl = $$(".nl"), ids = ["top","about","skills","work","experience"], secs = ids.map(i => document.getElementById(i)), exp = $("#exp"), blobs = $$(".hero .blob");
function onScroll(){
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${y/max})`; pn.classList.toggle("sh", y > 60);
  let cur = 0; secs.forEach((s,i) => { if (s.getBoundingClientRect().top < innerHeight*.4) cur = i; }); navl.forEach((a,i) => a.classList.toggle("on", i === cur));
  const r = exp.getBoundingClientRect(); exp.style.setProperty("--p", Math.max(0, Math.min(1, (innerHeight*.6 - r.top)/r.height)));
}
let tk=0; addEventListener("scroll", () => { if (!tk) tk = requestAnimationFrame(() => { tk = 0; onScroll(); }); }, {passive:true}); onScroll();

/* ---------- tilt + magnetic ---------- */
if (fine && !reduce) {
  $$(".pj").forEach(c => { c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5; c.style.transition = "box-shadow .3s"; c.style.transform = `perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-4px)`; });
    c.addEventListener("pointerleave", () => { c.style.transition = ""; c.style.transform = ""; }); });
  $$(".btn,.say").forEach(b => { b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`; }); b.addEventListener("pointerleave", () => b.style.transform = ""); });
}

/* ---------- copy email ---------- */
const cp = $("#copy"), EM = "chandanb.dev@gmail.com";
cp.addEventListener("click", async () => { try { await navigator.clipboard.writeText(EM); } catch (e) { const t = document.createElement("textarea"); t.value = EM; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
  cp.textContent = "Copied ✓"; cp.classList.add("ok"); setTimeout(() => { cp.textContent = "Copy email"; cp.classList.remove("ok"); }, 1800); });

$("#cover").addEventListener("click", e => { if (!e.target.closest("a,button")) document.getElementById("about").scrollIntoView({behavior:reduce?"auto":"smooth"}); });
})();


/* =====================================================================
   CINEMATIC MOTION LAYER — additive; core site logic above is untouched
   ===================================================================== */
(() => { try {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(pointer:fine)").matches;
const lerp = (a,b,t) => a+(b-a)*t, clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const body = document.body, root = document.documentElement, NS = "http://www.w3.org/2000/svg";
const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
if (reduce) return;

/* 1 ─ film grain + vignette */
body.appendChild(mk("div","cin-grain")); body.appendChild(mk("div","cin-vig"));

/* 2 ─ loader → lime curtain wipe */
const ld = $("#loader");
if (ld) {
  const wp = mk("div"); wp.id = "wipe"; body.appendChild(wp);
  new MutationObserver((_, ob) => { if (ld.classList.contains("out")) { wp.classList.add("out"); ob.disconnect(); setTimeout(() => wp.remove(), 1700); } }).observe(ld, {attributes:true, attributeFilter:["class"]});
}

/* 3 ─ split headings into masked words */
function split(el){
  let n = 0; el.setAttribute("aria-label", el.innerHTML.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim());
  (function walk(node){ [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p => { if (!p) return;
        if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(" ")); return; }
        const w = mk("span","w"), i = mk("span","wi"); w.setAttribute("aria-hidden","true"); i.style.setProperty("--i", n++); i.textContent = p; w.appendChild(i); f.appendChild(w); });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
  }); })(el);
}
$$("h2").forEach(split);

/* 4 ─ stagger delays inside grids */
[["#skillgrid .sk",3,.09],[".projects .pj",2,.14],[".steps .step",4,.1],["#what .wc",4,.09],[".g3 .stat",3,.12]].forEach(([sel,m,g]) => $$(sel).forEach((el,i) => el.style.setProperty("--dl", (i%m)*g + "s")));

/* 6 ─ marquee ribbons respond to scroll velocity (speed + skew) */
const xw = $(".xwrap");
if (xw) {
  let lastY = scrollY, vel = 0, rate = 1, sk = 0, run = false, mq = [];
  const grab = () => { mq = document.getAnimations().filter(a => a.animationName === "mq"); };
  const tick = () => {
    if (!mq.length) grab();
    const dy = scrollY-lastY; lastY = scrollY; vel = lerp(vel, dy, .14);
    rate = lerp(rate, 1 + clamp(Math.abs(vel),0,70)*.09, .12); sk = lerp(sk, clamp(-vel*.22,-9,9), .12);
    mq.forEach(a => a.playbackRate = rate); xw.style.setProperty("--sk", sk.toFixed(2)+"deg");
    if (Math.abs(vel) > .05 || Math.abs(rate-1) > .01 || Math.abs(sk) > .02) requestAnimationFrame(tick);
    else { run = false; mq.forEach(a => a.playbackRate = 1); xw.style.setProperty("--sk","0deg"); }
  };
  addEventListener("scroll", () => { if (!run) { run = true; requestAnimationFrame(tick); } }, {passive:true});
}

/* 7 ─ contact blob parallax */
const cb = $(".contact .blob");
if (cb) { let t = 0; addEventListener("scroll", () => { if (t) return; t = requestAnimationFrame(() => { t = 0; const r = cb.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; cb.style.translate = `0 ${((r.top - innerHeight*.4)*-.14).toFixed(1)}px`; }); }, {passive:true}); }

/* 8 ─ desktop-only: card glare/tilt + custom cursor */
if (fine) {
  $$(".pj").forEach(c => { const g = mk("i","glr"); g.setAttribute("aria-hidden","true"); c.appendChild(g);
    c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height; c.style.setProperty("--gx", x*100+"%"); c.style.setProperty("--gy", y*100+"%"); c.style.setProperty("--px", (x-.5)*2); c.style.setProperty("--py", (y-.5)*2); });
    c.addEventListener("pointerleave", () => { c.style.setProperty("--px",0); c.style.setProperty("--py",0); }); });
  $$(".sk").forEach(c => {
    c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5; c.style.transition = "border-color .3s,box-shadow .3s"; c.style.transform = `perspective(800px) rotateX(${(-y*10).toFixed(2)}deg) rotateY(${(x*12).toFixed(2)}deg) translateY(-8px)`; });
    c.addEventListener("pointerleave", () => { c.style.transition = ""; c.style.transform = ""; }); });

  /* custom cursor removed: the normal mouse pointer is used */
}
} catch (err) { console.warn("cinematic layer skipped:", err); } })();


/* =====================  v2 ADDITIONS  ===================== */
(() => { try {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(pointer:fine)").matches;
const lerp = (a,b,t) => a+(b-a)*t, clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const body = document.body, root = document.documentElement;
if (reduce) return;

/* cinematic letterbox bars: frame the intro, then open */
["t","b"].forEach(k => { const d = document.createElement("div"); d.className = "cin-bar " + k; body.appendChild(d); });
const openBars = () => setTimeout(() => $$(".cin-bar").forEach(b => b.classList.add("open")), 1100);
if (body.classList.contains("go")) openBars();
else { const w = new MutationObserver(() => { if (body.classList.contains("go")) { w.disconnect(); openBars(); } }); w.observe(body, {attributes:true, attributeFilter:["class"]}); }
setTimeout(() => $$(".cin-bar").forEach(b => b.classList.add("open")), 7000); /* safety */

/* heading parallax scrub */
const hs = $$("h2"); let pt = 0;
addEventListener("scroll", () => { if (pt) return; pt = requestAnimationFrame(() => { pt = 0; hs.forEach(h => { const r = h.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return; h.style.translate = `0 ${((r.top - innerHeight*.5)*-.07).toFixed(1)}px`; }); }); }, {passive:true});

/* smooth inertial scrolling (desktop mouse/trackpad wheel + anchor links) */
if (false) { /* custom smooth-scroll removed: native scrolling is smoother */
  let cur = scrollY, tgt = scrollY, on = false, k = .085;
  const max = () => root.scrollHeight - innerHeight;
  const free = () => !body.classList.contains("lock") && !($("#md") && !$("#md").hidden);
  const step = () => { cur = lerp(cur, tgt, k);
    if (Math.abs(tgt-cur) < .4) { cur = tgt; scrollTo(0, cur); on = false; root.classList.remove("lenis"); return; }
    scrollTo(0, cur); requestAnimationFrame(step); };
  const go = (y, kk) => { cur = scrollY; tgt = clamp(y, 0, max()); k = kk; if (!on) { on = true; root.classList.add("lenis"); requestAnimationFrame(step); } };
  addEventListener("wheel", e => { if (e.ctrlKey || !free() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; e.preventDefault();
    const base = on ? tgt : scrollY; go(base + e.deltaY*(e.deltaMode === 1 ? 32 : 1), .085); }, {passive:false});
  addEventListener("scroll", () => { if (!on) { cur = tgt = scrollY; } }, {passive:true});
  document.addEventListener("click", e => { const a = e.target.closest('a[href^="#"]'); if (!a || !free()) return;
    const id = a.getAttribute("href").slice(1), el = id ? document.getElementById(id) : null; if (id && !el) return;
    e.preventDefault(); go(!id || id === "top" ? 0 : el.getBoundingClientRect().top + scrollY - 90, .07); });
}
} catch (err) { console.warn("v2 layer skipped:", err); } })();


/* =====================  v3 — NEW HERO ENGINE (3D ribbon knot)  ===================== */
(() => { try {
const $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, fine = matchMedia("(pointer:fine)").matches;
const lerp = (a,b,t) => a+(b-a)*t, clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const hero = $("#cover"), heroC = hero && $(".hero-c"), art = hero && $(".hero-art img");
if (!hero || !heroC) return;
const dpr = Math.min(devicePixelRatio || 1, 1.5);

/* ---- orchestration ---- */
const spot = document.createElement("div"), dust = document.createElement("canvas");
spot.className = "cin-spot"; dust.className = "cin-dust"; hero.insertBefore(dust, hero.firstChild); hero.insertBefore(spot, hero.firstChild);
if (reduce) return;
const gr = $(".hero .gr"), gl = $(".hero .gl"), sp0 = $(".hero .spot");
let lastMove = -1e9;
const M = {tx:0, ty:0, x:0, y:0, sx:0, sy:0, tsx:0, tsy:0};
hero.addEventListener("pointermove", e => { lastMove = performance.now(); const r = hero.getBoundingClientRect(); M.tx = (e.clientX-r.left)/r.width-.5; M.ty = (e.clientY-r.top)/r.height-.5; M.tsx = e.clientX-r.left; M.tsy = e.clientY-r.top; spot.classList.add("on"); });
hero.addEventListener("pointerleave", () => { M.tx = 0; M.ty = 0; lastMove = -1e9; });

const dctx = dust.getContext("2d"); let DW = 0, DH = 0, DP = [];
const sprite = rgb => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"), gd = g.createRadialGradient(32,32,0,32,32,32); gd.addColorStop(0,`rgba(${rgb},1)`); gd.addColorStop(.4,`rgba(${rgb},.4)`); gd.addColorStop(1,`rgba(${rgb},0)`); g.fillStyle = gd; g.fillRect(0,0,64,64); return c; };
const spr = [sprite("255,255,255"), sprite("198,255,46")];
function dsize(){ DW = hero.clientWidth; DH = hero.clientHeight; dust.width = DW*dpr; dust.height = DH*dpr; dctx.setTransform(dpr,0,0,dpr,0,0);
  const N = clamp(Math.round(DW/34), 16, 46); DP = Array.from({length:N}, () => { const z = .2 + Math.random()*.8; return {x:Math.random()*DW, y:Math.random()*DH, z, r:3+z*16, vx:(Math.random()-.5)*.1, vy:-(.05+Math.random()*.16)*z, a:(.14+Math.random()*.4)*z, ph:Math.random()*6.28, sp:.4+Math.random()*1.2, c:Math.random()<.26?1:0}; }); }
dsize(); addEventListener("resize", dsize);

let live = true, raf = 0, last = performance.now();
function frame(t){
  raf = 0; if (!live) return;
  const dt = Math.min(t-last, 50)/16.7; last = t;
  if (!fine || t - lastMove > 2200) { M.tx = Math.sin(t/2600)*.3; M.ty = Math.cos(t/3100)*.25; M.tsx = hero.clientWidth*(.55+M.tx); M.tsy = hero.clientHeight*(.45+M.ty); spot.classList.add("on"); }
  M.x = lerp(M.x, M.tx, .06*dt); M.y = lerp(M.y, M.ty, .06*dt); M.sx = lerp(M.sx, M.tsx, .1*dt); M.sy = lerp(M.sy, M.tsy, .1*dt);
  if (art) art.style.transform = `translate3d(${(-M.x*30).toFixed(1)}px,${(-M.y*18 + scrollY*.1).toFixed(1)}px,0) scale(1.06)`;
  spot.style.transform = `translate3d(${M.sx.toFixed(1)}px,${M.sy.toFixed(1)}px,0)`;
  if (gr) gr.style.translate = `${(M.x*90).toFixed(1)}px ${(M.y*60).toFixed(1)}px`;
  if (gl) gl.style.translate = `${(-M.x*70).toFixed(1)}px ${(-M.y*50).toFixed(1)}px`;
  if (sp0) sp0.style.translate = `${(M.x*-40).toFixed(1)}px ${(M.y*-24).toFixed(1)}px`;
  const y = scrollY, p = clamp(y/Math.max(hero.offsetHeight,1), 0, 1);
  heroC.style.translate = `${(-M.x*12).toFixed(1)}px ${(-M.y*8).toFixed(1)}px`;
  heroC.style.transform = `translate3d(0,${(y*.24).toFixed(1)}px,0) scale(${(1-p*.08).toFixed(4)})`; heroC.style.opacity = (1-p*1.2).toFixed(3);
  dctx.clearRect(0,0,DW,DH);
  for (const q of DP) { q.x += q.vx*dt; q.y += q.vy*dt; if (q.y < -30) { q.y = DH+30; q.x = Math.random()*DW; } if (q.x < -30) q.x = DW+30; if (q.x > DW+30) q.x = -30;
    dctx.globalAlpha = q.a*(.62 + .38*Math.sin(t*.0012*q.sp + q.ph)); dctx.drawImage(spr[q.c], q.x - M.x*70*q.z - q.r, q.y - M.y*50*q.z - q.r, q.r*2, q.r*2); }
  dctx.globalAlpha = 1; raf = requestAnimationFrame(frame);
}
const kick = () => { if (!raf && live) { last = performance.now(); raf = requestAnimationFrame(frame); } };
new IntersectionObserver(es => { live = es[0].isIntersecting; if (live) kick(); }, {threshold:0}).observe(hero);
kick();
} catch (err) { console.warn("hero engine skipped:", err); } })();
