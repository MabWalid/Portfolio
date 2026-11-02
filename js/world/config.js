/* Tous les réglages du monde. Baisse un chiffre pour calmer l'effet. */

export const WORLD = {
  bootMs: 2000,
  /* Temps pour éteindre le chaos quand Contact arrive, en secondes. */
  fade: 1.5,

  matrix: {
    fontSize: 15,
    columns: 32,
    mobileColumns: 12,
    margin: 0.24,
    mobileMargin: 0.16,
    tailMin: 7,
    tailMax: 15,
    speedMin: 0.35,
    speedMax: 1.1,
    opacity: 0.78,
    shear: 36,
    glitchChance: 0.01,
    freezeChance: 0.004,
    alertRate: 0.07,
  },

  network: {
    nodes: 42,
    mobileNodes: 16,
    link: 150,
    speed: 18,
    packetCount: 14,
  },

  eyes: {
    count: 8,
    mobileCount: 4,
    blinkMin: 2.2,
    blinkMax: 6,
  },

  lightning: {
    minGap: 4,
    maxGap: 10,
    depth: 5,
  },

  glitch: {
    everyMin: 5.5,
    everyMax: 9,
  },

  terminals: {
    count: 2,
    mobileCount: 1,
  },
};
