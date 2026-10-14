// Croq'moi — formulaire court des pages d'arrivée (email + poids), même API que le configurateur.
(function () {
  const C = window.CROQ;
  const form = document.getElementById('landing-form');
  if (!form) return;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[name="email"]').value.trim();
    const poids = form.querySelector('input[name="poids"]:checked')?.value || 'petit';
    form.classList.remove('has-error');
    if (!EMAIL_RE.test(email)) { form.classList.add('has-error'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const p = C.prix('tete-a-tete', poids);
    const payload = {
      email,
      website: form.querySelector('input[name="website"]').value,
      chien: { nom: '', poids, allergies: [] },
      formule: 'tete-a-tete',
      saveurs: [],
      prix: Math.round((p.semaine + p.livraison) * 100) / 100,
      parrain: (window.CROQ_ATTR && window.CROQ_ATTR.parrain) || '',
      attribution: window.CROQ_ATTR || null,
    };
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Une erreur est survenue. Réessayez dans un instant.');
      form.hidden = true;
      const ok = document.getElementById('landing-success');
      ok.querySelector('.code').textContent = data.code || '';
      ok.classList.add('is-visible');
    } catch (ex) {
      form.querySelector('.form-error').textContent = ex.message;
      form.classList.add('has-error');
      btn.disabled = false;
    }
  });
})();
