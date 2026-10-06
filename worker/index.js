// Croq'moi — Worker : statiques via ASSETS, API liste d'attente via KV WAITLIST.

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const FORMULES = new Set(['premier-rendez-vous', 'tete-a-tete', 'inseparables']);
const POIDS = new Set(['petit', 'moyen', 'grand']);
const SAVEURS = new Set(['italien', 'sushi', 'bistrot', 'raclette', 'burger', 'mexicain', 'indien', 'brunch']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

function clean(s, max) {
  return String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

async function handleWaitlistPost(request, env) {
  if (!env.WAITLIST) return json({ ok: false, error: 'KV non configuré' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'JSON invalide' }, 400); }

  // Honeypot : un humain laisse le champ vide.
  if (clean(body.website, 200)) return json({ ok: true });

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Adresse email invalide' }, 400);

  const formule = clean(body.formule, 40);
  if (!FORMULES.has(formule)) return json({ ok: false, error: 'Formule inconnue' }, 400);

  const chien = body.chien && typeof body.chien === 'object' ? body.chien : {};
  const poids = clean(chien.poids, 10);
  if (!POIDS.has(poids)) return json({ ok: false, error: 'Taille du chien inconnue' }, 400);

  const saveurs = Array.isArray(body.saveurs)
    ? [...new Set(body.saveurs.map((s) => clean(s, 20)).filter((s) => SAVEURS.has(s)))].slice(0, 5)
    : [];

  // Limite : une inscription par IP et par minute.
  const ip = request.headers.get('cf-connecting-ip') || 'inconnue';
  const rlKey = `rl:${ip}`;
  if (await env.WAITLIST.get(rlKey)) return json({ ok: false, error: 'Doucement. Réessayez dans une minute.' }, 429);
  await env.WAITLIST.put(rlKey, '1', { expirationTtl: 60 });

  const record = {
    email,
    prenom: clean(body.prenom, 60),
    chien: {
      nom: clean(chien.nom, 60),
      poids,
      allergies: Array.isArray(chien.allergies) ? chien.allergies.map((a) => clean(a, 30)).filter(Boolean).slice(0, 8) : [],
    },
    formule,
    saveurs,
    prix: Number.isFinite(Number(body.prix)) ? Number(body.prix) : null,
    date: new Date().toISOString(),
    source: clean(request.headers.get('referer'), 200),
  };
  await env.WAITLIST.put(`w:${email}`, JSON.stringify(record));
  return json({ ok: true });
}

function csvCell(v) {
  const s = Array.isArray(v) ? v.join(' | ') : String(v ?? '');
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function handleWaitlistExport(url, env) {
  if (!env.WAITLIST) return json({ ok: false, error: 'KV non configuré' }, 503);
  const secret = url.searchParams.get('secret') || '';
  if (!env.EXPORT_SECRET || secret !== env.EXPORT_SECRET) return json({ ok: false, error: 'Accès refusé' }, 403);

  const rows = [];
  let cursor;
  do {
    const page = await env.WAITLIST.list({ prefix: 'w:', cursor });
    for (const k of page.keys) {
      const v = await env.WAITLIST.get(k.name);
      if (v) rows.push(JSON.parse(v));
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  rows.sort((a, b) => a.date.localeCompare(b.date));

  if (url.searchParams.get('format') === 'json') return json({ ok: true, count: rows.length, rows });

  const head = ['date', 'email', 'prenom', 'chien', 'poids', 'allergies', 'formule', 'saveurs', 'prix'];
  const lines = [head.join(';')];
  for (const r of rows) {
    lines.push([r.date, r.email, r.prenom, r.chien?.nom, r.chien?.poids, r.chien?.allergies, r.formule, r.saveurs, r.prix].map(csvCell).join(';'));
  }
  return new Response('﻿' + lines.join('\n'), {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="croqmoi-liste-attente.csv"', 'cache-control': 'no-store' },
  });
}

async function handleWaitlistDelete(url, env) {
  if (!env.WAITLIST) return json({ ok: false, error: 'KV non configuré' }, 503);
  const secret = url.searchParams.get('secret') || '';
  if (!env.EXPORT_SECRET || secret !== env.EXPORT_SECRET) return json({ ok: false, error: 'Accès refusé' }, 403);
  const email = (url.searchParams.get('email') || '').toLowerCase();
  if (!email) return json({ ok: false, error: 'email manquant' }, 400);
  await env.WAITLIST.delete(`w:${email}`);
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/waitlist') {
      if (request.method === 'POST') return handleWaitlistPost(request, env);
      if (request.method === 'GET') return handleWaitlistExport(url, env);
      if (request.method === 'DELETE') return handleWaitlistDelete(url, env);
      return json({ ok: false, error: 'Méthode non autorisée' }, 405);
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'Introuvable' }, 404);
    return env.ASSETS.fetch(request);
  },
};
