/* Réglages du monde vivant. matrix = pluie dans les marges, le centre reste lisible. */

export const WORLD = {
  bootMs: 2000,

  matrix: {
    fontSize: 15,
    columns: 34,
    mobileColumns: 14,
    /* Largeur des deux marges, en part de l'écran. Le milieu reste vide. */
    margin: 0.26,
    mobileMargin: 0.18,
    tailMin: 7,
    tailMax: 16,
    speedMin: 0.35,
    speedMax: 1.15,
    opacity: 0.8,
    /* Courbure des colonnes vers le curseur, en pixels. */
    shear: 42,
    glitchChance: 0.01,
    freezeChance: 0.004,
    /* Part des colonnes rouges. */
    alertRate: 0.06,
  },
};
