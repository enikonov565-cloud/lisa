/* Лисса Миляева — фотограф. Поведение страницы. */
(() => {
  'use strict';

  // сайт всегда открывается с первого экрана: без восстановления прокрутки и без якоря в адресе
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  toTop();
  window.addEventListener('load', toTop, { once: true });
  window.addEventListener('pageshow', (e) => { if (e.persisted) toTop(); });

  /* ----------------------------------------------------------------------
     НАСТРОЙКИ — всё, что Лисса может поменять сама
     ---------------------------------------------------------------------- */
  const CONTACTS = {
    telegram: 'vasilisa_elkina',          // ник без @
    phone: '+7 (900) 000-00-00',          // как показывать
    email: 'hello@vasilisa-elkina.ru',
  };

  const SERVICES = [
    {
      title: 'Репортажное фото',
      text: 'события, праздники и живые моменты без постановки',
      price: 'от 12 000 ₽',
      img: 'assets/img/w/report-wheel.jpg',
      alt: 'Колесо обозрения и праздничные ленты на фоне неба',
      includes: ['до 3 часов на событии', '60 кадров в обработке', 'готовые файлы за 5 дней'],
    },
    {
      title: 'Архитектура',
      text: 'здания, интерьеры, линии города и свет',
      price: 'от 4 000 ₽',
      img: 'assets/img/w/arch-arcade.jpg',
      alt: 'Галерея арок, уходящая вдаль: ведущий ритм в архитектуре',
      includes: ['съёмка здания или интерьера', '15 кадров с выверенной перспективой', 'готовые файлы за 7 дней'],
    },
    {
      title: 'Стрит-фотография',
      text: 'случайные моменты, которые больше не повторятся',
      price: 'от 6 000 ₽',
      img: 'assets/img/w/city-boardwalk.jpg',
      alt: 'Деревянная тропа между осенними деревьями в городе',
      includes: ['прогулка по городу 1,5 часа', '25 кадров в обработке', 'готовые файлы за 7 дней'],
    },
    {
      title: 'Студийный портрет',
      text: 'свет, характер, персональный и деловой образ',
      price: 'от 8 000 ₽',
      img: 'assets/img/w/studio-green.jpg',
      alt: 'Портрет в зелёном свете с длинной выдержкой',
      includes: ['1 час в студии', '15 кадров в ретуши', 'помощь с образом и позированием'],
    },
    {
      title: 'Уличный портрет',
      text: 'естественный свет и живой город вокруг героя',
      price: 'от 7 000 ₽',
      img: 'assets/img/w/street-alley.jpg',
      alt: 'Девушка идёт по осенней аллее в свете фонарей',
      includes: ['1 час съёмки на локации', '20 кадров в обработке', 'подбор локации и времени света'],
    },
  ];

  // разделы галереи — те же, что в услугах
  const WORK_CATS = ['Репортаж', 'Студийный портрет', 'Уличный портрет', 'Архитектура', 'Стрит'];
  const WORKS = [
    { src: 'assets/img/w/studio-profile.jpg', cat: 'Студийный портрет', title: 'Профиль в темноте', alt: 'Чёрно-белый профиль девушки в луче света', desc: 'Один луч света и мягкий силуэт: портрет, где говорит тишина.', size: 'tall' },
    { src: 'assets/img/w/city-road.jpg', cat: 'Стрит', title: 'Туман', alt: 'Пустая дорога уходит в утренний туман', desc: 'Дорога уходит в туман: линейная перспектива и тишина.' },
    { src: 'assets/img/w/street-lilac.jpg', cat: 'Уличный портрет', title: 'Сирень', alt: 'Девушка в красном среди цветущей сирени', desc: 'Красный цвет среди цветущей сирени. Весна в одном кадре.', size: 'tall' },
    { src: 'assets/img/w/arch-tower.jpg', cat: 'Архитектура', title: 'Высотка', alt: 'Сталинская высотка в облаках над эстакадой', desc: 'Высотка в облаках и ритм городского движения.', size: 'tall' },
    { src: 'assets/img/w/report-tractor.jpg', cat: 'Репортаж', title: 'Первый снег', alt: 'Трактор расчищает заснеженную аллею', desc: 'Утро после снегопада: город просыпается и расчищает дорогу.', size: 'tall' },
    { src: 'assets/img/w/studio-red-blue.jpg', cat: 'Студийный портрет', title: 'Цветной свет', alt: 'Портрет юноши в красном и синем свете', desc: 'Красный и синий свет, движение и характер в одном кадре.' },
    { src: 'assets/img/w/street-night-park.jpg', cat: 'Уличный портрет', title: 'Вечер в парке', alt: 'Девушка в парке под вечерними фонарями', desc: 'Фонари, листва и спокойная прогулка после заката.', size: 'tall' },
    { src: 'assets/img/w/city-taxi.jpg', cat: 'Стрит', title: 'Оранжевое такси', alt: 'Оранжевое такси на улице старого города', desc: 'Старый город, летнее небо и яркий акцент на углу улицы.', size: 'tall' },
    { src: 'assets/img/w/arch-glass.jpg', cat: 'Архитектура', title: 'Стекло и небо', alt: 'Грань стеклянного небоскрёба в облаках', desc: 'Острая грань небоскрёба уходит в облака.', size: 'tall' },
    { src: 'assets/img/w/studio-bw-sit.jpg', cat: 'Студийный портрет', title: 'Тишина', alt: 'Чёрно-белый портрет юноши на тёмном фоне', desc: 'Спокойный взгляд и уверенные руки: чёрно-белая тишина.', size: 'tall' },
    { src: 'assets/img/w/report-wheel.jpg', cat: 'Репортаж', title: 'Колесо обозрения', alt: 'Колесо обозрения и праздничные ленты', desc: 'Ленты, небо и праздник, который кружится над головой.', size: 'tall' },
    { src: 'assets/img/w/street-crossing.jpg', cat: 'Уличный портрет', title: 'Переход', alt: 'Девушка на ночном пешеходном переходе', desc: 'Ночной город, знаки и девушка на пустом переходе.', size: 'tall' },
    { src: 'assets/img/w/still-elephant.jpg', cat: 'Репортаж', title: 'Слон и веер', alt: 'Деревянный слон на фоне веера в тёмной студии', desc: 'Деревянный слон и веер в тёплом луче: деталь, которая хранит историю.' },
    { src: 'assets/img/w/still-bottles.jpg', cat: 'Репортаж', title: 'Флаконы', alt: 'Тёмные флаконы в мягком боковом свете', desc: 'Матовые флаконы и тонкий блик. Тишина, в которой видна форма.', size: 'tall' },
    { src: 'assets/img/w/still-spiral.jpg', cat: 'Репортаж', title: 'Спираль', alt: 'Спираль из деревянных палочек на тёмном фоне', desc: 'Сотни палочек складываются в одну спираль: ритм, пойманный в кадре.' },
    { src: 'assets/img/w/studio-bw-face.jpg', cat: 'Студийный портрет', title: 'Задумчивость', alt: 'Чёрно-белый портрет девушки, подпершей щёку рукой', desc: 'Мягкий свет на лице и мысль, которую хочется разгадать.' },
    { src: 'assets/img/w/arch-arcade.jpg', cat: 'Архитектура', title: 'Ведущий ритм', alt: 'Галерея арок, уходящая вдаль', desc: 'Арки, свет и тени: архитектура, которая ведёт взгляд вперёд.', size: 'tall' },
    { src: 'assets/img/w/city-boardwalk.jpg', cat: 'Стрит', title: 'Тропа', alt: 'Деревянная тропа между осенними деревьями', desc: 'Деревянная тропа петляет между осенними деревьями.', size: 'tall' },
    { src: 'assets/img/w/street-grass.jpg', cat: 'Уличный портрет', title: 'На траве', alt: 'Девушка в красном сидит на зелёной траве', desc: 'Солнце, зелень и лёгкость летнего вечера.', size: 'tall' },
    { src: 'assets/img/w/studio-bw-hands.jpg', cat: 'Студийный портрет', title: 'Руки и взгляд', alt: 'Чёрно-белый портрет с браслетами и кольцами', desc: 'Браслеты, кольца и прямой взгляд: характер в деталях.', size: 'tall' },
    { src: 'assets/img/w/arch-metro.jpg', cat: 'Архитектура', title: 'Своды', alt: 'Расписные своды подземного перехода', desc: 'Узор, свет и изгибы: архитектура в деталях.', size: 'tall' },
    { src: 'assets/img/w/street-curls.jpg', cat: 'Уличный портрет', title: 'Кудри', alt: 'Девушка с кудрявыми волосами на фоне города', desc: 'Город за спиной и живой, открытый взгляд.', size: 'tall' },
    { src: 'assets/img/w/studio-gaze.jpg', cat: 'Студийный портрет', title: 'Взгляд', alt: 'Портрет девушки в мягком свете на тёмном фоне', desc: 'Тёплый свет из темноты и внимательный взгляд.', size: 'tall' },
    { src: 'assets/img/w/street-alley.jpg', cat: 'Уличный портрет', title: 'Аллея', alt: 'Девушка идёт по осенней аллее в свете фонарей', desc: 'Осенняя аллея в свете фонарей и шаг навстречу.', size: 'tall' },
    { src: 'assets/img/w/studio-green.jpg', cat: 'Студийный портрет', title: 'Зелёный свет', alt: 'Портрет в зелёном свете с длинной выдержкой', desc: 'Длинная выдержка и цветной свет: портрет в движении.' },
  ];

  // точка фокуса каждого кадра (по вертикали, %): при обрезке в кадре остаются лица и главное
  const FOCUS = { 'studio-profile': 30, 'street-night-park': 60, 'street-crossing': 62, 'street-alley': 40, 'report-tractor': 70, 'street-lilac': 18, 'street-grass': 50, 'studio-gaze': 30, 'street-curls': 28, 'report-wheel': 40, 'arch-metro': 45, 'arch-glass': 50, 'arch-tower': 40, 'city-taxi': 62, 'city-boardwalk': 62, 'studio-bw-sit': 25, 'studio-bw-hands': 35, 'arch-arcade': 50, 'still-bottles': 75 };
  const focusOf = (src) => { const m = /\/w\/([\w-]+)\.jpg/.exec(src || ''); return 'center ' + (m && FOCUS[m[1]] != null ? FOCUS[m[1]] : 50) + '%'; };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- header ---------------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- кнопка «связаться с фотографом» ----------------
     Радиальная заливка: тёмный круг раскрывается из точки входа курсора
     и сворачивается в точку выхода. Тактильность: крышка проседает на подложку. */
  const cta = $('#cta3d');
  if (cta) {
    const reveal = $('.cta3d__reveal', cta);
    let full = false;
    let anim = null;
    const shape = (r, x, y) => 'circle(' + r + '% at ' + x + '% ' + y + '%)';
    // круг растёт/сжимается через Web Animations: можно прервать на полпути без рывка
    const grow = (from, to) => {
      if (anim) anim.cancel();
      reveal.style.clipPath = to;
      if (reduced) return;
      anim = reveal.animate([{ clipPath: from }, { clipPath: to }], { duration: 450, easing: 'ease-in-out' });
    };
    const anchor = (e) => {
      const b = reveal.getBoundingClientRect();
      const px = e.clientX - b.left;
      const py = e.clientY - b.top;
      const unit = Math.hypot(b.width, b.height) / Math.SQRT2;
      const far = Math.max(Math.hypot(px, py), Math.hypot(b.width - px, py), Math.hypot(px, b.height - py), Math.hypot(b.width - px, b.height - py));
      return { x: (px / b.width) * 100, y: (py / b.height) * 100, max: (far / unit) * 100 + 2 };
    };
    cta.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      const a = anchor(e);
      grow(shape(0, a.x, a.y), shape(a.max, a.x, a.y));   // раскрываемся из точки входа
      full = true;
    });
    cta.addEventListener('pointerleave', (e) => {
      cta.classList.remove('is-pressed');
      if (!full) return;
      const a = anchor(e);
      grow(shape(a.max, a.x, a.y), shape(0, a.x, a.y));   // сворачиваемся в точку выхода
      full = false;
    });
    cta.addEventListener('pointerdown', () => cta.classList.add('is-pressed'));
    ['pointerup', 'pointercancel'].forEach((ev) => window.addEventListener(ev, () => cta.classList.remove('is-pressed')));
  }

  /* ---------------- burger menu ---------------- */
  const burger = $('#burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
  $('#menu-veil').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------------- reveal on scroll ---------------- */
  // первый экран показываем сразу, остальное — по мере прокрутки
  requestAnimationFrame(() => $$('.hero .rv').forEach((el) => el.classList.add('in')));
  const rvs = $$('.rv:not(.hero .rv)');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.08 });
    rvs.forEach((el) => io.observe(el));
  } else {
    rvs.forEach((el) => el.classList.add('in'));
  }

  /* ---------------- falling text: жанры на главном экране ----------------
     Слова «репортаж · портрет · архитектура · стрит» появляются по очереди: буквы мягко
     «падают» сверху, вся строка держится, плавно растворяется — и цикл повторяется. */
  const FALL = {
    startY: "-0.9em",   // откуда падают буквы
    stagger: 45,        // задержка между буквами, мс
    inDur: 1300,        // длительность падения одной буквы
    wordGap: 450,       // через сколько начинает падать следующее слово
    hold: 3200,         // сколько строка видна целиком
    outDur: 700,        // растворение
    outStagger: 18,
    outWordGap: 160,
    gap: 600,           // пауза перед новым циклом
    easeIn: "cubic-bezier(.22, 1.12, .36, 1)", // мягкая пружина с лёгким «доводом»
    easeOut: "cubic-bezier(.4, 0, .2, 1)",
  };
  const FALL_TARGETS = ".hero__genres a"; // надписи с эффектом

  const splitChars = (el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/(\s+)/).map((w) => {
      if (!w) return "";
      if (/^\s+$/.test(w)) return "<span aria-hidden=\"true\"> </span>";
      return `<span class="fall__word" aria-hidden="true">${Array.from(w).map((c) => `<span class="fall__char">${c}</span>`).join("")}</span>`;
    }).join("");
    return $$(".fall__char", el);
  };

  const fallItems = $$(FALL_TARGETS).map((el) => ({ el, chars: splitChars(el) }));

  if (fallItems.length && !reduced && "animate" in Element.prototype) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    fallItems.forEach(({ chars }) => chars.forEach((c) => { c.style.opacity = "0"; }));

    const appear = (chars, delay) => Promise.all(chars.map((c, i) => c.animate(
      [{ transform: `translateY(${FALL.startY})`, opacity: 0, filter: "blur(3px)" },
       { transform: "translateY(0)", opacity: 1, filter: "blur(0)" }],
      { duration: FALL.inDur, delay: delay + i * FALL.stagger, easing: FALL.easeIn, fill: "forwards" },
    ).finished));

    const vanish = (chars, delay) => Promise.all(chars.map((c, i) => c.animate(
      [{ transform: "translateY(0)", opacity: 1, filter: "blur(0)" },
       { transform: "translateY(.35em)", opacity: 0, filter: "blur(3px)" }],
      { duration: FALL.outDur, delay: delay + i * FALL.outStagger, easing: FALL.easeOut, fill: "forwards" },
    ).finished));

    let running = false;
    let visibleNow = false;
    const loop = async () => {
      if (running) return;
      running = true;
      while (visibleNow) {
        await Promise.all(fallItems.map(({ chars }, w) => appear(chars, w * FALL.wordGap)));
        await wait(FALL.hold);
        await Promise.all(fallItems.map(({ chars }, w) => vanish(chars, w * FALL.outWordGap)));
        await wait(FALL.gap);
      }
      running = false;
    };

    // крутим цикл только пока строка на экране
    new IntersectionObserver(([e]) => {
      visibleNow = e.isIntersecting;
      if (visibleNow) loop();
    }, { threshold: 0.5 }).observe(fallItems[0].el.closest("ul"));
  }

  /* ---------------- заголовок первого экрана: буквы по отдельности для «дыхания» ---------------- */
  const heroTitle = $(".hero__title");
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    let n = 0;
    heroTitle.setAttribute("aria-label", text);
    heroTitle.innerHTML = text.split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? " "
      : `<span class="t-word" aria-hidden="true">${Array.from(w).map((ch) => `<span class="t-char" style="--i:${n++}">${ch}</span>`).join("")}</span>`)).join("");
  }

  /* ---------------- text carousel: «Лисса Миляева — [фотограф]» ----------------
     Буквы по очереди уезжают вверх, пилюля плавно меняет ширину,
     новое слово поднимается снизу. Слова — в data-texts в index.html. */
  const ROT = { interval: 2600, dur: 450, stagger: 30, ease: 'cubic-bezier(.33, 1, .68, 1)' };
  const rot = $('.rot');
  if (rot) {
    const texts = rot.dataset.texts.split('|');
    const name = rot.closest('.hero__name');
    const badge = $('.rot__badge', rot);
    const content = $('.rot__content', rot);
    const sr = $('#rot-sr');
    const padX = () => parseFloat(getComputedStyle(badge).paddingLeft);
    const render = (t) => {
      content.innerHTML = '<b>' + Array.from(t).map((ch) => '<span class="rot__char">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>').join('') + '</b>';
      return $$('.rot__char', content);
    };
    const fit = () => { badge.style.width = content.scrollWidth + padX() * 2 + 'px'; };
    let idx = 0;
    let chars = render(texts[0]);
    // резервируем место под самое длинное слово, чтобы строка не «гуляла»
    const init = () => {
      name.style.minWidth = '';
      let max = 0;
      texts.forEach((t) => { render(t); max = Math.max(max, content.scrollWidth); });
      const prefix = $('.hero__prefix', name).getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(name).columnGap) || 0;
      name.style.minWidth = Math.ceil(prefix + gap + max + padX() * 2) + 'px';
      chars = render(texts[idx]);
      fit();
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
    window.addEventListener('resize', init);

    if (!reduced && 'animate' in Element.prototype && texts.length > 1) {
      let busy = false;
      setInterval(async () => {
        if (busy) return;
        busy = true;
        await Promise.all(chars.map((ch, i) => ch.animate(
          [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-120%)', opacity: 0 }],
          { duration: ROT.dur, delay: i * ROT.stagger, easing: ROT.ease, fill: 'forwards' },
        ).finished));
        idx = (idx + 1) % texts.length;
        chars = render(texts[idx]);
        sr.textContent = texts[idx];
        fit();
        await Promise.all(chars.map((ch, i) => ch.animate(
          [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: ROT.dur, delay: i * ROT.stagger, easing: ROT.ease, fill: 'backwards' },
        ).finished));
        busy = false;
      }, ROT.interval);
    }
  }

  /* ---------------- плашки-перевёртыши на главном ----------------
     По очереди переворачиваются на цветную сторону, держатся и так же
     по очереди возвращаются — цикл повторяется, пока hero на экране. */
  const FLIP = { step: 380, hold: 2800, rest: 2400 };
  // лёгкое подпрыгивание плашки в момент переворота
  const hop = (el) => el.animate([
    { transform: "translateY(0)" },
    { transform: "translateY(-0.7rem)", offset: 0.3 },
    { transform: "translateY(0)", offset: 0.58 },
    { transform: "translateY(-0.22rem)", offset: 0.76 },
    { transform: "translateY(0)" },
  ], { duration: 900, easing: "cubic-bezier(.33, 0, .3, 1)" });
  const flips = $$('.tags .flip');
  if (flips.length && !reduced) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let flipRunning = false;
    let flipVisible = false;
    const flipLoop = async () => {
      if (flipRunning) return;
      flipRunning = true;
      await wait(1200); // даём первому экрану проявиться
      while (flipVisible) {
        for (const f of flips) { f.classList.add('is-flipped'); hop(f); await wait(FLIP.step); }
        await wait(FLIP.hold);
        for (const f of flips) { f.classList.remove('is-flipped'); hop(f); await wait(FLIP.step); }
        await wait(FLIP.rest);
      }
      flipRunning = false;
    };
    new IntersectionObserver(([e]) => {
      flipVisible = e.isIntersecting;
      if (flipVisible) flipLoop();
    }, { threshold: 0.3 }).observe($('.tags'));
  }

  /* ---------------- «Crystal Glow»: заголовок карточки гарантий и ссылка «мои работы» ----------------
     На телефоне наведения нет, поэтому эффект сам проигрывается, пока карточка на экране:
     сначала заголовок, следом ссылка. */
  const glows = $$('.guarantee .glow');
  if (glows.length && !reduced) {
    let glowTimer = 0;
    const playOne = (el) => {
      el.classList.remove('is-play');
      void el.offsetWidth;                   // перезапуск искорок
      el.classList.add('is-play');
      setTimeout(() => el.classList.remove('is-play'), 1600);
    };
    const play = () => glows.forEach((el, i) => setTimeout(() => playOne(el), i * 900));
    new IntersectionObserver(([e]) => {
      clearInterval(glowTimer);
      if (e.isIntersecting) { setTimeout(play, 600); glowTimer = setInterval(play, 6500); }
    }, { threshold: 0.5 }).observe($('.guarantee'));
  }

  /* ---------------- пункты гарантий: поочерёдное появление по кругу ----------------
     Пункты по одному проявляются, держатся, вместе плавно растворяются — и снова.
     Цикл крутится, только пока карточка на экране. */
  const guarantee = $('.guarantee');
  if (guarantee) {
    if ('IntersectionObserver' in window && !reduced) {
      const LIST = { appear: 6200, hold: 3200, vanish: 2900, pause: 1000 };   // мс, согласовано с CSS
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      let listVisible = false;
      let listRunning = false;
      const listLoop = async () => {
        if (listRunning) return;
        listRunning = true;
        while (listVisible) {
          guarantee.classList.remove('list-out');
          guarantee.classList.add('list-in');
          await wait(LIST.appear + LIST.hold);
          guarantee.classList.replace('list-in', 'list-out');
          await wait(LIST.vanish + LIST.pause);
        }
        listRunning = false;
      };
      new IntersectionObserver(([e]) => {
        listVisible = e.isIntersecting;
        if (listVisible) listLoop();
      }, { threshold: 0.35 }).observe(guarantee);
    } else {
      guarantee.classList.add('list-in');
    }
  }

  /* ---------------- бегущая строка: переворот плашки в центре экрана ----------------
     Каждый кадр смотрим, какая плашка проходит через середину окна, и переворачиваем её.
     Работает, только пока строка на экране. */
  const marquee = $('.marquee');
  let mflips = $$('.marquee .mflip');
  /* бесшовная бегущая строка: наборов плашек ровно столько, чтобы закрыть экран любой ширины,
     сдвиг — ровно на длину одного набора, поэтому круг замыкается без пробела и рывка */
  if (marquee && !reduced) {
    const track = $('.marquee__track', marquee);
    const proto = $('.marquee__list', track);
    const SPEED = 55;                       // px в секунду — спокойно, как раньше
    let anim = null;
    const build = () => {
      const progress = anim ? (anim.currentTime % anim.effect.getTiming().duration) / anim.effect.getTiming().duration : 0;
      if (anim) anim.cancel();
      $$('.marquee__list', track).forEach((l, i) => { if (i) l.remove(); });
      const w = proto.getBoundingClientRect().width;
      if (!w) return;
      const need = Math.ceil((marquee.clientWidth + w) / w) + 1;
      for (let i = 1; i < need; i++) {
        const c = proto.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      }
      mflips = $$('.marquee .mflip');
      const dur = (w / SPEED) * 1000;
      anim = track.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-w}px)` }], { duration: dur, iterations: Infinity, easing: 'linear' });
      anim.currentTime = progress * dur;
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
    let rT = 0;
    window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(build, 150); });
    marquee.addEventListener('mouseenter', () => anim && anim.pause());
    marquee.addEventListener('mouseleave', () => anim && anim.play());
  }
  if (marquee && mflips.length && !reduced) {
    let mRaf = 0;
    const tick = () => {
      mRaf = requestAnimationFrame(tick);
      const mid = window.innerWidth / 2;
      // ближайшая к центру плашка (так перевёрнута всегда одна, даже когда центр в промежутке)
      let best = null, bestD = Infinity;
      mflips.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = el; }
      });
      mflips.forEach((el) => el.classList.toggle('is-center', el === best));
    };
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(mRaf);
      if (e.isIntersecting) mRaf = requestAnimationFrame(tick);
    }).observe(marquee);
  }

  /* ---------------- карточки «О чём мои кадры»: переворот ----------------
     Нажатие переворачивает карточку. Обратно в исходное положение она возвращается сама:
     когда курсор уходит с карточки, через несколько секунд (для телефона),
     когда переворачивают другую карточку или экран уходит из вида. */
  const GENRE_BACK_DELAY = 6000;   // мс — сколько описание держится без взаимодействия
  const genreCards = $$('.genre').map((card) => {
    const front = $('.genre__front', card);
    const back = $('.genre__back', card);
    const toFront = $('.genre__front .genre__toggle', card);
    const backBtns = $$('.genre__back .genre__toggle, .genre__back .genre__more', card);
    let timer = 0;
    let mouseInside = false;   // пока мышь на карточке, описание не закрываем
    const api = { card, flipped: false };
    const arm = (ms) => { clearTimeout(timer); timer = setTimeout(() => (mouseInside ? arm(ms) : api.set(false, false)), ms); };
    api.set = (flipped, moveFocus = true) => {
      clearTimeout(timer);
      if (api.flipped === flipped) return;
      api.flipped = flipped;
      card.classList.toggle('is-flipped', flipped);
      toFront.setAttribute('aria-expanded', String(flipped));
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
      toFront.tabIndex = flipped ? -1 : 0;
      backBtns.forEach((b) => { b.tabIndex = flipped ? 0 : -1; });
      if (moveFocus && card.contains(document.activeElement)) (flipped ? backBtns[0] : toFront).focus({ preventScroll: true });
      if (flipped) arm(GENRE_BACK_DELAY);
    };
    toFront.addEventListener('click', () => {
      genreCards.forEach((g) => { if (g !== api) g.set(false, false); });   // открыта всегда одна
      api.set(true);
    });
    $('.genre__back .genre__toggle', card).addEventListener('click', () => api.set(false));
    // курсор ушёл — через мгновение карточка возвращается; вернулся — ждём дальше
    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      mouseInside = false;
      if (api.flipped) arm(700);
    });
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') mouseInside = true;
    });
    // фокус ушёл с карточки (Tab дальше) — возвращаем
    card.addEventListener('focusout', (e) => {
      if (api.flipped && !card.contains(e.relatedTarget) && e.relatedTarget) api.set(false, false);
    });
    return api;
  });
  const genresSection = $('.genres');
  if (genresSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) genreCards.forEach((g) => g.set(false, false));
    }, { threshold: 0 }).observe(genresSection);
  }

  /* ---------------- «можно добавить»: всплывающее окно ---------------- */
  const extrasBtn = $('.extras-btn');
  const extrasDlg = $('#extras-dialog');
  if (extrasBtn && extrasDlg) {
    const openDlg = () => {
      if (typeof extrasDlg.showModal === 'function') extrasDlg.showModal();
      else extrasDlg.setAttribute('open', '');
    };
    const closeDlg = () => {
      if (typeof extrasDlg.close === 'function') extrasDlg.close();
      else extrasDlg.removeAttribute('open');
    };
    extrasBtn.addEventListener('click', openDlg);
    $('.extras-dialog__close', extrasDlg).addEventListener('click', closeDlg);
    $('.extras-dialog__cta', extrasDlg).addEventListener('click', closeDlg);
    // клик по затемнению вокруг окна закрывает его
    extrasDlg.addEventListener('click', (e) => { if (e.target === extrasDlg) closeDlg(); });
    extrasDlg.addEventListener('close', () => extrasBtn.focus({ preventScroll: true }));
  }

  /* ---------------- services ---------------- */
  const list = $('#svc-list');
  // цвет обратной стороны плашки у каждой услуги — как в бегущей строке и карточках
  const SVC_COLORS = [
    ['var(--milk)', 'var(--orange)'],          // репортажное фото
    ['#e8925a', 'var(--ink-deep)'],             // архитектура
    ['var(--olive, #8a8d3c)', 'var(--ink-deep)'], // стрит
    ['#c4643a', 'var(--milk)'],                 // студийный портрет
    ['var(--orange)', 'var(--milk)'],           // уличный портрет
  ];
  const card = {
    kicker: $('#svc-kicker'), price: $('#svc-price'),
    includes: $('#svc-includes'), order: $('#svc-order'),
  };
  list.innerHTML = SERVICES.map((s, i) => `
    <li class="svc__item rv" style="--d:${i * 0.06}s" tabindex="0" data-i="${i}" aria-label="${s.title}, ${s.price}">
      <span class="flip" style="--back:${SVC_COLORS[i][0]};--back-ink:${SVC_COLORS[i][1]}"><span class="flip__inner"><span class="chip flip__face flip__front">${s.title}</span><span class="chip flip__face flip__back" aria-hidden="true">${s.title}</span></span></span>
      <p>${s.text}</p>
    </li>`).join('');

  /* фото услуги: «Cursor Image Gallery» — сдвиг кадров, стрелка-курсор, точки */
  const svcGallery = (() => {
    const box = $('.svc-photo');
    const track = $('.svc-photo__track', box);
    const cursor = $('.svc-cursor', box);
    const dotsBox = $('.svc-dots', box);
    const DUR = 600;
    const EASE = 'cubic-bezier(0.42, 0, 0.58, 1)';
    const count = SERVICES.length;
    let index = -1;
    let layer = null;
    let sliding = false;
    let queued = null;
    let side = 'none';
    let pointer = null;
    dotsBox.innerHTML = SERVICES.map(() => '<span></span>').join('');
    const dots = $$('span', dotsBox);
    SERVICES.forEach((s) => { const im = new Image(); im.src = s.img; });   // заранее, чтобы сдвиг был без пустоты
    const make = (i, x) => {
      const el = document.createElement('div');
      el.className = 'svc-photo__layer';
      el.style.backgroundImage = 'url("' + SERVICES[i].img + '")';
      el.style.backgroundPosition = focusOf(SERVICES[i].img);
      el.style.transform = 'translateX(' + x + ')';
      track.appendChild(el);
      return el;
    };
    const sideFor = (relX, w) => {
      if (w <= 0) return 'none';
      if (relX < w / 2) return index > 0 ? 'left' : 'none';
      return index < count - 1 ? 'right' : 'none';
    };
    const paintSide = () => {
      box.classList.toggle('has-side', side !== 'none');
      box.classList.toggle('side-left', side === 'left');
    };
    // «падающие буквы» (как «репортаж · портрет · архитектура · стрит» на главном экране)
    const fallPrice = (el) => {
      const text = el.textContent.trim();
      el.setAttribute("aria-label", text);
      el.innerHTML = "<span class=\"fall__word\" aria-hidden=\"true\">" +
        Array.from(text).map((c) => (/\s/.test(c) ? "<span class=\"fall__sp\"></span>" : "<span class=\"fall__char\">" + c + "</span>")).join("") + "</span>";
      if (reduced || !("animate" in Element.prototype)) return;
      $$(".fall__char", el).forEach((c, i) => {
        c.style.opacity = "0";
        c.animate(
          [{ transform: "translateY(" + FALL.startY + ")", opacity: 0, filter: "blur(3px)" },
           { transform: "translateY(0)", opacity: 1, filter: "blur(0)" }],
          { duration: FALL.inDur, delay: i * FALL.stagger * 1.6, easing: FALL.easeIn, fill: "forwards" },
        );
      });
    };
    // первый показ цены — когда плашка попадает на экран
    const priceEl = $(".svc-card__price");
    if (priceEl && "IntersectionObserver" in window) {
      const pio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { fallPrice(priceEl); pio.disconnect(); } }, { threshold: 0.6 });
      pio.observe(priceEl);
    }
    const cardParts = () => $$('.svc-card__kicker, .svc-card__price, .svc-card__list');
    const swapCard = (fill, dir) => {
      // половина сдвига фото — старый текст уходит, вторая половина — новый въезжает с той же стороны
      const parts = cardParts();
      const half = DUR / 2;
      parts.forEach((p) => p.animate(
        p.classList.contains("svc-card__price")
          ? [{ opacity: 1, transform: "translateY(0)", filter: "blur(0)" }, { opacity: 0, transform: "translateY(.35em)", filter: "blur(3px)" }]   // цена растворяется, как жанры
          : [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(' + (-dir * 2) + 'rem)' }],
        { duration: half, easing: 'cubic-bezier(0.42, 0, 1, 1)', fill: 'forwards' },
      ));
      // по таймеру, а не по .finished: текст обновится, даже если анимации браузер приостановил
      setTimeout(() => {
        fill();
        cardParts().forEach((p) => {
          p.getAnimations().forEach((a) => a.cancel());
          if (p.classList.contains("svc-card__price")) { fallPrice(p); return; }   // цена — буквами, как жанры на главном экране
          p.animate(
            [{ opacity: 0, transform: 'translateX(' + (dir * 2) + 'rem)' }, { opacity: 1, transform: 'translateX(0)' }],
            { duration: half, easing: 'cubic-bezier(0, 0, 0.58, 1)' },
          );
        });
      }, half);
    };
    let queuedFill = null;
    const go = (i, fill) => {
      if (i === index || i < 0 || i >= count) return;
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      box.setAttribute('aria-label', SERVICES[i].alt);
      if (!layer || reduced) {                       // первый кадр или без анимаций
        if (layer) layer.remove();
        layer = make(i, '0%');
        index = i;
        if (fill) fill();
        return;
      }
      if (sliding) { queued = i; queuedFill = fill; return; }
      sliding = true;
      const dir = i > index ? 1 : -1;
      if (fill) swapCard(fill, dir);
      const from = layer;
      const to = make(i, (dir * 100) + '%');
      void to.offsetWidth;
      from.style.transition = to.style.transition = 'transform ' + DUR + 'ms ' + EASE;
      from.style.transform = 'translateX(' + (-dir * 100) + '%)';
      to.style.transform = 'translateX(0%)';
      index = i;
      setTimeout(() => {
        from.remove();
        to.style.transition = '';
        layer = to;
        sliding = false;
        if (pointer) { side = sideFor(pointer.x, pointer.w); paintSide(); }
        if (queued !== null && queued !== index) { const q = queued, f = queuedFill; queued = null; queuedFill = null; go(q, f); } else { queued = null; queuedFill = null; }
      }, DUR + 40);
    };
    box.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = box.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, w: r.width };
      cursor.style.left = (e.clientX - r.left) + 'px';
      cursor.style.top = (e.clientY - r.top) + 'px';
      side = sideFor(pointer.x, pointer.w);
      paintSide();
    });
    box.addEventListener('pointerleave', () => { pointer = null; side = 'none'; paintSide(); });
    box.addEventListener('click', (e) => {
      const r = box.getBoundingClientRect();
      const s = sideFor(e.clientX - r.left, r.width);
      if (s === 'left') showService(index - 1);
      else if (s === 'right') showService(index + 1);
    });
    // свайп на телефоне
    let sx = null;
    box.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) showService(Math.min(count - 1, Math.max(0, index + (dx < 0 ? 1 : -1))));
      sx = null;
    });
    return { go };
  })();

  let activeSvc = -1;
  const showService = (i) => {
    if (i === activeSvc) return;
    activeSvc = i;
    const s = SERVICES[i];
    $$('.svc__item', list).forEach((el) => {
      const on = Number(el.dataset.i) === i;
      el.classList.toggle('is-active', on);
      const f = $('.flip', el);
      if (f) {
        if (on && !reduced) f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-0.6rem)', offset: 0.3 }, { transform: 'translateY(0)', offset: 0.6 }, { transform: 'translateY(-0.2rem)', offset: 0.8 }, { transform: 'translateY(0)' }], { duration: 800, easing: 'cubic-bezier(.33, 0, .3, 1)' });
        f.classList.toggle('is-flipped', on);
      }
    });
    card.order.dataset.type = s.title;
    const fill = () => {
      card.kicker.textContent = s.title.toLowerCase();
      card.price.textContent = s.price;
      card.includes.innerHTML = s.includes.map((t) => `<li>${t}</li>`).join('');
      if (window.siteTypograph) window.siteTypograph(card.includes);   // правило переносов и для новых строк
    };
    svcGallery.go(i, fill);   // фото и текст карточки меняются одновременно
  };
  $$('.svc__item', list).forEach((el) => {
    const i = Number(el.dataset.i);
    el.addEventListener('mouseenter', () => showService(i));
    el.addEventListener('focus', () => showService(i));
    el.addEventListener('click', () => showService(i));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showService(i); } });
  });
  showService(0);
  // новые .rv в списке услуг
  if ('IntersectionObserver' in window && !reduced) {
    const io2 = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } }), { rootMargin: '0px 0px -60px 0px' });
    $$('.rv', list).forEach((el) => io2.observe(el));
  } else {
    $$('.rv', list).forEach((el) => el.classList.add('in'));
  }

  // жанры в hero → открыть нужную услугу
  $$('[data-svc]').forEach((a) => a.addEventListener('click', () => showService(Number(a.dataset.svc))));

  // «заказать съёмку» → окно заявки с выбранной услугой
  let openContact = null;
  card.order.addEventListener('click', (e) => {
    if (!openContact) return;
    e.preventDefault();
    openContact(card.order.dataset.type, card.order);
  });

  /* ---------------- gallery + filters ---------------- */
  const gallery = $('#gallery');

  gallery.innerHTML = WORKS.map((w, i) => `
    <li class="gallery__item${w.size ? ' gallery__item--' + w.size : ''}" data-cat="${w.cat}">
      <button class="gallery__btn" type="button" data-i="${i}" aria-label="Открыть фото: ${w.title}">
        <img src="${w.src}" alt="${w.alt}" loading="lazy">
        <span class="gallery__cap">${w.title}</span>
      </button>
    </li>`).join('');

  let visible = WORKS.map((_, i) => i);
  // показать в сетке все кадры или одно направление
  // раскладка направления на компьютере: ряды высотой в две строки, без пустот —
  // вертикальные кадры по 3 колонки, горизонтальные по 6; остаток ряда делят кадры этого ряда
  const bandLayout = (lis) => {
    let band = [], used = 0;
    const close = () => {
      let left = 12 - used, k = 0;
      while (left > 0 && band.length) { const b = band[k % band.length]; b.span += 1; left -= 1; k += 1; }
      band.forEach((b) => b.li.style.setProperty('--span', b.span));
      band = []; used = 0;
    };
    lis.forEach((li) => {
      const w = WORKS[+$('.gallery__btn', li).dataset.i];
      const span = w.size === 'tall' ? 3 : 6;
      if (used + span > 12) close();
      band.push({ li, span }); used += span;
    });
    close();
  };
  const applyFilter = (cat) => {
    gallery.classList.toggle('is-filtered', cat !== 'Все');
    $$('.gallery__item', gallery).forEach((li) => li.style.removeProperty('--span'));
    if (cat !== 'Все') bandLayout($$('.gallery__item', gallery).filter((li) => li.dataset.cat === cat));
    visible = [];
    $$('.gallery__item', gallery).forEach((li, i) => {
      const show = cat === 'Все' || li.dataset.cat === cat;
      li.classList.toggle('is-hidden', !show);
      if (show) {
        visible.push(i);
        if (!reduced) li.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', delay: 250 + visible.length * 50, fill: 'backwards' });
      }
    });
  };

  /* ---------------- направления: «Image Tiles Menu» ----------------
     По мотивам Codrops «Image Tiles Menu» (MIT). Наведение на направление — обложка
     рассыпается на четыре фрагмента вокруг; нажатие — фрагменты слетаются в цельный кадр
     (FLIP), название проявляется по буквам, сетка ниже показывает кадры направления.
     Сделано на Web Animations API, без GSAP/Flip/Splitting. */
  const WCAT = {
    'Репортаж': { cover: 'assets/img/w/report-wheel.jpg', color: '#b4532a', desc: 'Живые моменты событий и детали, которые рассказывают историю.' },
    'Студийный портрет': { cover: 'assets/img/w/studio-gaze.jpg', color: '#c4643a', desc: 'Свет, характер и внимательный взгляд в спокойной студии.' },
    'Уличный портрет': { cover: 'assets/img/w/street-lilac.jpg', color: '#df600f', desc: 'Город, природа и мягкий естественный свет вокруг героя.' },
    'Архитектура': { cover: 'assets/img/w/arch-arcade.jpg', color: '#d9824f', desc: 'Линии, ритм и свет: здания, которые ведут взгляд.' },
    'Стрит': { cover: 'assets/img/w/city-road.jpg', color: '#7d8036', desc: 'Случайные моменты улиц, которые больше не повторятся.' },
  };
  // куда разлетаются фрагменты (в % от сцены): правее списка, вразброс
  Object.values(WCAT).forEach((c) => { c.desc = c.desc.replace(/ (\S+)$/, '\u00a0$1'); });
  const SCATTER = [
    [[2, 30], [70, 0], [10, 90], [92, 76]],
    [[86, 4], [0, 60], [62, 100], [34, 0]],
    [[60, 6], [4, 14], [96, 64], [28, 100]],
    [[0, 0], [92, 30], [40, 96], [74, 100]],
    [[30, 4], [98, 8], [6, 70], [66, 96]],
  ];
  const EZ_IO = 'cubic-bezier(0.76, 0, 0.24, 1)';   // power4.inOut
  const EZ_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';  // expo.out
  const EZ_SOFT = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // мягкое, без рывков
  const stage = $('#wstage');
  const wmenu = $('.wmenu', stage);
  const wtiles = $('.wtiles', stage);
  const wcontent = $('.wcontent', stage);
  const wcover = $('.wcontent__cover', stage);
  const wtitle = $('.wcontent__title', stage);
  const wdesc = $('.wcontent__desc', stage);
  const wback = $('.wcontent__back', stage);
  const wstrip = $('.wcontent__strip', stage);
  const wcar = $('.wcar', stage);
  const wSplit = (el, text) => {
    el.setAttribute('aria-label', text);
    // буквы внутри слов: слово не рвётся при переносе строки
    el.innerHTML = text.split(' ').map((w) => '<span class="wword" aria-hidden="true">' + Array.from(w).map((ch) => '<span class="char-wrap"><span class="char">' + ch + '</span></span>').join('') + '</span>').join(' ');
    return $$('.char', el);
  };
  // телефон: под каждым направлением — маленькая бегущая лента из его кадров (список удвоен для бесшовного круга)
  const miniStrip = (cat, k) => {
    const pics = WORKS.filter((w) => w.cat === cat);
    const imgs = pics.map((w) => `<img src="${w.src}" alt="" loading="lazy">`).join('');
    return `<span class="wmini${k % 2 ? ' wmini--rev' : ''}" aria-hidden="true"><span class="wmini__track" style="--dur:${pics.length * 7}s">${imgs}${imgs}</span></span>`;
  };
  wmenu.innerHTML = WORK_CATS.map((cat, k) => `<button class="wmenu__item" type="button" data-k="${k}">
      <span class="wmenu__title"></span><span class="wmenu__desc">${WCAT[cat].desc}</span>${miniStrip(cat, k)}</button>`).join('');
  const items = $$('.wmenu__item', wmenu).map((el, k) => {
    const cat = WORK_CATS[k];
    const chars = wSplit($('.wmenu__title', el), cat);
    el.style.setProperty('--cat', WCAT[cat].color);
    const group = document.createElement('div');
    group.className = 'wtiles__group';
    // кадры направления: обложка первой, потом остальные — каждый фрагмент из своего фото
    const pics = WORKS.filter((w) => w.cat === cat).sort((a, b) => (b.src === WCAT[cat].cover) - (a.src === WCAT[cat].cover)).slice(0, 4);
    group.innerHTML = pics.map((w) => `<div class="wtile" style="background-image:url('${w.src}');background-position:${focusOf(w.src)}"></div>`).join('');
    wtiles.appendChild(group);
    group.style.setProperty('--tw', 'clamp(30rem, 30vw, 54rem)');   /* вдвое крупнее */
    const descEl = $('.wmenu__desc', el);
    descEl.innerHTML = descEl.textContent.replace(/(^|\s)([А-Яа-яЁё]{1,3}) /g, '$1$2 ').split(' ').map((w) => '<span class="wdw">' + w + '</span>').join(' ');
    return { el, k, cat, chars, title: $('.wmenu__title', el), desc: $('.wmenu__desc', el), group, tiles: $$('.wtile', group) };
  });
  const canHover = window.matchMedia('(hover: hover) and (min-width: 1024px)').matches;
  let tMode = 'menu';
  let tBusy = false;
  let tCur = null;
  const kill = (els) => els.forEach((e) => e.getAnimations().forEach((a) => a.cancel()));
  // свободные места ищем при каждом наведении (размеры экрана могут меняться)
  // кадры лежат ПОД текстами (как в образце Codrops): крупно, вразброс, без наплывов друг на друга
  const placeTiles = (it) => {
    const st = stage.getBoundingClientRect();
    it.tiles.forEach((t) => { t.style.display = ''; t.style.width = ''; t.style.height = ''; });
    const base = Math.min(it.tiles[0].offsetWidth || 480, st.width * 0.4);
    let seed = (it.k + 5) * 7919;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const SCALES = [1.05, 0.85, 0.95, 0.75, 0.9];
    const GAP = 28;
    const hit = (a, b) => a.l < b.r + GAP && a.r + GAP > b.l && a.t < b.b + GAP && a.b + GAP > b.t;
    let k = 1, placed = [];
    for (let attempt = 0; attempt < 8; attempt++, k *= 0.9) {
      placed = [];
      for (let i = 0; i < it.tiles.length; i++) {
        const w = base * SCALES[(i + it.k) % SCALES.length] * k, h = w * 0.75;
        const ok = [];
        for (let n = 0; n < 400 && ok.length < 30; n++) {
          const x = rnd() * Math.max(1, st.width - w), y = rnd() * Math.max(1, st.height - h);
          const box = { l: x, t: y, r: x + w, b: y + h };
          if (!placed.some((p) => hit(box, p))) ok.push(box);
        }
        if (!ok.length) break;
        // самое далёкое от уже стоящих — разброс по всей сцене
        const c = (b) => [(b.l + b.r) / 2, (b.t + b.b) / 2];
        const best = ok.map((b) => [b, placed.length ? Math.min(...placed.map((p) => Math.hypot(c(b)[0] - c(p)[0], c(b)[1] - c(p)[1]))) : rnd()])
          .sort((a, b) => b[1] - a[1])[0][0];
        placed.push(best);
      }
      if (placed.length === it.tiles.length) break;
    }
    it.tiles.forEach((t, i) => {
      const p = placed[i];
      t.style.display = p ? '' : 'none';
      if (!p) return;
      t.style.left = p.l + 'px'; t.style.top = p.t + 'px';
      t.style.width = (p.r - p.l) + 'px'; t.style.height = (p.b - p.t) + 'px';
    });
  };
  /* ---- цвет текста подстраивается под то, что под ним ----
     Для каждого кадра заранее считаем яркость участков (сетка 32×24, кадр вписан 4:3).
     Над тёмным участком фото буква/слово становятся светлыми, над светлым — остаются своего цвета. */
  // яркость кадров посчитана заранее (сетка 16×12, кадр вписан 4:3 по точке фокуса) —
  // не зависит от браузера и не ждёт загрузки картинок
  const LUMDATA = {"arch-arcade":"c437aadc9f8d3f312d161f416373103fc738ade6a39e4d33270c355361460c48c83da9d5a6a9702322154c5e621a1047cd3fa8d6a7ae8f311c1e53564c101047d140acf1a5aea4431c36563647140f56d040a6efa5aeab3b1249332061310e59cf3da4f1a1b0aa483e31303056320f56ce3da3fba5aead482b313b3450400b59d23d65bf96937435333b3e355c3d0d5ccb3b6fd86d764b6996563c36603d0f576b3c59ba61574a719388432f693d11596634619a5e4b48646c71532b6b371153","arch-glass":"b7b9aca1a4a5adb2b5b5b4b6b6babdbcbabab7aea2a2aab1b4b6b9b7b6b8bcbb39abb4b2adaaabaf9aacbab3b4b8bcbb1b1d78bbacaeb1978d9fb2b5b6babbbb1a46acb8b5a5a28a899cabbbb6b9b7b253c1bcc2c2a79b8b7991a6acadb7b1a020a1c9cfccb3947f74839babaab3b38f0fafd5d3cfa58573748086a9b5b29a80abd6cfd0c08d786b6c74708ead917b90d4d2cdcdac80795d4f5b6a7d9c8a8b99c6cdd0c7957777343b6c777a95938e8fc8caccb165786c253a766f728f989595","arch-metro":"2b29232323222121211c1416090c12202a2d2d242928272733331e18190c080c2d2d2a1b2d302c373f312d2120190a0d2621161e3b363e4c3e2a262a291e14111011103e4b445f503e322a29261d201a070332674d687553473e2a292a23221f1c3674706d625c6b583c2d352b1a1f1e485f68657956466159464031281e1d1026242a364f5b6c6366553f302d1a110f3874562c2e4660726f4f432f16100f111b5bb07429355d6f6e58351316180c151e1347974b1c446e4c273e121a11080a","arch-tower":"939fb3b8b4c37f45bdc8d4e5ecebf4958a95afc4c9d76b2fb2e3d8eaedecf3a391a8bbc7d3ce5a3687ebdee3e2d9dc9e9eb6c4c7cfab473d5cccd3d2d0c6c39597a3aeb7c48646444c98c6bcb8aeac8c868e959fac6a46474e8ab0a4a198998860708e949e6c4b485087a8a59ca5aca41f293c4d675b4d4f5591b4b6b5b2b0b52c271f1d292832353f658fa5bfc2bbb22127242839353126332c2f3d475c70820b1012141a1f23212a2c2d2f232522271a150d0e0f1a311f2f4c4b39312d2b26","city-boardwalk":"826e784e5d505e886e6f9fa1a654478271605c4d8346616657839f949a583c81574f4f4a83526f6187957f649055427f4b625e405343696d9280746f90503b704c564255503955637495a9707a4038765a6244724b6c698778a7a15d7e3f3b70455e3e5d43694d6b537d6d4c64353a55414d324a3d5354766576725374363e59444028393343618576948253833c3c632d25222337404c3d43aec1708d3b30483223131533466784a3cfb3474c3f37303142485e6791a1c3b0562a2047523d35","city-road":"dfdededfdfdfe0e0dfdfdfdfdfdededfd7d4d7d7d8d9d9d9d9d9d9d8d8d8d8d8b1b6ced1d3d2d2d2d3d3d3d2d3d4d3d38691aabdcbcdcccececdcdcec8c0c5c7787d8a9bb1c5c9c9c9c8c8c6af9da2a6646a777f89a2bdc4c5c4c4ab90868586515661696d7997b1bfc1aa84756f6f6d3f424b505563758a9e9d856e605e5d58393f484d56576478695f675e57534f4f4145453b405a5f4634363d433d3d403f2e2628496a502b25262a2d342f292b301d3b6a642c171d1d1d212623202e2620","city-taxi":"474865718ecaece3dfdcd9d9dde1e1d549456876748dddd7d8d7d8d6d5d6dae44356827d6b99e3d2d3d4d8d9d6d9d59340559f8b6e9ddfd6d6d8dddfd9e8aa513d4f78868363ade0d7d3d8c9c8c364643f4b655f725d93efbf87656174464c5f34384b4b526172b6614b3c4036375657383331594f4d685f34444c4b433a4b4b303628363124575f414c40473c3f423e715f6042454e4953564744413c4a3a3c4636596b635f7c52413e383e1e22122a281c2c4f523345558da5837370644943","report-tractor":"394e575d6b719bd9c49a867b6a4d3f3f434f5c54657387c6d1c3985d565453525c6b7968625253a9e4db8d566a6960554b4c73696b636094d7b26d5c838c6461343b464153715a7be1936b727a6f5e592131332a31446868a6836c867258515f1e47272f413e72615d7a7486746258522738222c303c675c5d7f786e7a66595d4a171f228e76475a4e6c6e606441434629090e13776763937c87836b453b2e2e100f1417112c4b74c1c4b9af8e6f4d4210101013182c3f2e83bcb7b5aaa08d85","report-wheel":"b9b0c3bab5afb7b5afa596999395999accc5b6b7b5b1b0b09e919a989798989bc7babab2b0abaeb77559939e9e97989cc6c2c3b8b4b2b79f75698b98a19b9b9ac5c4beb8b9baafa28a80a99da2a7a399c1c7c6c6bca0a6b584789baca095adb0d1cbcbbbabadaaa5aab79d9fb1a7a0a69acfc0b1c5b8b9aac1c0b1adb2beb96c368caab8bcc1abc1cbc2c6c1b9baae4b331a74a7b7c5afd5cec6d3c5c2b972549f362464ceb4b2d1c2b7c6bbb8774e92aa3e52535cafcad2c8c0c8c6bb644b9c","still-bottles":"06050605050505050604040404040404060c07050505050504040404040404040a4c2104050505050a070404040404040d2b170605050508511e0105040506040e5b1e020505050b2d120404011934010f3c1c0805050309511d0104031325043c6926150f050810341a0906001835023b6e2210100e0f327a33100d0924380f385b1b100d0e0c2b72270b0e0a4a7a163858190f0d0b0c2764220b0c073b67143147160f0c0a0c24571f0c0b063460152e41150e0b0a0c224b1d0b0a07285216","still-elephant":"0707080a0b0c0e1114171a1e212324240707090a0c0c0e1115181c1f2427282807080a0a0b10141414191d2025282a2a07090a0e1d2e363420191d2124282b2a0709151a29332a28312b1c1a23262929070a1b1d2b2b20251d2e4e3c222528290808111e29201b11103052502e23262708090b17241a1e0e0a591c1020222423080a090f22191a091737020d1d1e1f1e0808080a10131b051e110510271916160c0c0c0b060a0e092b0c031d201918171417181919191919271f1b20211f1e1d","still-spiral":"1413162c45484d604d6353542001030214132f444a494d57594d7a6c5726000213174b4c48474648595d7f7c825f1c00113b5d4b4c564d474565828a918d52041b4a4f59575256544661848c91926d072246464b525b574f4c8185898888701a2548363e4b403c4d588c8b958d8879162140454f4641436058658f978c866d1617424c493a51567274608e90998f420014394d423c5b5463757672919581320014214641545a625e6c7c778272410a0015142747565e686b6a73717c62110002","street-alley":"02060c1113131b1a1a732608110a0c0f03090f12181b14100e572e09110a101202070c0e12190e354816190e140b151602060d0f1012144d6c261414130a15160e1b262d38321b2d412f3317110b14182534424b53532413263941220c0c121b31465a6c7a822910252e49401f09121a2b39444d5c44051d251f49462409141b4f636d7074632a2c353b4937292215195f74828d8d8466457c684b40382b1414627c919e9185624685484243431d060c6c8aabaea6995d5c834f484e37140908","street-crossing":"020a0f070201010406010104006676650004150602010103040101010011291401061501010200060801020001000c0438191508060604020102020101000e071910160a070401093c09000202000c06020610040101000a460f010201000d0802040e040304010f1e03040303000d0802040d04030401091e06040403020d0b04050e06050502132c0b040504010b0c05050e06050500134604050505040b0d03070f08080b0913490e0a0b0a060c12282c25292b2a211c3a29211213181816","street-curls":"693e3533313334352f2d426f9dadb6bd422f262c2b2b29316a93c0dbda999bb178492c312e2e6251bee4d7d0cb9e9da4896c6666594890758d89b3d6d0a6adbb907f8a8d7962884f36383683c77c8ea7968897988069591c569c4a27a26f70749c95a8a989633b2656854d1d53728e83a08b87867a552838667e4a1c32546a65a78068686850164e808172202e586c63a39dadaa995219376d6a43162b4c767da39fb6b69d48231d515a1b1a2d446761a4a1b7b7963a1e2243471e222654a8b6","street-grass":"3c3f363226261e1e2e4340043c7a7276252d39271d282f4866763d0f0f5c5b511e18312427456077817662231241464a3c363f4863787a786f61707a414e564c515e697f8177756e5d5a74aa544857496c7c7e70686a59381c515f1c0d40584d7862505b482f202734541d080a324d4a63575647110a3c5c52220b1e1d403923575e5414030606203416151e34464331515a3f0d03060402032d332543574b49524f3106030309102b4844475760452a4f4d2b06212d3b46585a535c5f5b4d49","street-lilac":"40404a3d2d2e304557405569744d432641474530422e293c434e556c4838412d4c5f443741553a2825241f373f4b5456434e3e312a555b453a1a1f3460536d5c3868493b1839878f7722243e40454944494f273f3529617c701822342640262d3f37262c241c26686e5731252726131f4e3a1a306d889a9eaeb1acaa7f231c1d4d362274aea09b9289838495904f38303a39464d3e3e403e3c41454549472c364d453f433c3e4241424545434741171b4041453b2a394142413d3a2f39462420","street-night-park":"190b000000000000000b02000000000f1900010000000000010000000000000c1e00010000000100000000000000000c2000010000000001100800000000000a1c0001000000000365290001000000092200010000010021871e0001010101062500010000000018240b0503030302062c000100000000132c1a0303030200032b00010000010033733901070504020327000100000200478a3500090805010027000100000505436a27070d0400010225000100081613435035060203080808","studio-bw-face":"090b0b0a0c1211080a10150504040303070707071765875d280e0804030303030404060042cde2c278220604030302020303060056dcdec37620040302020202030303045b86aa8b5d0c040302020303030305007ba98a4b380a0803030303030406030089e77680580406030303020202000a88abaf62641e000403020202020c4383cc9a606924040c0a01020202028090909993413e0509161d0601020202968983879b770905131b2c17000302028679816d4f89390818213a1900030202","studio-bw-hands":"005e782932182013100803030202020228dbf56422577349280a02030202030388fdaa674ec6e2d48b1600040203030337e1ad7a50cdf7e49b1f010603040404009ec7854da3d2a16815000003060403005be4cf6b79728666101a280a000302004ef2d3b0a1cde0a21835777b1e0004007f9d4dc3ad99d56e0c407cad6100040264cba29fbd4b8d2d13619e9a3b00040b93ccc973a64f28182b81b79820000411afe3f685c4a3020f3ea9b9640a0c1306a0f0f5b188b24b1a64bea5290a0f19","studio-bw-sit":"05060608032066351d1209060606050506070809023b89741f0b0407070606050607080a0431a9580f0a0308080606060708080c005da3482e0008090908060608090a0d0733907c32000c0b09070707080a0d11131e6c38060a0e0e0a090707090d141a0e1a621c050507090c0c08070b0a020000003a18010202030001080702294b444b38464d2c040100304305062ea3937949261618333b352c889321039d83405390631b1508132126202622065d42398fc3848788130202040c0b0905","studio-gaze":"0e0c08021625100b080b3523290e0705080a070136361b0f0a134e46462b0007080a050a5135231010225485633300070807031749241a0b0a1a33716d3005070607051f32150c0b12272249292e090606090520250c0a102c4618765a240c050a07021b1f0d0d111821097d791e09050a060418220b0a100f09307f4b1d05060908071b200d070c090e47353c1b040709050b312213130c0d2f5f37461603070a061c421f1f1910131f6a875a2203080b041e352022100e0800409d5c210708","studio-green":"17151413121211100f0f0f0f0f0f0f0f191717161514121011100e0f0f0f0f0f1d1b181b1c1a1f221b19161211100f10211d21342d30453c4b6c411614151112271a587e5e637a3e539051141d2918122d1b608a5d70a96c5ca45311222b1713342843555369949062832918222015163d313f87606972734f64201f23201416342d27616c725225454722241c1814152b26203365672a1217131a1d1d131313251f24486b582720171718181d16101220183043654822181415181718161010","studio-profile":"0001000f4d0c02000000000000010100000100268d080802000000000001010000010012410704020001000001010101000000092422060202000000000001020000050d53600004040000000001010100000709462f00070400000000010101000000054a1c01050200000000010101000001003b1c0410060100000001010100000100251c1f240a03000101010101000000000921120f0a010301020001010000000004150906471c00020200010100000000001f1b004a721c0c05010001","studio-red-blue":"1a181817151413131212100e121010111c1b14151b1b1d1715121c39261815111e18344b3b2a2220192247351b181c1722136aa78757272a254d6020232f575c241656b6846140393d72762023357260261a5dc47f4d463f345f722533316d32271d3bba5e3f484739636d353546712d24211f486773455959583530383f4114211a2346bc9c7e5d3b374047775b1d131735768298956f3645504d45788c72231865796c71834b504744454163777f4a266f75677d8150513d2e353e51597557"};
  const LUM = new Map();
  const lumOf = (src) => {
    if (LUM.has(src)) return LUM.get(src);
    const m = /\/w\/([\w-]+)\.jpg/.exec(src || '');
    const hex = m && LUMDATA[m[1]];
    const rec = { grid: null };
    if (hex) {
      rec.grid = new Float32Array(hex.length / 2);
      for (let i = 0; i < rec.grid.length; i++) rec.grid[i] = parseInt(hex.substr(i * 2, 2), 16) / 255;
    }
    LUM.set(src, rec);
    return rec;
  };
  const LIGHT = '#faf3ec';
  const DARK = '#2b2323';
  let curHover = null;
  const adaptText = (it) => {
    const st = stage.getBoundingClientRect();
    const boxes = it.tiles.filter((t) => t.style.display !== 'none').map((t) => {
      const l = parseFloat(t.style.left), tp = parseFloat(t.style.top), w = parseFloat(t.style.width), h = parseFloat(t.style.height);
      return { l: st.left + l, t: st.top + tp, w, h, rec: lumOf(t.style.backgroundImage.slice(5, -2)) };
    });
    const tone = (x, y) => {
      for (let i = boxes.length - 1; i >= 0; i--) {   // верхний кадр — последний
        const b = boxes[i];
        if (x < b.l || x > b.l + b.w || y < b.t || y > b.t + b.h) continue;
        if (!b.rec.grid) return null;
        const gx = Math.min(15, Math.floor((x - b.l) / b.w * 16)), gy = Math.min(11, Math.floor((y - b.t) / b.h * 12));
        return b.rec.grid[gy * 16 + gx];
      }
      return null;
    };
    // яркость под текстом — по нескольким точкам по всей ширине; вне кадра — светлый фон страницы
    const PAGE = 0.86;
    const lin = (v) => Math.pow(v, 2.2);                     // яркость → относительная светлота
    const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const L_LIGHT = 0.9, L_DARK = 0.03;
    // слово целиком: собираем яркость под всеми его буквами
    const paintGroup = (els) => {
      let sum = 0, cnt = 0, onPhoto = 0;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const n = Math.max(2, Math.min(9, Math.round(r.width / 14)));
        for (let i = 0; i < n; i++) {
          const x = r.left + r.width * (i + 0.5) / n;
          for (const fy of [0.35, 0.65]) {
            const v = tone(x, r.top + r.height * fy);
            if (v != null) onPhoto++;
            sum += v != null ? v : PAGE; cnt++;
          }
        }
      });
      let col = '';
      if (onPhoto / Math.max(1, cnt) > 0.2) {                  // слово заметно лежит на фото
        const bg = lin(sum / cnt);
        col = contrast(L_LIGHT, bg) >= contrast(L_DARK, bg) ? LIGHT : DARK;
      }
      els.forEach((el) => { el.style.color = col; });
    };
    const paint = (el) => {
      const r = el.getBoundingClientRect();
      const n = Math.max(3, Math.min(9, Math.round(r.width / 14)));
      let sum = 0, onPhoto = 0;
      for (let i = 0; i < n; i++) {
        const x = r.left + r.width * (i + 0.5) / n;
        for (const fy of [0.35, 0.65]) {
          const v = tone(x, r.top + r.height * fy);
          if (v != null) onPhoto++;
          sum += v != null ? v : PAGE;
        }
      }
      const avg = sum / (n * 2);
      el.style.color = onPhoto && avg < 0.62 ? LIGHT : '';
    };
    items.forEach((m) => {
      $$('.wword', $('.wmenu__title', m.el)).forEach((w) => paintGroup($$('.char', w)));
      $$('.wdw', m.desc).forEach((w) => paintGroup([w]));
    });
  };
  const clearText = () => items.forEach((m) => { m.chars.forEach((c) => { c.style.color = ''; }); $$('.wdw', m.desc).forEach((w) => { w.style.color = ''; }); });
  const quickHide = (m) => m.tiles.forEach((t) => {
    const o = parseFloat(getComputedStyle(t).opacity);
    if (o <= 0.01) return;
    t.getAnimations().forEach((a) => a.cancel());
    t.animate([{ opacity: o, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 250, easing: 'ease-out', fill: 'forwards' });
  });
  const showTiles = (it) => {
    items.forEach((m) => { if (m !== it) quickHide(m); });
    placeTiles(it);
    curHover = it;
    adaptText(it);
    clearTimeout(it.adaptT);
    it.adaptT = setTimeout(() => adaptText(it), 950);   // после сдвига названия — уточняем
    stage.classList.add('has-tiles');
    kill([it.title, it.desc, ...it.tiles]);
    it.title.animate([{ transform: 'translateX(3rem)' }, { transform: 'none' }], { duration: 900, easing: EZ_SOFT, fill: 'forwards' });
    it.desc.animate([{ opacity: 0, transform: 'translateY(40%)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: EZ_SOFT, fill: 'forwards' });
    it.tiles.forEach((t, i) => t.animate([{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 1000, delay: i * 90, easing: EZ_SOFT, fill: 'both' }));
  };
  const hideTiles = (it) => {
    if (curHover === it) curHover = null;
    clearTimeout(it.adaptT);
    clearText();
    stage.classList.remove('has-tiles');
    kill([it.title, it.desc, ...it.tiles]);
    it.title.animate([{ transform: 'none' }, { transform: 'translateX(3rem)' }], { duration: 700, easing: EZ_SOFT, fill: 'forwards' });
    it.desc.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(20%)' }], { duration: 700, easing: EZ_SOFT, fill: 'forwards' });
    it.tiles.forEach((t) => t.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.5)' }], { duration: 700, easing: EZ_SOFT, fill: 'forwards' }));
  };
  if (canHover && !reduced) {
    items.forEach((it) => {
      it.el.addEventListener('mouseenter', () => { if (tMode === 'menu' && !tBusy) showTiles(it); });
      it.el.addEventListener('mouseleave', () => { if (tMode === 'menu' && !tBusy) hideTiles(it); });
      it.el.addEventListener('focus', () => { if (tMode === 'menu' && !tBusy) showTiles(it); });
      it.el.addEventListener('blur', () => { if (tMode === 'menu' && !tBusy) hideTiles(it); });
    });
  }
  // FLIP: элементы переезжают в новый контейнер, а анимация ведёт их из старого места
  const flip = (els, move, opts) => {
    const first = els.map((e) => e.getBoundingClientRect());
    move();
    const last = els.map((e) => e.getBoundingClientRect());
    return Promise.all(els.map((e, i) => {
      const a = first[i], b = last[i];
      if (!b.width || !b.height) return Promise.resolve();
      const from = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
      e.style.transformOrigin = '0 0';
      return e.animate([{ transform: from, opacity: opts.fromOpacity ?? 1 }, { transform: 'none', opacity: opts.toOpacity ?? 1 }],
        { duration: opts.duration, easing: opts.easing, delay: (opts.stagger || 0) * (opts.reverse ? els.length - 1 - i : i), fill: 'both' }).finished;
    }));
  };
  /* ---------- лента кадров: «coverflow» из «Репертуара» театра ----------
     Непрерывная позиция едет к цели с постоянной скоростью (0,6 с на карточку),
     после остановки 3 с пауза и шаг дальше — слева направо, по кругу.
     Центр — крупно, соседние — меньше и приглушённо, дальше — растворяются. */
  const CAR = { move: 0.6, dwell: 3, dir: -1 };
  let car = null;
  const carSizes = () => {
    const W = wstrip.clientWidth || stage.clientWidth;
    const mobile = W < 700;
    const k = mobile ? 1 : Math.min(1, W / 1800);
    const AH = mobile ? Math.round(Math.min((W - 40) * 0.75, window.innerHeight * 0.45)) : Math.round(Math.min(window.innerHeight * 0.52, 600 * Math.max(k, .62)));
    const AW = Math.round(AH * 4 / 3);
    return mobile
      ? { AW, AH, RW: Math.round(AW * 0.4), RH: Math.round(AH * 0.65), GAP: 10, TGAP: 14, TITLE: 60 }
      : { AW, AH, RW: Math.round(AW * 0.9375), RH: Math.round(AH * 0.9167), GAP: Math.round(14 * AW / 800), TGAP: Math.round(Math.max(20, 37 * AW / 800)), TITLE: 70 };
  };
  const startCar = (list) => {
    const S = carSizes();
    const H = S.AH + S.TGAP + S.TITLE;
    wstrip.style.setProperty('--sh', H + 'px');
    wstrip.style.setProperty('--aw', S.AW + 'px');
    wstrip.style.setProperty('--ah', S.AH + 'px');
    wstrip.style.setProperty('--arrow-y', (H - S.AH / 2) + 'px');
    wcar.innerHTML = list.map((w, i) => `<div class="wcard" data-idx="${i}">
        <div class="wcard__title"><h4>${w.title}</h4><p>${w.desc || ''}</p></div>
        <div class="wcard__img"><img src="${w.src}" alt="${w.alt}" loading="lazy"></div></div>`).join('');
    if (window.siteTypograph) window.siteTypograph(wcar);
    const cards = $$('.wcard', wcar);
    const n = list.length;
    const C1 = S.AW / 2 + S.GAP + S.RW / 2;
    const PITCH = S.RW + S.GAP;
    const relOf = (i, pos) => { let r = ((i - pos) % n + n) % n; if (r > n / 2) r -= n; return r; };
    const xFor = (rel) => { const a = Math.abs(rel); const m = a <= 1 ? a * C1 : C1 + (a - 1) * PITCH; return (rel < 0 ? -1 : 1) * m; };
    const state = { pos: 0, target: 0, raf: 0, last: null, acc: 0, paused: false };
    const render = () => {
      cards.forEach((cd) => {
        const i = +cd.dataset.idx;
        const rel = relOf(i, state.pos);
        const a = Math.min(Math.abs(rel), 1);
        const ar = Math.abs(rel);
        const imgH = S.AH + (S.RH - S.AH) * a;
        const w = S.AW + (S.RW - S.AW) * a;
        const imgTop = H - imgH;                         // общий нижний край у всех карточек
        cd.style.transform = 'translateX(' + xFor(rel) + 'px) translateX(-50%)';
        cd.style.width = w + 'px';
        cd.style.opacity = String(ar <= 1 ? 1 : (ar >= 2 ? 0 : 2 - ar));
        cd.style.zIndex = String(Math.round(50 - ar * 10));
        cd.classList.toggle('current', ar < 0.5);
        const im = cd.children[1];
        const tt = cd.children[0];
        im.style.height = imgH + 'px';
        im.style.top = imgTop + 'px';
        tt.style.top = (imgTop - S.TGAP - tt.offsetHeight) + 'px';
      });
    };
    const tick = (t) => {
      const last = state.last == null ? t : state.last;
      const dt = Math.min((t - last) / 1000, 1 / 30);
      state.last = t;
      const diff = state.target - state.pos;
      const step = dt / CAR.move;
      if (reduced || Math.abs(diff) <= step) {
        state.pos = state.target;
        render();
        if (!state.paused) state.acc += dt;   // пока открыт кадр — лента стоит
        if (state.acc >= CAR.dwell && n > 1) { state.acc = 0; state.target -= CAR.dir; }
        state.raf = requestAnimationFrame(tick);
        return;
      }
      state.pos += (diff < 0 ? -1 : 1) * step;
      render();
      state.raf = requestAnimationFrame(tick);
    };
    render();
    state.raf = requestAnimationFrame(tick);
    car = {
      stop: () => cancelAnimationFrame(state.raf),
      go: (d) => { state.target += d; state.acc = 0; },
      pause: (v) => { state.paused = v; state.acc = 0; },
      relOf: (i) => relOf(i, state.target),
      list,
    };
  };
  const stopCar = () => { if (car) { car.stop(); car = null; } };
  // нажатие на фото ленты: центральное открывается панелью с описанием (как в сетке), боковое — подъезжает в центр
  wcar.addEventListener('click', (e) => {
    const cd = e.target.closest('.wcard');
    if (!car || !cd) return;
    const i = +cd.dataset.idx;
    const rel = Math.round(car.relOf(i));
    if (rel !== 0) { car.go(rel); return; }
    const idx = WORKS.indexOf(car.list[i]);
    if (idx < 0) return;
    car.pause(true);
    openWork(idx, null, $('img', cd));
  });
  document.addEventListener('wpanel:closed', () => { if (car) car.pause(false); });
  $('.wcar__arrow--prev', stage).addEventListener('click', () => car && car.go(-1));
  $('.wcar__arrow--next', stage).addEventListener('click', () => car && car.go(1));

  // перелёт кадра с его места на место в ленте (без переноса в DOM: только transform)
  const flyTo = (t, to, D, delay) => {
    const a = t.getBoundingClientRect();
    t.style.transformOrigin = '0 0';
    const tr = `translate(${to.left - a.left}px, ${to.top - a.top}px) scale(${to.width / a.width}, ${to.height / a.height})`;
    return t.animate([{ transform: 'none', opacity: 1 }, { transform: tr, opacity: to.o }], { duration: D, delay, easing: EZ_IO, fill: 'forwards' }).finished;
  };
  const openCat = (it) => {
    if (tBusy || tMode !== 'menu') return;
    tBusy = true; tMode = 'content'; tCur = it;
    const D = reduced ? 0 : 1100;
    const cover = WCAT[it.cat].cover;
    const list = WORKS.filter((w) => w.cat === it.cat).sort((a, b) => (b.src === cover) - (a.src === cover));
    wcover.style.display = 'none';
    wstrip.classList.remove('is-car');
    wcar.classList.remove('is-on');
    const tChars = wSplit(wtitle, it.cat);
    wcontent.style.setProperty('--cat', WCAT[it.cat].color);
    wdesc.textContent = WCAT[it.cat].desc;
    if (window.siteTypograph) window.siteTypograph(wdesc);
    wcontent.classList.add('is-current');
    if (!it.tiles[0].style.left) placeTiles(it);
    kill(it.tiles);
    it.tiles.forEach((t) => { if (t.style.display !== 'none') { t.style.opacity = '1'; t.style.transform = 'none'; } });
    // лента строится сразу (невидимой) — так известны места, куда летят кадры
    startCar(list);
    const cards = $$('.wcard', wcar);
    const n = list.length;
    const visibleTiles = it.tiles.filter((t) => t.style.display !== 'none');
    Promise.all(visibleTiles.map((t, i) => {
      const card = cards[i];
      const r = card.children[1].getBoundingClientRect();
      const o = Math.abs(((i % n) + n) % n) <= 1 || i === n - 1 ? 1 : 0;   // центр и соседи видны, дальние гаснут
      return flyTo(t, { left: r.left, top: r.top, width: r.width, height: r.height, o }, D, (reduced ? 0 : 60) * (visibleTiles.length - 1 - i));
    })).then(() => {
      wcar.classList.add('is-on');
      wstrip.classList.add('is-car');
      setTimeout(() => it.tiles.forEach((t) => { t.style.visibility = 'hidden'; }), 300);
    });
    // меню уходит: буквы выезжают влево, описание вверх
    items.forEach((m) => {
      m.chars.forEach((ch) => ch.animate([{ transform: 'none' }, { transform: 'translateX(-100%)' }], { duration: D, easing: EZ_IO, fill: 'forwards' }));
      m.desc.animate([{ opacity: getComputedStyle(m.desc).opacity }, { opacity: 0, transform: 'translateY(-60%)' }], { duration: D, easing: EZ_IO, fill: 'forwards' });
    });
    wmenu.classList.add('is-hidden');
    clearTimeout(it.adaptT); clearText();
    tChars.forEach((ch, i) => ch.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: D, delay: 550 + i * 40, easing: EZ_EXPO, fill: 'backwards' }));
    [wdesc, wback].forEach((el) => el.animate([{ opacity: 0, transform: 'translateY(100%)' }, { opacity: 1, transform: 'none' }], { duration: D, delay: 400, easing: EZ_EXPO, fill: 'backwards' }));
    applyFilter(it.cat);
    const hdr = $('#header');
    const want = stage.getBoundingClientRect().top + window.scrollY - (hdr ? hdr.offsetHeight : 0) - 24;
    if (Math.abs(window.scrollY - want) > 8) window.scrollTo({ top: want, behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => { tBusy = false; wback.focus({ preventScroll: true }); }, D + 450);
  };
  const closeCat = () => {
    if (tBusy || tMode !== 'content' || !tCur) return;
    tBusy = true;
    const it = tCur;
    const D = reduced ? 0 : 950;
    [wdesc, wback].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-100%)' }], { duration: D, easing: EZ_EXPO, fill: 'forwards' }));
    $$('.char', wtitle).forEach((ch) => ch.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], { duration: D, easing: EZ_EXPO, fill: 'forwards' }));
    stopCar();
    wcar.classList.remove('is-on');
    wstrip.classList.remove('is-car');
    // кадры из ленты разлетаются обратно и гаснут
    it.tiles.forEach((t) => { t.style.visibility = ''; });
    Promise.all(it.tiles.map((t) => {
      const cur = getComputedStyle(t).transform;
      t.getAnimations().forEach((a) => a.cancel());
      if (t.style.display === 'none') return Promise.resolve();
      return t.animate([{ transform: cur === 'none' ? 'none' : cur, opacity: 1 }, { transform: 'none', opacity: 0 }], { duration: D, easing: EZ_EXPO, fill: 'forwards' }).finished;
    })).then(() => {
      it.tiles.forEach((t) => { t.getAnimations().forEach((a) => a.cancel()); t.style.opacity = ''; t.style.transform = ''; t.style.transformOrigin = ''; });
      wcontent.classList.remove('is-current');
      wcar.innerHTML = '';
      [wdesc, wback].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      tBusy = false; tMode = 'menu'; tCur = null;
      it.el.focus({ preventScroll: true });
    });
    setTimeout(() => {
      wmenu.classList.remove('is-hidden');
      items.forEach((m) => {
        m.chars.forEach((ch, i) => { ch.getAnimations().forEach((a) => a.cancel()); ch.animate([{ transform: 'translateX(-100%)' }, { transform: 'none' }], { duration: D, delay: (m.chars.length - i) * 20, easing: EZ_EXPO, fill: 'backwards' }); });
        m.desc.getAnimations().forEach((a) => a.cancel());
        m.title.getAnimations().forEach((a) => a.cancel());
      });
    }, reduced ? 0 : 450);
    applyFilter('Все');
  };
  items.forEach((it) => it.el.addEventListener('click', () => openCat(it)));
  wback.addEventListener('click', closeCat);
  $('.wcontent__back--bottom', stage).addEventListener('click', closeCat);

  /* ---------------- lightbox ---------------- */
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbCap = $('#lb-cap');
  let cur = 0;
  let lastFocus = null;

  const render = () => {
    const w = WORKS[visible[cur]];
    lbImg.src = w.src;
    lbImg.alt = w.alt;
    lbCap.textContent = `${w.title} · ${w.cat.toLowerCase()} · ${cur + 1} / ${visible.length}`;
  };
  const openLb = (idx) => {
    cur = Math.max(0, visible.indexOf(idx));
    lastFocus = document.activeElement;
    render();
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('is-open'));
    $('.lightbox__close', lb).focus();
  };
  const closeLb = () => {
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, reduced ? 0 : 350);
    if (lastFocus) lastFocus.focus();
  };
  const step = (d) => { cur = (cur + d + visible.length) % visible.length; render(); };

  /* ---------------- кадр → панель с описанием ----------------
     По мотивам Codrops «Repeating Image Transition» (MIT): кадр «перелетает» к панели
     серией отпечатков, каждый проявляется и гаснет через clip-path; остальные кадры
     мягко уходят волной от нажатого. Сделано на Web Animations API, без GSAP. */
  const wp = $('#wpanel');
  const wpImg = $('.wpanel__img', wp);
  const wpContent = $('.wpanel__content', wp);
  const wpVeil = $('.wpanel__veil', wp);
  const WT = { steps: 6, step: 420, interval: 55, pause: 140, panelFactor: 2, stagger: 300 };
  const EZ = {
    sineIn: 'cubic-bezier(0.12, 0, 0.39, 0)', sineOut: 'cubic-bezier(0.61, 1, 0.88, 1)',
    sineInOut: 'cubic-bezier(0.37, 0, 0.63, 1)', expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  };
  const CLIP = { from: 'inset(100% 0% 0% 0%)', reveal: 'inset(0% 0% 0% 0%)', hide: 'inset(0% 0% 100% 0%)' };
  const ORDER_TYPE = { 'Репортаж': 'Репортажное фото', 'Стрит': 'Стрит-фотография' };
  let wBusy = false;
  let wOpen = false;
  let wItem = null;
  let wIdx = 0;
  const centerOf = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  const lerp = (a, b, t) => a + (b - a) * t;
  const shownItems = () => $$('.gallery__item:not(.is-hidden)', gallery);
  const delaysFrom = (item, items) => {
    const c0 = centerOf(item.getBoundingClientRect());
    const d = items.map((el) => { const c = centerOf(el.getBoundingClientRect()); return Math.hypot(c.x - c0.x, c.y - c0.y); });
    const max = Math.max(...d) || 1;
    return d.map((v) => (v / max) * WT.stagger);
  };
  const fillPanel = (w) => {
    $('.wpanel__cat', wp).textContent = w.cat.toLowerCase();
    $('.wpanel__title', wp).textContent = w.title;
    $('.wpanel__desc', wp).textContent = w.desc || '';
    if (window.siteTypograph) window.siteTypograph(wpContent);
    wpImg.style.backgroundImage = 'url("' + w.src + '")';
    wpImg.setAttribute('aria-label', w.alt);
  };
  const openWork = (idx, li, fromImg) => {
    if (wBusy || wOpen) return;
    wBusy = true;
    wItem = li;
    wIdx = idx;
    const w = WORKS[idx];
    const pic = fromImg || $('img', li);
    const startRect = pic.getBoundingClientRect();
    const isLeft = centerOf(startRect).x < window.innerWidth / 2;
    fillPanel(w);
    wp.style.setProperty('--aspect', pic.naturalWidth && pic.naturalHeight ? pic.naturalWidth / pic.naturalHeight : 1);
    wp.classList.toggle('wpanel--right', isLeft);
    wp.hidden = false;
    wpImg.style.clipPath = CLIP.hide;
    wpContent.style.opacity = '0';
    const endRect = wpImg.getBoundingClientRect();
    document.documentElement.style.overflow = 'hidden';

    if (reduced) {
      wpImg.style.clipPath = '';
      wpContent.style.opacity = '';
      wp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      wBusy = false; wOpen = true;
      $('.wpanel__close', wp).focus();
      return;
    }

    // остальные кадры уходят волной, нажатый «сворачивается» вниз
    const items = shownItems();
    const delays = delaysFrom(li || pic, items);
    items.forEach((el, k) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(el === li
        ? [{ opacity: 1, clipPath: CLIP.reveal }, { opacity: 0, clipPath: CLIP.from }]
        : [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.8)' }],
      { duration: el === li ? WT.step * 2 : 300, delay: delays[k], easing: 'ease-out', fill: 'forwards' });
    });
    wpVeil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EZ.sineInOut, fill: 'both' });

    // отпечатки по пути от кадра к панели
    const total = WT.step * 2 + WT.pause;
    for (let s = 1; s <= WT.steps; s++) {
      const t = s / (WT.steps + 1);
      const wdt = lerp(startRect.width, endRect.width, t);
      const hgt = lerp(startRect.height, endRect.height, t);
      const cx = lerp(centerOf(startRect).x, centerOf(endRect).x, t);
      const cy = lerp(centerOf(startRect).y, centerOf(endRect).y, t);
      const m = document.createElement('div');
      m.className = 'wmover';
      Object.assign(m.style, {
        left: (cx - wdt / 2) + 'px', top: (cy - hgt / 2) + 'px', width: wdt + 'px', height: hgt + 'px',
        backgroundImage: 'url("' + w.src + '")', zIndex: String(61 + s), clipPath: CLIP.from,
      });
      document.body.appendChild(m);
      m.animate([
        { opacity: 0.4, clipPath: CLIP.hide, easing: EZ.sineIn },
        { opacity: 1, clipPath: CLIP.reveal, offset: WT.step / total },
        { opacity: 1, clipPath: CLIP.reveal, offset: (WT.step + WT.pause) / total, easing: EZ.sineOut },
        { opacity: 1, clipPath: CLIP.from },
      ], { duration: total, delay: (s - 1) * WT.interval, fill: 'both' }).finished.then(() => m.remove(), () => m.remove());
    }

    // проявление панели
    const lead = WT.steps * WT.interval;
    wpImg.animate([{ clipPath: CLIP.hide }, { clipPath: CLIP.reveal }],
      { duration: WT.step * WT.panelFactor, delay: lead, easing: EZ.sineInOut, fill: 'both' });
    wpImg.style.clipPath = '';
    const contentIn = wpContent.animate([{ opacity: 0, transform: 'translateY(25px)' }, { opacity: 1, transform: 'none' }],
      { duration: 1000, delay: lead * 2, easing: EZ.expoOut, fill: 'both' });
    wpContent.style.opacity = '';
    setTimeout(() => { wBusy = false; wOpen = true; $('.wpanel__close', wp).focus({ preventScroll: true }); }, lead * 2 + 600);
    contentIn.finished.catch(() => {});
  };
  const closeWork = (instant) => {
    if (!wOpen || (wBusy && !instant)) return;
    wBusy = true;
    const items = shownItems();
    const back = () => {
      wp.hidden = true;
      wp.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      document.documentElement.style.overflow = '';
      const delays = wItem ? delaysFrom(wItem, items) : items.map(() => 0);
      items.forEach((el, k) => {
        el.getAnimations().forEach((a) => a.cancel());
        if (!instant && !reduced) {
          el.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: WT.step * 1.6, delay: delays[k], easing: EZ.expoOut, fill: 'backwards' });
        }
      });
      wBusy = false; wOpen = false;
      document.dispatchEvent(new Event('wpanel:closed'));
      if (!instant && wItem) $('.gallery__btn', wItem).focus({ preventScroll: true });
    };
    if (instant || reduced) { back(); return; }
    wp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: WT.step, easing: EZ.expoOut, fill: 'forwards' }).finished.then(back, back);
  };
  gallery.addEventListener('click', (e) => {
    const b = e.target.closest('.gallery__btn');
    if (b) openWork(Number(b.dataset.i), b.closest('.gallery__item'));
  });
  $('.wpanel__close', wp).addEventListener('click', () => closeWork());
  $('.wpanel__full', wp).addEventListener('click', () => { closeWork(true); openLb(wIdx); });
  $('.wpanel__order', wp).addEventListener('click', (e) => {
    e.preventDefault();
    const type = ORDER_TYPE[WORKS[wIdx].cat] || WORKS[wIdx].cat;
    closeWork(true);
    if (openContact) openContact(type);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wOpen && lb.hidden) closeWork(); });
  $('.lightbox__close', lb).addEventListener('click', closeLb);
  $('.lightbox__nav--prev', lb).addEventListener('click', () => step(-1));
  $('.lightbox__nav--next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) setMenu(false);
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') { // держим фокус внутри
      const f = $$('button', lb);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------------- contacts ---------------- */
  const tel = CONTACTS.phone.replace(/[^\d+]/g, '');
  const linksHTML = `
    <li><a href="https://t.me/${CONTACTS.telegram}" target="_blank" rel="noopener" aria-label="Написать в Telegram"><b>✈</b>telegram</a></li>
    <li><a href="tel:${tel}" data-reach="phone"><b>☏</b>позвонить</a></li>
    <li><a href="mailto:${CONTACTS.email}" data-reach="email"><b>✉</b>почта</a></li>`;
  $('#contact-links').innerHTML = linksHTML;
  $('#footer-contacts').insertAdjacentHTML('beforeend', `
    <a href="https://t.me/${CONTACTS.telegram}" target="_blank" rel="noopener"><b>✈</b>@${CONTACTS.telegram}</a>
    <a href="tel:${tel}" data-reach="phone"><b>☏</b>${CONTACTS.phone}</a>
    <a href="mailto:${CONTACTS.email}" data-reach="email"><b>✉</b>${CONTACTS.email}</a>`);

  /* ---------------- «как проходит съёмка» → всплывающее окно ---------------- */
  const pDlg = $('#process-dialog');
  if (pDlg && typeof pDlg.showModal === 'function') {
    const openP = (e) => { if (e) e.preventDefault(); pDlg.showModal(); };
    $$('.process-btn, a[href="#process"]').forEach((b) => b.addEventListener('click', openP));
    $('.extras-dialog__close', pDlg).addEventListener('click', () => pDlg.close());
    $('.extras-dialog__cta', pDlg).addEventListener('click', (e) => {
      e.preventDefault();
      pDlg.close();
      if (openContact) openContact();
    });
    pDlg.addEventListener('click', (e) => { if (e.target === pDlg) pDlg.close(); });
  }

  /* ---------------- «связаться с фотографом» → всплывающее окно ---------------- */
  const cDlg = $('#contact-dialog');
  if (cta && cDlg && typeof cDlg.showModal === 'function') {
    $('#cdlg-links').innerHTML = linksHTML;
    const cForm = $('#cdlg-form');
    const cStatus = $('.cdlg__status', cDlg);
    const cType = $('.cdlg__type', cDlg);
    let opener = cta;
    const closeC = () => cDlg.close();
    openContact = (type, from) => {
      opener = from || document.activeElement || cta;
      cStatus.textContent = '';
      cForm.elements.type.value = type || '';
      cType.hidden = !type;
      cType.textContent = type ? 'тема: ' + type.toLowerCase() : '';
      cDlg.showModal();
    };
    cta.addEventListener('click', (e) => { e.preventDefault(); openContact('', cta); });
    $$('.invite__btn, .js-contact').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      if (b.classList.contains('js-contact')) document.documentElement.classList.remove('menu-open');
      openContact('', b);
    }));
    const extrasCta = $('#extras-dialog .extras-dialog__cta');
    if (extrasCta) extrasCta.addEventListener('click', (e) => { e.preventDefault(); openContact('', $('.extras-btn')); });
    $('.extras-dialog__close', cDlg).addEventListener('click', closeC);
    cDlg.addEventListener('click', (e) => { if (e.target === cDlg) closeC(); });
    cDlg.addEventListener('close', () => { if (opener && opener.focus) opener.focus({ preventScroll: true }); });
    cForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      ['name', 'contact'].forEach((n) => {
        const input = cForm.elements[n];
        const bad = !input.value.trim();
        input.closest('.cdlg__field').classList.toggle('is-invalid', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      const consent = cForm.elements.consent;
      consent.closest('.cdlg__consent').classList.toggle('is-invalid', !consent.checked);
      if (!consent.checked) ok = false;
      if (!ok) { cStatus.textContent = 'Заполните имя, контакт и отметьте согласие'; return; }
      const d = new FormData(cForm);
      const body = `${d.get('type') ? 'Тема: ' + d.get('type') + '\n' : ''}Имя: ${d.get('name')}\nКонтакт: ${d.get('contact')}\n\n${d.get('message') || ''}`;
      window.location.href = `mailto:${CONTACTS.email}?subject=${encodeURIComponent('Заявка с сайта' + (d.get('type') ? ' — ' + d.get('type') : ''))}&body=${encodeURIComponent(body)}`;
      cStatus.textContent = 'Спасибо! Письмо открыто в вашей почте — осталось нажать «Отправить».';
      cForm.reset();
      cType.hidden = true;
    });
    $$('input', cForm).forEach((i) => i.addEventListener('input', () => { const f = i.closest('.cdlg__field'); if (f) f.classList.remove('is-invalid'); }));
  }

  /* ---------------- «позвонить» / «почта»: окно с номером или адресом ----------------
     На телефоне «позвонить» сразу открывает звонилку. На компьютере tel: никуда не ведёт,
     поэтому показываем номер с кнопками «скопировать» и «позвонить»; для почты — адрес
     и «открыть почту» (если почтовой программы нет, адрес можно скопировать). */
  const rDlg = $('#reach-dialog');
  if (rDlg && typeof rDlg.showModal === 'function') {
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const REACH = {
      phone: { icon: '☏', title: 'Позвонить', text: 'Буду рада вашему звонку.', value: CONTACTS.phone, href: 'tel:' + tel, go: 'позвонить' },
      email: { icon: '✉', title: 'Написать письмо', text: 'Отвечу в течение дня.', value: CONTACTS.email, href: 'mailto:' + CONTACTS.email, go: 'открыть почту' },
    };
    const copyBtn = $('.reach__copy', rDlg);
    let opener = null;
    const openReach = (kind, from) => {
      const r = REACH[kind];
      opener = from;
      $('.reach__icon', rDlg).textContent = r.icon;
      $('.reach__title', rDlg).textContent = r.title;
      $('.reach__text', rDlg).textContent = r.text;
      $('.reach__value', rDlg).textContent = r.value;
      $('.reach__go', rDlg).href = r.href;
      $('.reach__go-label', rDlg).textContent = r.go;
      copyBtn.textContent = 'скопировать';
      copyBtn.classList.remove('is-done');
      copyBtn.dataset.value = r.value;
      rDlg.showModal();
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-reach]');
      if (!a) return;
      if (a.dataset.reach === 'phone' && touch) return;   // на телефоне — сразу звонок
      e.preventDefault();
      openReach(a.dataset.reach, a);
    });
    copyBtn.addEventListener('click', async () => {
      const v = copyBtn.dataset.value;
      try {
        await navigator.clipboard.writeText(v);
      } catch (_) {
        const t = document.createElement('textarea');
        t.value = v; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (__) { /* остаётся ручное выделение */ }
        t.remove();
      }
      copyBtn.textContent = 'скопировано ✓';
      copyBtn.classList.add('is-done');
    });
    $('.extras-dialog__close', rDlg).addEventListener('click', () => rDlg.close());
    rDlg.addEventListener('click', (e) => { if (e.target === rDlg) rDlg.close(); });
    rDlg.addEventListener('close', () => { if (opener && opener.focus) opener.focus({ preventScroll: true }); });
  }

  // все <img> с кадрами — по точке фокуса (сетка, лента, мини-ленты, карточки, подход, приглашение)
  const applyFocus = (rootEl) => $$('img[src*="/w/"]', rootEl).forEach((im) => { im.style.objectPosition = focusOf(im.getAttribute('src')); });
  applyFocus(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((nd) => { if (nd.nodeType === 1) applyFocus(nd); }))).observe(document.body, { childList: true, subtree: true });

  $('#year').textContent = new Date().getFullYear();

  /* ---------------- типографика ----------------
     Правило сайта: предлоги, союзы и другие короткие слова не висят в конце строки —
     переносятся вместе со следующим словом; тире не начинает строку;
     последнее слово абзаца не остаётся на строке одно. Делается неразрывным пробелом. */
  const NBSP = ' ';
  const SHORT = /(^|[\s («"„])([А-ЯЁа-яёA-Za-z]{1,3})[ \t\n]+(?=\S)/g;
  const typo = (s) => {
    let prev;
    do { prev = s; s = s.replace(SHORT, `$1$2${NBSP}`); } while (s !== prev);   // цепочки: «и в доме»
    return s.replace(/[ \t\n]+([—–])/g, `${NBSP}$1`);                              // тире не с новой строки
  };
  // элементы, где текст разбит на буквы/слова для анимаций или стоит в одну строку
  const SKIP = '.glow, .wmenu__title, .wcontent__title, .hero__title, .hero__genres, .rot, .marquee, .chip, .pill, .flip, .bento__box, script, style, svg, noscript, textarea, input, .footer__nav, .menu__nav';
  const BLOCKS = 'p, li, h1, h2, h3, legend, figcaption, label > span, .step__title';
  const walkText = (root, fn) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(fn);
    return nodes;
  };
  const typograph = (root = document.body) => {
    walkText(root, (n) => { const t = typo(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; });
    // висячие строки: последнее слово блока держится за предыдущее
    const blocks = root.matches && root.matches(BLOCKS) ? [root, ...$$(BLOCKS, root)] : $$(BLOCKS, root);
    blocks.forEach((el) => {
      if (el.closest(SKIP)) return;
      if (el.textContent.trim().split(/\s+/).length < 3) return;     // короткие подписи не трогаем
      const nodes = walkText(el, () => {}).filter((n) => /\S/.test(n.nodeValue));
      const last = nodes[nodes.length - 1];
      if (last) last.nodeValue = last.nodeValue.replace(/[ \t\n]+(\S+\s*)$/, `${NBSP}$1`);
    });
  };
  typograph();
  window.siteTypograph = typograph;   // для текстов, которые появятся позже

  /* ---------------- подзаголовки: блок по ширине реального текста ----------------
     Строки подзаголовка выровнены по длине и короче своего блока, поэтому правый край
     текста «отставал» от линии карточек. Сужаем блок до самой длинной строки —
     текст встаёт ровно к правому полю (60 на десктопе). */
  const notes = $$('.sec-head .note');
  const fitNotes = () => notes.forEach((n) => {
    n.style.width = '';
    const r = document.createRange();
    r.selectNodeContents(n);
    const rects = [...r.getClientRects()].filter((q) => q.width > 1);
    if (!rects.length) return;
    const w = Math.max(...rects.map((q) => q.right)) - Math.min(...rects.map((q) => q.left));
    n.style.width = Math.ceil(w + 1) + 'px';
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitNotes);
  let fitT = 0;
  window.addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(fitNotes, 120); });
})();
