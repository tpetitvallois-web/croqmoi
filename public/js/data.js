// Croq'moi — données partagées (carte, formules, prix).
// Les prix sont des hypothèses de lancement, voir README.

window.CROQ = (function () {
  const saveurs = [
    {
      id: 'italien', nom: 'Italien', emoji: 'pasta',
      humain: 'Tagliatelles fraîches à la bolognaise, basilic',
      chien: 'Croquettes bœuf et courgette, topping tomate douce et basilic',
      prep: '20 min', kcal: 320, commun: ['bœuf', 'courgette', 'basilic'],
      allergenes: ['boeuf', 'gluten'],
      couleur: '#D7263D',
    },
    {
      id: 'sushi', nom: 'Sushi', emoji: 'sushi',
      humain: 'Poke bowl saumon, riz vinaigré, avocat, sésame',
      chien: 'Croquettes saumon et riz, topping algue nori émiettée',
      prep: '15 min', kcal: 300, commun: ['saumon', 'riz', 'nori'],
      allergenes: ['poisson'],
      couleur: '#F2B544',
    },
    {
      id: 'bistrot', nom: 'Bistrot', emoji: 'pot',
      humain: 'Blanquette de veau, riz pilaf, carottes fondantes',
      chien: 'Croquettes veau et carotte, sauce légère au bouillon',
      prep: '30 min', kcal: 330, commun: ['veau', 'carotte', 'riz'],
      allergenes: ['boeuf', 'lait'],
      couleur: '#6B7F3A',
    },
    {
      id: 'raclette', nom: 'Raclette', emoji: 'cheese',
      humain: 'Raclette, pommes de terre grenaille, charcuterie fine',
      chien: 'Croquettes pomme de terre et dinde, pointe de fromage sans lactose',
      prep: '25 min', kcal: 350, commun: ['pomme de terre', 'fromage'],
      allergenes: ['lait', 'volaille'],
      couleur: '#F2B544',
    },
    {
      id: 'burger', nom: 'Burger', emoji: 'burger',
      humain: 'Smash burger, cheddar, frites de patate douce',
      chien: 'Croquettes bœuf et patate douce, « burger bites » à la main',
      prep: '20 min', kcal: 340, commun: ['bœuf', 'patate douce'],
      allergenes: ['boeuf', 'gluten', 'lait'],
      couleur: '#D7263D',
    },
    {
      id: 'mexicain', nom: 'Mexicain', emoji: 'taco',
      humain: 'Tacos de poulet, maïs grillé, haricots rouges, citron vert',
      chien: 'Croquettes poulet et maïs, topping haricots rouges, sans épices',
      prep: '20 min', kcal: 310, commun: ['poulet', 'maïs', 'haricots'],
      allergenes: ['volaille', 'gluten'],
      couleur: '#6B7F3A',
    },
    {
      id: 'indien', nom: 'Indien', emoji: 'bowl',
      humain: 'Curry de poulet au lait de coco, riz basmati, coriandre',
      chien: 'Croquettes poulet, curcuma et riz, sans oignon ni piment',
      prep: '25 min', kcal: 320, commun: ['poulet', 'riz', 'curcuma'],
      allergenes: ['volaille'],
      couleur: '#F2B544',
    },
    {
      id: 'brunch', nom: 'Brunch', emoji: 'pancake',
      humain: 'Pancakes, œufs brouillés, fruits rouges, sirop d’érable',
      chien: 'Croquettes avoine, banane et œuf, topping myrtilles',
      prep: '15 min', kcal: 290, commun: ['œuf', 'avoine', 'myrtilles'],
      allergenes: ['oeuf', 'gluten', 'lait'],
      couleur: '#D7263D',
    },
  ];

  const formules = [
    {
      id: 'premier-rendez-vous', nom: 'Premier rendez-vous', dates: 2, base: 27.9,
      pitch: 'Pour essayer sans se presser.',
      points: ['2 dates par semaine', 'Portions calibrées à son poids', 'Livraison 3,90 €'],
    },
    {
      id: 'tete-a-tete', nom: 'Tête-à-tête', dates: 3, base: 38.9, featured: true,
      pitch: 'Le rythme de la plupart des duos.',
      points: ['3 dates par semaine', 'Livraison offerte', 'Changement de saveurs chaque semaine'],
    },
    {
      id: 'inseparables', nom: 'Inséparables', dates: 5, base: 59.9,
      pitch: 'Du lundi au vendredi, à la même table.',
      points: ['5 dates par semaine', 'Livraison offerte', 'Une friandise surprise par box'],
    },
  ];

  // Supplément par date selon le poids du chien.
  const poids = {
    petit: { label: 'Petit', detail: 'moins de 10 kg', sup: 0 },
    moyen: { label: 'Moyen', detail: '10 à 25 kg', sup: 1.5 },
    grand: { label: 'Grand', detail: 'plus de 25 kg', sup: 3 },
  };

  const livraison = (formule) => (formule.dates >= 3 ? 0 : 3.9);
  const remisePremiereBox = 0.3;

  function prix(formuleId, poidsId) {
    const f = formules.find((x) => x.id === formuleId);
    const p = poids[poidsId] || poids.petit;
    const semaine = f.base + f.dates * p.sup;
    return {
      semaine,
      parDate: semaine / f.dates,
      livraison: livraison(f),
      premiere: Math.round((semaine * (1 - remisePremiereBox)) * 100) / 100,
    };
  }

  const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';

  const allergenes = [
    { id: 'boeuf', label: 'Bœuf et veau' },
    { id: 'volaille', label: 'Poulet et dinde' },
    { id: 'poisson', label: 'Poisson' },
    { id: 'gluten', label: 'Céréales à gluten' },
    { id: 'lait', label: 'Produits laitiers' },
    { id: 'oeuf', label: 'Œuf' },
  ];

  // Petites illustrations par saveur (viewBox 0 0 120 120).
  const art = {
    pasta: '<ellipse cx="60" cy="78" rx="46" ry="14" fill="#FFFDF9"/><ellipse cx="60" cy="75" rx="32" ry="9" fill="#F2B544" stroke="none"/><path d="M35 73 Q 48 62 60 72 T 85 73" stroke="#D7263D" stroke-width="4"/><circle cx="50" cy="68" r="3" fill="#6B7F3A" stroke="none"/><circle cx="70" cy="66" r="3" fill="#6B7F3A" stroke="none"/><path d="M60 50 c -4 -6 -11 -2 -8 4 c 2 4 6 6 8 9 c 2 -3 6 -5 8 -9 c 3 -6 -4 -10 -8 -4 z" fill="#D7263D" stroke="none"/>',
    sushi: '<rect x="22" y="60" width="76" height="30" rx="8" fill="#FFFDF9"/><rect x="30" y="48" width="60" height="22" rx="6" fill="#F2B544"/><rect x="30" y="56" width="60" height="8" fill="#2A1A17" stroke="none"/><path d="M40 48 L 80 48" stroke="#D7263D" stroke-width="5"/><line x1="100" y1="30" x2="76" y2="92"/><line x1="110" y1="34" x2="86" y2="96"/>',
    pot: '<path d="M25 60 H95 V85 Q 95 95 85 95 H35 Q 25 95 25 85 Z" fill="#D7263D"/><rect x="20" y="54" width="80" height="8" rx="4" fill="#B01B30" stroke="none"/><rect x="40" y="42" width="40" height="12" rx="6" fill="#FFFDF9"/><line x1="15" y1="70" x2="25" y2="70"/><line x1="95" y1="70" x2="105" y2="70"/><path d="M50 36 Q 46 28 50 20 M62 36 Q 58 28 62 20 M74 36 Q 70 28 74 20" stroke-opacity=".6"/>',
    cheese: '<path d="M20 80 L 60 40 L 100 80 Z" fill="#F2B544"/><path d="M20 80 H 100 V 92 H 20 Z" fill="#D7A33A" stroke="none"/><circle cx="55" cy="68" r="5" fill="#FBE7B8" stroke="none"/><circle cx="70" cy="74" r="4" fill="#FBE7B8" stroke="none"/><circle cx="45" cy="78" r="3" fill="#FBE7B8" stroke="none"/><path d="M60 40 Q 70 32 80 40" stroke="#D7263D" stroke-width="4"/>',
    burger: '<path d="M25 50 Q 60 20 95 50 Z" fill="#F2B544"/><rect x="25" y="52" width="70" height="8" rx="2" fill="#6B7F3A" stroke="none"/><rect x="22" y="60" width="76" height="12" rx="3" fill="#2A1A17" stroke="none"/><path d="M25 72 H95 L 90 80 H 30 Z" fill="#D7263D" stroke="none"/><rect x="25" y="80" width="70" height="14" rx="7" fill="#F2B544"/><circle cx="45" cy="38" r="1.8" fill="#FFFDF9" stroke="none"/><circle cx="62" cy="33" r="1.8" fill="#FFFDF9" stroke="none"/><circle cx="78" cy="39" r="1.8" fill="#FFFDF9" stroke="none"/>',
    taco: '<path d="M22 80 Q 60 10 98 80 Z" fill="#F2B544"/><path d="M30 78 Q 60 30 90 78" stroke="#D7263D" stroke-width="6"/><circle cx="48" cy="60" r="4" fill="#6B7F3A" stroke="none"/><circle cx="72" cy="58" r="4" fill="#6B7F3A" stroke="none"/><circle cx="60" cy="50" r="3" fill="#FBE7B8" stroke="none"/>',
    bowl: '<path d="M20 60 H100 Q 100 95 60 95 Q 20 95 20 60 Z" fill="#6B7F3A"/><ellipse cx="60" cy="60" rx="40" ry="10" fill="#F2B544" stroke="none"/><circle cx="48" cy="58" r="4" fill="#FFFDF9" stroke="none"/><circle cx="66" cy="56" r="4" fill="#FFFDF9" stroke="none"/><circle cx="80" cy="60" r="3" fill="#FFFDF9" stroke="none"/><path d="M50 44 Q 46 36 50 28 M70 44 Q 66 36 70 28" stroke-opacity=".6"/>',
    pancake: '<ellipse cx="60" cy="82" rx="42" ry="10" fill="#F2B544"/><ellipse cx="60" cy="72" rx="40" ry="10" fill="#D7A33A"/><ellipse cx="60" cy="62" rx="38" ry="10" fill="#F2B544"/><path d="M40 60 Q 60 52 80 60 Q 85 66 78 68 Q 60 60 44 68 Q 36 66 40 60 Z" fill="#B01B30" stroke="none"/><circle cx="55" cy="52" r="4" fill="#2A1A17" stroke="none"/><circle cx="66" cy="50" r="4" fill="#2A1A17" stroke="none"/>',
  };

  function svgFor(key, extra) {
    return '<svg viewBox="0 0 120 120" fill="none" stroke="#2A1A17" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + (art[key] || '') + '</svg>';
  }

  return { saveurs, formules, poids, prix, euro, allergenes, svgFor, remisePremiereBox };
})();
