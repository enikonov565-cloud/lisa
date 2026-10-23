/* Плашка «Выбирайте по душе»: лёгкое «чернильное» поле, которое само плавает и тянется за курсором.
   Порт эффекта с тёмной плашки проекта Флорис (WebGL fluid), цвета — фирменные: рыжий, кирпичный, персиковый.
   Облегчённые настройки (меньше сетка и итераций), пауза вне экрана, без анимации при reduced-motion. */
(function(){
  var canvas = document.querySelector('.sv__fx');
  var host = canvas ? canvas.closest('.sv__info') : null;
  if (!canvas || !host) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SIM_RES = 96;
  var DYE_RES = 384;
  var PRESSURE_ITERATIONS = 12;
  var PRESSURE_DECAY = 0.8;
  var VELOCITY_DISSIPATION = 0.2;
  var CURL_AT_50 = 30;
  var INJECT_RATE = 4.5;
  var SEEDS = [
    [0.28, 0.62, 140, 60],
    [0.66, 0.38, -120, 90],
    [0.5, 0.5, 40, -140]
  ];
  var DPR_CAP = 1;
  var MAX_COLORS = 5;
  var GL_RGBA16F = 0x881a;
  var GL_HALF_FLOAT = 0x140b;
  var GL_HALF_FLOAT_OES = 0x8d61;

  // фирменные цвета сайта: рыжий, кирпичный, персиковый; движение спокойнее, чем у Флориса
  var PALETTE = ['#df600f', '#efdcc6', '#b4532a', '#e9a46f'];
  var SPEED = 70, DISSIPATION = 52, SWIRL = 0, DRIFT = 100;
  var CURSOR_REACH = 46, CURSOR_FORCE = 70;
  var DISPLAY_GAIN = 1.4;
  var MAX_ALPHA = 0.42; // лёгкая дымка: тексты на плашке остаются читаемыми

  var VERT = [
    'precision highp float;',
    'attribute vec2 aPos;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    vUv = aPos * 0.5 + 0.5;',
    '    vL = vUv - vec2(uTexel.x, 0.0);',
    '    vR = vUv + vec2(uTexel.x, 0.0);',
    '    vT = vUv + vec2(0.0, uTexel.y);',
    '    vB = vUv - vec2(0.0, uTexel.y);',
    '    gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_ADVECT = [
    'precision highp float;',
    'uniform sampler2D uVel;',
    'uniform sampler2D uSrc;',
    'uniform vec2 uTexel;',
    'uniform vec2 uTexelSrc;',
    'uniform float uDt;',
    'uniform float uDiss;',
    'varying vec2 vUv;',
    '#ifdef MANUAL_FILTERING',
    'vec4 bilerp(sampler2D s, vec2 uv, vec2 tsize) {',
    '    vec2 st = uv / tsize - 0.5;',
    '    vec2 iuv = floor(st);',
    '    vec2 fuv = fract(st);',
    '    vec4 a = texture2D(s, (iuv + vec2(0.5, 0.5)) * tsize);',
    '    vec4 b = texture2D(s, (iuv + vec2(1.5, 0.5)) * tsize);',
    '    vec4 c = texture2D(s, (iuv + vec2(0.5, 1.5)) * tsize);',
    '    vec4 d = texture2D(s, (iuv + vec2(1.5, 1.5)) * tsize);',
    '    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);',
    '}',
    '#endif',
    'void main() {',
    '    vec2 coord = vUv - uDt * texture2D(uVel, vUv).xy * uTexel;',
    '    vec2 halfTexel = uTexelSrc * 0.5;',
    '    coord = clamp(coord, halfTexel, 1.0 - halfTexel);',
    '#ifdef MANUAL_FILTERING',
    '    vec4 src = bilerp(uSrc, coord, uTexelSrc);',
    '#else',
    '    vec4 src = texture2D(uSrc, coord);',
    '#endif',
    '    gl_FragColor = src / (1.0 + uDiss * uDt);',
    '}'
  ].join('\n');

  var FRAG_DIVERGENCE = [
    'precision highp float;',
    'uniform sampler2D uVel;',
    'varying vec2 vUv;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    float l = texture2D(uVel, vL).x;',
    '    float r = texture2D(uVel, vR).x;',
    '    float t = texture2D(uVel, vT).y;',
    '    float b = texture2D(uVel, vB).y;',
    '    vec2 c = texture2D(uVel, vUv).xy;',
    '    if (vL.x < 0.0) l = -c.x;',
    '    if (vR.x > 1.0) r = -c.x;',
    '    if (vT.y > 1.0) t = -c.y;',
    '    if (vB.y < 0.0) b = -c.y;',
    '    gl_FragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_CURL = [
    'precision highp float;',
    'uniform sampler2D uVel;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    float l = texture2D(uVel, vL).y;',
    '    float r = texture2D(uVel, vR).y;',
    '    float t = texture2D(uVel, vT).x;',
    '    float b = texture2D(uVel, vB).x;',
    '    gl_FragColor = vec4(0.5 * (r - l - t + b), 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_VORTICITY = [
    'precision highp float;',
    'uniform sampler2D uVel;',
    'uniform sampler2D uCurl;',
    'uniform float uCurlAmt;',
    'uniform float uDt;',
    'varying vec2 vUv;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    float l = texture2D(uCurl, vL).x;',
    '    float r = texture2D(uCurl, vR).x;',
    '    float t = texture2D(uCurl, vT).x;',
    '    float b = texture2D(uCurl, vB).x;',
    '    float c = texture2D(uCurl, vUv).x;',
    '    vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));',
    '    force /= max(length(force), 1e-4);',
    '    force *= uCurlAmt * c;',
    '    force.y *= -1.0;',
    '    vec2 vel = texture2D(uVel, vUv).xy + force * uDt;',
    '    gl_FragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_PRESSURE = [
    'precision highp float;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uDivergence;',
    'varying vec2 vUv;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    float l = texture2D(uPressure, vL).x;',
    '    float r = texture2D(uPressure, vR).x;',
    '    float t = texture2D(uPressure, vT).x;',
    '    float b = texture2D(uPressure, vB).x;',
    '    float div = texture2D(uDivergence, vUv).x;',
    '    gl_FragColor = vec4((l + r + t + b - div) * 0.25, 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_GRADIENT = [
    'precision highp float;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uVel;',
    'varying vec2 vUv;',
    'varying vec2 vL;',
    'varying vec2 vR;',
    'varying vec2 vT;',
    'varying vec2 vB;',
    'void main() {',
    '    float l = texture2D(uPressure, vL).x;',
    '    float r = texture2D(uPressure, vR).x;',
    '    float t = texture2D(uPressure, vT).x;',
    '    float b = texture2D(uPressure, vB).x;',
    '    vec2 vel = texture2D(uVel, vUv).xy - vec2(r - l, t - b);',
    '    gl_FragColor = vec4(vel, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_CLEAR = [
    'precision highp float;',
    'uniform sampler2D uTex;',
    'uniform float uValue;',
    'varying vec2 vUv;',
    'void main() {',
    '    gl_FragColor = uValue * texture2D(uTex, vUv);',
    '}'
  ].join('\n');

  var FRAG_SPLAT = [
    'precision highp float;',
    'uniform sampler2D uTarget;',
    'uniform float uAspect;',
    'uniform vec3 uColor;',
    'uniform vec2 uPoint;',
    'uniform float uRadius;',
    'varying vec2 vUv;',
    'void main() {',
    '    vec2 p = vUv - uPoint;',
    '    p.x *= uAspect;',
    '    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;',
    '    gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);',
    '}'
  ].join('\n');

  var FRAG_DISPLAY = [
    'precision highp float;',
    'uniform sampler2D uTex;',
    'uniform float uGain;',
    'uniform float uMaxA;',
    'varying vec2 vUv;',
    'void main() {',
    '    vec3 c = texture2D(uTex, vUv).rgb * uGain;',
    '    float m = max(c.r, max(c.g, c.b));',
    '    vec3 col = c / max(m, 1e-3);',
    '    float a = clamp(m / (1.0 + m * 0.8), 0.0, 1.0) * uMaxA;',
    '    gl_FragColor = vec4(col * a, a);',
    '}'
  ].join('\n');

  function parseColor(input){
    if (!input) return [0, 0, 0];
    var s = String(input).trim();
    var fn = s.match(/rgba?\(([^)]+)\)/i);
    if (fn){
      var p = fn[1].split(',').map(function(v){ return parseFloat(v.trim()); });
      return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255];
    }
    var h = s.replace('#', '');
    if (h.length === 3 || h.length === 4){
      h = h.split('').map(function(c){ return c + c; }).join('');
    }
    h = (h + '000000').slice(0, 6);
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255
    ];
  }

  function compile(gl, type, src){
    var sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
      console.warn('svFx shader:', gl.getShaderInfoLog(sh));
    }
    return sh;
  }

  function makePass(gl, frag, names, defines){
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, defines + frag);
    var prog = gl.createProgram();
    if (!vs || !fs || !prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)){
      console.warn('svFx link:', gl.getProgramInfoLog(prog));
      return null;
    }
    var u = {};
    for (var i = 0; i < names.length; i++) u[names[i]] = gl.getUniformLocation(prog, names[i]);
    return { prog: prog, u: u };
  }

  function makeTarget(gl, w, h, fmt){
    var tex = gl.createTexture();
    var fbo = gl.createFramebuffer();
    if (!tex || !fbo) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, fmt.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, fmt.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, fmt.format, fmt.type, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex: tex, fbo: fbo, w: w, h: h, texelX: 1 / w, texelY: 1 / h };
  }

  function makeDouble(gl, w, h, fmt){
    var a = makeTarget(gl, w, h, fmt);
    var b = makeTarget(gl, w, h, fmt);
    if (!a || !b) return null;
    var d = { read: a, write: b, swap: function(){ var t = d.read; d.read = d.write; d.write = t; } };
    return d;
  }

  var opts = { alpha: true, antialias: false, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false };
  var isGL2 = true;
  var gl = canvas.getContext('webgl2', opts);
  if (!gl){ isGL2 = false; gl = canvas.getContext('webgl', opts); }
  if (!gl) return;

  var linear = false, renderable = false;
  if (isGL2){
    renderable = !!gl.getExtension('EXT_color_buffer_float');
    if (!renderable) renderable = !!gl.getExtension('EXT_color_buffer_half_float');
    linear = !!gl.getExtension('OES_texture_float_linear') || renderable;
  } else {
    renderable = !!gl.getExtension('OES_texture_half_float') && !!gl.getExtension('EXT_color_buffer_half_float');
    linear = !!gl.getExtension('OES_texture_half_float_linear');
  }
  if (!renderable){
    console.warn('svFx: no renderable half-float target');
    return;
  }

  var fmt = {
    internal: isGL2 ? GL_RGBA16F : gl.RGBA,
    format: gl.RGBA,
    type: isGL2 ? GL_HALF_FLOAT : GL_HALF_FLOAT_OES,
    filter: linear ? gl.LINEAR : gl.NEAREST
  };
  var defines = linear ? '' : '#define MANUAL_FILTERING\n';

  var advect = makePass(gl, FRAG_ADVECT, ['uVel', 'uSrc', 'uTexel', 'uTexelSrc', 'uDt', 'uDiss'], defines);
  var divergence = makePass(gl, FRAG_DIVERGENCE, ['uVel', 'uTexel'], '');
  var curl = makePass(gl, FRAG_CURL, ['uVel', 'uTexel'], '');
  var vorticity = makePass(gl, FRAG_VORTICITY, ['uVel', 'uCurl', 'uCurlAmt', 'uDt', 'uTexel'], '');
  var pressure = makePass(gl, FRAG_PRESSURE, ['uPressure', 'uDivergence', 'uTexel'], '');
  var gradient = makePass(gl, FRAG_GRADIENT, ['uPressure', 'uVel', 'uTexel'], '');
  var clearPass = makePass(gl, FRAG_CLEAR, ['uTex', 'uValue', 'uTexel'], '');
  var splat = makePass(gl, FRAG_SPLAT, ['uTarget', 'uAspect', 'uColor', 'uPoint', 'uRadius', 'uTexel'], '');
  var display = makePass(gl, FRAG_DISPLAY, ['uTex', 'uGain', 'uMaxA', 'uTexel'], '');
  if (!advect || !divergence || !curl || !vorticity || !pressure || !gradient || !clearPass || !splat || !display) return;

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function blit(target){
    if (target){
      gl.viewport(0, 0, target.w, target.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function bind(tex, unit){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    return unit;
  }

  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  var vel = null, dye = null, prs = null, div = null, crl = null, aspect = 1, built = '';

  function dispose(){
    var all = [
      vel ? vel.read : null, vel ? vel.write : null,
      dye ? dye.read : null, dye ? dye.write : null,
      prs ? prs.read : null, prs ? prs.write : null,
      div, crl
    ];
    for (var i = 0; i < all.length; i++){
      var t = all[i];
      if (!t) continue;
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    }
    vel = dye = prs = null;
    div = crl = null;
  }

  function buildTargets(w, h){
    var key = w + 'x' + h;
    if (key === built) return;
    dispose();
    aspect = w / Math.max(1, h);
    var simW = aspect >= 1 ? Math.round(SIM_RES * aspect) : SIM_RES;
    var simH = aspect >= 1 ? SIM_RES : Math.round(SIM_RES / aspect);
    var dyeW = aspect >= 1 ? Math.round(DYE_RES * aspect) : DYE_RES;
    var dyeH = aspect >= 1 ? DYE_RES : Math.round(DYE_RES / aspect);
    vel = makeDouble(gl, simW, simH, fmt);
    dye = makeDouble(gl, dyeW, dyeH, fmt);
    prs = makeDouble(gl, simW, simH, fmt);
    div = makeTarget(gl, simW, simH, fmt);
    crl = makeTarget(gl, simW, simH, fmt);
    built = key;
  }

  var cssW = 0, cssH = 0;
  function resize(){
    var dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    cssW = canvas.clientWidth || host.clientWidth || 0;
    cssH = canvas.clientHeight || host.clientHeight || 0;
    var w = Math.max(1, Math.round(cssW * dpr));
    var h = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== w || canvas.height !== h){
      canvas.width = w;
      canvas.height = h;
    }
    buildTargets(w, h);
  }
  resize();
  var ro = new ResizeObserver(function(){ resize(); });
  ro.observe(canvas);

  var pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, down: 0, moved: 0 };
  function onMove(e){
    var r = host.getBoundingClientRect();
    var w = host.offsetWidth || 1;
    var h = host.offsetHeight || 1;
    var nx = (e.clientX - r.left) / Math.max(1, r.width);
    var ny = 1 - (e.clientY - r.top) / Math.max(1, r.height);
    if (pointer.moved){
      pointer.dx += (nx - pointer.x) * w;
      pointer.dy += (ny - pointer.y) * h;
    }
    pointer.x = nx;
    pointer.y = ny;
    pointer.moved = 1;
  }
  function onLeave(){ pointer.moved = 0; pointer.down = 0; }
  function onDown(){ pointer.down = 1; }
  function onUp(){ pointer.down = 0; }
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('pointerdown', onDown);
  host.addEventListener('pointercancel', onUp);
  window.addEventListener('pointerup', onUp);

  var raf = 0, running = false, last = 0, clock = 0, colorPhase = 0, seeded = false, ax = 0.5, ay = 0.5;

  function doSplat(px, py, fx, fy, col, radius, ink){
    if (!vel || !dye) return;
    gl.useProgram(splat.prog);
    gl.uniform1f(splat.u.uAspect, aspect);
    gl.uniform2f(splat.u.uPoint, px, py);
    gl.uniform1f(splat.u.uRadius, radius);

    gl.uniform1i(splat.u.uTarget, bind(vel.read.tex, 0));
    gl.uniform3f(splat.u.uColor, fx, fy, 0);
    blit(vel.write);
    vel.swap();

    gl.uniform1i(splat.u.uTarget, bind(dye.read.tex, 0));
    gl.uniform3f(splat.u.uColor, col[0] * ink, col[1] * ink, col[2] * ink);
    blit(dye.write);
    dye.swap();
  }

  function frame(now){
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dtReal = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;

    if (cssW <= 0 || cssH <= 0){
      resize();
      if (cssW <= 0 || cssH <= 0) return;
    }
    if (!vel || !dye || !prs || !div || !crl) return;

    var scale = Math.max(0, SPEED) / 50;
    var dt = dtReal * scale;
    clock += dt;

    var pal = PALETTE.slice(0, MAX_COLORS);
    colorPhase += dt * 0.25;
    function pick(t){
      var i = Math.floor(Math.abs(t) * pal.length) % pal.length;
      var c = parseColor(pal[i]);
      return [c[0], c[1], c[2]];
    }

    var r = 0.008 + (Math.max(0, CURSOR_REACH) / 100) * 0.16;
    var radius = r * r;

    if (!seeded){
      seeded = true;
      for (var i = 0; i < SEEDS.length; i++){
        var s = SEEDS[i];
        doSplat(s[0], s[1], s[2], s[3], pick(i / SEEDS.length), radius, 1.1);
      }
    }

    var p = pointer;
    if (p.moved && (Math.abs(p.dx) > 0.01 || Math.abs(p.dy) > 0.01)){
      var gain = (CURSOR_FORCE / 100) * 0.9 * (1 + p.down);
      doSplat(p.x, p.y, p.dx * gain, p.dy * gain, pick(colorPhase + p.x), radius, dtReal * INJECT_RATE);
    }
    p.dx = 0;
    p.dy = 0;

    if (DRIFT > 0){
      var nx = 0.5 + 0.32 * Math.sin(clock * 0.55) * Math.cos(clock * 0.17);
      var ny = 0.5 + 0.28 * Math.sin(clock * 0.43 + 1.7);
      var w = cssW || 1;
      var h = cssH || 1;
      var fx = (nx - ax) * w * (DRIFT / 100) * 1.6;
      var fy = (ny - ay) * h * (DRIFT / 100) * 1.6;
      ax = nx;
      ay = ny;
      if (Math.abs(fx) > 0.01 || Math.abs(fy) > 0.01){
        doSplat(nx, ny, fx, fy, pick(colorPhase), radius * 0.8, dtReal * INJECT_RATE * (DRIFT / 100));
      }
    }

    function setTexel(pass, t){ gl.uniform2f(pass.u.uTexel, t.texelX, t.texelY); }

    gl.useProgram(curl.prog);
    setTexel(curl, vel.read);
    gl.uniform1i(curl.u.uVel, bind(vel.read.tex, 0));
    blit(crl);

    gl.useProgram(vorticity.prog);
    setTexel(vorticity, vel.read);
    gl.uniform1i(vorticity.u.uVel, bind(vel.read.tex, 0));
    gl.uniform1i(vorticity.u.uCurl, bind(crl.tex, 1));
    gl.uniform1f(vorticity.u.uCurlAmt, (SWIRL / 50) * CURL_AT_50);
    gl.uniform1f(vorticity.u.uDt, dt);
    blit(vel.write);
    vel.swap();

    gl.useProgram(divergence.prog);
    setTexel(divergence, vel.read);
    gl.uniform1i(divergence.u.uVel, bind(vel.read.tex, 0));
    blit(div);

    gl.useProgram(clearPass.prog);
    setTexel(clearPass, prs.read);
    gl.uniform1i(clearPass.u.uTex, bind(prs.read.tex, 0));
    gl.uniform1f(clearPass.u.uValue, PRESSURE_DECAY);
    blit(prs.write);
    prs.swap();

    gl.useProgram(pressure.prog);
    setTexel(pressure, prs.read);
    gl.uniform1i(pressure.u.uDivergence, bind(div.tex, 0));
    for (var it = 0; it < PRESSURE_ITERATIONS; it++){
      gl.uniform1i(pressure.u.uPressure, bind(prs.read.tex, 1));
      blit(prs.write);
      prs.swap();
    }

    gl.useProgram(gradient.prog);
    setTexel(gradient, vel.read);
    gl.uniform1i(gradient.u.uPressure, bind(prs.read.tex, 0));
    gl.uniform1i(gradient.u.uVel, bind(vel.read.tex, 1));
    blit(vel.write);
    vel.swap();

    gl.useProgram(advect.prog);
    setTexel(advect, vel.read);
    gl.uniform2f(advect.u.uTexelSrc, vel.read.texelX, vel.read.texelY);
    gl.uniform1f(advect.u.uDt, dt);
    gl.uniform1f(advect.u.uDiss, VELOCITY_DISSIPATION);
    gl.uniform1i(advect.u.uVel, bind(vel.read.tex, 0));
    gl.uniform1i(advect.u.uSrc, bind(vel.read.tex, 0));
    blit(vel.write);
    vel.swap();

    gl.uniform2f(advect.u.uTexel, vel.read.texelX, vel.read.texelY);
    gl.uniform2f(advect.u.uTexelSrc, dye.read.texelX, dye.read.texelY);
    gl.uniform1f(advect.u.uDiss, (Math.max(1, DISSIPATION) / 100) * 2.2);
    gl.uniform1i(advect.u.uVel, bind(vel.read.tex, 0));
    gl.uniform1i(advect.u.uSrc, bind(dye.read.tex, 1));
    blit(dye.write);
    dye.swap();

    gl.useProgram(display.prog);
    gl.uniform2f(display.u.uTexel, dye.read.texelX, dye.read.texelY);
    gl.uniform1i(display.u.uTex, bind(dye.read.tex, 0));
    gl.uniform1f(display.u.uGain, DISPLAY_GAIN);
    gl.uniform1f(display.u.uMaxA, MAX_ALPHA);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function start(){
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop(){
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && canvas.offsetParent) { resize(); start(); } else stop();
      });
    }, { threshold: 0.05 });
    io.observe(host);
  } else {
    start();
  }
})();
