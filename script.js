(() => {
  const body = document.body;
  const menu = document.querySelector(".menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const glow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");

  year.textContent = new Date().getFullYear();

  // Mobile menu
  menu?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
    mobileNav.setAttribute("aria-hidden", String(!open));
  });

  mobileNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menu?.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
    });
  });

  // Lightweight cursor spotlight — desktop only.
  const finePointer = matchMedia("(pointer:fine)").matches;
  if (finePointer && glow) {
    body.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    }, {passive:true});
    body.addEventListener("pointerleave", () => glow.style.opacity = "0");
  }

  // Reveal-on-scroll using IntersectionObserver, avoiding scroll handlers.
  const items = document.querySelectorAll(".reveal");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    items.forEach(el => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, {threshold:0.12, rootMargin:"0px 0px -50px 0px"});

    items.forEach(el => observer.observe(el));
  }

  // Small parallax effect only on desktop. Completely disabled on touch devices.
  if (finePointer) {
    const visual = document.querySelector(".hero-visual");
    if (visual) {
      let raf = 0, mx = 0, my = 0, tx = 0, ty = 0;
      window.addEventListener("pointermove", e => {
        tx = (e.clientX / innerWidth - .5) * 8;
        ty = (e.clientY / innerHeight - .5) * 6;
        if (!raf) raf = requestAnimationFrame(() => {
          mx += (tx - mx) * .08;
          my += (ty - my) * .08;
          visual.style.transform = `translate3d(${mx}px,${my}px,0)`;
          raf = 0;
        });
      }, {passive:true});
    }
  }

  // Gentle number/metric pulse without a permanent animation loop.
  const metric = document.querySelector(".metric-up");
  if (metric && !reduce) {
    setInterval(() => {
      metric.animate(
        [{transform:"translateY(2px)", opacity:.6},{transform:"translateY(0)",opacity:1}],
        {duration:700,easing:"cubic-bezier(.22,1,.36,1)"}
      );
    }, 4200);
  }
})();
