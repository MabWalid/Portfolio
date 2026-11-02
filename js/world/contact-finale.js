/* Contact : le silence. Un œil lent, un formulaire terminal, des liens attirés par le curseur. */

const SCRAMBLE = "▓▒░#/<>01";

function scramble(el) {
  const text = el.dataset.t || el.textContent;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = text;
    return;
  }
  const start = performance.now();
  (function frame(now) {
    const p = (now - start) / 700;
    el.textContent = [...text].map((ch, i) => (ch === " " || p > 0.25 + i / text.length ? ch : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0])).join("");
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = text;
  })(start);
}

export function mountContact() {
  const section = document.getElementById("contact");
  const title = document.getElementById("hello");
  const pupil = document.getElementById("pupil");
  const form = document.getElementById("mail");
  const sent = document.getElementById("sent");
  if (!section) return;

  if (title) {
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        scramble(title);
        seen.disconnect();
      }
    }, { threshold: 0.4 });
    seen.observe(section);
  }

  if (pupil) {
    let tx = 120;
    let ty = 50;
    let x = 120;
    let y = 50;
    addEventListener("pointermove", (e) => {
      const rect = pupil.ownerSVGElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
      const reach = Math.min(18, Math.hypot(e.clientX - cx, e.clientY - cy) * 0.06);
      tx = 120 + Math.cos(ang) * reach;
      ty = 50 + Math.sin(ang) * reach * 0.45;
    });
    let cursor = 0;
    (function follow() {
      cursor = requestAnimationFrame(follow);
      if (document.hidden) return;
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      pupil.setAttribute("cx", x.toFixed(2));
      pupil.setAttribute("cy", y.toFixed(2));
    })();
    addEventListener("pagehide", () => cancelAnimationFrame(cursor));
  }

  section.querySelectorAll(".mag").forEach((link) => {
    link.addEventListener("pointermove", (e) => {
      const rect = link.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      link.style.translate = `${dx * 0.28}px ${dy * 0.35}px`;
    });
    link.addEventListener("pointerleave", () => {
      link.style.translate = "";
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nom = String(data.get("nom") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = `De : ${nom} <${email}>\n\n${message}`;
    form.hidden = true;
    if (sent) sent.hidden = false;
    location.href = `mailto:mabroukwalid0@gmail.com?subject=${encodeURIComponent("Portfolio — " + nom)}&body=${encodeURIComponent(body)}`;
  });
}
