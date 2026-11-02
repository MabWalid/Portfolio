/* Couche fixe derrière le contenu. Pointer-events: none.
   Cette passe ne monte que MatrixRain. Les autres effets se branchent ici ensuite. */

import { WORLD } from "./config.js";
import { createMatrixRain } from "./matrix-rain.js";

const root = document.getElementById("world");
if (root) {
  const canvas = document.createElement("canvas");
  canvas.id = "matrix";
  root.appendChild(canvas);

  const rain = createMatrixRain(canvas, WORLD.matrix);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const calmBtn = document.getElementById("calm");
  const contact = document.getElementById("contact");

  let calm = calmBtn?.getAttribute("aria-pressed") === "true";
  let revealed = false;
  let running = false;
  let raf = 0;
  let last = performance.now();
  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };

  addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  calmBtn?.addEventListener("click", () => {
    calm = calmBtn.getAttribute("aria-pressed") === "true";
  });

  /* 0 sur le hero, monte vers les projets, retombe quand Contact entre. */
  function intensity() {
    if (!revealed) return 0;
    const scrolled = Math.min(1, scrollY / Math.max(1, innerHeight * 1.4));
    let level = 0.42 + scrolled * 0.58;
    if (contact) {
      const top = contact.getBoundingClientRect().top;
      if (top < innerHeight) {
        const fade = Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * 0.85)));
        level *= 1 - fade;
      }
    }
    return level;
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    rain.draw(dt, { intensity: intensity(), calm, reduced, pointer, time: now / 1000 });
    if (!document.hidden) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    root.classList.add("on");
    start();
  }

  rain.resize();
  addEventListener("resize", () => rain.resize());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  const boot = document.getElementById("boot");
  if (!boot || boot.classList.contains("out")) reveal();
  else addEventListener("world-ready", reveal, { once: true });

  /* Arrêt propre si la page est quittée. */
  addEventListener("pagehide", stop);
}
