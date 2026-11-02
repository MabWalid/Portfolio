/* Éclair ramifié. flash = voile blanc-cyan, struck = vrai au moment où ça tombe. */

function collect(segs, x, y, x2, y2, depth, jag) {
  if (depth <= 0) {
    segs.push([x, y, x2, y2]);
    return;
  }
  const mx = (x + x2) / 2 + (Math.random() - 0.5) * jag;
  const my = (y + y2) / 2 + (Math.random() - 0.5) * jag;
  collect(segs, x, y, mx, my, depth - 1, jag * 0.55);
  collect(segs, mx, my, x2, y2, depth - 1, jag * 0.55);
  if (depth > 2 && Math.random() < 0.4) {
    collect(segs, mx, my, mx + (Math.random() - 0.5) * jag, my + jag * 0.7, depth - 2, jag * 0.35);
  }
}

export function createLightning(canvas, cfg) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let bolts = [];
  let next = 1.4;
  let flash = 0;

  function resize() {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    width = canvas.clientWidth || innerWidth;
    height = canvas.clientHeight || innerHeight;
    canvas.width = Math.max(1, (width * dpr) | 0);
    canvas.height = Math.max(1, (height * dpr) | 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function strike() {
    const x = width * (0.15 + Math.random() * 0.7);
    const segs = [];
    collect(segs, x, -8, x + (Math.random() - 0.5) * width * 0.5, height * (0.35 + Math.random() * 0.45), cfg.depth, width * 0.1);
    bolts.push({ segs, life: 0.2 });
    flash = 1;
  }

  function stroke(bolt, color, widthPx) {
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.beginPath();
    for (const [x, y, x2, y2] of bolt.segs) {
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  }

  function update(dt, state) {
    ctx.clearRect(0, 0, width, height);
    let struck = false;
    const allow = !state.reduced && !state.calm && state.presence > 0.45;
    if (state.closing && allow) {
      strike();
      struck = true;
    }
    if (allow) {
      next -= dt;
      if (next <= 0) {
        next = cfg.minGap + Math.random() * (cfg.maxGap - cfg.minGap);
        strike();
        struck = true;
      }
    }
    flash = Math.max(0, flash - dt * 8);
    bolts = bolts.filter((bolt) => {
      bolt.life -= dt;
      if (bolt.life <= 0) return false;
      const a = Math.min(1, bolt.life * 6);
      stroke(bolt, `rgba(0,229,255,${a * 0.55})`, 5);
      stroke(bolt, `rgba(236,255,255,${a})`, 1.4);
      return true;
    });
    return { struck, flash };
  }

  resize();
  return { resize, update };
}
