/* «Стол фотографа»: разбросанные полароиды, плёнки, кассета, лупа и карта памяти.
   В центре — главный кадр с подписью и точками-переключателями. Предметы на столе можно подвинуть мышкой.
   Всё на CSS-переходах: без постоянного цикла анимации, кадры — лёгкие превью из assets/img/desk. */
(() => {
  const sec = document.getElementById('desk');
  if (!sec) return;
  const table = sec.querySelector('.desk__table');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = 'assets/img/desk/';

  // главный кадр: переключается точками
  const FOCUS = [
    { src: 'studio-gaze', title: 'Взгляд', note: 'студийный портрет' },
    { src: 'city-road', title: 'Туман', note: 'стрит' },
    { src: 'still-spiral', title: 'Спираль', note: 'предметная съёмка' },
    { src: 'arch-glass', title: 'Стекло и небо', note: 'архитектура' },
    { src: 'studio-red-blue', title: 'Цветной свет', note: 'студийный портрет' },
    { src: 'report-tractor', title: 'Первый снег', note: 'репортаж' },
  ];

  // описания кадров — для карточки, которая открывается по нажатию на фото
  const INFO = {
    'studio-gaze': { t: 'Взгляд', c: 'Студийный портрет', d: 'Тёплый свет из темноты и внимательный взгляд.' },
    'city-road': { t: 'Туман', c: 'Стрит', d: 'Дорога уходит в туман: линейная перспектива и тишина.' },
    'still-spiral': { t: 'Спираль', c: 'Предметная съёмка', d: 'Сотни палочек складываются в одну спираль: ритм, пойманный в кадре.' },
    'arch-glass': { t: 'Стекло и небо', c: 'Архитектура', d: 'Острая грань небоскрёба уходит в облака.' },
    'studio-red-blue': { t: 'Цветной свет', c: 'Студийный портрет', d: 'Красный и синий свет, движение и характер в одном кадре.' },
    'report-tractor': { t: 'Первый снег', c: 'Репортаж', d: 'Утро после снегопада: город просыпается и расчищает дорогу.' },
    'street-lilac': { t: 'Сирень', c: 'Уличный портрет', d: 'Красный цвет среди цветущей сирени. Весна в одном кадре.' },
    'arch-tower': { t: 'Высотка', c: 'Архитектура', d: 'Высотка в облаках и ритм городского движения.' },
    'city-taxi': { t: 'Оранжевое такси', c: 'Стрит', d: 'Старый город, летнее небо и яркий акцент на углу улицы.' },
    'studio-profile': { t: 'Профиль в темноте', c: 'Студийный портрет', d: 'Один луч света и мягкий силуэт: портрет, где говорит тишина.' },
    'report-wheel': { t: 'Колесо обозрения', c: 'Репортаж', d: 'Ленты, небо и праздник, который кружится над головой.' },
    'street-night-park': { t: 'Вечер в парке', c: 'Уличный портрет', d: 'Фонари, листва и спокойная прогулка после заката.' },
    'arch-arcade': { t: 'Ритм арок', c: 'Архитектура', d: 'Арки, свет и тени: архитектура, которая ведёт взгляд вперёд.' },
    'street-grass': { t: 'На траве', c: 'Уличный портрет', d: 'Солнце, зелень и лёгкость летнего вечера.' },
    'street-crossing': { t: 'Переход', c: 'Уличный портрет', d: 'Ночной город, знаки и девушка на пустом переходе.' },
    'studio-bw-face': { t: 'Задумчивость', c: 'Студийный портрет', d: 'Мягкий свет на лице и мысль, которую хочется разгадать.' },
    'still-elephant': { t: 'Слон и веер', c: 'Предметная съёмка', d: 'Деревянный слон и веер в тёплом луче: деталь, которая хранит историю.' },
    'city-boardwalk': { t: 'Тропа', c: 'Стрит', d: 'Деревянная тропа петляет между осенними деревьями.' },
  };
  // короткие слова не остаются висеть в конце строки
  const nb = (s) => s.replace(/(^|[\s(«])([а-яёА-ЯЁ]{1,2})\s/g, '$1$2\u00a0');

  // предметы на столе: x, y — левый верхний угол в % стола; r — поворот; w — ширина в rem; m — показывать на телефоне
  const ITEMS = [
    { t: 'pola', src: 'street-lilac', cap: 'Сирень', x: 2, y: 0, r: -12, w: 32, m: 1 },
    { t: 'pola', src: 'arch-tower', cap: 'Высотка', x: 17, y: -11, r: 8, w: 29 },
    { t: 'film', srcs: ['street-crossing', 'studio-bw-face', 'still-elephant'], x: -5, y: 44, r: -16, h: 15, m: 1 },
    { t: 'pola', src: 'city-taxi', cap: 'Оранжевое такси', x: 7, y: 46, r: 9, w: 30, m: 1 },
    { t: 'pola', src: 'studio-profile', cap: 'Профиль', x: 22, y: 24, r: -5, w: 25 },
    { t: 'can', x: 27, y: 64, r: 22, w: 22 },
    { t: 'pola', src: 'report-wheel', cap: 'Колесо обозрения', x: 63, y: -13, r: 10, w: 30, m: 1 },
    { t: 'pola', src: 'street-night-park', cap: 'Вечер в парке', x: 80, y: 1, r: -9, w: 32 },
    { t: 'film', srcs: ['city-boardwalk', 'report-tractor', 'studio-profile'], x: 60, y: 60, r: 11, h: 14, m: 1 },
    { t: 'pola', src: 'arch-arcade', cap: 'Ритм арок', x: 71, y: 32, r: 14, w: 28 },
    { t: 'loupe', x: 83, y: 41, r: -28, w: 19 },
    { t: 'sd', x: 61, y: 24, r: -18, w: 9 },
    { t: 'pola', src: 'street-grass', cap: 'На траве', x: 87, y: 49, r: -6, w: 28, m: 1 },
  ];

  const CAN = `<svg viewBox="0 0 210 92" aria-hidden="true"><path d="M150 26h52l-6 8 6 8-6 8 6 8-6 8 6 8h-52z" fill="#2b211b"/><g fill="#efdcc6" opacity=".75"><rect x="158" y="29" width="6" height="5" rx="1"/><rect x="172" y="29" width="6" height="5" rx="1"/><rect x="186" y="29" width="6" height="5" rx="1"/><rect x="158" y="60" width="6" height="5" rx="1"/><rect x="172" y="60" width="6" height="5" rx="1"/><rect x="186" y="60" width="6" height="5" rx="1"/></g><rect x="4" y="34" width="12" height="24" rx="3" fill="#180f01"/><rect x="14" y="8" width="14" height="76" rx="5" fill="#2b2626"/><rect x="24" y="10" width="112" height="72" rx="6" fill="#df600f"/><rect x="24" y="10" width="112" height="72" rx="6" fill="url(#canShade)"/><rect x="24" y="36" width="112" height="20" fill="#faf5ee"/><text x="80" y="50.5" text-anchor="middle" font-family="Georgia, serif" font-size="12" letter-spacing="2" fill="#4c4343">LM 200 · 36</text><rect x="132" y="8" width="14" height="76" rx="5" fill="#2b2626"/><defs><linearGradient id="canShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs></svg>`;
  const LOUPE = `<svg viewBox="0 0 130 130" aria-hidden="true"><rect x="76" y="80" width="16" height="50" rx="8" transform="rotate(-45 84 105)" fill="#4c4343"/><rect x="73" y="74" width="12" height="16" rx="3" transform="rotate(-45 79 82)" fill="#b4532a"/><circle cx="50" cy="50" r="40" fill="rgba(250,245,238,.28)"/><circle cx="50" cy="50" r="40" fill="none" stroke="#4c4343" stroke-width="9"/><path d="M27 38a26 26 0 0 1 18-16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`;
  const SD = `<svg viewBox="0 0 60 80" aria-hidden="true"><path d="M8 0h52v74a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V14z" fill="#2b2626"/><g fill="#d9a35a"><rect x="14" y="4" width="5" height="12" rx="1"/><rect x="22" y="4" width="5" height="12" rx="1"/><rect x="30" y="4" width="5" height="12" rx="1"/><rect x="38" y="4" width="5" height="12" rx="1"/><rect x="46" y="4" width="5" height="12" rx="1"/></g><rect x="8" y="30" width="44" height="34" rx="4" fill="#df600f"/><text x="30" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#faf5ee">64</text></svg>`;

  const img = (src) => `<img src="${P}${src}.jpg" alt="${(INFO[src] || {}).t || ''}" data-k="${src}" loading="lazy" decoding="async" draggable="false">`;
  const html = (it) => {
    if (it.t === 'pola') return `<figure class="pola">${img(it.src)}<figcaption>${it.cap}</figcaption></figure>`;
    if (it.t === 'film') return `<div class="film"><span class="film__edge">ЛИССА 200&nbsp;&nbsp;▸ 14&nbsp;&nbsp;▸ 15</span><div class="film__frames">${it.srcs.map((s) => img(s)).join('')}</div><span class="film__edge film__edge--b">▸ 16&nbsp;&nbsp;▸ 17&nbsp;&nbsp;▸ 18</span></div>`;
    if (it.t === 'can') return CAN;
    if (it.t === 'loupe') return LOUPE;
    return SD;
  };

  const els = ITEMS.map((it, i) => {
    const el = document.createElement('div');
    el.className = `desk__item desk__item--${it.t}${it.m ? '' : ' m-hide'}`;
    el.style.cssText = `left:${it.x}%;top:${it.y}%;${it.w ? `width:${it.w}rem;` : `--fh:${it.h}rem;`}--r:${it.r}deg;z-index:${i + 1};--i:${i}`;
    el.innerHTML = html(it);
    table.appendChild(el);
    return el;
  });

  // появление: предметы «высыпаются» на стол от центра, по очереди
  const scatterFrom = () => {
    const t = table.getBoundingClientRect();
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', (t.left + t.width / 2 - (r.left + r.width / 2)) * .55 + 'px');
      el.style.setProperty('--fy', (t.top + t.height / 2 - (r.top + r.height / 2)) * .55 + 'px');
    });
  };
  if (reduced || !('IntersectionObserver' in window)) sec.classList.add('is-in');
  else {
    requestAnimationFrame(scatterFrom);
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      sec.classList.add('is-in', 'is-entering');
      setTimeout(() => sec.classList.remove('is-entering'), 2200);
    }, { threshold: .08 });
    io.observe(sec);
  }

  // подвинуть предмет мышкой; взятый ложится поверх остальных
  let top = els.length + 1;
  els.forEach((el) => {
    let sx = 0, sy = 0, bx = 0, by = 0, id = null, moved = false, downImg = null;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      id = e.pointerId; el.setPointerCapture(id); moved = false; downImg = e.target.closest('img');
      sx = e.clientX; sy = e.clientY;
      bx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
      by = parseFloat(el.style.getPropertyValue('--dy')) || 0;
      el.style.zIndex = ++top;
      el.classList.add('is-drag');
      e.preventDefault();
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 5) return;
      moved = true;
      el.style.setProperty('--dx', bx + e.clientX - sx + 'px');
      el.style.setProperty('--dy', by + e.clientY - sy + 'px');
    });
    const up = (e) => { if (e.pointerId !== id) return; id = null; el.classList.remove('is-drag'); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', (e) => {
      if (moved) { moved = false; return; }
      const im = e.target.closest('img') || downImg;
      downImg = null;
      if (im && im.dataset.k) openCard(im);
    });
  });

  // карточка кадра: фото целиком, название, жанр, описание
  const dlg = document.createElement('dialog');
  dlg.className = 'dcard';
  dlg.setAttribute('aria-labelledby', 'dcard-title');
  dlg.innerHTML = '<figure class="dcard__pola"><img class="dcard__img" alt=""><figcaption><span class="dcard__cat"></span><h3 class="dcard__title" id="dcard-title"></h3><p class="dcard__text"></p></figcaption></figure><button class="dcard__close" type="button" aria-label="Закрыть">×</button>';
  document.body.appendChild(dlg);
  const dImg = dlg.querySelector('.dcard__img');
  const dPola = dlg.querySelector('.dcard__pola');
  let lastFocus = null, srcIm = null, closing = false;
  const OPEN_MS = 1100, CLOSE_MS = 850, EASE_OPEN = 'cubic-bezier(.22, 1, .36, 1)', EASE_CLOSE = 'cubic-bezier(.55, 0, .45, 1)';
  // положение карточки относительно исходного фото (откуда вылетела)
  const fromPhoto = () => {
    const a = srcIm.getBoundingClientRect(), b = dPola.getBoundingClientRect();
    const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${Math.max(.2, a.width / b.width)})`;
  };
  function openCard(im) {
    if (closing) return;
    srcIm = im;
    const k = im.dataset.k, info = INFO[k] || { t: '', c: '', d: '' };
    dImg.src = P + k + '.jpg'; dImg.alt = info.t;
    dlg.querySelector('.dcard__cat').textContent = info.c;
    dlg.querySelector('.dcard__title').textContent = info.t;
    dlg.querySelector('.dcard__text').textContent = nb(info.d);
    lastFocus = document.activeElement;
    dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    if (!reduced) {
      // карточка медленно вылетает из того места, где лежало фото, и встаёт ровно
      dPola.animate([{ transform: fromPhoto(), opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: OPEN_MS, easing: EASE_OPEN });
      dlg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: OPEN_MS * .7, easing: 'ease-out', pseudoElement: '::backdrop' });
      dClose.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: OPEN_MS * .6, easing: 'ease-out', fill: 'backwards' });
    }
    hover = true; plan();
  }
  const dClose = dlg.querySelector('.dcard__close');
  const closeCard = () => {
    if (!dlg.open || closing) return;
    if (reduced || !srcIm) { dlg.close(); return; }
    closing = true;
    // так же плавно возвращается на своё место на столе
    dClose.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
    dlg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS, easing: 'ease-in-out', fill: 'forwards', pseudoElement: '::backdrop' });
    dPola.animate([{ transform: 'none', opacity: 1 }, { transform: fromPhoto(), opacity: 0 }], { duration: CLOSE_MS, easing: EASE_CLOSE, fill: 'forwards' })
      .finished.then(() => {
        dlg.close();
        dlg.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        dPola.getAnimations().forEach((a) => a.cancel());
        dClose.getAnimations().forEach((a) => a.cancel());
        closing = false;
      });
  };
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeCard(); });   // Esc — тоже плавно
  dlg.addEventListener('close', () => { document.documentElement.style.overflow = ''; hover = false; plan(); if (lastFocus) lastFocus.focus(); });
  dClose.addEventListener('click', closeCard);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeCard(); });   // нажатие мимо карточки — закрыть

  // главный кадр и точки
  const card = sec.querySelector('.desk__focus');
  const fImg = card.querySelector('img');
  fImg.dataset.k = FOCUS[0].src;
  card.addEventListener('click', () => openCard(fImg));
  const fTitle = card.querySelector('.desk__ftitle');
  const fNote = card.querySelector('.desk__fnote');
  const dots = sec.querySelector('.desk__dots');
  dots.innerHTML = FOCUS.map((f, i) => `<button type="button" class="desk__dot" aria-label="Кадр «${f.title}»"${i ? '' : ' aria-current="true"'}></button>`).join('');
  FOCUS.forEach((f) => { const im = new Image(); im.src = P + f.src + '.jpg'; });   // заранее, чтобы смена была без задержки
  let cur = 0, auto = 0, busy = false;
  const show = (n) => {
    n = (n + FOCUS.length) % FOCUS.length;
    if (n === cur || busy) return;
    cur = n; busy = true;
    [...dots.children].forEach((d, i) => d.toggleAttribute('aria-current', i === n));
    const f = FOCUS[n];
    const swap = () => { fImg.src = P + f.src + '.jpg'; fImg.alt = f.title; fImg.dataset.k = f.src; fTitle.textContent = f.title; fNote.textContent = f.note; };
    if (reduced) { swap(); busy = false; return; }
    const tilt = (n % 2 ? 1 : -1) * 2.5;
    card.animate([{ transform: 'none' }, { transform: `translateY(-1.6rem) rotate(${tilt}deg) scale(.97)`, opacity: .0 }], { duration: 260, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })
      .finished.then(() => {
        swap();
        return card.animate([{ transform: `translateY(2rem) rotate(${-tilt}deg) scale(1.02)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }).finished;
      })
      .then(() => { card.getAnimations().forEach((a) => a.cancel()); busy = false; });
  };
  // стрелки по бокам от точек — листать кадры
  sec.querySelectorAll('.desk__arrow').forEach((b) => b.addEventListener('click', () => { show(cur + Number(b.dataset.d)); plan(); }));
  dots.addEventListener('click', (e) => { const d = e.target.closest('.desk__dot'); if (d) { show([...dots.children].indexOf(d)); plan(); } });
  dots.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    show(cur + (e.key === 'ArrowRight' ? 1 : -1)); dots.children[cur].focus(); plan();
  });
  // сам меняется раз в 5 секунд, пока страница на экране и курсор не на кадре
  let inView = false, hover = false;
  const plan = () => { clearTimeout(auto); if (!reduced && inView && !hover && !document.hidden) auto = setTimeout(() => { show(cur + 1); plan(); }, 5000); };
  card.addEventListener('pointerenter', () => { hover = true; plan(); });
  card.addEventListener('pointerleave', () => { hover = false; plan(); });
  document.addEventListener('visibilitychange', plan);
  if ('IntersectionObserver' in window) new IntersectionObserver((en) => { inView = en[0].isIntersecting; plan(); }, { threshold: .4 }).observe(sec);
})();
