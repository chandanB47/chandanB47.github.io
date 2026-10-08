(() => {
  const menu=document.querySelector(".menu-btn"), mobileNav=document.querySelector(".mobile-nav");
  const glow=document.querySelector(".cursor-glow"), year=document.querySelector("#year");
  year.textContent=new Date().getFullYear();

  menu?.addEventListener("click",()=>{
    const open=mobileNav.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
    mobileNav.setAttribute("aria-hidden",String(!open));
  });
  mobileNav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    mobileNav.classList.remove("open"); menu?.setAttribute("aria-expanded","false"); mobileNav?.setAttribute("aria-hidden","true");
  }));

  const fine=matchMedia("(pointer:fine)").matches;
  if(fine && glow){
    window.addEventListener("pointermove",e=>{
      glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px"; glow.style.opacity="1";
    },{passive:true});
    window.addEventListener("pointerleave",()=>glow.style.opacity="0");
  }

  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals=document.querySelectorAll(".reveal");
  if(reduce) reveals.forEach(x=>x.classList.add("visible"));
  else{
    const io=new IntersectionObserver((entries,obs)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}});
    },{threshold:.10,rootMargin:"0px 0px -45px 0px"});
    reveals.forEach(x=>io.observe(x));
  }

  if(fine){
    const visual=document.querySelector(".hero-visual");
    let raf=0,tx=0,ty=0,mx=0,my=0;
    window.addEventListener("pointermove",e=>{
      tx=(e.clientX/innerWidth-.5)*7; ty=(e.clientY/innerHeight-.5)*5;
      if(!raf) raf=requestAnimationFrame(()=>{
        mx+=(tx-mx)*.08; my+=(ty-my)*.08;
        if(visual) visual.style.transform=`translate3d(${mx}px,${my}px,0)`;
        raf=0;
      });
    },{passive:true});
  }

  // Interactive toolkit: hover previews on desktop, click/tap opens a persistent detail panel.
  const data={
    sql:{n:"01",icon:"⌁",title:"SQL",desc:"Query, transform and analyse structured data inside relational databases.",skills:["SELECT / WHERE","JOINS","CTEs","WINDOW FUNCTIONS","SUBQUERIES","AGGREGATIONS"]},
    python:{n:"02",icon:"Py",title:"Python",desc:"Use Python to clean data, explore patterns, automate repetitive work and prototype ideas.",skills:["Pandas","NumPy","EDA","Data Cleaning","Automation","Jupyter"]},
    excel:{n:"03",icon:"X",title:"Excel",desc:"Build practical models, reports and analysis workflows for everyday business problems.",skills:["PivotTables","XLOOKUP","INDEX-MATCH","Power Query","Validation","MIS Reports"]},
    powerbi:{n:"04",icon:"▰",title:"Power BI",desc:"Turn structured data into interactive dashboards, KPIs and decision-friendly stories.",skills:["Data Modeling","DAX","Power Query","KPIs","Star Schema","Dashboard Design"]},
    statistics:{n:"05",icon:"σ",title:"Statistics",desc:"Use statistical thinking to understand distributions, relationships, uncertainty and patterns.",skills:["Descriptive Stats","Probability","Distributions","Correlation","Sampling","Hypothesis Thinking"]},
    aiml:{n:"06",icon:"AI",title:"AI / ML",desc:"Explore machine-learning concepts and practical experiments as an extension of analytical thinking.",skills:["Supervised Learning","Features","Evaluation","Regression","Classification","Model Thinking"]},
    genai:{n:"07",icon:"✦",title:"GenAI",desc:"Experiment with modern AI tools, prompting and workflows that make knowledge work faster.",skills:["Prompting","LLM Workflows","RAG Concepts","AI Assistants","Automation","Evaluation"]},
    linux:{n:"08",icon:"$_",title:"Linux",desc:"Work comfortably with the command line, files, processes and practical system workflows.",skills:["CLI","Bash","Files","Processes","Permissions","Environment"]},
    github:{n:"09",icon:"⌘",title:"Git / GitHub",desc:"Track changes, document projects and keep work reproducible and shareable.",skills:["Git","Branches","Commits","Repositories","GitHub Pages","README"]},
    sap:{n:"10",icon:"SAP",title:"SAP",desc:"Experience with ERP workflows supporting operational data, production and dispatch processes.",skills:["ERP Workflows","ASN Uploads","Production Schedules","Dispatch","Operations","Data Validation"]}
  };
  const cards=[...document.querySelectorAll(".tool-card")], detail=document.querySelector("#toolDetail");
  const title=document.querySelector("#detailTitle"),desc=document.querySelector("#detailDescription"),skills=document.querySelector("#detailSkills"),num=document.querySelector("#detailNumber"),icon=document.querySelector("#detailIcon");
  function openTool(key){
    const d=data[key]; if(!d)return;
    cards.forEach(c=>c.classList.toggle("active",c.dataset.tool===key));
    num.textContent=d.n; icon.textContent=d.icon; title.textContent=d.title; desc.textContent=d.desc;
    skills.innerHTML=d.skills.map(s=>`<span>${s}</span>`).join("");
    detail.classList.add("open");
    if(!fine) detail.scrollIntoView({behavior:reduce?"auto":"smooth",block:"nearest"});
  }
  cards.forEach(card=>{
    card.addEventListener("click",()=>openTool(card.dataset.tool));
    if(fine) card.addEventListener("mouseenter",()=>{ if(!detail.classList.contains("open")) openTool(card.dataset.tool); });
  });
  document.querySelector("#detailClose")?.addEventListener("click",()=>{
    detail.classList.remove("open"); cards.forEach(c=>c.classList.remove("active"));
  });
})();

/* V3 scroll progress — passive, tiny, native-scroll friendly. */
(() => {
  const bar = document.querySelector(".scroll-progress span");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    bar.style.height = `${Math.min(100, Math.max(0, pct))}%`;
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});
  addEventListener("resize", update, {passive:true});
  update();
})();
