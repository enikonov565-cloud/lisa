/* «Ribbon Glow» (по мотивам Originkit) — фон тёмной карточки гарантий.
   Светящиеся ленты в фирменных тонах с минимальной интенсивностью,
   при наведении ленты мягко закручиваются вокруг курсора.
   Чистый WebGL2, без библиотек; без WebGL2 карточка остаётся просто графитовой. */

const CFG = {
  background: '#4c4343',  // графитовый фон карточки
  color1: '#7a3a12',      // глубокий тон фирменного оранжевого
  color2: '#dea988',      // персиковый
  intensity: 0.32,        // минимальная яркость лент (1 — как в оригинале)
  speed: 1,
  size: 1,
  angle: -Math.PI,
  hover: 1,
  reach: 160,             // радиус «закрутки» вокруг курсора, px
};

const MAX_DPR = 2;

const VERT = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;

const FIELD = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uSize;
uniform float uAngle;
uniform vec2 uMouse;
uniform float uOn;
uniform float uReach;
uniform vec2 uVel;
uniform float uIntensity;
out vec4 o;

const float LAYERS = 84.0;
const float TWIST = 1.25;
const float DRAG = 0.18;
const float GAIN = 0.62;
const vec2 CENTRE = vec2(-0.62, 0.24);
const float TILT = 0.6;
const float ZOOM = 1.05;
const float THETA = 2.13;
const float SHEAR = 0.963;
const float SHRINK = 0.953;
const vec2 WARP_FREQ = vec2(0.42, 2.4);
const vec2 WARP_AMP = vec2(0.13, 0.027);
const vec2 ASPECT = vec2(2.1, 0.17);
const float OFFSET = 0.36;
const float GLOW = 0.0021;
const float SOFT = 0.0019;
const float FALLOFF = 0.37;
const float PHASE = 12.0;
const float CYCLE = 0.16;
const float HUE_TRAVEL = 2.0;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

void main() {
  vec2 R = uRes;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;

  vec2 d = pos - uMouse;
  float w = uOn * exp(-dot(d, d) / (uReach * uReach));
  if (w > 1e-4) pos = uMouse + rot(w * TWIST) * d * (1.0 - 0.3 * min(w, 1.0)) - uVel * min(w, 1.0) * DRAG;

  pos = rot(uAngle) * pos / uSize;
  float t = uTime * 0.49 + PHASE;
  float breath = (-sin(uTime * 0.735) + sin(uTime * 0.49 + 1.0)) * 0.25 + 0.5;
  vec2 u = rot(TILT) * ((pos - CENTRE) * (ZOOM - breath * 0.085));
  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  vec3 col = vec3(0.0);
  for (float i = 1.0; i <= LAYERS; i += 1.0) {
    u.x -= sin(u.y * WARP_FREQ.x + t + i * 0.007) * WARP_AMP.x;
    u.y -= sin(u.x * WARP_FREQ.y - t + i * 0.02) * WARP_AMP.y;
    u = fold * u * SHRINK;
    vec2 q = (u - vec2(OFFSET + breath * 0.1, 0.0)) * ASPECT;
    float g = GLOW / (dot(q, q) + SOFT) * (0.25 + breath * 0.4);
    float r = length(u);
    float k = sin(i * CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    col += g * mix(uC1, uC2, k) * (0.62 + 0.5 * k) * exp2(-r * FALLOFF);
  }
  vec3 x = max(col * GAIN * uIntensity, 0.0);
  col = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.85, 0.92, 0.98));
  col *= 1.0 - smoothstep(0.5, 1.6, length(pos)) * 0.07;
  o = vec4(col, 1.0);
}
`;

const FINISH = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform float uPaper;
out vec4 o;

float ign(vec2 p, float f) { p += 5.588238 * mod(f, 64.0); return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 L = max(texture(uField, frag / uRes).rgb, 0.0);
  vec3 dark = uBg + L * (1.0 - uBg);
  float strength = clamp(max(L.r, max(L.g, L.b)), 0.0, 1.0);
  vec3 paper = uBg * (1.0 - strength) + L * 0.96;
  vec3 col = mix(dark, paper, uPaper);
  col += (ign(frag, floor(uTime * 24.0)) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

function program(gl, frag) {
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('RibbonGlow:', gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

function init() {
  const card = document.querySelector('.guarantee');
  if (!card) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.className = 'guarantee__bg';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false });
  if (!gl) return;
  card.prepend(canvas);

  const field = program(gl, FIELD);
  const finish = program(gl, FINISH);
  if (!field || !finish) { canvas.remove(); return; }
  const loc = (p, names) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)]));
  const uf = loc(field, ['uRes', 'uTime', 'uC1', 'uC2', 'uSize', 'uAngle', 'uMouse', 'uOn', 'uReach', 'uVel', 'uIntensity']);
  const un = loc(finish, ['uField', 'uRes', 'uTime', 'uBg', 'uPaper']);
  gl.bindVertexArray(gl.createVertexArray());

  // поле считаем в половинном разрешении — дешевле, ленты всё равно мягкие
  const fbo = gl.createFramebuffer();
  let tex = null, tw = 0, th = 0;
  let half = !!gl.getExtension('EXT_color_buffer_float');
  const resizeTarget = (w, h) => {
    if (w === tw && h === th && tex) return;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (tex) gl.deleteTexture(tex);
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, half ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, half ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (ok || !half) break;
      half = false;
    }
    tw = w; th = h;
  };

  // курсор над карточкой
  const ptr = { x: 0, y: 0, inside: false };
  const read = (e) => {
    const r = card.getBoundingClientRect();
    ptr.x = e.clientX - r.left;
    ptr.y = e.clientY - r.top;
    ptr.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };
  window.addEventListener('pointermove', read, { passive: true });
  card.addEventListener('pointerleave', () => { ptr.inside = false; });

  const c1 = hex(CFG.color1), c2 = hex(CFG.color2), bg = hex(CFG.background);
  const bgLum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];

  let mx = 0, my = 0, vx = 0, vy = 0, on = 0, raf = 0, last = -1, clock = 0, running = false;

  const render = (now) => {
    raf = requestAnimationFrame(render);
    const dt = last < 0 ? 0 : clamp((now - last) / 1000, 0, 0.05);
    last = now;
    if (!reduced) clock = (clock + dt * CFG.speed) % 3600;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const cw = canvas.clientWidth || 1;
    const ch = canvas.clientHeight || 1;
    const bw = Math.max(1, Math.round(cw * dpr));
    const bh = Math.max(1, Math.round(ch * dpr));
    if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
    resizeTarget(Math.max(1, Math.round(bw / 2)), Math.max(1, Math.round(bh / 2)));

    const present = ptr.inside && !reduced ? 1 : 0;
    if (present && on < 0.02) { mx = ptr.x; my = ptr.y; }
    on += (present - on) * (1 - Math.exp(-dt * 5));
    const k = 1 - Math.exp(-dt * 16);
    const nx = mx + (ptr.x - mx) * k;
    const ny = my + (ptr.y - my) * k;
    if (dt > 0) {
      const kv = 1 - Math.exp(-dt * 8);
      vx += ((nx - mx) / dt - vx) * kv;
      vy += ((ny - my) / dt - vy) * kv;
    }
    mx = nx; my = ny;
    const vLen = Math.hypot(vx, vy) / ch;
    const vCap = vLen > 3 ? 3 / vLen : 1;

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, tw, th);
    gl.useProgram(field);
    gl.uniform2f(uf.uRes, tw, th);
    gl.uniform1f(uf.uTime, clock);
    gl.uniform3f(uf.uC1, c1[0], c1[1], c1[2]);
    gl.uniform3f(uf.uC2, c2[0], c2[1], c2[2]);
    gl.uniform1f(uf.uSize, CFG.size);
    gl.uniform1f(uf.uAngle, CFG.angle);
    gl.uniform2f(uf.uMouse, (mx - cw / 2) / ch, (ch / 2 - my) / ch);
    gl.uniform1f(uf.uOn, on * CFG.hover);
    gl.uniform1f(uf.uReach, CFG.reach / ch);
    gl.uniform2f(uf.uVel, (vx / ch) * vCap, (-vy / ch) * vCap);
    gl.uniform1f(uf.uIntensity, CFG.intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, bw, bh);
    gl.useProgram(finish);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(un.uField, 0);
    gl.uniform2f(un.uRes, bw, bh);
    gl.uniform1f(un.uTime, clock);
    gl.uniform3f(un.uBg, bg[0], bg[1], bg[2]);
    gl.uniform1f(un.uPaper, clamp((bgLum - 0.35) / 0.3, 0, 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const start = () => { if (running) return; running = true; last = -1; raf = requestAnimationFrame(render); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  // рисуем только пока карточка на экране
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(card);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else {
      const r = card.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) start();
    }
  });
  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('has-ribbon')));
}

init();
