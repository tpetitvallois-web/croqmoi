// Croq'moi — Worker : statiques via ASSETS, API liste d'attente via KV WAITLIST.

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const FORMULES = new Set(['premier-rendez-vous', 'tete-a-tete', 'inseparables']);
const POIDS = new Set(['petit', 'moyen', 'grand']);
const SAVEURS = new Set(['italien', 'sushi', 'bistrot', 'raclette', 'burger', 'mexicain', 'indien', 'brunch']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CODE_RE = /^CROQ-[A-Z0-9]{6}$/;
const ATTR_KEYS = ['source', 'medium', 'campaign', 'content', 'landing', 'date'];

// Code de parrainage dérivé de l'email (stable, non devinable sans l'email).
async function referralCode(email) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('croqmoi:' + email));
  const bytes = new Uint8Array(buf);
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % alphabet.length];
  return 'CROQ-' + out;
}

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

  const code = await referralCode(email);
  const parrain = clean(body.parrain, 12).toUpperCase();
  let parrainValide = false;
  if (parrain && CODE_RE.test(parrain) && parrain !== code) {
    parrainValide = Boolean(await env.WAITLIST.get(`c:${parrain}`));
  }
  const attribution = {};
  if (body.attribution && typeof body.attribution === 'object') {
    for (const k of ATTR_KEYS) attribution[k] = clean(body.attribution[k], 120);
  }

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
    code,
    parrain: parrain || '',
    parrainValide,
    attribution,
    date: new Date().toISOString(),
    referer: clean(request.headers.get('referer'), 200),
  };
  await env.WAITLIST.put(`w:${email}`, JSON.stringify(record));
  await env.WAITLIST.put(`c:${code}`, email);
  return json({ ok: true, code });
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

  const head = ['date', 'email', 'prenom', 'chien', 'poids', 'allergies', 'formule', 'saveurs', 'prix', 'code', 'parrain', 'parrain_valide', 'source', 'medium', 'campaign', 'content', 'landing', 'premier_contact'];
  const lines = [head.join(';')];
  for (const r of rows) {
    const a = r.attribution || {};
    lines.push([r.date, r.email, r.prenom, r.chien?.nom, r.chien?.poids, r.chien?.allergies, r.formule, r.saveurs, r.prix, r.code, r.parrain, r.parrainValide ? 'oui' : '', a.source, a.medium, a.campaign, a.content, a.landing, a.date].map(csvCell).join(';'));
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
  const existing = await env.WAITLIST.get(`w:${email}`);
  if (existing) { const r = JSON.parse(existing); if (r.code) await env.WAITLIST.delete(`c:${r.code}`); }
  await env.WAITLIST.delete(`w:${email}`);
  return json({ ok: true });
}

// --- Mesure d'activation : événements anonymes (vue de page, clic vers la carte), 90 jours.
const EVENT_TYPES = new Set(['pv', 'cta']);
async function handleEvent(request, env) {
  if (!env.WAITLIST) return json({ ok: false }, 503);
  let body;
  try { body = JSON.parse(await request.text()); } catch { return json({ ok: false }, 400); }
  const t = clean(body.t, 8);
  if (!EVENT_TYPES.has(t)) return json({ ok: false }, 400);
  const ev = {
    t,
    id: clean(body.id, 24),
    v: clean(body.v, 2),
    p: clean(body.p, 80),
    target: clean(body.target, 80),
    where: clean(body.where, 40),
    s: clean(body.s, 60),
    m: clean(body.m, 30),
    c: clean(body.c, 60),
    at: new Date().toISOString(),
  };
  if (!ev.id) return json({ ok: false }, 400);
  const key = `e:${ev.at}:${Math.random().toString(36).slice(2, 8)}`;
  await env.WAITLIST.put(key, JSON.stringify(ev), { expirationTtl: 60 * 60 * 24 * 90 });
  return json({ ok: true });
}

async function handleStats(url, env) {
  if (!env.WAITLIST) return json({ ok: false }, 503);
  const secret = url.searchParams.get('secret') || '';
  if (!env.EXPORT_SECRET || secret !== env.EXPORT_SECRET) return json({ ok: false, error: 'Accès refusé' }, 403);
  const events = [];
  let cursor;
  do {
    const page = await env.WAITLIST.list({ prefix: 'e:', cursor, limit: 1000 });
    const vals = await Promise.all(page.keys.map((k) => env.WAITLIST.get(k.name)));
    for (const v of vals) if (v) events.push(JSON.parse(v));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  const visitors = new Map(); // id -> { v, s, carte, pages:Set, first }
  for (const e of events) {
    let r = visitors.get(e.id);
    if (!r) { r = { v: e.v || '?', s: e.s || 'direct', carte: false, pages: new Set(), first: e.at.slice(0, 10) }; visitors.set(e.id, r); }
    if (e.t === 'pv') r.pages.add(e.p);
    if ((e.t === 'pv' && e.p === '/menus') || (e.t === 'cta' && e.target === '/menus')) r.carte = true;
  }
  const bucket = () => ({ visiteurs: 0, carte: 0, taux: 0 });
  const total = bucket(), byVariant = {}, bySource = {}, byDay = {};
  for (const r of visitors.values()) {
    for (const [map, key] of [[null, null], [byVariant, r.v], [bySource, r.s], [byDay, r.first]]) {
      const b = map ? (map[key] = map[key] || bucket()) : total;
      b.visiteurs += 1; if (r.carte) b.carte += 1;
    }
  }
  const finish = (b) => { b.taux = b.visiteurs ? Math.round((b.carte / b.visiteurs) * 1000) / 10 : 0; return b; };
  finish(total); Object.values(byVariant).forEach(finish); Object.values(bySource).forEach(finish); Object.values(byDay).forEach(finish);
  const waitlist = (await env.WAITLIST.list({ prefix: 'w:' })).keys.length;
  const out = { ok: true, activation: 'visiteurs ayant atteint la carte (/menus) ÷ visiteurs', evenements: events.length, total, parVariante: byVariant, parSource: bySource, parJour: byDay, inscrits: waitlist, genere: new Date().toISOString() };

  if (url.searchParams.get('format') === 'html') {
    const row = (k, b) => `<tr><td>${k}</td><td>${b.visiteurs}</td><td>${b.carte}</td><td><strong>${b.taux} %</strong></td></tr>`;
    const table = (title, obj) => `<h2>${title}</h2><table><tr><th></th><th>Visiteurs</th><th>Ont atteint la carte</th><th>Activation</th></tr>${Object.entries(obj).sort().map(([k, b]) => row(k, b)).join('')}</table>`;
    const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Croq'moi · activation</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#2A1A17;background:#FFF7EE}table{border-collapse:collapse;width:100%;margin:12px 0 28px}td,th{border-bottom:1px solid #EADFD3;padding:8px 10px;text-align:left}th{font-weight:600;color:#6B5A55}.big{font-size:2.6rem;font-weight:700}</style>
<h1>Croq'moi · activation</h1><p>${out.activation}. Variante A : bouton « Composer ma box ». Variante B : bouton « Voir la carte ».</p>
<p class="big">${total.taux} %</p><p>${total.carte} visiteurs sur ${total.visiteurs} ont atteint la carte · ${waitlist} inscrits sur la liste · ${events.length} événements</p>
${table('Par variante du hero', byVariant)}${table('Par source', bySource)}${table('Par jour de première visite', byDay)}
<p><small>Généré le ${out.genere}. Identifiant anonyme par navigateur, aucun cookie.</small></p></html>`;
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  return json(out);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/event' && request.method === 'POST') return handleEvent(request, env);
    if (url.pathname === '/api/stats' && request.method === 'GET') return handleStats(url, env);
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
