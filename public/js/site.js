// Croq'moi — comportements communs + animations (GSAP si présent).
(function () {
  const C = window.CROQ;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && !reduced;
  const hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* Navigation */
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); } });
  }
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Marquee : on double la piste pour la boucle */
  const track = document.querySelector('.marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* Cartes menus */
  function menuCard(s) {
    const flipIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
    const heart = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9z"/></svg>';
    return `
      <button class="menu-card" type="button" data-id="${s.id}" aria-label="${s.nom} : voir la version de votre chien">
        <div class="menu-card-inner">
          <div class="menu-face front">
            <div><span class="tag">${heart} Date ${s.nom.toLowerCase()}</span><h3>${s.nom}</h3><p class="dish">${s.humain}</p></div>
            <div class="menu-art">${C.svgFor(s.emoji)}</div>
            <div class="meta"><span>Votre assiette</span><span>${s.prep}</span><span class="flip-hint">${flipIcon} Sa version</span></div>
          </div>
          <div class="menu-face back">
            <div><span class="tag">${heart} Pour lui</span><h3>${s.nom}, version chien</h3><p class="dish">${s.chien}</p></div>
            <div class="menu-art">${C.svgFor('bowl')}</div>
            <div class="meta"><span>${s.kcal} kcal pour 10 kg</span><span>En commun : ${s.commun.join(', ')}</span><span class="flip-hint">${flipIcon} Retour</span></div>
          </div>
        </div>
      </button>`;
  }
  document.querySelectorAll('[id^="menu-grid"]').forEach((grid) => {
    const limit = grid.id === 'menu-grid-home' ? 6 : C.saveurs.length;
    grid.innerHTML = C.saveurs.slice(0, limit).map(menuCard).join('');
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.menu-card');
      if (card) card.classList.toggle('is-flipped');
    });
  });

  /* Formules + sélecteur de taille */
  const plans = document.getElementById('plans');
  let size = 'petit';
  function renderPlans() {
    if (!plans) return;
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
    plans.innerHTML = C.formules.map((f) => {
      const p = C.prix(f.id, size);
      return `
        <article class="plan ${f.featured ? 'is-featured' : ''} reveal is-visible">
          ${f.featured ? '<span class="badge">Le plus choisi</span>' : ''}
          <div><h3>${f.nom}</h3><p class="freq">${f.pitch}</p></div>
          <div>
            <div class="price" data-price="${p.semaine}"><span class="price-value">${C.euro(p.semaine)}</span><small>/ semaine</small></div>
            <p class="per-date">soit ${C.euro(p.parDate)} le date, pour deux</p>
          </div>
          <ul>${f.points.map((pt) => `<li>${check}<span>${pt}</span></li>`).join('')}</ul>
          <a class="btn ${f.featured ? 'btn-light' : 'btn-primary'}" href="/commander?formule=${f.id}&poids=${size}">Choisir ${f.nom}</a>
        </article>`;
    }).join('');
  }
  renderPlans();
  document.querySelectorAll('.size-switch button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.size-switch button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      const old = {};
      plans.querySelectorAll('.plan').forEach((el, i) => { old[i] = parseFloat(el.querySelector('.price').dataset.price); });
      size = b.dataset.size;
      renderPlans();
      if (hasGsap) {
        plans.querySelectorAll('.plan').forEach((el, i) => {
          const target = parseFloat(el.querySelector('.price').dataset.price);
          const span = el.querySelector('.price-value');
          const obj = { v: old[i] ?? target };
          gsap.to(obj, { v: target, duration: .6, ease: 'power2.out', onUpdate: () => { span.textContent = C.euro(obj.v); } });
        });
      }
    });
  });

  /* Reveal au scroll */
  const reveals = document.querySelectorAll('.reveal');
  if (hasST) {
    reveals.forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('is-visible') });
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Hero */
  const hero = document.getElementById('hero-svg');
  if (hero && hasGsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#table', { y: 60, opacity: 0, duration: .8 })
      .from('#lamp', { y: -80, opacity: 0, duration: .8 }, '-=.5')
      .from('#woman', { x: -80, opacity: 0, duration: .8 }, '-=.5')
      .from('#dog', { x: 80, opacity: 0, duration: .8 }, '-=.7')
      .from('#plate', { x: -120, opacity: 0, duration: .7 }, '-=.4')
      .from('#bowl', { x: 120, opacity: 0, duration: .7 }, '-=.6')
      .from('#candle', { scaleY: 0, transformOrigin: '50% 100%', opacity: 0, duration: .5 }, '-=.3')
      .from('#steam path', { scale: 0, transformOrigin: '50% 100%', opacity: 0, stagger: .15, duration: .5 }, '-=.1');

    gsap.to('#flame', { scaleX: .85, scaleY: 1.1, skewX: 4, transformOrigin: '50% 100%', duration: .35, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#flame-core', { y: -2, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#lamp-glow', { opacity: .3, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#tail', { rotation: 18, transformOrigin: '540px 380px', duration: .3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#dog-head', { rotation: -4, transformOrigin: '505px 300px', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
    gsap.to('#tongue', { scaleY: 1.3, transformOrigin: '50% 0%', duration: .45, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('#fork', { rotation: -10, transformOrigin: '258px 330px', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
    gsap.to('#steam path', { y: -14, opacity: .25, duration: 2.2, stagger: .6, repeat: -1, ease: 'sine.inOut' });
  }

  /* Split : les deux côtés arrivent face à face */
  const human = document.getElementById('split-human');
  const dog = document.getElementById('split-dog');
  if (human && dog && hasST) {
    gsap.from(human, { x: -60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: human, start: 'top 80%', once: true } });
    gsap.from(dog, { x: 60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: dog, start: 'top 80%', once: true } });
    gsap.from('.split-heart', { scale: 0, duration: .6, ease: 'back.out(2)', delay: .5, scrollTrigger: { trigger: human, start: 'top 80%', once: true } });
  }

  /* Tracés qui se dessinent */
  if (hasST) {
    document.querySelectorAll('.step-art svg path.draw').forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: p, start: 'top 85%', once: true } });
    });
  }
})();
