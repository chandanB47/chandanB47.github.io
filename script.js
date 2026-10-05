
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Reveal content once. No scroll event loop = smoother scrolling.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  // Count-up metrics.
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el=entry.target, target=Number(el.dataset.count||0), start=performance.now();
        const tick=now=>{
          const p=Math.min(1,(now-start)/700);
          el.textContent=Math.round(target*(1-Math.pow(1-p,3)));
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },{threshold:.8});
    counters.forEach(el=>counterObserver.observe(el));
  }

  // Reliable smooth navigation with fixed-header offset.
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const id=link.getAttribute('href'), target=id && $(id);
      if(!target) return;
      e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-76,behavior:'smooth'});
      history.replaceState(null,'',id);
    });
  });

  // Very small pointer interactions only.
  if(window.matchMedia('(pointer:fine)').matches){
    $$('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.045, y=(e.clientY-r.top-r.height/2)*.045;
        el.style.transform=`translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave',()=>el.style.transform='translate3d(0,0,0)');
    });

    const heroVisual=$('.hero-visual'), card=$('.data-card');
    if(heroVisual&&card){
      heroVisual.addEventListener('pointermove',e=>{
        const r=heroVisual.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translate3d(0,-4px,0) rotateY(${x*4}deg) rotateX(${y*-3}deg)`;
      });
      heroVisual.addEventListener('pointerleave',()=>card.style.transform='');
    }
  }

  // Mobile menu.
  const menu=$('.menu'), nav=$('.nav nav');
  menu?.addEventListener('click',()=>{
    const open=nav.classList.toggle('mobile-open');
    if(window.innerWidth<=900){
      if(open){
        nav.style.display='flex';nav.style.position='absolute';nav.style.top='78px';nav.style.right='5vw';
        nav.style.flexDirection='column';nav.style.gap='18px';nav.style.padding='18px 22px';
        nav.style.border='1px solid rgba(255,255,255,.15)';nav.style.borderRadius='12px';nav.style.background='#0C1930';
      }else nav.removeAttribute('style');
    }
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    if(window.innerWidth<=900){nav.classList.remove('mobile-open');nav.removeAttribute('style')}
  }));

  // Email copy.
  const copy=$('.copy-email');
  copy?.addEventListener('click',async()=>{
    const email=copy.dataset.email;
    try{
      await navigator.clipboard.writeText(email);
      const msg=$('.copied-message');
      if(msg){msg.textContent='Email copied: '+email;setTimeout(()=>msg.textContent='',2200)}
    }catch{window.prompt('Copy this email:',email)}
  });
})();
