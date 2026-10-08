# Croq'moi — site vitrine et liste d'attente

Des box hebdomadaires pour dîner avec son chien : votre assiette d'un côté, sa gamelle de l'autre,
le même menu. Cible : femmes de 18 à 30 ans vivant seules avec leur chien.

En ligne : https://croqmoi.gererseul-avis-worker.workers.dev (Cloudflare Workers, compte perso de Tom).

## Structure

- `public/` : site statique sans build. `index.html` (accueil), `concept.html`, `menus.html` (carte),
  `formules.html`, `faq.html`, `commander.html` (configurateur + liste d'attente), `mentions-legales.html`,
  `404.html`. Liens internes sans extension (`/concept`, `/formules`…), Cloudflare sert le `.html`.
- `public/js/data.js` : carte des saveurs, formules, prix. Un seul endroit à modifier pour changer
  un prix ou une recette.
- `public/js/site.js` : navigation, cartes retournables, formules, animations GSAP.
- `public/js/commander.js` : configurateur en quatre étapes et envoi vers l'API.
- `worker/index.js` : API `/api/waitlist` (KV `WAITLIST`), le reste est servi par les assets.
- `tools/` : génération des photos (RunComfy) et prompts.

## Lancer en local

```bash
npm install
npm run dev          # http://localhost:8767 (preview « croqmoi » dans ~/.claude/launch.json)
```

`.dev.vars` contient `EXPORT_SECRET` pour le local. Le KV local est vide au premier lancement.

## Déployer

```bash
npx wrangler deploy
```

Le compte est fixé dans `wrangler.toml` (`account_id`). Le secret d'export est posé une fois :

```bash
npx wrangler secret put EXPORT_SECRET < .export-secret
```

## Liste d'attente

- `POST /api/waitlist` : JSON `{email, prenom, chien:{nom, poids, allergies}, formule, saveurs, prix}`.
  Email validé, formule et poids vérifiés, honeypot `website`, une inscription par IP et par minute.
  Clé KV `w:<email>` : une réinscription écrase la précédente.
- `GET /api/waitlist?secret=…` : export CSV (séparateur `;`, BOM pour Excel). `&format=json` pour du JSON.
- `DELETE /api/waitlist?secret=…&email=…` : supprime une inscription.

Le secret est dans `.export-secret` (non versionné).

```bash
curl -s "https://croqmoi.gererseul-avis-worker.workers.dev/api/waitlist?secret=$(cat .export-secret)" -o liste.csv
```

## Prix (hypothèses de lancement)

Repères : HelloFresh facture 7 à 10 € la portion humaine selon le nombre de repas ; les abonnements
chien premium (Elmut, Pepette, Dog Chef) tournent entre 2 et 5 € par jour pour 10 kg. Objectif : un
« date » entre 11 et 14 €, livraison incluse dès trois dates.

| Formule | Dates / semaine | Prix / semaine (chien ≤ 10 kg) | Prix / date |
|---|---|---|---|
| Premier rendez-vous | 2 | 27,90 € | 13,95 € |
| Tête-à-tête | 3 | 38,90 € | 12,97 € |
| Inséparables | 5 | 59,90 € | 11,98 € |

Supplément par date : 10-25 kg +1,50 €, plus de 25 kg +3,00 €. Livraison 3,90 € pour la formule
2 dates, offerte au-delà. Première box à -30 %. Tout est dans `public/js/data.js`.

## Photos (RunComfy)

Le site tourne aujourd'hui avec les illustrations SVG seules. Les photos sont prêtes à générer :

```bash
tools/gen_images.sh test           # une image (hero) pour vérifier coût et rendu
tools/gen_images.sh all            # les 14 images de tools/prompts.json
tools/gen_images.sh one duo-sushi  # une seule
```

Modèle `google/nano-banana-2/text-to-image`. Les fichiers arrivent dans `public/img/photos/*.webp`.
Il reste ensuite à les référencer dans les pages (hero, cartes, témoignages). Le 2026-10-07 le compte
RunComfy n'avait plus de crédits (« Insufficient Funds »), la génération a été reportée.

### Montages fondateurs (fait le 2026-10-07, sans RunComfy)

Détourage local avec Vision de macOS (`tools/cutout/cutout.swift`, compilé en `tools/cutout/cutout`,
usage `cutout in.jpg out.png`) puis composition ImageMagick. Sources : portraits fournis par Tom
(dans `~/Downloads`) et deux photos Wikimedia Commons (`tools/dogs/golden.jpg` CC0 Jiyoon Leee,
`tools/dogs/teckel.jpg` CC BY 2.0 Dan Bennett, crédités dans les mentions légales). Les commandes
exactes sont dans l'historique de `tools/dogs/` (montages `lorenzo-montage.jpg`, `tom-montage.jpg`).
Zackari : photo avec le daim de Nara, recadrée en carré, sans montage.

## Règles de forme

Phrases courtes, tournures affirmatives, trois éléments au plus dans une énumération. Pas de
sur-titres en capitales, pas d'icônes décoratives en grille, pas d'ombres lourdes. Typo Fraunces
(titres) et Figtree (texte). Palette dans `:root` de `public/css/site.css`.
