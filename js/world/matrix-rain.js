/* Pluie tenue dans les marges. Trois profondeurs, trois teintes,
   les têtes se penchent vers le curseur. Le centre de l'écran reste libre. */

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";
const WORDS = ["const", "root", "SELECT *", "ssh", "404", "void", "whoami", "illusion", "layer"];

const INK = {
  green: [0, 255, 156],
  cyan: [0, 229, 255],
  alert: [255, 45, 85],
};

function glyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

function rgba(rgb, a) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

export function createMatrixRain(canvas, cfg) {
  const ctx = canvas.getContext("2d", { alpha: true });
  let cols = [];
  let width = 0;
  let height = 0;
  let fontPx = cfg.fontSize;
  let margin = 0;

  function bandX() {
    const left = Math.random() < 0.5;
    const span = margin * Math.random();
    return left ? span : width - span;
  }

  function spawn(anywhere) {
    const tail = cfg.tailMin + ((Math.random() * (cfg.tailMax - cfg.tailMin)) | 0);
    const alert = Math.random() < cfg.alertRate;
    const depth = Math.random();
    return {
      x: bandX(),
      y: anywhere ? Math.random() * height : Math.random() < 0.22 ? height + fontPx : -fontPx * 2,
      speed: (cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin)) * (0.45 + depth),
      dir: Math.random() < 0.22 ? -1 : 1,
      sway: 6 + Math.random() * 16,
      phase: Math.random() * 6.28,
      scale: depth < 0.33 ? 0.72 : depth < 0.75 ? 1 : 1.35,
      kind: alert ? "alert" : depth < 0.5 ? "cyan" : "green",
      word: !alert && Math.random() < 0.1 ? WORDS[(Math.random() * WORDS.length) | 0] : "",
      tail: Array.from({ length: alert ? 5 + ((Math.random() * 4) | 0) : tail }, glyph),
      freeze: 0,
      glitch: 0,
    };
  }

  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    width = canvas.clientWidth || innerWidth;
    height = canvas.clientHeight || innerHeight;
    canvas.width = Math.max(1, (width * dpr) | 0);
    canvas.height = Math.max(1, (height * dpr) | 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = width < 760;
    fontPx = mobile ? cfg.fontSize - 2 : cfg.fontSize;
    margin = width * (mobile ? cfg.mobileMargin : cfg.margin);
    const count = mobile ? cfg.mobileColumns : cfg.columns;
    cols = Array.from({ length: count }, () => spawn(true));
  }

  function draw(dt, state) {
    ctx.clearRect(0, 0, width, height);
    if (state.intensity < 0.02 || !cols.length) return;

    const calm = state.calm || state.reduced;
    const speedScale = (calm ? 0.35 : 1) * (0.45 + state.intensity * 0.7);
    const alpha = cfg.opacity * (calm ? 0.32 : 1) * (0.35 + state.intensity * 0.65);
    const px = state.pointer?.x ?? width / 2;
    const py = state.pointer?.y ?? height / 2;
    const time = state.time || 0;
    ctx.textBaseline = "top";

    for (const col of cols) {
      const size = fontPx * col.scale;
      if (col.freeze > 0) col.freeze -= dt;
      else col.y += col.dir * col.speed * speedScale * dt * 60;

      if (!calm) {
        if (Math.random() < cfg.glitchChance) col.glitch = 4 + ((Math.random() * 5) | 0);
        else if (Math.random() < cfg.freezeChance) col.freeze = 0.18 + Math.random() * 0.35;
      }
      if (col.glitch > 0) col.glitch--;

      const span = col.tail.length * size + 40;
      if (col.y < -span || col.y > height + span) {
        const next = spawn(false);
        Object.assign(col, next);
      }

      const dx = px - col.x;
      const reach = Math.min(1, 240 / (Math.abs(dx) + 80));
      const lean = calm ? 0 : cfg.shear * reach * Math.sign(dx || 1);
      const drift = Math.sin(time * 0.6 + col.phase) * col.sway;
      const ink = INK[col.kind];
      ctx.font = `${size | 0}px "JetBrains Mono", ui-monospace, monospace`;

      for (let i = 0; i < col.tail.length; i++) {
        const y = col.y - col.dir * i * size;
        if (y < -size || y > height + size) continue;
        if (col.glitch > 0 && i % 2 === 0) col.tail[i] = glyph();
        const along = 1 - i / col.tail.length;
        const x = col.x + drift + lean * along;
        if (x > margin && x < width - margin) continue;
        const a = Math.max(0, Math.min(1, alpha * along * (col.kind === "alert" ? 1 : 0.9)));
        const label = i === 0 && col.word ? col.word : col.tail[i];
        const inward = i === 0 && col.word && x < width / 2;
        ctx.fillStyle = i === 0 ? `rgba(238,242,255,${Math.min(1, a + 0.25)})` : rgba(ink, a);
        ctx.textAlign = inward ? "right" : "left";
        ctx.fillText(label, x, y);
      }
    }
  }

  return { resize, draw };
}
