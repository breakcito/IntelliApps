/* IntelliApps · SCOM — interacciones */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => matchMedia('(min-width: 961px)').matches;

  /* ---------- Navegación y menú móvil ---------- */
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const mmenu = $('#mobile-menu');
  const setMenu = (open) => {
    mmenu.hidden = !open;
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(mmenu.hidden));
  $$('a', mmenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Revelado ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  $$('[data-reveal]').forEach((el) => revealObserver.observe(el));

  /* ---------- Hero: parallax y tilt 3D en escritorio ---------- */
  const heroBg = $('[data-parallax]');
  const heroStage = $('.hero-stage');
  const heroPhone = $('#hero-phone');
  if (!reduceMotion) {
    heroStage.addEventListener('pointermove', (e) => {
      if (!isDesktop()) return;
      const r = heroStage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroPhone.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
    });
    heroStage.addEventListener('pointerleave', () => { heroPhone.style.transform = ''; });
  }

  /* ---------- SCOM: selector de módulos ---------- */
  const MODULES = [
    {
      cat: 'personal',
      link: 'Ver procesos de Personal',
      poster: 'thumbnails/03-asistencia-planilla.jpg',
      video: 'videos/procesos/03-asistencia-planilla.mp4',
      bullets: [
        'Contratos, adendas e historial por trabajador',
        'Horarios por grupos y turnos día/noche',
        'Pre-planilla automática desde el tareo por QR',
      ],
    },
    {
      cat: 'logistica',
      link: 'Ver procesos de Logística',
      poster: 'thumbnails/04-inventario.jpg',
      video: 'videos/procesos/04-inventario.mp4',
      bullets: [
        'Kardex valorizado con alertas de stock mínimo',
        'Pedidos de contratistas con firma digital',
        'Cotizaciones comparadas y órdenes de compra',
      ],
    },
    {
      cat: 'activos',
      link: 'Ver procesos de Maquinaria',
      poster: 'thumbnails/12-mantenimiento.jpg',
      video: 'videos/procesos/12-mantenimiento.mp4',
      bullets: [
        'Ficha técnica, serie y horómetro por equipo',
        'Consumo de diésel frente a horas operadas',
        'Órdenes de taller vinculadas al almacén',
      ],
    },
    {
      cat: 'produccion',
      link: 'Ver procesos de Producción',
      poster: 'thumbnails/14-despacho.jpg',
      video: 'videos/procesos/14-despacho.mp4',
      bullets: [
        'Lotes por labor y ticket de pesaje en balanza',
        'Simulador de blending según leyes objetivo',
        'Liquidación transparente con maquila y mermas',
      ],
    },
  ];

  const scomVideo = $('#scom-video');
  const scomBullets = $('#scom-bullets');
  const scomLink = $('#scom-link');
  const stabBtns = $$('.stab');
  let activeMod = -1;

  const setModule = (idx, autoplay = true) => {
    if (idx === activeMod) return;
    activeMod = idx;
    const m = MODULES[idx];
    stabBtns.forEach((b, k) => b.setAttribute('aria-selected', String(k === idx)));
    scomBullets.innerHTML = m.bullets.map((b) => `<li><svg><use href="#i-check"/></svg>${b}</li>`).join('');
    scomLink.dataset.gotoFilter = m.cat;
    scomLink.innerHTML = `${m.link} <svg><use href="#i-arrow"/></svg>`;
    scomVideo.pause();
    scomVideo.poster = m.poster;
    scomVideo.src = m.video;
    if (autoplay && !reduceMotion) scomVideo.play().catch(() => {});
  };
  stabBtns.forEach((b) => b.addEventListener('click', () => setModule(+b.dataset.mod, true)));
  setModule(0, false);

  const scomObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !reduceMotion) scomVideo.play().catch(() => {});
      else scomVideo.pause();
    });
  }, { threshold: 0.25 });
  scomObserver.observe($('#scom'));

  /* ---------- Catálogo de 18 procesos ---------- */
  const rail = $('#rail');
  const filters = $('#filters');

  rail.innerHTML = PROCESOS.map((p, i) => `
    <button class="pcard" data-i="${i}" data-cat="${p.cat}" aria-label="Ver video: ${p.title}">
      <img src="thumbnails/${p.file}.jpg" alt="" loading="lazy">
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
    $$('.filter', filters).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    $$('.pcard', rail).forEach((c) => { c.hidden = !(cat === 'all' || c.dataset.cat === cat); });
    rail.scrollTo({ left: 0 });
    updateArrows();
  };
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (b) applyFilter(b.dataset.filter);
  });
  scomLink.addEventListener('click', () => applyFilter(scomLink.dataset.gotoFilter));

  const step = () => {
    const first = $('.pcard:not([hidden])', rail);
    return first ? first.offsetWidth * 2 + 36 : 400;
  };
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

  /* ---------- Scroll ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', scrollY > 24);
      if (!reduceMotion && isDesktop() && scrollY <= innerHeight * 1.2) {
        heroBg.style.transform = `translate3d(0, ${scrollY * 0.14}px, 0)`;
      } else if (!isDesktop()) {
        heroBg.style.transform = '';
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
