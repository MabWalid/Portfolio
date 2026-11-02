/* Nœuds reliés, paquets qui glissent, le curseur les attire. */

function canvasBox(canvas) {
  const dpr = Math.min(1.5, devicePixelRatio || 1);
  const width = canvas.clientWidth || innerWidth;
  const height = canvas.clientHeight || innerHeight;
  canvas.width = Math.max(1, (width * dpr) | 0);
  canvas.height = Math.max(1, (height * dpr) | 0);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

export function createNetwork(canvas, cfg) {
  let ctx, width, height, nodes, packets;

  function spawn(n) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed,
    };
  }

  function resize() {
    ({ ctx, width, height } = canvasBox(canvas));
    const count = width < 760 ? cfg.mobileNodes : cfg.nodes;
    nodes = Array.from({ length: count }, spawn);
    packets = Array.from({ length: Math.min(cfg.packetCount, count) }, () => ({ a: 0, b: 1, t: Math.random() }));
  }

  function update(dt, state) {
    ctx.clearRect(0, 0, width, height);
    if (state.presence < 0.04) return;
    const calm = state.calm || state.reduced;
    const gain = state.presence * (calm ? 0.35 : 1);
    const px = state.pointer.x;
    const py = state.pointer.y;
    for (const n of nodes) {
      if (!calm) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        const dx = px - n.x;
        const dy = py - n.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 200) {
          n.x += (dx / dist) * 28 * dt;
          n.y += (dy / dist) * 28 * dt;
        }
      }
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      n.x = Math.max(0, Math.min(width, n.x));
      n.y = Math.max(0, Math.min(height, n.y));
    }
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < cfg.link) links.push([i, j, 1 - d / cfg.link]);
      }
    }
    ctx.lineWidth = 1;
    for (const [i, j, a] of links) {
      ctx.strokeStyle = `rgba(0,229,255,${a * 0.35 * gain})`;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
    if (links.length) {
      for (const packet of packets) {
        packet.t += dt * (calm ? 0.15 : 0.45);
        if (packet.t >= 1) {
          const link = links[(Math.random() * links.length) | 0];
          packet.a = link[0];
          packet.b = link[1];
          packet.t = 0;
        }
        const A = nodes[packet.a];
        const B = nodes[packet.b];
        if (!A || !B) continue;
        const x = A.x + (B.x - A.x) * packet.t;
        const y = A.y + (B.y - A.y) * packet.t;
        ctx.fillStyle = `rgba(0,255,156,${0.9 * gain})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, 7);
        ctx.fill();
      }
    }
    ctx.fillStyle = `rgba(234,255,246,${0.8 * gain})`;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, 7);
      ctx.fill();
    }
  }

  resize();
  return { resize, update };
}
