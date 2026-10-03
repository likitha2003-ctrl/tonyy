/* For Nana. All the behaviour lives here; all the words live in content.js */
(function () {
  'use strict';

  const SITE = window.SITE, ICONS = window.ICONS, HEADS = window.HEADS;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function h(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const photoSrc = (f) => (window.PHOTO_DATA && window.PHOTO_DATA[f]) || ('assets/photos/' + f);
  function icoAt(name, x, y, size) {
    return ICONS[name]().replace('<svg class="ico"', '<svg class="ico in" x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" style="width:' + size + 'px;height:' + size + 'px"');
  }
  function deco(parent, name, pos) {
    const d = h('div', 'deco sticker', ICONS[name]());
    Object.assign(d.style, { width: pos.w + 'px', height: pos.w + 'px', transform: 'rotate(' + (pos.r || 0) + 'deg)' });
    ['top', 'bottom', 'left', 'right'].forEach((k) => { if (pos[k] != null) d.style[k] = pos[k]; });
    parent.appendChild(d); return d;
  }
  const root = document.documentElement;
  function lock() { root.classList.add('locked'); document.body.classList.add('locked'); }
  function unlock() { root.classList.remove('locked'); document.body.classList.remove('locked'); }

  /* =========================================================
     MUSIC (never autoplays; needs a tap)
     ========================================================= */
  const music = (function () {
    const wrap = $('#music'); const audio = new Audio(); audio.preload = 'none';
    let cur = 0; let tipTimer;
    wrap.innerHTML = '<button id="mPlay" type="button" aria-label="Play or pause music"><span class="eq"><i></i><i></i><i></i></span><span id="mTitle"></span></button><button id="mNext" type="button" aria-label="Next song">next</button><span class="tip" id="mTip" role="status"></span>';
    const title = $('#mTitle'), tip = $('#mTip');
    title.textContent = SITE.music[0] ? SITE.music[0].title : 'music';
    function say(t) { tip.textContent = t; tip.classList.add('show'); clearTimeout(tipTimer); tipTimer = setTimeout(() => tip.classList.remove('show'), 3800); }
    function load() { const t = SITE.music[cur]; title.textContent = t.title; audio.src = t.src; }
    function play() {
      if (!SITE.music.length) return;
      if (!audio.src || audio.error) load();
      const p = audio.play();
      if (p && p.then) p.then(() => wrap.classList.add('playing')).catch(() => { wrap.classList.remove('playing'); say('Add your song files to assets/music/ ♪'); });
    }
    function pause() { audio.pause(); wrap.classList.remove('playing'); }
    $('#mPlay').addEventListener('click', () => (audio.paused ? play() : pause()));
    $('#mNext').addEventListener('click', () => { cur = (cur + 1) % SITE.music.length; load(); play(); });
    audio.addEventListener('ended', () => { cur = (cur + 1) % SITE.music.length; load(); play(); });
    audio.addEventListener('error', () => { wrap.classList.remove('playing'); say('Add your song files to assets/music/ ♪'); });
    return { show() { wrap.classList.add('show'); }, pause };
  })();

  /* =========================================================
     1. THE GATE
     ========================================================= */
  function isRightAnswer(v) {
    const g = SITE.gate;
    v = v.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!v) return false;
    return g.answers.concat(g.extraAnswers || []).some((a) => (' ' + v + ' ').indexOf(' ' + a.toLowerCase() + ' ') !== -1);
  }

  function initGate(onOpen) {
    const gate = $('#gate');
    const stars = h('div', 'gate-stars'); const R = rng(7);
    for (let i = 0; i < 34; i++) {
      const s = h('i'); const sz = 1.5 + R() * 2.6;
      s.style.cssText = 'left:' + (R() * 100) + '%;top:' + (R() * 100) + '%;width:' + sz + 'px;height:' + sz + 'px;animation-delay:' + (R() * 5) + 's;animation-duration:' + (4 + R() * 4) + 's';
      stars.appendChild(s);
    }
    gate.appendChild(stars);
    const inner = h('div', 'gate-inner'); gate.appendChild(inner);
    let wrong = 0;

    async function swap(html) {
      const old = $('.gate-step', inner);
      if (old) { old.classList.add('leaving'); await sleep(450); old.remove(); }
      const st = h('div', 'gate-step', html); inner.appendChild(st); return st;
    }
    async function ask() {
      const st = await swap('<p class="gate-q">Are you my super handsome man, Tony? <span aria-hidden="true">👀</span></p><div class="gate-btns"><button class="btn solid" data-a="yes" type="button">Obviously 😌</button><button class="btn ghost" data-a="no" type="button">No??</button></div>');
      st.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; b.dataset.a === 'yes' ? prove() : no(); });
    }
    async function no() {
      const st = await swap('<p class="gate-line">Hmm. Suspicious.</p><button class="btn ghost" type="button">Wait, go back</button>');
      $('button', st).addEventListener('click', ask);
    }
    async function prove() {
      const st = await swap('');
      for (const l of ['Hmm…', 'Anyone could say that.', 'Prove it.']) { st.appendChild(h('p', 'gate-line', l)); await sleep(reduce ? 500 : 1350); }
      const f = h('form', 'gate-form', '<label for="ans">' + esc(SITE.gate.question) + '</label><input id="ans" name="ans" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type it here…" enterkeyhint="go"><button class="btn solid" type="submit">That\'s it</button><p class="gate-msg" aria-live="polite"></p>');
      st.appendChild(f);
      const input = $('#ans', f), msg = $('.gate-msg', f);
      if (!matchMedia('(pointer: coarse)').matches) setTimeout(() => input.focus({ preventScroll: true }), 300);
      const tries = ['Nice try.', 'I know my Nana better than that. 😭', 'Nana. Come on.', 'Think harder, my super handsome man.'];
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isRightAnswer(input.value)) { input.blur(); win(); return; }
        msg.innerHTML = esc(tries[wrong % tries.length]) + (wrong >= 1 ? '<br><span style="font-size:26px;opacity:.7">(you know exactly what happened, Nana)</span>' : '');
        wrong++;
        input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');
        input.select();
      });
    }
    async function win() {
      const st = await swap('<p class="gate-line">Okay. It\'s you.</p>');
      await sleep(1900);
      await swap('<p class="gate-line small">Come in, Nanaaaaaaaa. ♡</p>');
      await sleep(1900);
      gate.classList.add('out');
      music.show();
      onOpen();
      setTimeout(() => gate.remove(), 1800);
    }
    ask();
    return { skip() { gate.remove(); music.show(); onOpen(); } };
  }

  /* =========================================================
     2. THE BOUQUET
     ========================================================= */
  function buildBouquet() {
    const sec = $('#bouquet'); sec.classList.add('bq');
    sec.innerHTML = '<div class="bq-lines" id="bqLines" aria-live="polite"></div><div class="bq-stage" id="bqStage"></div><p class="bq-hint" id="bqHint">(tap the flowers, Nana)</p><a class="cue" id="bqCue" href="#cloud">keep going ↓</a>';
    const FL = [
      { k: 'poppy', x: 180, y: 98, s: 1.25, r: 0 },
      { k: 'blush', x: 112, y: 144, s: 1.12, r: -8 },
      { k: 'daisy', x: 250, y: 142, s: 1.12, r: 10 },
      { k: 'tulip', x: 62, y: 218, s: 1.0, r: -18 },
      { k: 'bud', x: 298, y: 214, s: 1.1, r: 14 },
      { k: 'cream', x: 134, y: 212, s: .95, r: 6 },
      { k: 'poppy', x: 226, y: 208, s: .85, r: -10 }
    ];
    let svg = '<svg class="bq-svg" viewBox="0 0 360 450" role="group" aria-label="A bouquet of flowers">';
    FL.forEach((f, i) => {
      const cx = lerp(180, f.x, .3), cy = lerp(352, f.y, .62);
      svg += '<g class="sway" style="animation-delay:-' + (i * 0.9).toFixed(1) + 's;animation-duration:' + (5.2 + i * 0.35).toFixed(1) + 's"><g class="fl" data-i="' + i + '">' +
        '<path class="stem" pathLength="1" d="M180 360 Q' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ' ' + f.x + ' ' + (f.y + 16 * f.s).toFixed(0) + '"/>' +
        '<g transform="translate(' + f.x + ' ' + f.y + ') rotate(' + f.r + ') scale(' + f.s + ')"><g class="head" tabindex="0" role="button" aria-label="Flower ' + (i + 1) + '"><g class="hv"><g class="pop">' + HEADS[f.k]() + '</g></g><circle class="hit" r="34"/></g></g></g></g>';
    });
    [[96, 292, -30], [262, 288, 28], [150, 300, 8]].forEach((l) => {
      svg += '<ellipse cx="' + l[0] + '" cy="' + l[1] + '" rx="16" ry="6.5" fill="#9aa57b" stroke="#3a2320" stroke-width="2" transform="rotate(' + l[2] + ' ' + l[0] + ' ' + l[1] + ')"/>';
    });
    svg += '<path class="wrap" d="M52 270Q180 244 308 270L228 434Q180 446 132 434Z"/>' +
      '<path class="wrap2" d="M52 270Q180 244 308 270L270 340Q180 304 90 340Z"/>' +
      '<path class="fold" d="M116 284L150 432M244 284L210 432M180 272V302"/>' +
      '<g class="bowwrap">' + icoAt('bow', 134, 300, 92) + '</g></svg>';
    const stage = $('#bqStage');
    stage.innerHTML = svg + '<div class="bq-tag" id="bqTag" role="status"><span class="string"></span><div class="tagbody" id="bqTagText"></div></div>';

    const tag = $('#bqTag'), tagText = $('#bqTagText'); let n = 0;
    function show(i) {
      tagText.textContent = SITE.flowerNotes[i % SITE.flowerNotes.length];
      tag.classList.remove('show'); void tag.offsetWidth; tag.classList.add('show');
    }
    stage.addEventListener('click', (e) => { const hd = e.target.closest('.head'); if (!hd) return; const fl = hd.closest('.fl'); if (fl.classList.contains('on')) show(+fl.dataset.i); });
    stage.addEventListener('keydown', (e) => { if (e.key !== 'Enter' && e.key !== ' ') return; const hd = e.target.closest('.head'); if (!hd) return; e.preventDefault(); const fl = hd.closest('.fl'); if (fl.classList.contains('on')) show(+fl.dataset.i); });

    return async function start() {
      const lines = $('#bqLines'); const fls = $$('.fl', stage);
      let unlocked = false;
      const free = () => { if (unlocked) return; unlocked = true; unlock(); $('#bqHint').classList.add('show'); $('#bqCue').classList.add('show'); };
      setTimeout(free, 16000);
      async function say(t, keep) {
        const old = $('.bq-line', lines);
        if (old) { old.classList.add('out'); await sleep(620); old.remove(); }
        lines.appendChild(h('p', 'bq-line', esc(t)));
      }
      (async () => {
        await sleep(2600); await say('I couldn\'t hand you these today…');
        await sleep(3300); await say('…so I left them here instead.');
        await sleep(3300); await say('Happy birthday, Nana. 🌷');
        await sleep(1800); free();
      })();
      await sleep(900);
      for (const i of [5, 2, 0, 3, 6, 1, 4]) { fls[i].classList.add('on'); await sleep(reduce ? 200 : 800); }
    };
  }

  /* =========================================================
     3. MEMORY CLOUD
     ========================================================= */
  function buildCloud() {
    const sec = $('#cloud'); sec.classList.add('cloud');
    sec.innerHTML = '<div class="cloud-head"><p>Somewhere between all these moments…</p><small>(tap one)</small></div>';
    const veil = h('div', 'cloud-veil'); const cap = h('div', 'cloud-cap');
    const items = []; const R = rng(2024);
    let W = 0, H = 0, active = null, hover = null, T = 0, running = false, last = 0;

    SITE.photos.forEach((p, i) => {
      const fig = h('figure', 'ph ' + p.frame);
      fig.setAttribute('role', 'button'); fig.tabIndex = 0; fig.setAttribute('aria-label', p.cap || 'A memory of us');
      fig.innerHTML = '<div class="box"><img src="' + photoSrc(p.file) + '" alt="' + esc(p.cap || '') + '" decoding="async" style="aspect-ratio:' + p.ar + '">' + (p.tape ? '<span class="tape"></span>' : '') + '</div>' + (p.cap ? '<div class="mini">' + esc(p.cap) + '</div>' : '');
      sec.appendChild(fig);
      items.push({ el: fig, photo: p, d: p.d });
    });
    SITE.scraps.forEach((t) => {
      const s = h('div', 'scrap', esc(t)); sec.appendChild(s);
      items.push({ el: s, scrap: true, d: 1.1 });
    });
    sec.appendChild(veil); sec.appendChild(cap);

    items.forEach((it, i) => {
      const m = R();
      it.mode = it.scrap ? 'h' : (m < .58 ? 'h' : (m < .84 ? 'v' : 'dg'));
      it.dir = R() < .5 ? -1 : 1;
      it.spd = (5 + R() * 9) * it.d;
      it.ph = R() * 6.28; it.f1 = .12 + R() * .16; it.amp = 10 + R() * 22;
      it.r0 = (R() - .5) * 14; it.ra = 1 + R() * 2.2;
      it.sp = 1; it.k = 0; it.hv = 0;
    });

    function layout() {
      W = sec.clientWidth;
      const vh = window.innerHeight;
      const mult = W < 640 ? clamp(items.length * 0.062, 1.5, 2.3) : clamp(items.length * 0.04, 1.12, 1.6);
      H = Math.round(Math.max(vh * mult, 700));
      sec.style.height = H + 'px';
      const sc = clamp(W / 390, 1, 1.9) * (W < 640 ? .86 : 1);
      items.forEach((it) => {
        if (it.photo) it.el.style.width = Math.round(it.photo.w * it.d * sc) + 'px';
        else it.el.style.fontSize = Math.round(25 * Math.min(sc, 1.3)) + 'px';
      });
      items.forEach((it) => { it.w = it.el.offsetWidth; it.h = it.el.offsetHeight; });
      const n = items.length;
      const cols = Math.max(3, Math.round(Math.sqrt(n * W / H * 1.15)));
      const rows = Math.ceil(n / cols);
      const cw = W / cols, ch = (H - 150) / rows;
      const order = items.map((_, i) => i).sort(() => R() - .5);
      order.forEach((idx, k) => {
        const it = items[idx], c = k % cols, r = Math.floor(k / cols);
        it.x = c * cw + (R() - .35) * cw * .6 - it.w * .1;
        it.y = 130 + r * ch + (R() - .5) * ch * .7 - it.h * .1;
        it.bx = it.x; it.by = it.y;
      });
    }

    function pickActive(it) {
      if (active === it) return release();
      active = it; hover = null;
      veil.classList.add('on');
      const c = it.photo && it.photo.cap;
      cap.textContent = c || '';
      cap.classList.toggle('on', !!c);
      it.el.style.zIndex = 3050;
    }
    function release() {
      if (!active) return;
      active.el.style.zIndex = Math.round(active.d * 100);
      active = null; veil.classList.remove('on'); cap.classList.remove('on');
    }
    items.forEach((it) => {
      if (it.scrap) return;
      it.el.addEventListener('click', () => pickActive(it));
      it.el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickActive(it); } });
      it.el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !active) { hover = it; it.el.classList.add('hover'); it.el.style.zIndex = 2000; } });
      it.el.addEventListener('pointerleave', () => { if (hover === it) { hover = null; it.el.classList.remove('hover'); if (active !== it) it.el.style.zIndex = Math.round(it.d * 100); } });
      it.el.addEventListener('focus', () => { if (!active) { hover = it; it.el.classList.add('hover'); } });
      it.el.addEventListener('blur', () => { if (hover === it) { hover = null; it.el.classList.remove('hover'); } });
    });
    veil.addEventListener('click', release);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') release(); });

    function step(dt) {
      const rect = sec.getBoundingClientRect();
      const vTop = Math.max(0, -rect.top), vBot = Math.min(H, window.innerHeight - rect.top);
      const cy = (vTop + vBot) / 2, cx = W / 2;
      const motion = reduce ? 0 : 1;
      items.forEach((it) => {
        const isA = it === active, isH = it === hover;
        const target = isA ? 0 : isH ? .1 : (active ? .25 : 1);
        it.sp += (target - it.sp) * Math.min(1, dt * 5);
        const v = it.spd * it.sp * motion * dt;
        const margin = 40;
        if (it.mode === 'h' || it.mode === 'dg') { it.bx += v * it.dir; if (it.bx > W + margin) it.bx = -it.w - margin; if (it.bx < -it.w - margin) it.bx = W + margin; }
        if (it.mode === 'v' || it.mode === 'dg') { const vv = v * (it.mode === 'dg' ? .45 : 1) * (it.mode === 'v' ? -1 : it.dir); it.by += vv; if (it.by > H + margin) it.by = -it.h - margin; if (it.by < -it.h - margin) it.by = H + margin; }
        const sw = Math.sin(T * it.f1 * 6.28 + it.ph) * it.amp * motion;
        it.x = it.mode === 'v' ? it.bx + sw : it.bx;
        it.y = it.mode === 'h' ? it.by + sw : (it.mode === 'dg' ? it.by + sw * .5 : it.by);
        it.k += ((isA ? 1 : 0) - it.k) * Math.min(1, dt * 7);
        it.hv += ((isH ? .12 : 0) - it.hv) * Math.min(1, dt * 8);
        const k = ease(clamp(it.k, 0, 1));
        let sa = 1;
        if (it.photo) {
          sa = Math.min(Math.min(W * .8, 440) / it.w, (window.innerHeight * .56) / it.h);
          if (isA) { cap.style.top = (cy + it.h * sa / 2 + 16) + 'px'; }
        }
        const bob = 1 + Math.sin(T * .5 + it.ph) * .035 * motion;
        const s = lerp(bob + it.hv, sa, k);
        const r = lerp(it.r0 + Math.sin(T * .35 + it.ph) * it.ra * motion, -1.5, k);
        const x = lerp(it.x, cx - it.w / 2, k), y = lerp(it.y, cy - it.h / 2, k);
        it.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + r.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
        if (!isA && !isH && it.k < .02 && !it.z) { it.el.style.zIndex = Math.round(it.d * 100); it.z = 1; }
        if (isA || isH) it.z = 0;
      });
    }
    function frame(ts) {
      if (!running) return;
      const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts; T += dt; step(dt); requestAnimationFrame(frame);
    }
    layout(); step(0);
    new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
      else if (!vis) { running = false; if (active) release(); }
    }, { rootMargin: '120px' }).observe(sec);
    let lw = W;
    window.addEventListener('resize', () => { if (Math.abs(sec.clientWidth - lw) > 40) { lw = sec.clientWidth; layout(); step(0); } });
  }

  /* =========================================================
     4. YOU KNOW WHAT'S STUPID?
     ========================================================= */
  function buildStupid() {
    const sec = $('#stupid'); sec.classList.add('stupid');
    sec.innerHTML = '<h2 class="hand h-big">You know what\'s stupid?</h2><p class="sub">(tap things)</p><div class="desk" id="desk"></div><div class="pnote empty" id="stNote" aria-live="polite"><p class="t">…</p><p class="b">Tap something. They all actually happened.</p></div>';
    const desk = $('#desk'), note = $('#stNote');
    SITE.stupid.forEach((o) => {
      const b = h('button', 'obj'); b.type = 'button'; b.setAttribute('aria-label', o.title);
      b.style.cssText = 'left:' + o.x + '%;top:' + o.y + '%;width:min(' + o.size + 'px,' + (o.size / 390 * 100).toFixed(1) + 'vw);height:min(' + o.size + 'px,' + (o.size / 390 * 100).toFixed(1) + 'vw);--r:' + o.r + 'deg';
      b.innerHTML = '<span class="sticker" style="display:block;width:100%;height:100%">' + ICONS[o.icon]() + '</span>';
      b.addEventListener('click', () => {
        $$('.obj', desk).forEach((x) => x.classList.remove('on'));
        b.classList.remove('on'); void b.offsetWidth; b.classList.add('on', 'seen');
        note.className = 'pnote'; void note.offsetWidth; note.classList.add('pop');
        note.innerHTML = '<p class="t">' + esc(o.title) + '</p><p class="b">' + esc(o.text) + '</p>';
      });
      desk.appendChild(b);
    });
    deco(sec, 'bow', { top: '5%', right: '7%', w: 58, r: 14 });
    deco(sec, 'spark', { bottom: '5%', left: '9%', w: 26, r: 0 });
  }

  /* =========================================================
     5. 23 LITTLE THINGS
     ========================================================= */
  function buildThings() {
    const sec = $('#things'); sec.classList.add('things');
    sec.innerHTML = '<div class="things-head"><h2 class="hand h-big">23 little things</h2><p class="sub">because you\'re turning 23</p><p class="count" id="thCount" aria-live="polite"></p></div>';
    const grid = h('div', 'thgrid'); sec.appendChild(grid);
    const R = rng(11); const total = SITE.things.length - 1; let opened = 0;
    const count = $('#thCount'); const modal = $('#modal');
    const msg = (t) => { count.textContent = t; };
    msg('tap them. there are 23.');
    let lastBtn = null;

    function close() {
      modal.classList.remove('open');
      setTimeout(() => { if (!modal.classList.contains('open')) modal.innerHTML = ''; }, 350);
      if (lastBtn) { try { lastBtn.focus({ preventScroll: true }); } catch (e) { /* ok */ } }
    }
    function open(i, btn) {
      const t = SITE.things[i]; lastBtn = btn;
      const rot = (((i * 37) % 5) - 2) * 0.9;
      let inner = '<button class="x" type="button" aria-label="Close">×</button>';
      if (t.paper === 'polaroid' && t.photo) inner += '<img class="p-photo" src="' + photoSrc(t.photo) + '" alt="">';
      else inner += '<div class="p-ico">' + ICONS[t.icon]() + '</div>';
      inner += '<h3 class="p-title">' + esc(t.title) + '</h3>';
      t.lines.forEach((l, j) => { inner += '<p class="p-line" style="--i:' + j + '">' + esc(l) + '</p>'; });
      modal.innerHTML = '<div class="paper ' + t.paper + '" role="dialog" aria-modal="true" aria-label="' + esc(t.title) + '" style="--rot:' + rot + 'deg">' + inner + '</div>';
      requestAnimationFrame(() => { modal.classList.add('open'); const x = $('.x', modal); if (x) x.focus({ preventScroll: true }); });
      if (!btn.classList.contains('seen') && i < total) {
        btn.classList.add('seen'); opened++;
        if (opened < total) msg(opened + ' / ' + total + ' opened'); else msg('that\'s all of them. now the last one.');
        if (opened === total) { last.classList.remove('locked'); last.classList.add('ready'); }
      }
    }
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.x')) close(); else if (e.target.closest('.paper')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    SITE.things.slice(0, total).forEach((t, i) => {
      const b = h('button', 'th ' + t.type); b.type = 'button'; b.setAttribute('aria-label', t.title);
      b.style.setProperty('--r', ((R() - .5) * 9).toFixed(1) + 'deg');
      b.style.setProperty('--y', Math.round((R() - .5) * 16) + 'px');
      b.innerHTML = '<span class="face">' + ICONS[t.icon]() + '</span>';
      b.addEventListener('click', () => open(i, b));
      grid.appendChild(b);
    });
    const last = h('button', 'th th23 locked'); last.type = 'button'; last.setAttribute('aria-label', 'The 23rd thing');
    last.innerHTML = '<span class="env">' + ICONS.envelope() + '</span><span class="seal">23</span>';
    last.addEventListener('click', () => {
      if (last.classList.contains('locked')) {
        last.classList.remove('nope'); void last.offsetWidth; last.classList.add('nope');
        msg('Not yet. Open the others first. 😌'); return;
      }
      open(total, last);
    });
    grid.appendChild(last);
    deco(sec, 'teddy', { top: '3.5%', right: '6%', w: 62, r: 10 });
  }

  /* =========================================================
     6. THE GAME (snake, but the food is kisses)
     ========================================================= */
  function buildGame() {
    const sec = $('#game'); sec.classList.add('game');
    sec.innerHTML = '<div class="nb" id="nb"></div>';
    const nb = $('#nb'); const G = SITE.game; const N = 14;
    let cv, ctx, over, msgEl, goBtn, cs = 20, dpr = Math.min(2, window.devicePixelRatio || 1);
    let snake, dir, queue, food, eaten, state = 'idle', acc = 0, last = 0, vis = false, running = false, T = 0;

    function reset() {
      snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]; dir = { x: 1, y: 0 }; queue = []; eaten = 0; placeFood(); score();
    }
    function placeFood() {
      let p; do { p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; } while (snake.some((s) => s.x === p.x && s.y === p.y));
      food = p;
    }
    function score() { const s = $('#gScore', nb); if (s) s.textContent = eaten + ' / ' + G.goal + ' kisses'; }

    function mount() {
      nb.innerHTML = '<h2>' + esc(G.title) + '</h2><p class="intro">' + esc(G.intro) + '</p>' +
        '<div class="gwrap"><canvas id="gc" aria-label="Snake game: catch the kisses"></canvas><div class="gover on" id="gOver"><p id="gMsg">' + esc(G.startMsg) + '</p><button class="btn red" id="gGo" type="button">Start</button></div></div>' +
        '<p class="gscore" id="gScore" aria-live="polite"></p>' +
        '<div class="dpad"><button type="button" data-d="u" aria-label="Up">↑</button><button type="button" data-d="l" aria-label="Left">←</button><button type="button" data-d="d" aria-label="Down">↓</button><button type="button" data-d="r" aria-label="Right">→</button></div>' +
        '<p class="ghint">swipe on the board, or use the arrows</p>';
      cv = $('#gc', nb); ctx = cv.getContext('2d'); over = $('#gOver', nb); msgEl = $('#gMsg', nb); goBtn = $('#gGo', nb);
      state = 'idle'; reset(); size();
      goBtn.addEventListener('click', () => { if (state === 'dead') { reset(); } start(); });
      $$('.dpad button', nb).forEach((b) => b.addEventListener('click', () => { const d = b.dataset.d; turn(d === 'l' ? -1 : d === 'r' ? 1 : 0, d === 'u' ? -1 : d === 'd' ? 1 : 0); }));
      let sx = 0, sy = 0, down = false;
      cv.addEventListener('pointerdown', (e) => { down = true; sx = e.clientX; sy = e.clientY; });
      cv.addEventListener('pointerup', (e) => {
        if (!down) return; down = false;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
        if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
      });
      cv.addEventListener('pointercancel', () => { down = false; });
    }
    function size() {
      const w = $('.gwrap', nb).clientWidth || 280;
      cs = Math.max(16, Math.floor(Math.min(w, 336) / N));
      cv.width = cs * N * dpr; cv.height = cs * N * dpr; cv.style.width = cv.style.height = (cs * N) + 'px';
      draw();
    }
    function turn(dx, dy) {
      if (state === 'dead' || state === 'won') return;
      const ref = queue.length ? queue[queue.length - 1] : dir;
      if ((ref.x === -dx && ref.y === -dy) || (ref.x === dx && ref.y === dy)) return;
      if (queue.length < 2) queue.push({ x: dx, y: dy });
      if (state === 'idle') start();
    }
    function start() { state = 'play'; over.classList.remove('on'); acc = 0; last = performance.now(); }
    function lose() {
      state = 'dead';
      msgEl.textContent = G.loseMsgs[Math.floor(Math.random() * G.loseMsgs.length)];
      goBtn.textContent = 'Try again'; over.classList.add('on');
    }
    function tick() {
      if (queue.length) dir = queue.shift();
      const h = snake[0]; const nx = (h.x + dir.x + N) % N, ny = (h.y + dir.y + N) % N;
      const eat = nx === food.x && ny === food.y;
      const body = eat ? snake : snake.slice(0, -1);
      if (body.some((s) => s.x === nx && s.y === ny)) return lose();
      snake.unshift({ x: nx, y: ny });
      if (eat) { eaten++; score(); if (eaten >= G.goal) { state = 'won'; draw(); setTimeout(reward, 650); return; } placeFood(); } else snake.pop();
    }
    function reward() {
      nb.innerHTML = '<div class="coupon"><p class="c-top">You did it, Nana.</p><p class="c-big">Unlimited lifetime kisses</p>' +
        G.coupon.map((l) => '<p class="c-line">' + esc(l) + '</p>').join('') +
        '<p class="c-sign">— ' + esc(SITE.letterSign) + '</p><div class="stamp-out">' + esc(G.stamp) + '</div></div><button class="btn dark" id="gAgain" type="button">Play again</button>';
      $('#gAgain', nb).addEventListener('click', mount_again);
    }
    function mount_again() { mount(); }

    function kiss(cx, cy, s) {
      const w = cs * 1.08 * s, hh = cs * .4 * s;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, cy);
      ctx.quadraticCurveTo(cx - w / 4, cy - hh * 1.15, cx, cy - hh * .45);
      ctx.quadraticCurveTo(cx + w / 4, cy - hh * 1.15, cx + w / 2, cy);
      ctx.quadraticCurveTo(cx, cy + hh * 1.3, cx - w / 2, cy);
      ctx.closePath(); ctx.fillStyle = '#b3414a'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#3a2320'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - w * .34, cy); ctx.quadraticCurveTo(cx, cy + hh * .12, cx + w * .34, cy); ctx.lineWidth = 1.3; ctx.stroke();
    }
    function draw() {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = cs * N;
      ctx.fillStyle = '#fbf3e4'; ctx.fillRect(0, 0, W, W);
      ctx.fillStyle = '#ead8c2';
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) { ctx.beginPath(); ctx.arc(x * cs + cs / 2, y * cs + cs / 2, 1.1, 0, 6.3); ctx.fill(); }
      const pulse = 1 + Math.sin(T * 5) * .08;
      kiss(food.x * cs + cs / 2, food.y * cs + cs / 2, pulse);
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i], cx = s.x * cs + cs / 2, cy = s.y * cs + cs / 2;
        ctx.beginPath(); ctx.arc(cx, cy, cs * (i === 0 ? .48 : .4), 0, 6.3);
        ctx.fillStyle = i === 0 ? '#b3414a' : (i % 2 ? '#f2cbc5' : '#e5a09d'); ctx.fill();
        ctx.lineWidth = 1.7; ctx.strokeStyle = '#3a2320'; ctx.stroke();
        if (i === 0) {
          const ex = dir.x * cs * .12, ey = dir.y * cs * .12, px = -dir.y * cs * .17, py = dir.x * cs * .17;
          ctx.fillStyle = '#fffaf1';
          [[1, 1], [-1, -1]].forEach((k) => { ctx.beginPath(); ctx.arc(cx + ex + px * k[0], cy + ey + py * k[0], cs * .1, 0, 6.3); ctx.fill(); });
          ctx.fillStyle = '#3a2320';
          [[1, 1], [-1, -1]].forEach((k) => { ctx.beginPath(); ctx.arc(cx + ex * 1.6 + px * k[0], cy + ey * 1.6 + py * k[0], cs * .05, 0, 6.3); ctx.fill(); });
        }
      }
    }
    function frame(ts) {
      if (!running) return;
      requestAnimationFrame(frame);
      const dt = Math.min(120, ts - last || 0); last = ts; T = ts / 1000;
      if (state === 'play') {
        acc += dt; const step = Math.max(92, 150 - eaten * 5);
        while (acc >= step) { acc -= step; tick(); if (state !== 'play') break; }
      }
      draw();
    }
    mount();
    new IntersectionObserver((es) => {
      vis = es[0].isIntersecting;
      if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); } else if (!vis) running = false;
    }, { threshold: .15 }).observe(sec);
    document.addEventListener('keydown', (e) => {
      if (!vis || state === 'dead' || state === 'won') return;
      const k = e.key.toLowerCase(); const m = { arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0], arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1] }[k];
      if (!m || (document.activeElement && /input|textarea/i.test(document.activeElement.tagName))) return;
      e.preventDefault(); turn(m[0], m[1]);
    });
    window.addEventListener('resize', () => { if (cv && cv.isConnected) size(); });
    deco(sec, 'flower', { top: '3%', left: '5%', w: 50, r: -12 });
    deco(sec, 'heart', { bottom: '3.5%', right: '8%', w: 34, r: 12 });
  }

  /* =========================================================
     6b. YOU, BEING SUPER CUTE (his chats)
     ========================================================= */
  function buildChats() {
    const sec = $('#chats'); sec.classList.add('chats');
    sec.innerHTML = '<h2 class="hand h-big">You being super cute to me.</h2><p class="sub">(I kept all of these)</p><div class="chat-row"></div><p class="chat-hint">tap one to read it</p>';
    const row = $('.chat-row', sec); const modal = $('#modal');
    const src = (f) => (window.PHOTO_DATA && window.PHOTO_DATA[f]) || ('assets/chats/' + f);
    SITE.chats.forEach((c, i) => {
      const f = h('figure', 'chat'); f.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1.2 + (i % 3) * .7)) + 'deg');
      f.innerHTML = '<button class="chat-btn" type="button" aria-label="Read this message: ' + esc(c.cap) + '"><span class="tape"></span><img src="' + src(c.file) + '" alt="A chat screenshot" loading="lazy" style="aspect-ratio:' + c.ar + '"></button><figcaption>' + esc(c.cap) + '</figcaption>';
      $('.chat-btn', f).addEventListener('click', () => {
        modal.innerHTML = '<div class="paper shot" role="dialog" aria-modal="true" aria-label="Chat screenshot"><button class="x" type="button" aria-label="Close">×</button><img src="' + src(c.file) + '" alt="A chat screenshot"><p class="p-title">' + esc(c.cap) + '</p></div>';
        requestAnimationFrame(() => modal.classList.add('open'));
      });
      row.appendChild(f);
    });
    deco(sec, 'bow', { top: '4%', right: '7%', w: 54, r: -12 });
  }

  /* =========================================================
     7. THINGS I DON'T WANT YOU TO FORGET
     ========================================================= */
  function buildEnvelopes() {
    const sec = $('#notes'); sec.classList.add('notes');
    sec.innerHTML = '<h2 class="hand h-big">Things I don\'t want you to forget</h2><p class="sub">(open them slowly)</p><div class="envs"></div>';
    const wrap = $('.envs', sec);
    SITE.envelopes.forEach((t) => {
      const b = h('button', 'env-w'); b.type = 'button'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Open a note');
      b.innerHTML = '<span class="back"></span><span class="paperin">' + esc(t) + '</span><span class="pocket"></span><span class="flap"></span><span class="seal">♡</span><span class="front-label">don\'t forget…</span>';
      b.addEventListener('click', () => { const o = b.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
      wrap.appendChild(b);
    });
    deco(sec, 'tulip', { bottom: '3%', right: '8%', w: 54, r: 10 });
  }

  /* =========================================================
     8. INDIA -> IRELAND  (scroll-driven)
     ========================================================= */
  function buildDistance() {
    const sec = $('#distance'); sec.classList.add('dist');
    const A = { x: 125, y: 92 }, B = { x: 250, y: 330 }, M = { x: 180, y: 211 };
    sec.innerHTML = '<div class="dist-sticky"><svg class="dist-svg" viewBox="0 0 360 440" aria-hidden="true">' +
      '<path class="line" id="dLine" d=""/>' +
      '<g id="dI"><circle class="dot" r="10" fill="#8a5a44"/><text class="lbl" text-anchor="middle" y="-26">IRELAND <tspan class="flag">🇮🇪</tspan></text></g>' +
      '<g id="dN"><circle class="dot" r="10" fill="#b3414a"/><text class="lbl" text-anchor="middle" y="46">INDIA <tspan class="flag">🇮🇳</tspan></text></g>' +
      '<g transform="translate(180 211)"><g class="heartpop" id="dH"><path d="M0 14C-16 3-19-8-12-14c5-5 10-2 12 3 2-5 7-8 12-3 7 6 4 17-12 28z" transform="translate(0 -4) scale(.9)" fill="#b3414a" stroke="#3a2320" stroke-width="2.2" stroke-linejoin="round"/></g></g></svg>' +
      '<div class="dist-text" aria-live="polite">' +
      '<p>This is probably my least favourite line on this website.</p>' +
      '<p>Because right now, this is the distance between us.</p>' +
      '<p class="red">But someday…</p>' +
      '<p>I\'m going to see you at that airport.</p>' +
      '<p class="small">(I\'m working on it. I\'m trying to get into a university so I can be closer to you.)</p></div></div>';
    const line = $('#dLine'), gI = $('#dI'), gN = $('#dN'), heart = $('#dH');
    const ps = $$('.dist-text p', sec);
    const lbls = $$('.lbl', sec);
    function bez(a, c, b, t) { const u = 1 - t; return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }; }
    function update() {
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - window.innerHeight), 0, 1);
      const t = ease(clamp((p - .4) / .38, 0, 1)) * .93;
      const a = { x: lerp(A.x, M.x, t), y: lerp(A.y, M.y, t) }, b = { x: lerp(B.x, M.x, t), y: lerp(B.y, M.y, t) };
      const c = { x: (a.x + b.x) / 2 + (b.y - a.y) * .22, y: (a.y + b.y) / 2 - (b.x - a.x) * .22 };
      const f = clamp(p / .13, 0, 1);
      let d = 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1);
      const n = 36;
      for (let k = 1; k <= n; k++) { const pt = bez(a, c, b, (k / n) * f); d += ' L' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1); }
      line.setAttribute('d', d);
      gI.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ')');
      gN.setAttribute('transform', 'translate(' + b.x.toFixed(1) + ' ' + b.y.toFixed(1) + ')');
      const lo = clamp(1 - (p - .42) / .2, 0, 1);
      lbls.forEach((l) => (l.style.opacity = lo));
      heart.classList.toggle('on', p > .83);
      const on = [p > .13 && p <= .3, p > .3 && p <= .6, p > .6 && p <= .8, p > .8, p > .9];
      ps.forEach((el, k) => el.classList.toggle('on', on[k]));
    }
    update();
    let tick = false;
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; update(); }); } }, { passive: true });
    window.addEventListener('resize', update);
  }

  /* =========================================================
     9. VIDEO
     ========================================================= */
  function buildVideo() {
    const sec = $('#video'); sec.classList.add('video');
    sec.innerHTML = '<p class="hand">I made you something.</p><div class="vf" id="vf"><i></i><i></i><i></i><i></i><div class="poster"><span>for Nana</span></div><video playsinline controls preload="none"></video><div class="msg">The video isn\'t here yet. (Put it at assets/video/for-nana.mp4)</div></div><button class="btn solid" id="vBtn" type="button">Press play, Nana.</button>';
    const vf = $('#vf'), v = $('video', vf), btn = $('#vBtn');
    const D = window.PHOTO_DATA || {};
    const vsrc = D.video || SITE.video, vposter = D.poster || SITE.videoPoster;
    if (SITE.videoAspect) vf.style.aspectRatio = SITE.videoAspect;
    if (vposter) { const ps = $('.poster', vf); ps.style.cssText = 'background:url(' + vposter + ') center/cover'; ps.innerHTML = ''; v.poster = vposter; }
    btn.addEventListener('click', () => {
      if (!vsrc) { vf.classList.add('missing'); return; }
      vf.classList.remove('missing'); vf.classList.add('playing'); btn.classList.add('gone');
      music.pause();
      v.src = vsrc; const p = v.play(); if (p && p.catch) p.catch(() => { /* controls are visible */ });
    });
    v.addEventListener('error', () => { vf.classList.remove('playing'); vf.classList.add('missing'); btn.classList.remove('gone'); });
  }

  /* =========================================================
     10. THE LETTER
     ========================================================= */
  function buildLetter() {
    const sec = $('#letter'); sec.classList.add('letter');
    sec.innerHTML = '<div class="sheet"><h2>For my Nana.</h2>' + SITE.letter.map((p) => '<p>' + esc(p) + '</p>').join('') + '<p class="sign">— ' + esc(SITE.letterSign) + '</p><div class="pressed sticker">' + ICONS.flower3() + '</div></div>';
    const ps = $$('.sheet p', sec);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .6 });
    ps.forEach((p) => io.observe(p));
  }

  /* =========================================================
     11. PRAYER
     ========================================================= */
  function buildPrayer() {
    const sec = $('#prayer'); sec.classList.add('prayer');
    sec.innerHTML = '<svg class="cross" viewBox="0 0 24 40" aria-hidden="true"><path d="M12 2V38M2 13H22"/></svg><p class="hand">One thing I pray for…</p><p class="verse">' + esc(SITE.verse) + '<cite>' + esc(SITE.verseRef) + '</cite></p><div class="prayer-lines">' +
      SITE.prayer.map((l) => '<p>' + esc(l) + '</p>').join('') + '<p>Amen.</p></div>';
    const ps = $$('.prayer-lines p', sec);
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { ps.forEach((p, i) => setTimeout(() => p.classList.add('in'), 700 + i * 1500)); io.disconnect(); } }, { threshold: .3 });
    io.observe($('.prayer-lines', sec));
  }

  /* =========================================================
     FINAL
     ========================================================= */
  function buildFinal() {
    const sec = $('#final'); sec.classList.add('final');
    const top = [
      { f: '12-baby-yellow.jpg', x: 5, y: 8, w: 23, r: -6, k: 'polaroid' },
      { ico: 'flower3', x: 42, y: 14, w: 16, r: 8 },
      { f: '09-polaroid.jpg', x: 67, y: 4, w: 26, r: 5, k: 'none' },
      { f: '04-scooter.jpg', x: 22, y: 52, w: 34, r: -3, k: 'border', tall: 1 },
      { ico: 'spark', x: 70, y: 62, w: 9, r: 0, tall: 1 }
    ];
    const bot = [
      { f: '16-cinema-snacks.jpg', x: 4, y: 6, w: 34, r: -4, k: 'border' },
      { f: '13-baby-laughing.jpg', x: 62, y: 8, w: 23, r: 5, k: 'polaroid' },
      { ico: 'flower2', x: 44, y: 10, w: 13, r: -8 },
      { ico: 'tulip', x: 8, y: 62, w: 15, r: -6, tall: 1 },
      { f: '05-sofa-hug.jpg', x: 36, y: 54, w: 30, r: 4, k: 'border', tall: 1 },
      { ico: 'heart', x: 78, y: 64, w: 10, r: 8, tall: 1 }
    ];
    function band(list, cls) {
      return '<div class="fin-band ' + cls + '">' + list.map((o) => {
        const st = 'left:' + o.x + '%;top:' + o.y + '%;width:' + o.w + 'vw;max-width:' + Math.round(o.w * 6.2) + 'px;transform:rotate(' + o.r + 'deg)';
        const inner = o.f ? '<div class="box"><img src="' + photoSrc(o.f) + '" alt=""></div>' : '<div class="sticker">' + ICONS[o.ico]() + '</div>';
        return '<div class="fb-item float ' + (o.k || '') + (o.tall ? ' tall' : '') + '" style="' + st + ';animation-delay:-' + (Math.random() * 8).toFixed(1) + 's">' + inner + '</div>';
      }).join('') + '</div>';
    }
    sec.innerHTML = band(top, 'top') +
      '<div class="final-core"><p class="fin-l fin-a">Nanaaaaaaaa…</p><p class="fin-l fin-b">Happy 23rd, babyyiieeeeeeee. ❤️</p><p class="fin-l fin-c">I love you, my person.</p><p class="fin-l fin-d">— your pretty girl</p></div>' +
      band(bot, 'bot') + '<p class="fin-restart"><a href="#top" id="again">start from the beginning</a></p>';
    const a = $('.fin-a', sec), b = $('.fin-b', sec), c = $('.fin-c', sec), d = $('.fin-d', sec), rs = $('.fin-restart', sec);
    const bits = $$('.fb-item', sec); let played = false;
    async function play() {
      played = true;
      await sleep(1400); a.classList.add('in');
      await sleep(3600); a.classList.remove('in');
      await sleep(1800); b.classList.add('in');
      await sleep(2800);
      for (const it of bits.sort(() => Math.random() - .5)) { it.classList.add('in'); await sleep(reduce ? 100 : 650); }
      await sleep(1600); c.classList.add('in');
      await sleep(3000); d.classList.add('in');
      await sleep(3500); rs.classList.add('in');
    }
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting && !played) { play(); io.disconnect(); } }, { threshold: .55 }).observe(sec);
    $('#again', sec).addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* =========================================================
     GO
     ========================================================= */
  function init() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    lock();
    const startBouquet = buildBouquet();
    buildCloud(); buildStupid(); buildThings(); buildGame(); buildChats(); buildEnvelopes(); buildDistance(); buildVideo(); buildLetter(); buildPrayer(); buildFinal();
    const gate = initGate(() => { window.scrollTo(0, 0); startBouquet(); });
    // handy for testing: open the page with ?skip to jump past the entrance
    if (/[?&]skip\b/.test(location.search)) gate.skip();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
