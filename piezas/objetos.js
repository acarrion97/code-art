// Objetos con acabado (pieza compartida; para que un objeto no parezca de juguete): cajas en 3D con perspectiva,
// sombreadas por su normal y con bisel en las aristas (el filo que coge la luz),
// la sombra de contacto difuminada donde algo apoya, la cota de medida (topes y flechas, del tamaño justo, encima del
// objeto que mide) y la madera clara de veta fina. Las unidades del mundo son las que quieras; la cámara, la del kit.
//   import { caja, conMadera, sombraContacto, cota } from "#piezas/objetos.js";
//   const cam = k.mira([6, 5, 9], [0, 0, 0]);
//   caja(g, cam, { x: [-6, 6], y: [-2, 0], z: [-4, 4] }, [214, 172, 112], { textura: conMadera(cam, { x: [-6, 6], y: [-2, 0], z: [-4, 4] }) });
//   sombraContacto(g, cam, { x: [0, 3], z: [-1, 1], y: 0.01 });                         // antes del objeto que apoya
//   caja(g, cam, { x: [0, 3], y: [0, 0.3], z: [-1, 1] }, [184, 190, 200], { bisel: 1, brillo: 0.3, grano: 0.1 });
//   cota(g, cam, [0, 0.3, 1], [3, 0.3, 1], { texto: "3 cm" });                          // al final: encima de todo
// Metal: grano 0,1 como mucho (más, y parece piedra agrietada). Lo que marca (cotas, etiquetas) se dibuja al final y
// fuera de la franja de los subtítulos.
import * as k from "#kit";

const { mez, uni, res, sum, por, pto, proyecta } = k;
const LUZ = uni([-0.45, 0.85, 0.6]);   // de arriba, a la izquierda y de frente: la sombra cae a la derecha y al fondo

export function proy(cam, pts) { const out = []; for (const p of pts) { const q = proyecta(cam, p); if (!q) return null; out.push(q); } return out; }
export function poli(g, P) { g.beginPath(); g.moveTo(P[0].x, P[0].y); for (let i = 1; i < P.length; i++) g.lineTo(P[i].x, P[i].y); g.closePath(); }
const rgb = (c, m = 1) => `rgb(${Math.min(255, Math.round(c[0] * m))},${Math.min(255, Math.round(c[1] * m))},${Math.min(255, Math.round(c[2] * m))})`;

// Una caja x:[x0,x1] y:[y0,y1] z:[z0,z1] de un color [r,g,b]. op: { al, luz (dirección), bisel (0..1), brillo (metal),
// grano, moteado (pared), borde, bordeAncho, textura: { arriba(g, P, cara), frente, ... } }.
export function caja(g, cam, c, color, op = {}) {
  const [x0, x1] = c.x, [y0, y1] = c.y, [z0, z1] = c.z, L = op.luz ? uni(op.luz) : LUZ;
  const caras = [
    { n: [0, 1, 0], p: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], id: "arriba" },
    { n: [0, -1, 0], p: [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]], id: "abajo" },
    { n: [0, 0, 1], p: [[x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]], id: "frente" },
    { n: [0, 0, -1], p: [[x1, y1, z0], [x0, y1, z0], [x0, y0, z0], [x1, y0, z0]], id: "fondo" },
    { n: [1, 0, 0], p: [[x1, y1, z1], [x1, y1, z0], [x1, y0, z0], [x1, y0, z1]], id: "derecha" },
    { n: [-1, 0, 0], p: [[x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [x0, y0, z0]], id: "izquierda" },
  ];
  g.save();
  if (op.al !== undefined) g.globalAlpha *= op.al;
  for (const f of caras) {
    const centro = por(f.p.reduce((a, p) => sum(a, p), [0, 0, 0]), 0.25);
    if (pto(f.n, res(cam.p, centro)) <= 0) continue;            // cara de atrás
    const P = proy(cam, f.p); if (!P) continue;
    const luz = 0.36 + 0.64 * Math.max(0, pto(f.n, L));
    poli(g, P);
    const gr = g.createLinearGradient(P[0].x, P[0].y, P[2].x, P[2].y);
    gr.addColorStop(0, rgb(color, luz * 1.14)); gr.addColorStop(1, rgb(color, luz * 0.8));
    g.fillStyle = gr; g.fill();
    if (op.grano) { g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= op.grano; g.drawImage(k.red2, -200, -300, 1500, 2600); g.restore(); }
    if (op.moteado) { g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= op.moteado; g.drawImage(k.manchas, -100, -100, 1300, 2200); g.restore(); }
    if (op.brillo) {
      // metal: una banda de luz que cruza la cara en diagonal (el reflejo de la lámpara)
      g.save(); g.clip(); g.globalCompositeOperation = "screen";
      const bg = g.createLinearGradient(P[0].x, P[0].y, P[2].x, P[2].y);
      bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(0.3, "rgba(255,255,255,0)"); bg.addColorStop(0.45, `rgba(255,255,255,${op.brillo * luz})`); bg.addColorStop(0.6, "rgba(255,255,255,0)"); bg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920); g.restore();
    }
    if (op.textura && op.textura[f.id]) { g.save(); poli(g, P); g.clip(); op.textura[f.id](g, P, f); g.restore(); }
    if (op.borde) { poli(g, P); g.strokeStyle = op.borde; g.lineWidth = op.bordeAncho || 2; g.lineJoin = "round"; g.stroke(); }
    if (op.bisel) { // la arista: una línea oscura fina por fuera y una clara por dentro (el filo redondeado que coge la luz)
      poli(g, P); g.strokeStyle = `rgba(0,0,0,${0.35 * op.bisel})`; g.lineWidth = 3.5; g.lineJoin = "round"; g.stroke();
      g.save(); g.clip(); poli(g, P); g.strokeStyle = `rgba(255,255,255,${0.55 * op.bisel * luz})`; g.lineWidth = 5; g.stroke(); g.restore();
    }
  }
  g.restore();
}

// Una imagen sobre un rectángulo horizontal del mundo (y fijo), por trozos para que la perspectiva sea la buena. Cada
// trozo va en dos triángulos (cada uno, exacto en sus tres esquinas): con un trozo entero, en perspectiva oblicua las
// vetas no casan de un trozo al siguiente y se ve un parqué.
export function imagenEnPlano(g, cam, img, x0, x1, y, z0, z1, nx = 12, nz = 2, al = 1) {
  const W = img.width, H = img.height;
  const tri = (P, cw, ch) => { // P: tres esquinas de la pantalla, un píxel más grandes (sin eso, se ven las juntas)
    const mx = (P[0].x + P[1].x + P[2].x) / 3, my = (P[0].y + P[1].y + P[2].y) / 3;
    g.beginPath();
    P.forEach((q, n) => { const d = Math.hypot(q.x - mx, q.y - my) || 1, px = q.x + (q.x - mx) / d, py = q.y + (q.y - my) / d; n ? g.lineTo(px, py) : g.moveTo(px, py); });
    g.closePath(); g.clip();
  };
  g.save(); g.globalAlpha *= al;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const xa = mez(x0, x1, i / nx), xb = mez(x0, x1, (i + 1) / nx), za = mez(z0, z1, j / nz), zb = mez(z0, z1, (j + 1) / nz);
    const Q = proy(cam, [[xa, y, za], [xb, y, za], [xa, y, zb], [xb, y, zb]]); if (!Q) continue;
    const sx = (W * i) / nx, sy = (H * j) / nz, cw = W / nx, ch = H / nz, [a, b, c, d] = Q;
    // el triángulo a-b-c: la esquina (0,0) del trozo en a
    g.save(); tri([a, b, c], cw, ch);
    g.setTransform((b.x - a.x) / cw, (b.y - a.y) / cw, (c.x - a.x) / ch, (c.y - a.y) / ch, a.x, a.y);
    g.drawImage(img, sx, sy, cw, ch, -0.5, -0.5, cw + 1, ch + 1); g.restore();
    // el triángulo d-c-b: la esquina (cw,ch) del trozo en d
    const m = [(c.x - d.x) / -cw, (c.y - d.y) / -cw, (b.x - d.x) / -ch, (b.y - d.y) / -ch];
    g.save(); tri([d, c, b], cw, ch);
    g.setTransform(m[0], m[1], m[2], m[3], d.x - m[0] * cw - m[2] * ch, d.y - m[1] * cw - m[3] * ch);
    g.drawImage(img, sx, sy, cw, ch, -0.5, -0.5, cw + 1, ch + 1); g.restore();
  }
  g.restore();
}

// La madera clara de veta fina (1024 × 512, vetas a lo largo de x). Se hace la primera vez que se pide.
let maderaHecha;
export function madera() {
  return (maderaHecha ??= (() => {
    const l = k.lienzo(1024, 512), c = l.getContext("2d"), az = k.azar(31);
    const gr = c.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#e6c28a"); gr.addColorStop(1, "#cfa56a"); c.fillStyle = gr; c.fillRect(0, 0, 1024, 512);
    c.lineCap = "round";
    for (let i = 0; i < 110; i++) {
      const y = az() * 512, w = 2 + az() * 9, a = 0.05 + az() * 0.16, amp = 3 + az() * 9, f = 0.003 + az() * 0.006, ph = az() * 7, tono = az() < 0.5 ? "120,74,30" : "170,120,62";
      c.strokeStyle = `rgba(${tono},${a})`; c.lineWidth = w; c.beginPath();
      for (let x = -10; x <= 1034; x += 12) { const yy = y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3.1 + ph * 2) * amp * 0.25; x === -10 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
      c.stroke();
    }
    c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.14; c.drawImage(k.manchas, 0, 0, 1024, 512);
    return k.fijar(l);
  })());
}
// La madera puesta en una caja c (la de `caja`): arriba, en perspectiva; en los cantos, las vetas más tenues.
// caja(g, cam, c, [214, 172, 112], { textura: conMadera(cam, c) })
export function conMadera(cam, c, al = 0.9) {
  const canto = (gg) => { gg.globalCompositeOperation = "multiply"; gg.globalAlpha *= 0.4; gg.drawImage(madera(), 0, 0, 1080, 1920); };
  return {
    arriba: (gg) => imagenEnPlano(gg, cam, madera(), c.x[0], c.x[1], c.y[1], c.z[0], c.z[1], 8, 6, al),
    frente: canto, fondo: canto, izquierda: canto, derecha: canto,
  };
}

// La sombra de contacto de lo que apoya sobre un plano horizontal: base { x: [x0,x1], z: [z0,z1], y } (la huella del
// objeto, y un pelo por encima del suelo). Se dibuja antes que el objeto. op: { al, blur (px), margen (lo que asoma por
// todos los lados, para que se vea desde cualquier cámara; un 10 % del lado corto), corre: [dx, dz] (hacia dónde se
// alarga, lejos de la luz) }.
export function sombraContacto(g, cam, base, op = {}) {
  const [x0, x1] = base.x, [z0, z1] = base.z, y = base.y;
  const al = op.al ?? 0.55, m = op.margen ?? 0.1 * Math.min(x1 - x0, z1 - z0), [dx, dz] = op.corre ?? [0.45, -0.1];
  if (al <= 0.003) return;
  const Q = proy(cam, [[x0 - m, y, z0 - m + dz], [x1 + m + dx * 0.8, y, z0 - m + dz], [x1 + m + dx, y, z1 + m], [x0 - m, y, z1 + m]]); if (!Q) return;
  g.save(); g.globalAlpha *= al; g.filter = `blur(${op.blur ?? 16}px)`; poli(g, Q); g.fillStyle = "#000"; g.fill(); g.restore();
}

// La cota: lo que mide de A a B (puntos del mundo), con un tope en cada extremo, la línea a media altura y las dos
// puntas de flecha del tamaño justo. op: { arriba (vector del mundo: hacia dónde salen los topes; [0, 0.55, 0]),
// color ("r,g,b"), al, ancho, texto (la cifra, encima de la línea), letra (px) }.
export function cota(g, cam, A, B, op = {}) {
  const al = op.al ?? 1, color = op.color ?? "255,214,80", up = op.arriba ?? [0, 0.55, 0];
  if (al <= 0.003) return;
  const P = proy(cam, [A, B, sum(A, up), sum(B, up)]); if (!P) return;
  const [a, b, a2, b2] = P;
  g.save(); g.globalAlpha *= al; g.strokeStyle = `rgb(${color})`; g.lineWidth = op.ancho ?? 6; g.lineCap = "round"; g.shadowColor = `rgba(${color},0.9)`; g.shadowBlur = 18;
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a2.x, a2.y); g.moveTo(b.x, b.y); g.lineTo(b2.x, b2.y);
  const Ma = [mez(a.x, a2.x, 0.5), mez(a.y, a2.y, 0.5)], Mb = [mez(b.x, b2.x, 0.5), mez(b.y, b2.y, 0.5)];
  g.moveTo(Ma[0], Ma[1]); g.lineTo(Mb[0], Mb[1]); g.stroke();
  const dx = Mb[0] - Ma[0], dy = Mb[1] - Ma[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, h = Math.min(22, L * 0.3);
  g.fillStyle = `rgb(${color})`;
  for (const [px, py, s] of [[Ma[0], Ma[1], 1], [Mb[0], Mb[1], -1]]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + s * ux * h - uy * h * 0.45, py + s * uy * h + ux * h * 0.45); g.lineTo(px + s * ux * h + uy * h * 0.45, py + s * uy * h - ux * h * 0.45); g.closePath(); g.fill(); }
  if (op.texto) {
    // la cifra, a media línea y por encima de ella (del lado de los topes)
    const nx = mez(a2.x, b2.x, 0.5) - mez(a.x, b.x, 0.5), ny = mez(a2.y, b2.y, 0.5) - mez(a.y, b.y, 0.5), n = Math.hypot(nx, ny) || 1, s = op.letra ?? 54;
    g.font = `800 ${s}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,0.85)"; g.shadowBlur = 14;
    g.fillText(op.texto, (Ma[0] + Mb[0]) / 2 + (nx / n) * (n * 0.5 + s * 0.75), (Ma[1] + Mb[1]) / 2 + (ny / n) * (n * 0.5 + s * 0.75));
  }
  g.restore();
}
