/* IntelliApps · SCOM — interacciones de la landing */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => matchMedia('(min-width: 1025px)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Navegación: fondo al hacer scroll ---------- */
  const nav = $('#nav');
  const onScrollNav = () => nav.classList.toggle('scrolled', scrollY > 24);

  /* ---------- Revelado de elementos ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach((el) => revealObserver.observe(el));

  /* ---------- Manifiesto: palabras que se iluminan con el scroll ---------- */
  const manifesto = $('#manifesto');
  const words = manifesto.textContent.trim().split(/\s+/);
  manifesto.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  const wordEls = $$('.w', manifesto);
  const updateManifesto = () => {
    const r = manifesto.getBoundingClientRect();
    const progress = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3));
    const lit = Math.round(progress * wordEls.length);
    wordEls.forEach((el, i) => el.classList.toggle('on', i < lit));
  };

  /* ---------- Contadores ---------- */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countObserver.unobserve(e.target);
      const end = +e.target.dataset.count;
      if (reduceMotion || end < 2) return;
      const t0 = performance.now();
      const tick = (t) => {
        const p = clamp((t - t0) / 1600);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countObserver.observe(el));

  /* ---------- Hero: parallax y tilt 3D ---------- */
  const heroBg = $('[data-parallax]');
  const heroStage = $('.hero-stage');
  const heroPhone = $('#hero-phone');
  const updateHeroParallax = () => {
    if (scrollY > innerHeight * 1.2) return;
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
  };
  if (!reduceMotion) {
    heroStage.addEventListener('pointermove', (e) => {
      const r = heroStage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroPhone.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    heroStage.addEventListener('pointerleave', () => { heroPhone.style.transform = ''; });
  }

  /* ---------- Módulos SCOM: teléfono fijo que cambia con el scroll ---------- */
  const modules = $$('.module');
  const layers = $$('#story-screen .layer');
  const progressBars = $$('.story-progress i');
  let activeLayer = -1;
  const setActiveModule = (i) => {
    if (i === activeLayer) return;
    activeLayer = i;
    modules.forEach((m, k) => m.classList.toggle('active', k === i));
    progressBars.forEach((b, k) => b.classList.toggle('active', k === i));
    layers.forEach((layer, k) => {
      layer.classList.toggle('active', k === i);
      const video = $('video', layer);
      if (k === i && isDesktop()) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };
  const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) setActiveModule(modules.indexOf(e.target));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  modules.forEach((m) => moduleObserver.observe(m));

  /* ---------- Galería en terreno: scroll vertical → desplazamiento horizontal ---------- */
  const fieldPin = $('#field-pin');
  const fieldTrack = $('#field-track');
  const updateField = () => {
    if (!isDesktop() || reduceMotion) { fieldTrack.style.transform = ''; return; }
    const r = fieldPin.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight));
    const max = fieldTrack.scrollWidth - innerWidth;
    fieldTrack.style.transform = `translate3d(${-p * max}px, 0, 0)`;
  };

  /* ---------- Catálogo de procesos ---------- */
  const rail = $('#rail');
  const filters = $('#filters');
  const thumbSrc = (p) => `thumbnails/${p.file}.jpg`;
  rail.innerHTML = PROCESOS.map((p, i) => `
    <button class="pcard" data-i="${i}" data-cat="${p.cat}" aria-label="Ver video: ${p.title}">
      <img src="${thumbSrc(p)}" alt="" loading="lazy">
      <span class="pcard-info">
        <span><small>${p.n} · ${CATEGORIAS[p.cat].toUpperCase()}</small><b>${p.title}</b></span>
        <span class="pcard-play"><svg><use href="#i-play"/></svg></span>
      </span>
    </button>`).join('');

  const counts = PROCESOS.reduce((acc, p) => ({ ...acc, [p.cat]: (acc[p.cat] || 0) + 1 }), {});
  const filterDefs = [['all', 'Todos', PROCESOS.length], ...Object.entries(CATEGORIAS).map(([k, v]) => [k, v, counts[k]])];
  filters.innerHTML = filterDefs.map(([k, label, n]) =>
    `<button class="filter" data-filter="${k}" aria-pressed="${k === 'all'}">${label}<small>${n}</small></button>`).join('');

  const prev = $('#rail-prev'), next = $('#rail-next');
  const updateArrows = () => {
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };
  const applyFilter = (cat) => {
    $$('.filter', filters).forEach((b) => b.setAttribute('aria-pressed', b.dataset.filter === cat));
    $$('.pcard', rail).forEach((c) => { c.hidden = !(cat === 'all' || c.dataset.cat === cat); });
    rail.scrollTo({ left: 0 });
    updateArrows();
  };
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (b) applyFilter(b.dataset.filter);
  });
  $$('[data-goto-filter]').forEach((a) => a.addEventListener('click', () => applyFilter(a.dataset.gotoFilter)));
  const step = () => $('.pcard:not([hidden])', rail).offsetWidth * 2 + 40;
  prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  rail.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();

  /* ---------- Modal de video ---------- */
  const modal = $('#vmodal');
  const vm = { video: $('#vm-video'), title: $('#vm-title'), desc: $('#vm-desc'), tag: $('#vm-tag') };
  const openVideo = ({ src, title, desc, tag }) => {
    vm.title.textContent = title;
    vm.desc.textContent = desc;
    vm.tag.textContent = tag;
    vm.video.src = src;
    modal.showModal();
    vm.video.play().catch(() => {});
  };
  const closeVideo = () => {
    vm.video.pause();
    vm.video.removeAttribute('src');
    vm.video.load();
    modal.close();
  };
  rail.addEventListener('click', (e) => {
    const card = e.target.closest('.pcard');
    if (!card) return;
    const p = PROCESOS[+card.dataset.i];
    openVideo({ src: `videos/procesos/${p.file}.mp4`, title: `${p.n} · ${p.title}`, desc: p.desc, tag: CATEGORIAS[p.cat] });
  });
  $$('[data-open-hero]').forEach((el) => {
    el.addEventListener('click', () => openVideo({ ...VIDEO_PRINCIPAL, tag: 'Video principal' }));
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    }
  });
  $('#vm-close').addEventListener('click', closeVideo);
  $('#vm-cta').addEventListener('click', closeVideo);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeVideo(); });
  modal.addEventListener('cancel', (e) => { e.preventDefault(); closeVideo(); });

  /* ---------- Formulario → WhatsApp ---------- */
  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => $(id).value.trim();
    const msg = `Hola IntelliApps, mi nombre es ${val('#f-name')} de la empresa ${val('#f-empresa')} (Tel: ${val('#f-phone')}). Quisiera coordinar una demostración sobre: ${val('#f-interes')}.`;
    window.open(`https://wa.me/51912800115?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  /* ---------- Bucle de scroll (un solo rAF para todos los efectos) ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollNav();
      updateManifesto();
      updateField();
      if (!reduceMotion) updateHeroParallax();
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
