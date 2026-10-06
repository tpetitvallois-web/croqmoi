#!/usr/bin/env bash
# Génère les photos du site avec RunComfy (google/nano-banana-2) et les convertit en webp.
# Usage :
#   tools/gen_images.sh test            -> une seule image (hero) pour vérifier coût et rendu
#   tools/gen_images.sh all             -> toutes les images de prompts.json (hors fondateurs)
#   tools/gen_images.sh one duo-sushi   -> une image par son nom
#   tools/gen_images.sh founders        -> montages fondateurs (les sources doivent être en ligne, voir README)
# Prérequis : runcomfy login, crédits sur le compte, magick (ImageMagick), jq.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=tools/out; mkdir -p "$OUT" public/img/photos
STYLE=$(jq -r '._style' tools/prompts.json)
BASE_URL="${CROQMOI_BASE_URL:-https://croqmoi.gererseul-avis-worker.workers.dev}"

gen() { # name aspect prompt [source_url]
  local name=$1 aspect=$2 prompt=$3 src=${4:-}
  local model input
  if [[ -n "$src" ]]; then
    model=google/nano-banana-2/edit
    input=$(jq -cn --arg p "$prompt" --arg u "$src" --arg a "$aspect" '{prompt:$p,image_urls:[$u],aspect_ratio:$a,resolution:"1K"}')
  else
    model=google/nano-banana-2/text-to-image
    input=$(jq -cn --arg p "$prompt. $STYLE" --arg a "$aspect" '{prompt:$p,aspect_ratio:$a,resolution:"1K"}')
  fi
  echo "→ $name ($model)"
  runcomfy run "$model" --output json --input "$input" > "$OUT/$name.json"
  local url
  url=$(jq -r '.image // .images[0] // .output.image // .output.images[0] // empty' "$OUT/$name.json")
  if [[ -z "$url" ]]; then echo "  pas d'URL dans la réponse, voir $OUT/$name.json"; return 1; fi
  curl -sL "$url" -o "$OUT/$name.src"
  if [[ -n "$src" ]]; then
    magick "$OUT/$name.src" -resize 800x800^ -gravity center -extent 800x800 -quality 86 "public/img/founders/$name.webp"
  else
    magick "$OUT/$name.src" -resize 1600x1600\> -quality 84 "public/img/photos/$name.webp"
  fi
  echo "  ok"
}

case "${1:-}" in
  test) gen hero "$(jq -r '.images[0].aspect_ratio' tools/prompts.json)" "$(jq -r '.images[0].prompt' tools/prompts.json)" ;;
  all)
    jq -c '.images[]' tools/prompts.json | while read -r img; do
      gen "$(jq -r .file <<<"$img")" "$(jq -r .aspect_ratio <<<"$img")" "$(jq -r .prompt <<<"$img")"
    done ;;
  one)
    img=$(jq -c --arg f "$2" '.images[] | select(.file==$f)' tools/prompts.json)
    gen "$(jq -r .file <<<"$img")" "$(jq -r .aspect_ratio <<<"$img")" "$(jq -r .prompt <<<"$img")" ;;
  founders)
    jq -c '.founders[]' tools/prompts.json | while read -r f; do
      gen "$(jq -r .file <<<"$f")" "1:1" "$(jq -r .prompt <<<"$f")" "$BASE_URL/$(jq -r .source <<<"$f")"
    done ;;
  *) sed -n '2,8p' "$0"; exit 1 ;;
esac
