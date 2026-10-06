(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;

  // Scroll reveal
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    }), {threshold:.08, rootMargin:'0px 0px -7% 0px'});
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Scroll progress
  const progress = $('.scroll-progress span');
  let scrollTick = false;
  const progressUpdate = () => {
    scrollTick = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    if(progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  };
  addEventListener('scroll', () => { if(!scrollTick){ scrollTick=true; requestAnimationFrame(progressUpdate); } }, {passive:true});
  progressUpdate();

  if(fine && !reduce){
    // Cursor light
    const cursor = $('.cursor-glow');
    addEventListener('pointermove', e => {
      if(cursor){ cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; }
    }, {passive:true});

    // Hero image parallax
    const heroImage = $('.hero-image');
    addEventListener('pointermove', e => {
      if(!heroImage) return;
      const x = e.clientX / innerWidth - .5;
      const y = e.clientY / innerHeight - .5;
      heroImage.style.transform = `scale(1.06) translate3d(${x * -12}px,${y * -8}px,0)`;
    }, {passive:true});

    // Magnetic buttons
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .12;
        const y = (e.clientY - r.top - r.height/2) * .12;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = 'translate3d(0,0,0)');
    });

    // Premium 3D tilt + specular glare
    $$('.tilt-card').forEach(card => {
      const maxTilt = 11;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width;
        const y = (e.clientY-r.top)/r.height;
        const rx = (0.5-y)*maxTilt;
        const ry = (x-0.5)*maxTilt;
        card.style.setProperty('--mx', `${x*100}%`);
        card.style.setProperty('--my', `${y*100}%`);
        card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(7px) scale3d(1.018,1.018,1.018)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1,1,1)';
        card.style.setProperty('--mx','50%');
        card.style.setProperty('--my','50%');
      });
    });
  }

  // Particle field
  const canvas = $('#particle-canvas');
  if(canvas && !reduce){
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1, particles=[];
    const resize=()=>{
      dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
      canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.min(90,Math.floor(w/18));
      particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.3,a:Math.random()*.65+.1,v:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08}));
    };
    resize(); addEventListener('resize',resize,{passive:true});
    let mx=w/2,my=h/2;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.x+=p.v;p.y+=p.vy;
        if(p.x<-5)p.x=w+5;if(p.x>w+5)p.x=-5;if(p.y<-5)p.y=h+5;if(p.y>h+5)p.y=-5;
        const dx=mx-p.x,dy=my-p.y,dist=Math.hypot(dx,dy);
        const boost=dist<180 ? (1-dist/180) : 0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r+boost*1.2,0,Math.PI*2);ctx.fillStyle=`rgba(242,184,75,${p.a+boost*.45})`;ctx.fill();
      });
      requestAnimationFrame(draw);
    }; draw();
  }

  // Mobile navigation
  const menu=$('.menu'), nav=$('.nav-links');
  menu?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    if(open){ nav.style.display='flex'; nav.style.position='absolute'; nav.style.top='68px'; nav.style.right='6vw'; nav.style.flexDirection='column'; nav.style.padding='20px 24px'; nav.style.gap='20px'; nav.style.background='rgba(8,8,8,.96)'; nav.style.border='1px solid rgba(255,255,255,.15)'; nav.style.borderRadius='14px'; nav.style.backdropFilter='blur(18px)'; }
    else nav.removeAttribute('style');
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=720){nav.classList.remove('open');nav.removeAttribute('style')}}));
})();
