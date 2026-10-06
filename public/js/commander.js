// Croq'moi — configurateur en quatre étapes + inscription liste d'attente.
(function () {
  const C = window.CROQ;
  const form = document.getElementById('config-form');
  if (!form) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && !reduced;
  const params = new URLSearchParams(location.search);

  const state = {
    formule: C.formules.some((f) => f.id === params.get('formule')) ? params.get('formule') : 'tete-a-tete',
    poids: C.poids[params.get('poids')] ? params.get('poids') : 'petit',
    allergies: [],
    saveurs: [],
    step: 1,
  };

  /* Rendu des choix */
  const fWrap = document.getElementById('formules');
  fWrap.innerHTML = C.formules.map((f) => `
    <div class="choice">
      <input type="radio" name="formule" id="f-${f.id}" value="${f.id}" ${f.id === state.formule ? 'checked' : ''}>
      <label for="f-${f.id}"><strong>${f.nom}</strong><span>${f.dates} dates par semaine. ${f.pitch}</span></label>
    </div>`).join('');

  const pWrap = document.getElementById('poids');
  pWrap.innerHTML = Object.entries(C.poids).map(([id, p]) => `
    <div class="choice">
      <input type="radio" name="poids" id="p-${id}" value="${id}" ${id === state.poids ? 'checked' : ''}>
      <label for="p-${id}"><strong>${p.label}</strong><span>${p.detail}${p.sup ? ` · +${C.euro(p.sup)} par date` : ' · inclus'}</span></label>
    </div>`).join('');

  const aWrap = document.getElementById('allergies');
  aWrap.innerHTML = C.allergenes.map((a) => `<label><input type="checkbox" name="allergie" value="${a.id}"> ${a.label}</label>`).join('');

  const sWrap = document.getElementById('saveurs');
  sWrap.innerHTML = C.saveurs.map((s) => `
    <div class="choice">
      <input type="checkbox" name="saveur" id="s-${s.id}" value="${s.id}">
      <label for="s-${s.id}"><div class="mini-art">${C.svgFor(s.emoji)}</div><strong>${s.nom}</strong><span>${s.humain}</span></label>
    </div>`).join('');

  /* Lecture de l'état */
  function read() {
    state.formule = form.querySelector('input[name="formule"]:checked')?.value || state.formule;
    state.poids = form.querySelector('input[name="poids"]:checked')?.value || state.poids;
    state.allergies = [...form.querySelectorAll('input[name="allergie"]:checked')].map((i) => i.value);
    state.saveurs = [...form.querySelectorAll('input[name="saveur"]:checked')].map((i) => i.value);
  }
  const formule = () => C.formules.find((f) => f.id === state.formule);

  /* Saveurs : masquer les allergènes, plafonner au nombre de dates */
  function refreshSaveurs() {
    const max = formule().dates;
    const checked = form.querySelectorAll('input[name="saveur"]:checked').length;
    C.saveurs.forEach((s) => {
      const input = document.getElementById('s-' + s.id);
      const incompatible = s.allergenes.some((a) => state.allergies.includes(a));
      if (incompatible && input.checked) input.checked = false;
      input.disabled = incompatible || (!input.checked && checked >= max);
      input.closest('.choice').title = incompatible ? 'Masquée à cause des allergies indiquées' : '';
    });
    const n = form.querySelectorAll('input[name="saveur"]:checked').length;
    document.getElementById('counter').textContent = `${n} sur ${max} saveur${max > 1 ? 's' : ''} choisie${n > 1 ? 's' : ''}`;
  }

  /* Récapitulatif */
  function refreshSummary() {
    const f = formule();
    const p = C.prix(f.id, state.poids);
    const nom = document.getElementById('chien-nom').value.trim();
    document.getElementById('s-formule').textContent = `${f.nom} · ${f.dates} dates`;
    document.getElementById('s-chien').textContent = `${nom || 'Votre chien'} · ${C.poids[state.poids].label.toLowerCase()} (${C.poids[state.poids].detail})`;
    document.getElementById('s-saveurs').textContent = state.saveurs.length ? state.saveurs.map((id) => C.saveurs.find((s) => s.id === id).nom).join(', ') : 'À choisir';
    document.getElementById('s-livraison').textContent = p.livraison ? C.euro(p.livraison) : 'Offerte';
    const total = document.getElementById('s-total');
    const target = p.semaine + p.livraison;
    if (hasGsap && total.dataset.v) {
      const obj = { v: parseFloat(total.dataset.v) };
      gsap.to(obj, { v: target, duration: .5, ease: 'power2.out', onUpdate: () => { total.textContent = C.euro(obj.v); } });
    } else {
      total.textContent = C.euro(target);
    }
    total.dataset.v = target;
    document.getElementById('s-promo').textContent = `Première box à ${C.euro(p.premiere + p.livraison)} (-30 %).`;
  }

  function refresh() { read(); refreshSaveurs(); read(); refreshSummary(); }
  form.addEventListener('change', refresh);
  form.addEventListener('input', refresh);
  refresh();

  /* Navigation entre étapes */
  const panels = [...form.querySelectorAll('.step-panel')];
  const bars = [...form.querySelectorAll('.progress span')];
  function go(step) {
    state.step = step;
    panels.forEach((p) => p.classList.toggle('is-active', Number(p.dataset.step) === step));
    bars.forEach((b, i) => { b.className = i + 1 < step ? 'is-done' : i + 1 === step ? 'is-current' : ''; });
    const active = panels.find((p) => Number(p.dataset.step) === step);
    if (hasGsap) gsap.from(active, { y: 16, opacity: 0, duration: .45, ease: 'power2.out' });
    active.querySelector('h2')?.setAttribute('tabindex', '-1');
    active.querySelector('h2')?.focus({ preventScroll: true });
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: reduced ? 'auto' : 'smooth' });
  }
  form.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]')) {
      if (state.step === 3 && state.saveurs.length === 0) {
        document.getElementById('counter').textContent = 'Choisissez au moins une saveur pour continuer.';
        return;
      }
      go(state.step + 1);
    }
    if (e.target.closest('[data-prev]')) go(state.step - 1);
  });

  /* Envoi */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    read();
    const emailField = document.getElementById('field-email');
    const email = document.getElementById('email').value.trim();
    const err = document.getElementById('submit-error');
    err.style.display = 'none';
    if (!EMAIL_RE.test(email)) { emailField.classList.add('has-error'); document.getElementById('email').focus(); return; }
    emailField.classList.remove('has-error');

    const btn = document.getElementById('submit');
    btn.disabled = true; btn.textContent = 'Un instant…';
    const p = C.prix(state.formule, state.poids);
    const payload = {
      email,
      prenom: document.getElementById('prenom').value.trim(),
      website: form.querySelector('input[name="website"]').value,
      chien: { nom: document.getElementById('chien-nom').value.trim(), poids: state.poids, allergies: state.allergies },
      formule: state.formule,
      saveurs: state.saveurs,
      prix: Math.round((p.semaine + p.livraison) * 100) / 100,
    };
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Une erreur est survenue. Réessayez dans un instant.');
      const prenom = payload.prenom ? `${payload.prenom}, on` : 'On';
      const chien = payload.chien.nom ? ` ${payload.chien.nom} et vous` : ' vous deux';
      document.getElementById('success-text').textContent = `${prenom} vous écrit dès que les livraisons ouvrent près de chez vous. La première table sera pour${chien}.`;
      go(5);
      if (hasGsap) {
        const check = document.getElementById('success-check');
        const len = check.getTotalLength();
        gsap.fromTo(check, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .7, ease: 'power2.out', delay: .2 });
      }
    } catch (ex) {
      err.textContent = ex.message;
      err.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Rejoindre la liste';
    }
  });
})();
