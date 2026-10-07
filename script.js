/* ==========================================================================
   Chandan B — portfolio engine
   1. Stage     WebGL image stage: your two photos as living scenes
                (depth parallax, heat shimmer, drifting mist, gold <-> moss crossfade)
   2. Embers    2D particles that orbit the rock's light rings, react to the cursor
   3. UI        headline "clean-up", ledger counters, accordion, workbench, nav
   Everything degrades gracefully: no WebGL / file:// / reduced motion all work.
   ========================================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = root.classList.contains('reduce');
  const fine = matchMedia('(pointer:fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  /* ======================================================================
     CONFIG — swap images or retune framing here.
     focus  = the point of the photo that must stay in view (0..1)
     target = where on screen that point should land (0..1)
     rings  = light-ring ellipses in photo coordinates, used by the embers
     ====================================================================== */
  const BG = {
    gold: {
      src: 'assets/bg/hero-gold.webp', zoom: 1.08, zoomMobile: .8,
      focus: { x: .505, y: .56 },
      target: { desktop: { x: .70, y: .50 }, mobile: { x: .50, y: .27 } },
      rings: [
        { cx: .53, cy: .145, rx: .26,  ry: .093, tilt:  5, sp:  .34, w: 3 },
        { cx: .53, cy: .320, rx: .23,  ry: .050, tilt: 16, sp: -.27, w: 2 },
        { cx: .50, cy: .470, rx: .12,  ry: .047, tilt: 10, sp:  .55, w: 2 },
        { cx: .48, cy: .520, rx: .16,  ry: .035, tilt: -4, sp: -.40, w: 1.5 },
        { cx: .48, cy: .650, rx: .15,  ry: .070, tilt: -6, sp:  .50, w: 2.5 }
      ]
    },
    moss: {
      src: 'assets/bg/section-moss.webp', zoom: 1.1,
      focus: { x: .55, y: .55 },
      target: { desktop: { x: .55, y: .55 }, mobile: { x: .50, y: .58 } }
    }
  };

  /* shared live state */
  const S = {
    time: 0, clean: reduce ? 1 : 0, mix: 0, mixT: 0,
    mouse: { x: .5, y: .5, tx: .5, ty: .5, px: -999, py: -999, vx: 0, vy: 0, on: false },
    W: innerWidth, H: innerHeight, mobile: false, gl: false, maps: {}, images: {}
  };

  /* ======================================================================
     1. STAGE (WebGL)
     ====================================================================== */
  const stageCanvas = $('#stage');
  let gl, prog, U = {}, textures = {}, stageQuality = 1;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uGold; uniform sampler2D uMoss;
uniform vec2 uRes; uniform vec2 uMouse;
uniform float uTime; uniform float uMix; uniform float uClean;
uniform vec4 uGM; uniform vec2 uGT; uniform vec4 uMM; uniform vec2 uMT;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.03+vec2(11.7,3.1); a*=.5; } return v; }
float luma(vec3 c){ return dot(c,vec3(.299,.587,.114)); }
vec3 tex(sampler2D s, vec2 uv){ return texture2D(s, clamp(uv,.001,.999)).rgb; }
float inside(vec2 uv){ vec2 e=smoothstep(vec2(0.),vec2(.02),uv)*smoothstep(vec2(0.),vec2(.02),1.-uv); return e.x*e.y; }

vec3 goldScene(vec2 su){
  vec2 uv = uGM.zw + (su-uGT)*uGM.xy;
  float mess = 1.-uClean;
  float d = smoothstep(.06,.65,luma(tex(uGold,uv)));            // brighter = nearer
  vec2 par = (uMouse-.5)*vec2(.04,.024)*d;                       // depth parallax
  float t = uTime;
  vec2 sh = (vec2(fbm(uv*vec2(16.,11.)+vec2(0.,t*.35)), fbm(uv*vec2(13.,10.)+7.1-vec2(t*.3,0.)))-.5)
            * (.004*d + .03*mess*mess);                          // heat shimmer (wild while "messy")
  vec2 uv2 = uv+par+sh;
  float ca = .004*mess + .0006;                                  // chromatic split settles as data cleans
  vec3 c = vec3(tex(uGold,uv2+vec2(ca,0.)).r, tex(uGold,uv2).g, tex(uGold,uv2-vec2(ca,0.)).b);
  float l = luma(c);
  float pulse = .5+.5*sin(t*.9);
  c *= 1.+.12*pulse*smoothstep(.35,.95,l);                       // rings breathe
  c += vec3(1.,.56,.16)*pow(l,2.6)*.12*pulse;
  c *= mix(.35,1.,uClean);
  return c*inside(uv2);
}
vec3 mossScene(vec2 su){
  vec2 uv = uMM.zw + (su-uMT)*uMM.xy;
  float t = uTime;
  float dd = smoothstep(0.,.7,1.-luma(tex(uMoss,uv)))*.85+.15;   // darker foliage = nearer
  vec2 par = (uMouse-.5)*vec2(.034,.02)*dd;
  float sway = sin(t*.7+uv.x*9.)*.0014*smoothstep(.45,1.,uv.y)*dd; // foliage sway
  vec2 uv2 = uv+par+vec2(sway,0.);
  vec3 c = tex(uMoss,uv2);
  float m1 = fbm(vec2(uv2.x*3.+t*.03, uv2.y*2.2-t*.015));
  float m2 = fbm(vec2(uv2.x*5.-t*.05, uv2.y*3.+3.));
  float fog = smoothstep(.34,.85,m1*.62+m2*.5)*smoothstep(.2,.95,uv2.y);
  c = mix(c, vec3(.76,.83,.74), fog*.24);                        // drifting mist
  return c*inside(uv2);
}
void main(){
  vec2 su = vec2(gl_FragCoord.x/uRes.x, 1.-gl_FragCoord.y/uRes.y);
  float m = smoothstep(0.,1.,uMix);
  vec3 col;
  if(m<.002) col = goldScene(su); else if(m>.998) col = mossScene(su); else col = mix(goldScene(su),mossScene(su),m);
  vec2 q = su-.5; col *= 1.-dot(q,q)*.55;
  col += (hash(gl_FragCoord.xy+fract(uTime)*100.)-.5)*.02;
  gl_FragColor = vec4(col,1.);
}`;

  const loadImage = src => new Promise((res, rej) => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => res(im); im.onerror = rej; im.src = src;
  });

  function compile(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function makeTexture(img) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);   // throws SecurityError on file://
    return t;
  }

  function mapFor(cfg, img) {
    const A = S.W / S.H, I = img.naturalWidth / img.naturalHeight;
    const z = S.mobile ? (cfg.zoomMobile || cfg.zoom) : cfg.zoom;
    const vx = (A >= I ? 1 : A / I) / z, vy = (A >= I ? I / A : 1) / z;
    const t = S.mobile ? cfg.target.mobile : cfg.target.desktop;
    return { vx, vy, fx: cfg.focus.x, fy: cfg.focus.y, tx: t.x, ty: t.y };
  }
  function updateMaps() {
    S.mobile = S.W < 700 || S.W / S.H < .8;
    for (const k of Object.keys(S.images)) S.maps[k] = mapFor(BG[k], S.images[k]);
  }

  async function initStage() {
    try {
      const [g, m] = await Promise.all([loadImage(BG.gold.src), loadImage(BG.moss.src)]);
      S.images = { gold: g, moss: m };
      gl = stageCanvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
      if (!gl) throw new Error('no webgl');
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uGold', 'uMoss', 'uRes', 'uMouse', 'uTime', 'uMix', 'uClean', 'uGM', 'uGT', 'uMM', 'uMT'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
      gl.activeTexture(gl.TEXTURE0); textures.gold = makeTexture(g);
      gl.activeTexture(gl.TEXTURE1); textures.moss = makeTexture(m);
      gl.uniform1i(U.uGold, 0); gl.uniform1i(U.uMoss, 1);
      S.gl = true;
      stageCanvas.addEventListener('webglcontextlost', e => { e.preventDefault(); useFallback(); });
    } catch (err) {
      console.info('[stage] using CSS fallback:', err && err.message);
      useFallback();
    }
    resize();
    stageCanvas.classList.add('on');
  }

  function useFallback() {
    S.gl = false; root.classList.add('no-gl');
    if (!S.images.gold) { /* images failed to load: keep plain dark background */ }
  }

  function resizeStage() {
    if (!S.gl) return;
    if (!resizeStage.init) { resizeStage.init = 1; const px = S.W * S.H * Math.pow(Math.min(devicePixelRatio || 1, 1.5), 2); if (px > 2.4e6) stageQuality = .72; }
    const dpr = Math.min(devicePixelRatio || 1, 1.5) * stageQuality;
    const w = Math.max(2, Math.floor(S.W * dpr)), h = Math.max(2, Math.floor(S.H * dpr));
    if (stageCanvas.width !== w || stageCanvas.height !== h) { stageCanvas.width = w; stageCanvas.height = h; }
    gl.viewport(0, 0, w, h);
  }
  function drawStage() {
    if (!S.gl) {
      // CSS fallback: parallax + moss crossfade
      const el = document.body.style;
      root.style.setProperty('--px', ((.5 - S.mouse.x) * 26).toFixed(1) + 'px');
      root.style.setProperty('--py', ((.5 - S.mouse.y) * 16).toFixed(1) + 'px');
      root.style.setProperty('--mossmix', clamp(S.mix, 0, 1).toFixed(3));
      return;
    }
    const g = S.maps.gold, m = S.maps.moss;
    gl.uniform2f(U.uRes, stageCanvas.width, stageCanvas.height);
    gl.uniform2f(U.uMouse, S.mouse.x, S.mouse.y);
    gl.uniform1f(U.uTime, S.time);
    gl.uniform1f(U.uMix, S.mix);
    gl.uniform1f(U.uClean, easeOut(clamp(S.clean, 0, 1)));
    gl.uniform4f(U.uGM, g.vx, g.vy, g.fx, g.fy); gl.uniform2f(U.uGT, g.tx, g.ty);
    gl.uniform4f(U.uMM, m.vx, m.vy, m.fx, m.fy); gl.uniform2f(U.uMT, m.tx, m.ty);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ======================================================================
     2. EMBERS (2D canvas)
     ====================================================================== */
  const ec = $('#embers'), ectx = ec.getContext('2d');
  let edpr = 1, particles = [], sparks = [], activeN = 0, lastSpark = 0;

  function sprite(inner, mid) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, inner); g.addColorStop(.25, mid); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c;
  }
  const spriteGold = sprite('rgba(255,244,214,1)', 'rgba(255,176,58,.55)');
  const spriteMoss = sprite('rgba(244,255,226,1)', 'rgba(170,222,120,.5)');

  function buildParticles() {
    const mobileScale = S.mobile ? .55 : 1;
    const N = Math.round(210 * mobileScale);
    const rings = BG.gold.rings, total = rings.reduce((a, r) => a + r.w, 0);
    particles = [];
    for (let i = 0; i < N; i++) {
      let ring = -1;
      if (Math.random() < .72) { let r = Math.random() * total; ring = 0; for (; ring < rings.length - 1; ring++) { r -= rings[ring].w; if (r <= 0) break; } }
      particles.push({
        ring, th: rand(0, Math.PI * 2), spd: (ring >= 0 ? rings[ring].sp : 0) * rand(.8, 1.25),
        cx: rand(0, S.W), cy: rand(0, S.H), vx: rand(-45, 45), vy: ring >= 0 ? rand(-45, 45) : -rand(8, 38),
        size: rand(5, 15) * (ring >= 0 ? 1 : .8), tw: rand(0, 6.28), bind: rand(.6, 1), ox: 0, oy: 0
      });
    }
    activeN = N;
  }

  function resizeEmbers() {
    edpr = Math.min(devicePixelRatio || 1, 1.5);
    ec.width = Math.floor(S.W * edpr); ec.height = Math.floor(S.H * edpr);
    ectx.setTransform(edpr, 0, 0, edpr, 0, 0);
  }

  function ringPos(p, g, par) {
    const r = BG.gold.rings[p.ring];
    const sx = S.W, sy = S.H;
    const cx = (g.tx + (r.cx - g.fx) / g.vx) * sx + par.x, cy = (g.ty + (r.cy - g.fy) / g.vy) * sy + par.y;
    const rx = r.rx / g.vx * sx, ry = r.ry / g.vy * sy, T = r.tilt * Math.PI / 180;
    const ex = rx * Math.cos(p.th), ey = ry * Math.sin(p.th);
    return { x: cx + ex * Math.cos(T) - ey * Math.sin(T), y: cy + ex * Math.sin(T) + ey * Math.cos(T), z: Math.sin(p.th) };
  }

  function drawEmbers(dt, still) {
    ectx.clearRect(0, 0, S.W, S.H);
    ectx.globalCompositeOperation = 'lighter';
    const g = S.maps.gold; if (!g) return;
    const ce = easeOut(clamp(S.clean, 0, 1)), moss = clamp(S.mix, 0, 1);
    const par = { x: -(S.mouse.x - .5) * .04 * .8 / g.vx * S.W, y: -(S.mouse.y - .5) * .024 * .8 / g.vy * S.H };
    const R = 150;
    for (let i = 0; i < activeN; i++) {
      const p = particles[i];
      if (!still) {
        p.cx += p.vx * dt * (1.2 - ce * .9); p.cy += p.vy * dt * (1.2 - ce * .9);
        if (p.ring < 0) { p.cx += Math.sin(S.time * .6 + p.tw) * 10 * dt; }
        if (p.cx < -20) p.cx = S.W + 20; else if (p.cx > S.W + 20) p.cx = -20;
        if (p.cy < -20) p.cy = S.H + 20; else if (p.cy > S.H + 20) p.cy = -20;
        if (p.ring >= 0) p.th += p.spd * dt * (.4 + ce * .6);
      }
      const b = p.ring >= 0 ? ce * p.bind * (1 - moss) : 0;
      let x = p.cx, y = p.cy, z = 0;
      if (b > 0) { const rp = ringPos(p, g, par); x = lerp(p.cx, rp.x, b); y = lerp(p.cy, rp.y, b); z = rp.z * b; }
      // cursor repulsion (smoothly springs back)
      if (!still && S.mouse.on) {
        const dx = x - S.mouse.px, dy = y - S.mouse.py, d = Math.hypot(dx, dy);
        const f = d < R ? Math.pow(1 - d / R, 2) * 70 : 0;
        const tx = d > 0.01 ? dx / d * f : 0, ty = d > 0.01 ? dy / d * f : 0;
        p.ox = lerp(p.ox, tx, 1 - Math.exp(-9 * dt)); p.oy = lerp(p.oy, ty, 1 - Math.exp(-9 * dt));
      } else if (!still) { p.ox *= Math.exp(-5 * dt); p.oy *= Math.exp(-5 * dt); }
      x += p.ox; y += p.oy;
      const tw = .62 + .38 * Math.sin(S.time * 2 + p.tw);
      const a = clamp((.45 + .5 * tw) * (.72 + .28 * z) * (.35 + .65 * ce), 0, 1);
      const sz = p.size * (1 + .3 * z) * (S.mobile ? .8 : 1);
      if (moss < .98) { ectx.globalAlpha = a * (1 - moss); ectx.drawImage(spriteGold, x - sz, y - sz, sz * 2, sz * 2); }
      if (moss > .02) { ectx.globalAlpha = a * moss * .85; ectx.drawImage(spriteMoss, x - sz, y - sz, sz * 2, sz * 2); }
    }
    // sparks (cursor trail + click bursts)
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      if (!still) { s.life -= dt; s.vy -= 22 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= Math.exp(-1.3 * dt); s.vy *= Math.exp(-.6 * dt); }
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const k = s.life / s.max, sz = s.size * (.4 + .6 * k);
      ectx.globalAlpha = k * .95;
      ectx.drawImage(moss > .5 ? spriteMoss : spriteGold, s.x - sz, s.y - sz, sz * 2, sz * 2);
    }
    ectx.globalAlpha = 1;
  }

  function spawnSpark(x, y, vx, vy, size, life) { if (sparks.length < 260) sparks.push({ x, y, vx, vy, size, life, max: life }); }
  function burst(x, y) {
    for (let i = 0; i < 30; i++) { const a = rand(0, 6.283), s = rand(70, 300); spawnSpark(x, y, Math.cos(a) * s, Math.sin(a) * s, rand(4, 11), rand(.9, 1.9)); }
  }

  /* ======================================================================
     Main loop (stage + embers share one clock)
     ====================================================================== */
  let raf = 0, last = performance.now(), accT = 0, frames = 0;
  function resize() {
    S.W = innerWidth; S.H = innerHeight; updateMaps(); resizeStage(); resizeEmbers();
    if (!particles.length || (S.mobile && particles.length > 140) || (!S.mobile && particles.length < 140)) buildParticles();
    if (reduce) renderOnce();
  }
  function renderOnce() { S.mix = S.mixT; S.clean = 1; drawStage(); drawEmbers(0, true); }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000); last = now; S.time += dt;
    const m = S.mouse, k = 1 - Math.exp(-6 * dt);
    m.x = lerp(m.x, m.tx, k); m.y = lerp(m.y, m.ty, k);
    S.mix = lerp(S.mix, S.mixT, 1 - Math.exp(-2.4 * dt));
    drawStage(); drawEmbers(dt, false); applyDim();
    accT += dt; frames++;
    if (accT >= 2) {                       // adaptive quality: protect slower GPUs
      const fps = frames / accT;
      if (fps < 38 && stageQuality > .55) { stageQuality = Math.max(.55, stageQuality - .15); resizeStage(); }
      if (fps < 30 && activeN > 70) activeN = Math.floor(activeN * .8);
      accT = 0; frames = 0;
    }
  }
  function start() { if (reduce) { renderOnce(); return; } cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); }
  document.addEventListener('visibilitychange', () => { if (reduce) return; document.hidden ? cancelAnimationFrame(raf) : start(); });

  /* pointer */
  addEventListener('pointermove', e => {
    const m = S.mouse;
    m.tx = e.clientX / S.W; m.ty = e.clientY / S.H;
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      const now = performance.now();
      m.vx = e.clientX - m.px; m.vy = e.clientY - m.py;
      m.px = e.clientX; m.py = e.clientY; m.on = true;
      if (!reduce && now - lastSpark > 34 && !e.target.closest('.glass,.bar')) {
        lastSpark = now;
        spawnSpark(e.clientX, e.clientY, rand(-25, 25) + m.vx * .8, rand(-40, -5) + m.vy * .8, rand(3, 7), rand(.7, 1.3));
      }
    }
    hideHint();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { S.mouse.on = false; });
  addEventListener('pointerdown', e => {
    if (reduce || e.target.closest('a,button,.glass,.bar,input')) return;
    burst(e.clientX, e.clientY); hideHint();
  });

  /* ======================================================================
     3. UI
     ====================================================================== */
  const hint = $('#hint'); let hintTimer = 0;
  function hideHint() { if (hint && !hintTimer) hintTimer = setTimeout(() => hint.classList.add('gone'), 3500); }

  /* tween helper */
  function tween(from, to, ms, fn, ease = easeOut, done) {
    const t0 = performance.now();
    const step = now => { const t = clamp((now - t0) / ms, 0, 1); fn(lerp(from, to, ease(t))); t < 1 ? requestAnimationFrame(step) : done && done(); };
    requestAnimationFrame(step);
  }

  /* headline: "messy data" scatters, then cleans up — together with the live background */
  const messy = $('.messy');
  let letters = [], busy = false;
  if (messy && !reduce) {
    const text = messy.textContent; messy.textContent = '';
    letters = [...text].map((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? '\u00a0' : c; s.style.setProperty('--i', i); messy.appendChild(s); return s; });
  }
  function scramble() {
    letters.forEach(s => {
      s.style.setProperty('--tx', rand(-.45, .45).toFixed(2) + 'em'); s.style.setProperty('--ty', rand(-.4, .4).toFixed(2) + 'em');
      s.style.setProperty('--r', rand(-32, 32).toFixed(0) + 'deg'); s.style.setProperty('--b', rand(0, 3).toFixed(1) + 'px');
    });
    messy.classList.remove('clean');
  }
  const cleanUp = () => messy && messy.classList.add('clean');
  if (messy && !reduce) scramble(); else cleanUp();

  function replay() {
    if (busy || reduce || !letters.length) return; busy = true;
    scramble();
    const c0 = S.clean; tween(c0, .28, 380, v => S.clean = v);
    setTimeout(() => { cleanUp(); tween(.28, 1, 2200, v => S.clean = v); }, 700);
    setTimeout(() => busy = false, 2400);
  }
  if (messy && fine) messy.addEventListener('pointerenter', replay);

  /* scroll-driven theme (gold <-> moss), dimming and scrim */
  S.scrollT = 0;
  function applyDim() {
    const t = S.scrollT, m = clamp(S.mix, 0, 1);
    root.style.setProperty('--hero-scrim', (1 - t * .8).toFixed(3));
    root.style.setProperty('--dim', (t * lerp(.52, .2, m)).toFixed(3));   // gold ~.52, moss ~.20
  }
  let sections = $$('[data-bg]'), ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, h = S.H, mid = h * .5;
    let cur = sections[0];
    for (const s of sections) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) { cur = s; break; } }
    const theme = cur.dataset.bg;
    S.mixT = theme === 'moss' ? 1 : 0;
    document.body.dataset.theme = theme;
    S.scrollT = clamp(y / (h * .85), 0, 1);
    applyDim();
    if (reduce) renderOnce();
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* nav: current section, mobile menu */
  const links = $$('.bar nav a'), menuBtn = $('.menu'), nav = $('#nav');
  const navTargets = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navTargets.forEach(t => navIO.observe(t));
  menuBtn.addEventListener('click', () => { const o = menuBtn.getAttribute('aria-expanded') !== 'true'; menuBtn.setAttribute('aria-expanded', String(o)); nav.classList.toggle('open', o); });
  links.forEach(a => a.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') { menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });

  /* glass spotlight follows the pointer */
  let spot = null;
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('.glass,.glass-row,.ledger li,.toolkit>div,.proj');
    if (!el) return;
    spot = { el, x: e.clientX, y: e.clientY };
    if (!spot.raf) spot.raf = requestAnimationFrame(() => {
      const r = spot.el.getBoundingClientRect();
      spot.el.style.setProperty('--mx', (spot.x - r.left) + 'px'); spot.el.style.setProperty('--my', (spot.y - r.top) + 'px'); spot.raf = 0;
    });
  }, { passive: true });
  // rows that are not .glass need the spotlight pseudo-element too
  $$('.ledger li,.toolkit>div').forEach(el => el.classList.add('glass-row'));

  /* magnetic buttons */
  if (fine && !reduce) $$('.btn,.bar-cta,.social a').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .14}px,${(e.clientY - r.top - r.height / 2) * .22}px)`; });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  /* projects accordion */
  const projs = $$('.proj');
  function setOpen(p, open) {
    p.classList.toggle('open', open);
    const btn = $('.proj-btn', p), inner = $('.proj-inner', p);
    btn.setAttribute('aria-expanded', String(open));
    if (open) inner.removeAttribute('inert'); else inner.setAttribute('inert', '');
  }
  projs.forEach(p => $('.proj-btn', p).addEventListener('click', () => {
    const willOpen = !p.classList.contains('open');
    projs.forEach(o => setOpen(o, false)); setOpen(p, willOpen);
  }));

  /* SQL console typing + ledger counters */
  const sql = $('#sql');
  if (sql) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { sql.classList.add('go'); o.disconnect(); } }), { threshold: .4 }).observe(sql);

  const fmt = (n, f) => f === 'comma' ? n.toLocaleString('en-US') : String(n);
  if (!reduce) {
    // each ledger row counts up on its own when it scrolls into view (works for tall mobile layouts too)
    $$('.ledger li').forEach(li => {
      const nums = $$('[data-count]', li);
      nums.forEach(el => el.textContent = fmt(0, el.dataset.format));
      new IntersectionObserver((es, o) => es.forEach(e => {
        if (!e.isIntersecting) return; o.disconnect();
        nums.forEach(el => tween(0, +el.dataset.count, 1400, v => el.textContent = fmt(Math.round(v), el.dataset.format)));
      }), { threshold: .6 }).observe(li);
    });
  }

  /* approach: steps drive the workbench */
  const approach = $('.approach'), steps = $$('.step');
  const stepIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    steps.forEach(s => s.classList.toggle('on', s === e.target));
    approach.dataset.stage = e.target.dataset.step;
  }), { rootMargin: '-42% 0px -42% 0px' });
  steps.forEach(s => stepIO.observe(s)); steps[0] && steps[0].classList.add('on');

  /* copy email */
  const copy = $('.copy'), toast = $('.toast');
  copy && copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try { await navigator.clipboard.writeText(email); toast.textContent = 'Copied ' + email; }
    catch { toast.textContent = 'Copy this address: ' + email; }
    setTimeout(() => toast.textContent = '', 3000);
  });

  addEventListener('resize', () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 120); });

  /* ======================================================================
     Boot
     ====================================================================== */
  (async function boot() {
    await initStage();
    buildParticles(); resizeEmbers(); ec.classList.add('on');
    onScroll(); start();
    if (!reduce) {
      await Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 1400))]);
      setTimeout(() => { cleanUp(); tween(0, 1, 3400, v => S.clean = v, t => t); }, 450);
    }
    window.__stage = { S, BG };          // handy for debugging in the console
  })();
})();
