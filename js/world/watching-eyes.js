/* Yeux dans les marges. Les pupilles suivent le curseur, les paupières se ferment ensemble vers Contact. */

const SLOTS = [
  [0.07, 0.24], [0.12, 0.7], [0.05, 0.48], [0.18, 0.88],
  [0.9, 0.2], [0.86, 0.55], [0.93, 0.78], [0.78, 0.12],
];

export function createEyes(canvas, cfg) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let eyes = [];

  function resize() {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    width = canvas.clientWidth || innerWidth;
    height = canvas.clientHeight || innerHeight;
    canvas.width = Math.max(1, (width * dpr) | 0);
    canvas.height = Math.max(1, (height * dpr) | 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 760 ? cfg.mobileCount : cfg.count;
    eyes = SLOTS.slice(0, count).map((slot, i) => ({
      slot,
      lid: 1,
      blink: 0,
      next: 1 + Math.random() * 2,
      alpha: i % 3 === 0 ? 0 : 1,
      fade: i % 3 === 0 ? 0.35 : 0,
      dir: Math.random() < 0.5 ? 1 : -1,
    }));
  }

  function update(dt, state) {
    ctx.clearRect(0, 0, width, height);
    if (state.presence < 0.03) return;
    const shut = 1 - Math.min(1, state.presence * 1.35);
    for (const eye of eyes) {
      eye.next -= dt;
      if (eye.next <= 0 && eye.blink <= 0) eye.blink = 0.16;
      if (eye.blink > 0) {
        eye.blink -= dt;
        const k = eye.blink / 0.16;
        eye.lid = Math.sin((1 - k) * Math.PI);
        if (eye.blink <= 0) eye.next = cfg.blinkMin + Math.random() * (cfg.blinkMax - cfg.blinkMin);
      } else eye.lid += (0 - eye.lid) * Math.min(1, dt * 8);
      if (eye.fade) {
        eye.alpha += eye.dir * dt * eye.fade;
        if (eye.alpha > 1 || eye.alpha < 0) eye.dir *= -1;
        eye.alpha = Math.max(0, Math.min(1, eye.alpha));
      }
      const lid = Math.max(eye.lid, shut);
      const x = eye.slot[0] * width;
      const y = eye.slot[1] * height;
      const a = eye.alpha * Math.min(1, state.presence * 1.4);
      if (a < 0.02) continue;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = a;
      ctx.fillStyle = "#d7fff0";
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, Math.max(1.2, 14 * (1 - lid)), 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,229,255,.7)";
      ctx.stroke();
      if (lid < 0.82) {
        const ang = Math.atan2(state.pointer.y - y, state.pointer.x - x);
        const reach = Math.min(8, Math.hypot(state.pointer.x - x, state.pointer.y - y) * 0.03);
        const px = Math.cos(ang) * reach;
        const py = Math.sin(ang) * reach;
        ctx.fillStyle = "#05060a";
        ctx.beginPath();
        ctx.arc(px, py, 6.5, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#00ff9c";
        ctx.beginPath();
        ctx.arc(px, py, 2.1, 0, 7);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  resize();
  return { resize, update };
}
