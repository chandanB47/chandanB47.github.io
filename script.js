
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal: one observer, no continuous scroll animation.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, {threshold: .10, rootMargin: '0px 0px -8% 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  // Scroll progress uses requestAnimationFrame only while the browser is scrolling.
  const progress = $('.scroll-progress span');
  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, {passive:true});
  updateProgress();

  // Count-up metrics.
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el=entry.target, target=Number(el.dataset.count||0), start=performance.now();
        const tick=now=>{
          const p=Math.min(1,(now-start)/750);
          el.textContent=Math.round(target*(1-Math.pow(1-p,3)));
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },{threshold:.8});
    counters.forEach(el=>counterObserver.observe(el));
  }

  // Anchor navigation.
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const id=link.getAttribute('href'), target=id && $(id);
      if(!target) return;
      e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-76,behavior:reduceMotion?'auto':'smooth'});
      history.replaceState(null,'',id);
    });
  });

  // Lightweight mouse depth on the cinematic hero scene.
  if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
    const scene=$('.cinematic-scene');
    if(scene){
      scene.addEventListener('pointermove',e=>{
        const r=scene.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        scene.style.transform=`perspective(1200px) rotateY(${x*1.8}deg) rotateX(${y*-1.2}deg)`;
      });
      scene.addEventListener('pointerleave',()=>scene.style.transform='');
    }
    $$('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.035, y=(e.clientY-r.top-r.height/2)*.035;
        el.style.transform=`translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave',()=>el.style.transform='translate3d(0,0,0)');
    });
  }



  // 3D project-card tilt + cursor-following specular glare.
  const projectCards = $$('.project');

  projectCards.forEach(card => {
    const glare = document.createElement('div');
    glare.className = 'card-glare';
    card.appendChild(glare);

    const maxTilt = 10;

    card.addEventListener('pointerenter', () => {
      if (reduceMotion) return;
      card.style.transition =
        'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('pointermove', e => {
      if (reduceMotion) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xCenter = (x - rect.width / 2) / (rect.width / 2);
      const yCenter = (y - rect.height / 2) / (rect.height / 2);

      const rotateX = -yCenter * maxTilt;
      const rotateY = xCenter * maxTilt;

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX.toFixed(2)}deg)
        rotateY(${rotateY.toFixed(2)}deg)
        scale3d(1.015, 1.015, 1.015)
      `;
    });

    card.addEventListener('pointerleave', () => {
      if (reduceMotion) return;

      card.style.transition =
        'transform 0.5s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';

      card.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  // Mobile menu.
  const menu=$('.menu'), nav=$('.nav nav');
  menu?.addEventListener('click',()=>{
    const open=nav.classList.toggle('mobile-open');
    if(window.innerWidth<=900){
      if(open){
        nav.style.display='flex';nav.style.position='absolute';nav.style.top='78px';nav.style.right='5vw';
        nav.style.flexDirection='column';nav.style.gap='18px';nav.style.padding='18px 22px';
        nav.style.border='1px solid rgba(255,255,255,.15)';nav.style.borderRadius='12px';nav.style.background='#09182F';
      }else nav.removeAttribute('style');
    }
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    if(window.innerWidth<=900){nav.classList.remove('mobile-open');nav.removeAttribute('style')}
  }));

  // Copy full email.
  const copy=$('.copy-email');
  copy?.addEventListener('click',async()=>{
    const email=copy.dataset.email;
    try{
      await navigator.clipboard.writeText(email);
      const msg=$('.copied-message');
      if(msg){msg.textContent='Copied: '+email;setTimeout(()=>msg.textContent='',2200)}
    }catch{window.prompt('Copy this email:',email)}
  });
})();
