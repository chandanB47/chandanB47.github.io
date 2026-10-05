const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const counters=document.querySelectorAll('[data-count]');
const counterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=+el.dataset.count;let start=0;const step=Math.max(1,Math.ceil(target/30));const timer=setInterval(()=>{start+=step;if(start>=target){el.textContent=target;clearInterval(timer)}else el.textContent=start},35);counterObserver.unobserve(el)})},{threshold:.8});counters.forEach(c=>counterObserver.observe(c));

const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');let mx=0,my=0,rx=0,ry=0;window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(dot){dot.style.left=mx+'px';dot.style.top=my+'px'}});function cursorLoop(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px'}requestAnimationFrame(cursorLoop)}cursorLoop();

document.querySelectorAll('a,.btn,.stack-item,.project').forEach(el=>{el.addEventListener('mouseenter',()=>{if(ring){ring.style.width='52px';ring.style.height='52px'}});el.addEventListener('mouseleave',()=>{if(ring){ring.style.width='32px';ring.style.height='32px'}})});

document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)')});

const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('mobile-open');if(open){nav.style.display='flex';nav.style.position='absolute';nav.style.top='76px';nav.style.right='5vw';nav.style.flexDirection='column';nav.style.padding='20px';nav.style.background='#101217';nav.style.border='1px solid #272b34';nav.style.borderRadius='8px'}else nav.removeAttribute('style')});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(window.innerWidth<=900){nav.classList.remove('mobile-open');nav.removeAttribute('style')}}));

window.addEventListener('scroll',()=>{document.querySelector('.nav')?.classList.toggle('scrolled',window.scrollY>30)},{passive:true});