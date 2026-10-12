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
$("#projects").innerHTML = P.map(p => `<article class="pj ${p.wide?"wide ":""}rv" data-c="${p.c}" style="--t:${p.col}"><header><span class="ic">${p.ic}</span><h3>${p.t}</h3>${p.f?'<span class="feat">★ Featured Project</span>':""}</header><p>${p.d}</p>${p.s?`<div class="stats">${p.s.map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join("")}</div>`:""}<div class="tags">${p.g.map(x=>`<span>${x}</span>`).join("")}</div><div class="links">${p.det?`<a class="btn lime" href="${p.url || GH}" target="_blank" rel="noopener">View on GitHub ↗</a><a class="btn ghost" href="${p.url || GH}" target="_blank" rel="noopener">View Project Details ↗</a>`:`<a class="tx" href="${p.url || GH}" target="_blank" rel="noopener">View on GitHub ↗</a>`}</div></article>`).join("");
const F = [["all","All Projects"],["sql","SQL"],["python","Python"],["analytics","Analytics"],["excel","Excel"],["other","Other"]];
$("#filters").innerHTML = F.map((f,i) => `<button data-f="${f[0]}" class="${i?"":"on"}">${f[1]}</button>`).join("");
$("#filters").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return;
  $$("#filters button").forEach(x => x.classList.toggle("on", x === b));
  $$(".pj").forEach(p => { const show = b.dataset.f === "all" || p.dataset.c.split(" ").includes(b.dataset.f); p.classList.toggle("hide", !show); if (show) { p.classList.remove("in"); void p.offsetWidth; p.classList.add("in"); } }); });

/* ---------- loader + hero entrance ---------- */
document.body.classList.add("lock");
const words = ["Query","Analyze","Visualize"]; let wi = 0;
const wt = setInterval(() => { wi = (wi+1)%words.length; const w = $("#ldw"); w.textContent = words[wi]; w.style.animation = "none"; w.offsetHeight; w.style.animation = ""; }, 650);
const T = reduce ? 1 : 1900, t0 = performance.now();
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
