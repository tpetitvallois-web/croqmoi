# Croq'moi — Rendu de la séance 3

Rédigé le 2026-10-14. Les chiffres marqués « hypothèse » ou « estimation » sont les nôtres,
les autres sont sourcés en fin de document.

## 1. La page, mise à jour

https://croqmoi.gererseul-avis-worker.workers.dev

Pages ajoutées depuis la présentation de la semaine dernière :
- https://croqmoi.gererseul-avis-worker.workers.dev/abonnement-croquettes-chien (page d'arrivée Google Ads)
- https://croqmoi.gererseul-avis-worker.workers.dev/box-pour-chien (page d'arrivée Google Ads)

Code public : https://github.com/tpetitvallois-web/croqmoi

## 2. Ce qu'on a changé, et pourquoi

Le site de la semaine dernière présentait le concept et prenait des inscriptions. Il ne savait
ni d'où venaient les inscrites, ni comment les faire venir à moins de 60 € chacune. Cinq
changements, tous au service des trois chemins de la question 3.

| Changement | Où | Pourquoi |
|---|---|---|
| **Le premier date est offert** (une portion humain + chien sur la première box, 12,97 € de valeur) remplace « première box à -30 % » | accueil, formules, configurateur, FAQ | Même coût pour nous (11,70 € contre 12,97 €), mais lisible en six mots dans une annonce Google ou un post. Japhy vend sa première commande à 2 €, « -30 % » ne se voyait pas. |
| **Parrainage « un date pour deux »** : chaque inscrite reçoit un code CROQ-XXXXXX, son amie entre le code, son premier date est offert, la marraine reçoit un date sur sa box suivante | section accueil, étape 4 du configurateur, écran de confirmation, FAQ, formules | C'est le chemin le moins cher (26 € par cliente, voir question 3). Japhy a construit sa croissance dessus. Le code est généré et vérifié côté serveur, le lien de partage porte ses propres UTM. |
| **Deux pages d'arrivée** dédiées aux requêtes cibles, titre et contenu alignés sur la requête, formulaire en deux champs (poids du chien, email) en haut de page | /abonnement-croquettes-chien, /box-pour-chien | Une annonce Google qui envoie sur l'accueil convertit mal. Chaque page répond à la requête payée et sert aussi le SEO (sitemap et robots ajoutés). Le formulaire court vise 3 % de conversion, contre un configurateur en quatre étapes. |
| **Mesure de la provenance** : UTM, site d'origine et page d'arrivée du premier contact sont gardés dans le navigateur et enregistrés avec chaque inscription. Export CSV avec source, medium, campagne, code, parrain | tout le site, API | Sans ça, pas de CAC par chemin. On saura, inscrite par inscrite, si elle vient de Google, d'une amie ou d'Instagram. |
| **Section « Vos dates »** remplace trois témoignages inventés : appel à poster la photo du dîner avec #croqmoi, cadres pour les premières photos | accueil | Des témoignages fictifs n'apportent rien et se voient. Les photos de clientes sont le contenu Instagram et TikTok le moins cher à produire, et personne ne poste la photo de son sac de croquettes Japhy. |

Hors acquisition, le site a aussi gagné des pages Concept, Formules et FAQ complètes, et les
portraits des fondateurs avec leurs chiens.

## 3. Nos trois chemins prioritaires, justifiés par le CAC max

### Le CAC max

| Donnée | Valeur | Origine |
|---|---|---|
| Panier hebdomadaire, Tête-à-tête, petit chien | 38,90 € TTC | notre grille |
| Marge de contribution après ingrédients, croquettes, box isotherme et livraison | 30 %, soit 11,70 € par semaine | hypothèse, ordre de grandeur des box repas |
| Durée de vie moyenne d'une cliente | 12 semaines | hypothèse, à mesurer |
| Marge sur la durée de vie | 140 € | 11,70 × 12 |
| Premier date offert | 12,97 € | c'est déjà un coût d'acquisition |
| **CAC max retenu** | **60 €** | remboursé en 6 semaines : 6 × 11,70 − 12,97 ≈ 57 €, arrondi |
| Plafond absolu | 127 € | 140 − 12,97, au-delà on perd de l'argent |

### Chemin 1 : le parrainage

Coût par cliente gagnée : le date offert à la marraine (12,97 €) plus le premier date offert à
la filleule (12,97 €), soit **26 €**, moins de la moitié du CAC max. Aucun coût fixe. Il ne
marche qu'avec une base de clientes, donc il se nourrit des deux autres chemins. Objectif à
suivre : part des inscrites qui viennent avec un code (visible dans l'export).

### Chemin 2 : Google Ads sur les requêtes d'intention

« abonnement croquettes chien » et « box pour chien », avec les deux pages d'arrivée. Au prix du
marché, une commande revient entre 40 et 83 € selon la requête (question 5). C'est à la limite
du CAC max : rentable seulement si la page convertit à 3 % ou plus, ce qui est le travail des
pages d'arrivée. Budget de test proposé : 300 € sur quatre semaines, soit environ 200 clics,
pour mesurer le vrai taux de conversion avant d'augmenter.

### Chemin 3 : Instagram et TikTok, micro-influence et contenu de clientes

Notre cible y passe ses soirées. Deux mécaniques :
- Envoi d'une box à des micro-influenceuses « vie avec mon chien » (5 000 à 30 000 abonnées),
  contre une story et un post. Coût : une box, environ 27 € de marchandise. Si une créatrice
  amène trois inscrites, le CAC tombe à 9 €. Si elle n'en amène qu'une, on reste sous 60 €.
- Reprise des photos de clientes (#croqmoi) sur notre compte et sur la box. Coût nul.

Ce chemin est le seul où le produit fait le travail : un dîner à deux avec son chien se
photographie, un sac de croquettes non.

### Les chemins écartés, et pourquoi

- **Affiliation et sites de codes promo** : Japhy y est partout, mais ces sites réclament 30 à
  50 % de remise plus une commission. Avec 11,70 € de marge hebdomadaire, on ne peut pas.
- **Télévision et affichage** : hors de portée avant plusieurs milliers d'abonnées.
- **SEO générique** (« meilleures croquettes pour chien ») : utile à terme, trop lent pour les
  trois premiers mois. On commence avec les deux pages d'arrivée, qui comptent aussi en SEO.
- **Meta Ads** en paid : à tester après Google, une fois les visuels de clientes disponibles.

## 4. Un concurrent : Japhy, par quels chemins passe-t-il ?

Japhy vend des croquettes sur-mesure par abonnement, 100 % en ligne (fondée en 2018, 7 M€
levés, 300 000 clients et 35 000 abonnés actifs revendiqués). Ce n'est pas le même produit :
Japhy nourrit le chien, pas le maître, et livre un sac pour plusieurs semaines. C'est pourtant
notre concurrent sur le chemin d'achat : une femme qui tape « abonnement croquettes chien »
tombe sur Japhy, Hector Kitchen ou Pepette.

Ses chemins, du plus documenté au moins documenté :

1. **Parrainage.** 15 € pour la marraine à chaque filleule validée, sans plafond. Jusqu'à 50 €
   offerts à la filleule sur quatre colis. Diffuser son code sur les sites de réduction est
   interdit : le canal est pensé pour la recommandation entre maîtres.
2. **Offre découverte agressive.** Deux semaines de croquettes pour 2 €, ou -50 % à -60 % sur la
   première commande selon le code, avec garantie « remboursé si le chien refuse ». Le
   questionnaire de profil sert de tunnel de conversion.
3. **Google Ads.** Comptes Google et Facebook restructurés par le responsable acquisition, ROAS
   supérieur à 3 obtenu en six mois. Deux tests de pages d'arrivée ont fait gagner 35 % de taux
   de conversion.
4. **Meta (Facebook, Instagram).** Vidéos sponsorisées, dont une jugée dénigrante par le Jury de
   déontologie publicitaire. Instagram et TikTok tenus en interne.
5. **Influence.** Matrice de scoring des influenceurs, « échecs divisés par 4 ». Codes partenaires
   visibles (HELLOJAPHY, RED60).
6. **Affiliation et cashback.** iGraal, eBuyClub, Widilo, Vitepromo, et une dizaine de blogs
   « avis Japhy » commissionnés.
7. **SEO de contenu.** Environ 170 pages « croquettes pour [race] », une soixantaine de pages
   éducation du chien, des pages santé.
8. **CRM.** Emailing (Splio), remises progressives et cagnotte de parrainage pour tenir l'abonnement.
9. **Avis.** Trustpilot 4,7 sur 16 984 avis, mis en avant sur le site.

Ni télévision, ni animalerie, ni Amazon, à notre connaissance.

Ce qu'on en retient : Japhy paie du trafic (Google, Meta) pour alimenter deux mécaniques, une
première commande quasi gratuite et une boucle de parrainage, puis le SEO prend le relais. Nos
changements de cette semaine copient la mécanique (offre d'entrée lisible, parrainage, pages
d'arrivée) et ajoutent ce que Japhy n'a pas : un produit qui se photographie.

## 5. Trois requêtes cibles

Méthode. Clic maximum qu'on accepte de payer = CAC max (60 €) × taux de conversion attendu de la
page d'arrivée. Coût par commande au prix du marché = CPC du marché ÷ ce même taux.

Aucun outil public ne donne le volume et le CPC exacts d'un mot-clé en France. Les fourchettes
ci-dessous partent des repères e-commerce (0,50 à 2,50 € le clic en France, plus haut sur les
requêtes génériques disputées par Zooplus, Ultra Premium Direct, Japhy, Hector Kitchen). Elles
sont à remplacer par les chiffres du Keyword Planner de Google Ads (gratuit avec un compte, zone
France, langue français).

| Requête | Intention | Volume estimé / mois (FR) | CPC marché estimé | Conversion attendue | Clic max pour nous | Coût par commande au CPC marché |
|---|---|---|---|---|---|---|
| **abonnement croquettes chien** | achat, notre modèle exact | 500 à 1 000 | 1,50 à 2,50 € | 3 % | **1,80 €** | 50 à 83 € |
| **box pour chien** | découverte, cadeau | 3 000 à 5 000 | 0,60 à 1,00 € | 1,5 % | **0,90 €** | 40 à 67 € |
| **meilleures croquettes pour chien** | information, comparaison | 10 000 à 20 000 | 1,00 à 1,50 € | 0,8 % | **0,48 €** | 125 à 190 € |

Lecture.

- **« abonnement croquettes chien »** : la requête à acheter en premier. Volume faible, intention
  exacte. À 2 € le clic, une commande coûte 67 €, juste au-dessus du CAC max : la page d'arrivée
  doit convertir à 3,5 % ou plus. C'est ce que Japhy a travaillé (+35 % de conversion).
- **« box pour chien »** : la plus rentable sur le papier, clic bon marché, commande sous 60 € dès
  1,5 % de conversion. L'intention est mixte (box de jouets, cadeau), d'où la page qui dit tout
  de suite « ce n'est pas une box de jouets ».
- **« meilleures croquettes pour chien »** : ne se paie pas au clic, 125 à 190 € la commande. On
  la travaille en SEO, pas en Google Ads.

Variantes à vérifier dans le Keyword Planner : « croquettes chien livraison », « repas frais
chien », « dîner avec son chien » (volume probablement nul, c'est notre marque à créer).

## Sources

- Growthmakers, épisode 162 avec Jérémy Decherf, head of acquisition Japhy :
  https://blog.mantra.work/article/japhy-dnvb-bat-algorithmes-google-facebook
- Japhy, parrainage : https://japhy.fr/sur-mesure/parrainage/concept
- Sitemap Japhy : https://japhy.fr/sitemap.xml
- Jury de déontologie publicitaire, plainte fondée : https://www.jdp-pub.org/avis/japhy-internet-2/
- Trustpilot Japhy : https://fr.trustpilot.com/review/japhy.fr
- Offre découverte et codes (sites d'affiliation, à lire avec prudence) :
  https://www.vitepromo.com/famille-animaux/code-promo-japhy, https://fr.igraal.com/codes-promo/japhy,
  https://parrainage.co/site/japhy
- Levée de 7 M€ : https://www.presse-citron.net/la-startup-japhy-leve-7me-pour-son-abonnement-de-croquettes-par-internet/
- Xerfi, DNVB du petfood : https://www.xerfi.com/blog/marche-des-petfoods-le-succes-des-dnbv-bouscule-la-concurrence_2231
- Repères CPC France 2026 : https://www.elliottram.fr/blog/google-ads-prix, https://panja.io/sea/google-ads-guide-complet/
- Repères de taux de conversion e-commerce : https://landmarkglobal.com/eu/fr/actualites/taux-de-conversion-en-e-commerce/
