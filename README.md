# Portfolio : architecte d’illusions

Portfolio de développeur, sans framework ni dépendance : HTML, CSS et JavaScript purs.

## Ce que contient le site
- Fond WebGL (shader GLSL) qui se transforme en continu au scroll : tunnel, moiré, damier qui respire, spirale, lave.
- Zoom arrière infini (effet Droste) piloté par le scroll.
- Cartes projets 3D qui suivent le curseur.
- Mini-jeu de balle en canvas 2D (combo, orbes dorés, ralenti, record sauvegardé).
- Bouton de contact « symbiote » : tentacules qui poursuivent le curseur et l’absorbent.
- Easter eggs : taper `sudo`, titre d’onglet qui change quand tu pars.
- Accessibilité : bouton « Calmer les effets » et respect de `prefers-reduced-motion`.

## Lancer en local
```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Personnaliser
- Nom, textes : `index.html` (cherche « Ton Nom »).
- Projets : tableau `P` en haut de `js/main.js`.
- Email : lien `mailto:` dans `index.html`.
- Couleurs : variables CSS au début de `css/style.css`.

## Publier avec GitHub Pages
1. Pousse le dépôt sur GitHub.
2. Settings, puis Pages, puis Branch `main` et dossier `/ (root)`.
3. Le site sera en ligne sur `https://ton-pseudo.github.io/nom-du-depot/`.

## Avertissement
Le site contient des effets visuels hypnotiques en mouvement. Un bouton permet de les calmer.
