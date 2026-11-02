/* Orchestre le monde vivant derrière le contenu, et l'éteint en arrivant au contact. */

import { WORLD } from "./config.js";
import { createMatrixRain } from "./matrix-rain.js";
import { createNetwork } from "./node-network.js";
import { createEyes } from "./watching-eyes.js";
import { createLightning } from "./lightning.js";
import { createTerminals } from "./terminal-windows.js";
import { createGlitch } from "./glitch-overlay.js";
import { mountContact } from "./contact-finale.js";

const root = document.getElementById("world");
if (root) {
  const layer = (id) => {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    root.appendChild(canvas);
    return canvas;
  };

  const network = createNetwork(layer("net"), WORLD.network);
  const rain = createMatrixRain(layer("matrix"), WORLD.matrix);
  const eyes = createEyes(layer("eyes"), WORLD.eyes);
  const lightning = createLightning(layer("bolts"), WORLD.lightning);
  const terminals = createTerminals(root, WORLD.terminals);
  const glitch = createGlitch(root, WORLD.glitch);
  mountContact();

  const flash = document.createElement("div");
  flash.id = "flash";
  flash.setAttribute("aria-hidden", "true");
  document.body.appendChild(flash);

  const cursor = document.createElement("div");
  cursor.id = "cur";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = "<i></i><b></b>";
  document.body.appendChild(cursor);
  const dot = cursor.firstChild;
  const ring = cursor.lastChild;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobile = matchMedia("(max-width: 760px)").matches;
  const calmBtn = document.getElementById("calm");
  const contact = document.getElementById("contact");
  const bg = document.getElementById("bg");

  let calm = calmBtn?.getAttribute("aria-pressed") === "true";
  let revealed = false;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let presence = 0;
  let armed = true;
  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  let ringX = pointer.x;
  let ringY = pointer.y;

  if (fine && !reduced) document.documentElement.classList.add("fx-cursor");

  addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  calmBtn?.addEventListener("click", () => {
    calm = calmBtn.getAttribute("aria-pressed") === "true";
    document.documentElement.classList.toggle("fx-cursor", fine && !reduced && !calm);
  });

  function resize() {
    network.resize();
    rain.resize();
    eyes.resize();
    lightning.resize();
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    let want = 0;
    if (revealed && !calm) {
      want = 1;
      if (contact) {
        const top = contact.getBoundingClientRect().top;
        if (top < innerHeight * 0.72) want = 0;
      }
    }
    const prev = presence;
    presence += (want - presence) * (1 - Math.exp(-dt / WORLD.fade));
    const closing = armed && prev > 0.55 && want === 0;
    if (want === 0 && presence < 0.2) armed = false;
    if (want === 1 && presence > 0.65) armed = true;

    const scrolled = Math.min(1, scrollY / Math.max(1, innerHeight * 0.8));
    const state = {
      dt,
      time: now / 1000,
      presence,
      intensity: presence * (0.45 + scrolled * 0.55),
      calm,
      reduced,
      mobile,
      pointer,
      closing,
    };

    network.update(dt, state);
    rain.draw(dt, state);
    eyes.update(dt, state);
    const bolt = lightning.update(dt, state);
    terminals.update(dt, state);
    glitch.update(dt, state);

    root.style.opacity = String(Math.min(1, presence));
    if (bg) bg.style.opacity = String(0.35 + presence * 0.65);
    flash.style.opacity = bolt.flash > 0.02 && !reduced && !calm ? String(bolt.flash * 0.55) : "0";
    if (bolt.struck && !mobile && !reduced && !calm) {
      document.body.classList.add("shake");
      setTimeout(() => document.body.classList.remove("shake"), 140);
    }

    if (fine && !reduced && !calm) {
      ringX += (pointer.x - ringX) * 0.18;
      ringY += (pointer.y - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    }

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

  resize();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  addEventListener("pagehide", stop);

  const boot = document.getElementById("boot");
  if (!boot || boot.classList.contains("out")) reveal();
  else addEventListener("world-ready", reveal, { once: true });
}
