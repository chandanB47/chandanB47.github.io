const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const counters=document.querySelectorAll('[data-count]');
const counterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=+el.dataset.count;let start=0;const step=Math.max(1,Math.ceil(target/30));const timer=setInterval(()=>{start+=step;if(start>=target){el.textContent=target;clearInterval(timer)}else el.textContent=start},35);counterObserver.unobserve(el)})},{threshold:.8});counters.forEach(c=>counterObserver.observe(c));

document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)')});

const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('mobile-open');if(open){nav.style.display='flex';nav.style.position='absolute';nav.style.top='76px';nav.style.right='5vw';nav.style.flexDirection='column';nav.style.padding='20px';nav.style.background='#101217';nav.style.border='1px solid #272b34';nav.style.borderRadius='8px'}else nav.removeAttribute('style')});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(window.innerWidth<=900){nav.classList.remove('mobile-open');nav.removeAttribute('style')}}));

window.addEventListener('scroll',()=>{document.querySelector('.nav')?.classList.toggle('scrolled',window.scrollY>30)},{passive:true});
const copyEmail=document.querySelector('.copy-email');
copyEmail?.addEventListener('click',async()=>{const email=copyEmail.dataset.email;try{await navigator.clipboard.writeText(email);document.querySelector('.copied-message').textContent='Email copied: '+email;setTimeout(()=>document.querySelector('.copied-message').textContent='',2500)}catch(e){window.prompt('Copy this email:',email)}});
const heroVisual=document.querySelector('.hero-visual');
const heroCard=document.querySelector('.data-card');
if(heroVisual && heroCard && window.matchMedia('(pointer:fine)').matches){
  heroVisual.addEventListener('mousemove',e=>{
    const r=heroVisual.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    heroCard.style.transform=`translateZ(55px) rotateY(${x*8}deg) rotateX(${y*-6}deg)`;
  });
  heroVisual.addEventListener('mouseleave',()=>{heroCard.style.transform='translateZ(45px) rotateY(-5deg) rotateX(0deg)'});
}

const scene=document.querySelector('.scene');
const auroras=[...document.querySelectorAll('.aurora')];
const rings=[...document.querySelectorAll('.depth-ring')];
const gridFloor=document.querySelector('.grid-floor');
const particles=[...document.querySelectorAll('.data-particle')];
let scrollTick=false;
function updateDepth(){
  const y=window.scrollY;
  if(scene) scene.style.transform=`translate3d(0,${y*0.015}px,0)`;
  auroras.forEach((el,i)=>{const d=[0.035,-0.022,0.018][i]||0.02;el.style.transform=`translate3d(${Math.sin(y*.002+i)*18}px,${y*d}px,0)`});
  rings.forEach((el,i)=>{el.style.transform=`translate(-50%,calc(-50% + ${y*(.018+i*.008)}px)) rotateX(68deg) rotateZ(${y*(.015+i*.006)}deg)`});
  if(gridFloor) gridFloor.style.backgroundPosition=`0 ${y*.22}px`;
  particles.forEach((el,i)=>{el.style.transform=`translate3d(${Math.sin(y*.004+i)*18}px,${-y*(.018+i*.004)}px,0)`});
  scrollTick=false;
}
window.addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateDepth);scrollTick=true}},{passive:true});
updateDepth();
