/* Scan déjà en CSS. Ici : tranches, mots fantômes, et le titre qui se corrompt puis revient. */

const GHOSTS = ["DEVELOPER", "DESIGNER", "HACKER", "CREATOR", "404", "ROOT ACCESS"];
const SCRAMBLE = "▓▒░#/<>01";

export function createGlitch(root, cfg) {
  const ghosts = document.createElement("div");
  ghosts.className = "ghosts";
  ghosts.innerHTML = GHOSTS.map((word, i) => {
    const x = i % 2 === 0 ? 4 + (i % 3) * 6 : 62 + (i % 3) * 8;
    const y = 12 + ((i * 17) % 70);
    return `<span style="left:${x}%;top:${y}%">${word}</span>`;
  }).join("");
  root.appendChild(ghosts);

  const slices = document.createElement("div");
  slices.className = "slices";
  for (let i = 0; i < 4; i++) {
    const bar = document.createElement("i");
    slices.appendChild(bar);
  }
  root.appendChild(slices);
  const bars = [...slices.children];

  let wait = 2.5;
  let scrambling = false;

  function corrupt() {
    const title = document.getElementById("nm");
    if (!title || scrambling) return;
    const text = title.dataset.t || title.textContent;
    scrambling = true;
    const start = performance.now();
    (function frame(now) {
      const p = (now - start) / 520;
      if (p < 1) {
        title.textContent = [...text].map((ch, i) => (ch === " " || p > i / text.length ? ch : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0])).join("");
        requestAnimationFrame(frame);
      } else {
        title.textContent = text;
        scrambling = false;
      }
    })(start);
  }

  function update(dt, state) {
    ghosts.style.opacity = String(state.presence * (state.calm ? 0.25 : 0.9));
    if (state.reduced || state.calm || state.presence < 0.4) return;
    wait -= dt;
    if (wait > 0) return;
    wait = cfg.everyMin + Math.random() * (cfg.everyMax - cfg.everyMin);
    document.body.classList.add("glitch");
    bars.forEach((bar) => {
      bar.style.top = `${(Math.random() * 90) | 0}%`;
      bar.style.height = `${4 + ((Math.random() * 18) | 0)}px`;
      bar.style.transform = `translateX(${(Math.random() * 24 - 12) | 0}px)`;
    });
    setTimeout(() => document.body.classList.remove("glitch"), 180);
    corrupt();
  }

  return { update };
}
