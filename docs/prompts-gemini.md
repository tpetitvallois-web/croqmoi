# Prompts Gemini pour les visuels Croq'moi

Copier le bloc « Contexte » en tête de chaque conversation, puis un prompt à la fois.
Images : Gemini (Nano Banana). Vidéos : Veo dans Gemini. Toujours demander une variante avant
de choisir. Les fichiers vont dans `public/img/photos/` en webp, 1600 px de large maximum.

## Contexte (à coller en premier)

```
Tu es directeur artistique pour Croq'moi, une jeune marque française. Croq'moi livre chaque semaine
des box « dîner pour deux » : le repas d'une personne et la gamelle de son chien, sur le même menu
(italien, sushi, bistrot, raclette, burger, mexicain, indien, brunch). Le concept : dîner avec son
chien comme à un rendez-vous amoureux, « un date qui ne vous posera jamais de lapin ».

Cible : femmes de 18 à 30 ans qui vivent seules avec leur chien, en appartement, en ville.

Direction artistique, à respecter sur toutes les images :
- Photographie éditoriale lifestyle, lumière chaude de bougie et de lampe, soirée.
- Palette : crème (#FFF7EE), rouge cerise (#D7263D), moutarde (#F2B544), vert olive (#6B7F3A),
  rose poudré (#F6D6D2). Pas de bleu, pas de néon, pas de fond blanc studio.
- Rendu argentique discret, grain fin, faible profondeur de champ, cadrage serré et naturel.
- Vrais intérieurs parisiens : parquet, table en bois, nappe en lin, vaisselle en céramique.
- Le chien est à table, sur une chaise, comme un invité. Sa gamelle est en céramique, posée sur un set.
- Aucun texte, aucun logo, aucun filigrane dans l'image. Pas de visage de célébrité.
- Les deux assiettes sont toujours visibles : l'assiette humaine et la gamelle du chien, même menu.

Quand je te demande une image, propose deux variantes de cadrage et dis-moi laquelle tu recommandes.
Format par défaut : 3:2 horizontal, 2K.
```

## Images

Le hero de l'accueil (3:2) :
```
Image 1, hero. Une femme d'environ 25 ans, cheveux bruns bouclés, pull en maille, assise à une petite
table ronde en bois dans un appartement parisien le soir. En face d'elle, un golden retriever assis sur
une chaise, les pattes avant près de la table, devant une gamelle en céramique. Côté femme : tagliatelles
à la bolognaise avec du basilic, un verre de vin rouge. Côté chien : croquettes avec une cuillerée de
topping tomate et basilic. Une bougie allumée entre eux. Elle lève son verre vers lui en souriant.
Cadrage à hauteur de table, légèrement de trois quarts.
```

Les huit dates, vus de dessus (3:2, même mise en scène pour les huit, seul le contenu change) :
```
Image 2, série « les dates ». Vue de dessus (flat lay) sur une nappe en lin crème. À gauche, une assiette
en céramique avec [PLAT HUMAIN]. À droite, une gamelle en céramique vert olive avec des croquettes brunes
et [TOPPING CHIEN]. Entre les deux, une petite bougie allumée et une serviette pliée. Même lumière chaude,
même cadrage, pour que les huit images de la série s'alignent côte à côte.
```
À décliner avec :
- Italien : tagliatelles bolognaise, basilic / topping tomate douce et basilic
- Sushi : poke bowl saumon, riz vinaigré, avocat, sésame / topping algue nori émiettée
- Bistrot : blanquette de veau, riz pilaf, carottes / carotte fondante et filet de bouillon
- Raclette : raclette, pommes de terre grenaille, charcuterie / pointe de fromage sans lactose fondu
- Burger : smash burger cheddar, frites de patate douce / petites bouchées de bœuf
- Mexicain : tacos poulet, maïs grillé, haricots rouges, citron vert / haricots rouges et maïs, sans épice
- Indien : curry de poulet au lait de coco, riz basmati, coriandre / poulet au curcuma et riz
- Brunch : pancakes, œufs brouillés, fruits rouges, sirop d'érable / myrtilles sur croquettes à l'avoine

La box (4:3) :
```
Image 3, unboxing. Une box en carton crème ouverte sur un plan de travail de cuisine, lumière du dimanche
matin. Deux compartiments : à gauche des ingrédients frais emballés dans du papier, une fiche recette
posée dessus ; à droite trois sachets kraft de croquettes et trois petits pots en verre de topping.
Une truffe de chien entre dans le cadre en bas à droite, curieuse. Aucun texte sur la box.
```

La livraison (3:2) :
```
Image 4, livraison. Une box en carton crème posée sur le paillasson d'une porte d'appartement parisien,
ancien immeuble, carrelage à cabochons, lumière du matin dans le couloir. Un golden retriever la renifle.
```

Trois photos pour la section « Vos dates » (1:1, style téléphone, pour simuler des photos de clientes) :
```
Image 5, série « Vos dates », trois photos carrées prises au téléphone, moins léchées que les autres,
flash doux, comme postées sur Instagram.
a) Une femme d'environ 27 ans, cheveux courts blonds, rit en trinquant avec son teckel assis sur la
   chaise d'en face, deux assiettes sur la table.
b) Un shiba inu seul dans le cadre, assis à table, qui fixe sa gamelle avec une bougie devant lui,
   légende imaginable : « le regard avant le topping ».
c) Une femme d'environ 29 ans, rousse, et son cocker, assis par terre devant une box ouverte, le chien
   a le museau dans la box.
```

Pages d'arrivée (3:2) :
```
Image 6, abonnement. Gros plan sur un sachet kraft de croquettes posé sur une table, avec une étiquette
vierge (sans texte), à côté d'une gamelle en céramique remplie et d'une main de femme qui verse un topping
depuis un petit pot en verre. Lumière chaude de soirée.
```

## Vidéos (Veo)

Hero en boucle, muet, 8 secondes, 16:9, à poser derrière le titre :
```
Vidéo 1, boucle hero. Plan fixe à hauteur de table, soir, appartement parisien. Une femme d'environ
25 ans et son golden retriever assis sur une chaise en face d'elle. Elle pose sa fourchette, verse une
cuillerée de topping tomate dans sa gamelle en céramique, le chien remue la queue et commence à manger,
elle sourit et reprend son assiette de pâtes. Bougie qui vacille au centre. Lumière chaude, grain
argentique léger, mouvement lent et naturel, aucune musique, aucun texte. La première et la dernière
image doivent se ressembler pour boucler sans coupure.
```

Reel vertical pour Instagram et TikTok, 15 secondes, 9:16 :
```
Vidéo 2, reel vertical. Trois plans de cinq secondes, montés cut. Plan 1 : une box crème s'ouvre sur un
plan de travail, deux compartiments, une truffe de chien entre dans le cadre. Plan 2 : vue de dessus,
deux assiettes qui se remplissent en accéléré, tagliatelles d'un côté, croquettes et topping de l'autre.
Plan 3 : la femme et le chien à table, elle lève son verre, il remue la queue. Lumière chaude, soirée,
rythme vif, aucun texte incrusté (je l'ajouterai moi-même), pas de musique.
```

Déclinaison par saveur pour les publicités Meta, 6 secondes, 1:1 :
```
Vidéo 3, saveur [SAVEUR]. Vue de dessus fixe sur une nappe en lin crème. En six secondes, l'assiette
humaine se remplit de [PLAT HUMAIN] et la gamelle du chien de croquettes puis de [TOPPING CHIEN],
en stop motion fluide. Une main de femme pose une bougie au centre à la dernière seconde.
Aucun texte, pas de musique.
```

## Après génération

1. Vérifier qu'il y a bien les deux assiettes sur chaque image et aucun texte parasite.
2. Convertir en webp : `magick image.png -resize 1600x1600\> -quality 84 public/img/photos/nom.webp`.
3. Les vidéos : MP4 H.264 sans son, moins de 3 Mo pour la boucle hero (`ffmpeg -i in.mp4 -an -vf scale=1280:-2 -crf 28 out.mp4`).
