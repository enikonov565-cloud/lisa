/* Лисса Миляева — фотограф. Поведение страницы. */
(() => {
  'use strict';

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
  const mflips = $$('.marquee .mflip');
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
  const applyFilter = (cat) => {
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
  wmenu.innerHTML = WORK_CATS.map((cat, k) => `<button class="wmenu__item" type="button" data-k="${k}">
      <span class="wmenu__title"></span><span class="wmenu__desc">${WCAT[cat].desc}</span></button>`).join('');
  const items = $$('.wmenu__item', wmenu).map((el, k) => {
    const cat = WORK_CATS[k];
    const chars = wSplit($('.wmenu__title', el), cat);
    el.style.setProperty('--cat', WCAT[cat].color);
    const group = document.createElement('div');
    group.className = 'wtiles__group';
    // кадры направления: обложка первой, потом остальные — каждый фрагмент из своего фото
    const pics = WORKS.filter((w) => w.cat === cat).sort((a, b) => (b.src === WCAT[cat].cover) - (a.src === WCAT[cat].cover)).slice(0, 4);
    group.innerHTML = pics.map((w) => `<div class="wtile" style="background-image:url('${w.src}')"></div>`).join('');
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
  // кадры лежат ПОД текстами (как в образце Codrops): крупно, вразброс по всей сцене
  const SPOTS = [[0.02, 0.04], [0.64, 0.02], [0.30, 0.50], [0.86, 0.62]];
  const placeTiles = (it) => {
    const st = stage.getBoundingClientRect();
    it.tiles.forEach((t) => { t.style.display = ''; t.style.width = ''; t.style.height = ''; });
    const base = it.tiles[0].offsetWidth || 480;
    let seed = (it.k + 5) * 7919;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const SCALES = [1.1, 0.85, 1, 0.75, 0.95];
    // порядок мест у каждого направления свой — картинка каждый раз новая
    const order = SPOTS.map((s, i) => [s, rnd()]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    it.tiles.forEach((t, i) => {
      const w = Math.min(base * SCALES[(i + it.k) % SCALES.length], st.width * 0.42);
      const h = w * 0.75;
      const [fx, fy] = order[i % order.length];
      const x = Math.max(0, Math.min(st.width - w, fx * st.width + (rnd() - 0.5) * st.width * 0.08));
      const y = Math.max(0, Math.min(st.height - h, fy * st.height + (rnd() - 0.5) * st.height * 0.1));
      t.style.left = x + 'px'; t.style.top = y + 'px';
      t.style.width = w + 'px'; t.style.height = h + 'px';
    });
  };
  /* ---- цвет текста подстраивается под то, что под ним ----
     Для каждого кадра заранее считаем яркость участков (сетка 32×24, кадр вписан 4:3).
     Над тёмным участком фото буква/слово становятся светлыми, над светлым — остаются своего цвета. */
  const LUM = new Map();
  const lumOf = (src) => {
    if (LUM.has(src)) return LUM.get(src);
    const rec = { grid: null };
    LUM.set(src, rec);
    const im = new Image();
    im.onload = () => {
      const W = 32, H = 24;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      const iar = im.naturalWidth / im.naturalHeight, BA = 4 / 3;
      let sw = im.naturalWidth, sh = im.naturalHeight, sx = 0, sy = 0;
      if (iar > BA) { sw = sh * BA; sx = (im.naturalWidth - sw) / 2; } else { sh = sw / BA; sy = (im.naturalHeight - sh) / 2; }
      cx.drawImage(im, sx, sy, sw, sh, 0, 0, W, H);
      const d = cx.getImageData(0, 0, W, H).data;
      const g = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) g[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      rec.grid = g;
    };
    im.src = src;
    return rec;
  };
  items.forEach((m) => m.tiles.forEach((t) => lumOf(t.style.backgroundImage.slice(5, -2))));
  const LIGHT = '#faf3ec';
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
        const gx = Math.min(31, Math.floor((x - b.l) / b.w * 32)), gy = Math.min(23, Math.floor((y - b.t) / b.h * 24));
        return b.rec.grid[gy * 32 + gx];
      }
      return null;
    };
    const paint = (el) => {
      const r = el.getBoundingClientRect();
      const lum = tone(r.left + r.width / 2, r.top + r.height / 2);
      el.style.color = lum != null && lum < 0.5 ? LIGHT : '';
    };
    items.forEach((m) => { m.chars.forEach(paint); $$('.wdw', m.desc).forEach(paint); });
  };
  const clearText = () => items.forEach((m) => { m.chars.forEach((c) => { c.style.color = ''; }); $$('.wdw', m.desc).forEach((w) => { w.style.color = ''; }); });
  const showTiles = (it) => {
    placeTiles(it);
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
