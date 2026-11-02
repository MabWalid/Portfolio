/* Fenêtres qui tapent toutes seules, dans les coins, puis disparaissent. */

const SCRIPTS = [
  ["> accessing mainframe...", "> bypassing firewall [#####---]", "> user detected: visiteur", "> you are being watched"],
  ["> trace route — lille", "> handshake accepted", "> shadow process alive", "> do not look away"],
  ["> reading gaze.bin", "> pupil lock: partial", "> signal unstable", "> still here"],
];

const SPOTS = [
  { left: "4vw", top: "18vh" },
  { right: "4vw", bottom: "10vh" },
  { left: "6vw", bottom: "16vh" },
  { right: "6vw", top: "24vh" },
];

export function createTerminals(root, cfg) {
  const host = document.createElement("div");
  host.className = "terms";
  root.appendChild(host);
  const mobile = innerWidth < 760;
  const count = mobile ? cfg.mobileCount : cfg.count;
  const windows = Array.from({ length: count }, (_, i) => {
    const el = document.createElement("pre");
    el.className = "term";
    host.appendChild(el);
    return { el, script: SCRIPTS[i % SCRIPTS.length], line: 0, char: 0, wait: 0.4 + i * 0.6, hold: 0, spot: i };
  });

  function place(win) {
    win.spot = (win.spot + 1 + ((Math.random() * (SPOTS.length - 1)) | 0)) % SPOTS.length;
    const spot = SPOTS[win.spot];
    win.el.style.left = spot.left || "auto";
    win.el.style.right = spot.right || "auto";
    win.el.style.top = spot.top || "auto";
    win.el.style.bottom = spot.bottom || "auto";
  }
  windows.forEach(place);

  function update(dt, state) {
    const show = state.presence > 0.25 && !state.calm;
    host.style.opacity = show ? String(Math.min(1, state.presence)) : "0";
    if (!show || state.reduced) {
      if (state.reduced && !state.calm) {
        windows.forEach((win) => {
          win.el.textContent = win.script.join("\n");
        });
      }
      return;
    }
    for (const win of windows) {
      if (win.hold > 0) {
        win.hold -= dt;
        if (win.hold <= 0) {
          win.line = 0;
          win.char = 0;
          win.script = SCRIPTS[(Math.random() * SCRIPTS.length) | 0];
          place(win);
          win.wait = 0.25;
        }
        continue;
      }
      if (win.wait > 0) {
        win.wait -= dt;
        continue;
      }
      const line = win.script[win.line];
      win.char += 1;
      const shown = win.script.slice(0, win.line).join("\n");
      const head = line.slice(0, win.char);
      win.el.textContent = (shown ? shown + "\n" : "") + head + "▌";
      if (win.char >= line.length) {
        win.line += 1;
        win.char = 0;
        win.wait = win.line >= win.script.length ? 0 : 0.18 + Math.random() * 0.45;
        if (win.line >= win.script.length) win.hold = 1.7 + Math.random();
      } else {
        win.wait = 0.02 + Math.random() * 0.07;
      }
    }
  }

  return { update };
}
