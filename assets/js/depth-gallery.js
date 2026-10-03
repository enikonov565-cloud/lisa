/* Depth gallery на первом экране.
   Адаптация «Atmospheric Depth Gallery» (Houmahani Kane, Codrops, MIT):
   https://github.com/houmahani/codrops-depth-gallery
   Отличия от оригинала: работает внутри рамки портрета, камера летит сквозь фото
   сама (по кругу), колесо мыши не перехватывается; фон-шейдер переливается
   только фирменными цветами сайта. */
import * as THREE from '../vendor/three/three.module.min.js';

/* ---------------- настройки ---------------- */
const BRAND = {
  ink: '#4c4343',
  orange: '#df600f',
  peach: '#dea988',
  milk: '#faf5ee',
  stone: '#cdcbc7',
  copper: '#c4643a',   // медный — в цвет волос на фото
  olive: '#8a8d3c',    // оливковый акцент
};

// каждое фото задаёт свою «атмосферу» фона — всё в пределах фирменной палитры
const PHOTOS = [
  { src: 'assets/img/depth-1.jpg', x: 0,     mood: { background: BRAND.copper, blob1: BRAND.peach, blob2: BRAND.orange } },
  { src: 'assets/img/depth-2.jpg', x: 0,     mood: { background: BRAND.peach, blob1: BRAND.orange, blob2: BRAND.milk } },
  { src: 'assets/img/depth-3.jpg', x: 0,     mood: { background: BRAND.milk,  blob1: BRAND.peach,  blob2: BRAND.stone } },
];

const CFG = {
  gap: 5,                 // расстояние между фото по глубине
  viewOffset: 5,          // на каком расстоянии камера останавливается перед фото
  dwell: 3400,            // мс — сколько камера «смотрит» на фото
  travel: 2300,           // мс — перелёт к следующему
  fadeSmoothing: 0.14,
  parallaxX: 0.16,
  parallaxY: 0.08,
  parallaxSmoothing: 0.08,
  breathTilt: 0.045,
  breathScale: 0.03,
  breathSmoothing: 0.14,
  cornerRadius: 0.14,     // скругление углов фото (в единицах сцены)
  photoFill: 0.84,        // какую часть бывшей рамки занимает фото
  photoScale: 2,          // во сколько раз фото крупнее исходного (ограничено высотой экрана и надписями)
  glowX: 1.35,            // радиус мягкого «облака» вокруг фото по горизонтали (в ширинах портрета)
  glowY: 0.95,            // и по вертикали (в высотах портрета)
  blobRadius: 0.65,
  blobRadius2Ratio: 0.78,
  blobStrength: 0.9,
  noise: 0.04,
};

/* ---------------- шейдеры ---------------- */
const bgVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const bgFragment = /* glsl */ `
varying vec2 vUv;
uniform vec3 uBackgroundColor;
uniform vec3 uBlob1Color;
uniform vec3 uBlob2Color;
uniform float uNoiseStrength;
uniform float uBlobRadius;
uniform float uBlobRadiusSecondary;
uniform float uBlobStrength;
uniform float uTime;
uniform float uVelocityIntensity;
uniform vec2 uCenter;   // центр портрета в uv холста
uniform vec2 uFrame;    // размер портрета в долях холста

float random(vec2 coord) {
  return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec3 color = uBackgroundColor;
  // координаты «как в квадратной рамке оригинала», но холст шире рамки
  vec2 f = (vUv - uCenter) / uFrame + 0.5;
  float animTime = uTime * 0.00028;
  vec2 blob1Center = vec2(
    0.50 + sin(animTime * 1.000) * 0.13 + sin(animTime * 1.618) * 0.05,
    0.48 + cos(animTime * 0.794) * 0.09 + cos(animTime * 1.272) * 0.03
  );
  vec2 blob2Center = vec2(
    0.35 + cos(animTime * 0.927) * 0.11 + cos(animTime * 1.414) * 0.04,
    0.55 + sin(animTime * 1.175) * 0.07 + sin(animTime * 0.618) * 0.03
  );
  float blob1 = smoothstep(uBlobRadius, 0.0, distance(f, blob1Center));
  float blob2 = smoothstep(uBlobRadiusSecondary, 0.0, distance(f, blob2Center));
  vec3 blob1SoftColor = mix(uBlob1Color, uBackgroundColor, 0.35);
  vec3 blob2SoftColor = mix(uBlob2Color, uBackgroundColor, 0.35);
  color = mix(color, blob1SoftColor, blob1 * uBlobStrength);
  color = mix(color, blob2SoftColor, blob2 * uBlobStrength);
  color += uVelocityIntensity * 0.10;
  float grain = random(vUv * vec2(1387.13, 947.91)) - 0.5;
  color += grain * uNoiseStrength;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const planeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// фото с мягко скруглёнными углами
const planeFragment = /* glsl */ `
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uOpacity;
uniform vec2 uSize;
uniform float uRadius;
void main() {
  vec2 p = (vUv - 0.5) * uSize;
  vec2 q = abs(p) - (uSize * 0.5 - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float edge = 1.0 - smoothstep(-0.006, 0.006, d);
  vec4 tex = texture2D(uMap, vUv);
  gl_FragColor = vec4(tex.rgb, edge * uOpacity);
}`;

/* ---------------- утилиты ---------------- */
const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSpeedMax = 1.5; // максимум производной easeInOutCubic

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

/* При открытии index.html двойным щелчком (file://) браузер не даёт WebGL читать
   локальные картинки. На этот случай фото подгружаются встроенными (data URI)
   из depth-images.js; на хостинге используются обычные файлы. */
function imageSources() {
  const direct = PHOTOS.map((p) => p.src);
  if (location.protocol !== 'file:') return Promise.resolve(direct);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'assets/js/depth-images.js';
    s.onload = () => resolve(direct.map((src) => (window.__DEPTH_IMAGES || {})[src] || src));
    s.onerror = () => resolve(direct);
    document.head.appendChild(s);
  });
}

/* ---------------- галерея ---------------- */
async function init() {
  const host = document.querySelector('.hero__photo');   // место портрета в вёрстке
  const stage = document.querySelector('.hero');          // холст растянут на весь первый экран
  if (!host || !stage || !webglAvailable()) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // цвета и текстуры берём «как есть» (sRGB), без линейной конверсии — фирменные цвета без искажений
  THREE.ColorManagement.enabled = false;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  /* фон */
  const bgColors = {
    background: new THREE.Color(PHOTOS[0].mood.background),
    blob1: new THREE.Color(PHOTOS[0].mood.blob1),
    blob2: new THREE.Color(PHOTOS[0].mood.blob2),
  };
  const tmp = { a: new THREE.Color(), b: new THREE.Color() };
  const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: bgVertex,
    fragmentShader: bgFragment,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uBackgroundColor: { value: bgColors.background },
      uBlob1Color: { value: bgColors.blob1 },
      uBlob2Color: { value: bgColors.blob2 },
      uNoiseStrength: { value: CFG.noise },
      uBlobRadius: { value: CFG.blobRadius },
      uBlobRadiusSecondary: { value: CFG.blobRadius * CFG.blobRadius2Ratio },
      uBlobStrength: { value: CFG.blobStrength },
      uTime: { value: 0 },
      uVelocityIntensity: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uFrame: { value: new THREE.Vector2(1, 1) },
    },
  });
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial));

  /* текстуры */
  const loader = new THREE.TextureLoader();
  let textures;
  try {
    const sources = await imageSources();
    textures = await Promise.all(sources.map((src) => loader.loadAsync(src)));
  } catch (e) {
    canvas.remove();
    return;
  }
  textures.forEach((t) => {
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  });

  /* плоскости: 1 → 2 → 3 → копия 1, чтобы цикл замыкался бесшовно */
  const sequence = [...PHOTOS.keys(), 0];
  const geometry = new THREE.PlaneGeometry(1, 1);
  const planes = sequence.map((photoIndex, i) => {
    const tex = textures[photoIndex];
    const aspect = tex.image.width / tex.image.height;
    const material = new THREE.ShaderMaterial({
      vertexShader: planeVertex,
      fragmentShader: planeFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uMap: { value: tex },
        uOpacity: { value: i === 0 ? 1 : 0 },
        uSize: { value: new THREE.Vector2(aspect, 1) },
        uRadius: { value: CFG.cornerRadius },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { aspect, x: PHOTOS[photoIndex].x, mood: PHOTOS[photoIndex].mood, opacity: i === 0 ? 1 : 0 };
    mesh.position.set(0, 0, -i * CFG.gap);
    scene.add(mesh);
    return mesh;
  });
  const last = planes.length - 1;

  /* размеры */
  let baseHeight = 3;
  const px = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const resize = () => {
    const W = stage.clientWidth || 1;
    const H = stage.clientHeight || 1;
    const s = stage.getBoundingClientRect();
    const r = host.getBoundingClientRect();          // бывшая рамка — эталон «исходного» размера фото
    const pad = parseFloat(getComputedStyle(stage).paddingRight) || 0;
    renderer.setSize(W, H, false);

    const maxAspect = Math.max(...planes.map((p) => p.userData.aspect));
    // исходный размер фото (как было в рамке) × photoScale
    const want = Math.min(r.height, r.width / 1.24) * CFG.photoFill * CFG.photoScale;   // 1.24 — пропорция прежнего широкого кадра

    // правый край реального текста (заголовок и плашки)
    const textRight = [...document.querySelectorAll('.hero__title .t-word, .tags .flip')]
      .reduce((m, el) => Math.max(m, el.getBoundingClientRect().right), -Infinity) - s.left;
    const textBox = document.querySelector('.hero__text')?.getBoundingClientRect();
    const sideBySide = textBox && isFinite(textRight) && textBox.bottom > r.top && textBox.top < r.bottom;

    let cx, cy, photoPx;
    const swing = Math.max(...PHOTOS.map((p) => Math.abs(p.x))) / 3;   // смещение фото при пролёте, доля высоты
    if (sideBySide) {
      // десктоп: фото прижато к правому полю, по высоте — между шапкой и нижней строкой
      const header = document.querySelector('.header');
      const bar = document.querySelector('.hero__bar');
      const top = (header ? header.offsetHeight : 0) + px(0.8);
      const bottom = (bar ? bar.getBoundingClientRect().top - s.top : H) - px(2);
      const left = textRight + px(4);
      const right = W - pad;
      // десктоп: фото занимает всю высоту между шапкой и нижней строкой — без пустых полос
      photoPx = Math.min(bottom - top, (right - left) / (maxAspect + 2 * swing));
      cx = right - photoPx * (maxAspect / 2 + swing);
      cy = (top + bottom) / 2;
    } else {
      // телефон/планшет: фото на месте рамки над заголовком
      cx = r.left - s.left + r.width / 2;
      cy = r.top - s.top + r.height / 2;
      photoPx = Math.min(want, r.height * 0.96, (W - 2 * pad) / (maxAspect + 2 * swing));
    }
    photoPx = Math.max(80, photoPx);

    // внецентренная проекция: точка схода в центре фото — фото стоит на своём месте,
    // а цветной фон растекается по всему первому экрану
    const Fw = 2 * Math.max(cx, W - cx);
    const Fh = 2 * Math.max(cy, H - cy);
    camera.aspect = Fw / Fh;
    camera.setViewOffset(Fw, Fh, Fw / 2 - cx, Fh / 2 - cy, W, H);
    camera.updateProjectionMatrix();

    const visH = 2 * CFG.viewOffset * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    baseHeight = photoPx / (Fh / visH);
    planes.forEach((p) => p.material.uniforms.uSize.value.set(p.userData.aspect * baseHeight, baseHeight));
    // скругление углов фото — 20px на экране, как у всех фото и плашек сайта
    const radiusUnits = 20 / (Fh / visH);
    planes.forEach((p) => { p.material.uniforms.uRadius.value = radiusUnits; });

    // фон-шейдер: пятна кружат вокруг фото
    const photoW = photoPx * maxAspect;
    bgMaterial.uniforms.uCenter.value.set(cx / W, 1 - cy / H);
    bgMaterial.uniforms.uFrame.value.set((photoW * 1.3) / W, (photoPx * 1.05) / H);

    // мягкая растушёвка: облако вокруг фото, гаснет к краям первого экрана и под надписями
    canvas.style.setProperty('--cx', cx + 'px');
    canvas.style.setProperty('--cy', cy + 'px');
    canvas.style.setProperty('--rx', Math.max(photoW * CFG.glowX, cx - pad) + 'px');
    canvas.style.setProperty('--ry', Math.min(photoPx * CFG.glowY, cy, H - cy) + 'px');
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  ro.observe(host);

  /* курсор → параллакс */
  const pointerTarget = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  window.addEventListener('pointermove', (e) => {
    pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => pointerTarget.set(0, 0));

  /* цикл */
  const cycle = CFG.dwell + CFG.travel;
  const loopLength = cycle * (planes.length - 1);
  let elapsed = 0;
  let lastNow = performance.now();
  let lastProgress = 0;
  let breath = 0;
  let running = false;
  let rafId = 0;

  const progressAt = (ms) => {
    const t = ms % loopLength;
    const seg = Math.floor(t / cycle);
    const inSeg = t - seg * cycle;
    const k = inSeg <= CFG.dwell ? 0 : easeInOutCubic(clamp((inSeg - CFG.dwell) / CFG.travel, 0, 1));
    return seg + k;
  };

  const frame = (now) => {
    rafId = requestAnimationFrame(frame);
    const dt = clamp(now - lastNow, 0, 64); // после паузы вкладки не «прыгаем»; первый кадр бывает «из прошлого»
    lastNow = now;
    if (!reduced) elapsed += dt;

    let progress = progressAt(elapsed);
    // замыкание цикла: копия первого фото = первое фото, сбрасываем прозрачности без вспышки
    if (progress < lastProgress - 0.5) {
      planes.forEach((p, i) => { p.userData.opacity = i === 0 ? 1 : 0; });
    }
    const speed = Math.abs(progress - lastProgress) / Math.max(dt, 1) * CFG.travel; // в долях от макс. скорости
    lastProgress = progress;
    const velocity = clamp(speed / easeSpeedMax, 0, 1);

    // камера
    camera.position.set(0, 0, CFG.viewOffset - progress * CFG.gap);

    // смешение «настроений» фона
    const cur = clamp(Math.floor(progress), 0, last);
    const next = Math.min(cur + 1, last);
    const blend = progress - cur;
    const m1 = planes[cur].userData.mood;
    const m2 = planes[next].userData.mood;
    bgColors.background.set(m1.background).lerp(tmp.a.set(m2.background), blend);
    bgColors.blob1.set(m1.blob1).lerp(tmp.a.set(m2.blob1), blend);
    bgColors.blob2.set(m1.blob2).lerp(tmp.b.set(m2.blob2), blend);

    // вне середины перелёта фон «дышит» от скорости, как в оригинале
    const stability = THREE.MathUtils.smoothstep(Math.abs(blend - 0.5) * 2, 0.35, 1);
    bgMaterial.uniforms.uVelocityIntensity.value = lerp(bgMaterial.uniforms.uVelocityIntensity.value, velocity * stability, 0.1);
    bgMaterial.uniforms.uBlobRadius.value = CFG.blobRadius + (progress / last) * 0.08;
    bgMaterial.uniforms.uBlobRadiusSecondary.value = bgMaterial.uniforms.uBlobRadius.value * CFG.blobRadius2Ratio;
    bgMaterial.uniforms.uTime.value = now;

    // фото: прозрачность, параллакс, «дыхание»
    pointer.lerp(pointerTarget, CFG.parallaxSmoothing);
    breath = lerp(breath, velocity, CFG.breathSmoothing);
    planes.forEach((p, i) => {
      let target = 0;
      if (i === cur) target = 1 - blend;
      if (i === next) target = Math.max(target, blend);
      p.userData.opacity = lerp(p.userData.opacity, target, CFG.fadeSmoothing);
      const o = p.userData.opacity;
      p.material.uniforms.uOpacity.value = o;
      p.visible = o > 0.002;

      const depthInfluence = 1 + i * 0.05;
      // параллакс от курсора только в пролёте: в покое каждое фото стоит на одном и том же месте
      const motion = clamp(breath * 1.5, 0, 1);
      p.position.x = p.userData.x * baseHeight / 3 + pointer.x * CFG.parallaxX * o * depthInfluence * motion;
      p.position.y = pointer.y * CFG.parallaxY * o * depthInfluence * motion;
      p.position.z = -i * CFG.gap;

      const b = breath * o;
      p.rotation.x = -pointer.y * CFG.breathTilt * b;
      p.rotation.y = pointer.x * CFG.breathTilt * b;
      const s = 1 + CFG.breathScale * b;
      p.scale.set(p.userData.aspect * baseHeight * s, baseHeight * s, 1);
    });

    renderer.clear(true, true, true);
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
  };

  const start = () => {
    if (running) return;
    running = true;
    lastNow = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  // рисуем только пока первый экран виден
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (stage.getBoundingClientRect().bottom > 0) start();
  });

  // первый кадр готов → плавно показываем холст поверх статичного фото
  start();
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-webgl')));
}

init();
