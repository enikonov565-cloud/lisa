/* Василиса Ёлкина — фотограф. Поведение страницы. */
(() => {
  'use strict';

  /* ----------------------------------------------------------------------
     НАСТРОЙКИ — всё, что Василиса может поменять сама
     ---------------------------------------------------------------------- */
  const CONTACTS = {
    telegram: 'vasilisa_elkina',          // ник без @
    phone: '+7 (900) 000-00-00',          // как показывать
    email: 'hello@vasilisa-elkina.ru',
  };

  const SERVICES = [
    {
      title: 'Рекламная съёмка',
      text: 'кампании, предметка, lookbook, контент для брендов',
      price: 'от 12 000 ₽',
      img: 'assets/img/approach-owl.jpg',
      alt: 'Металлическая фигурка совы — пример предметной съёмки',
      includes: ['2 часа съёмки', '30 кадров в авторской обработке', 'готовые файлы за 7 дней'],
    },
    {
      title: 'Пейзаж',
      text: 'горы, море, рассветы — принты и фотоистории',
      price: 'от 4 000 ₽',
      img: 'assets/img/about-arch.jpg',
      alt: 'Осенняя каменная арка — пейзажная фотография',
      includes: ['принт или цифровой файл', 'подбор кадра под интерьер', 'печать на хлопковой бумаге'],
    },
    {
      title: 'Стрит-фотография',
      text: 'случайные моменты, которые больше не повторятся',
      price: 'от 6 000 ₽',
      img: 'assets/img/about-flower.jpg',
      alt: 'Тёплый крупный план цветка — стрит и деталь города',
      includes: ['прогулка по городу 1,5 часа', '25 кадров в обработке', 'готовые файлы за 7 дней'],
    },
    {
      title: 'Студийный портрет',
      text: 'свет, характер, персональный и деловой образ',
      price: 'от 8 000 ₽',
      img: 'assets/img/hero-portrait.jpg',
      alt: 'Студийный портрет на тёмном фоне',
      includes: ['1 час в студии', '15 кадров в ретуши', 'помощь с образом и позированием'],
    },
    {
      title: 'Уличный портрет',
      text: 'естественный свет и живой город вокруг героя',
      price: 'от 7 000 ₽',
      img: 'assets/img/depth-3.jpg',
      alt: 'Портрет при естественном свете у окна',
      includes: ['1 час съёмки на локации', '20 кадров в обработке', 'подбор локации и времени света'],
    },
  ];

  // разделы галереи — те же, что в услугах
  const WORK_CATS = ['Реклама', 'Студийный портрет', 'Уличный портрет', 'Пейзаж', 'Стрит'];
  const WORKS = [
    { src: 'assets/img/hero-portrait.jpg', cat: 'Студийный портрет', title: 'Студийный портрет', alt: 'Студийный портрет женщины с рыжими волосами на тёмном фоне', size: 'tall' },
    { src: 'assets/img/about-arch.jpg', cat: 'Пейзаж', title: 'Осенняя арка', alt: 'Каменная арка и тропинка среди осенней листвы', size: 'wide' },
    { src: 'assets/img/approach-fox.jpg', cat: 'Реклама', title: 'Лиса-оригами, предметная съёмка', alt: 'Фигурка лисы в технике оригами' },
    { src: 'assets/img/approach-owl.jpg', cat: 'Реклама', title: 'Сова, предметная съёмка', alt: 'Металлическая фигурка совы на фоне боке' },
    { src: 'assets/img/depth-3.jpg', cat: 'Уличный портрет', title: 'Свет у окна', alt: 'Женщина в светлом жакете у окна' },
    { src: 'assets/img/about-flower.jpg', cat: 'Стрит', title: 'Хризантема', alt: 'Крупный план цветка хризантемы' },
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
     Слова «реклама · портрет · пейзаж · стрит» появляются по очереди: буквы мягко
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

  /* ---------------- text carousel: «Василиса Ёлкина — [фотограф]» ----------------
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
    ['var(--milk)', 'var(--orange)'],          // рекламная съёмка
    ['#e8925a', 'var(--ink-deep)'],             // пейзаж
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
    // «падающие буквы» (как «реклама · портрет · пейзаж · стрит» на главном экране)
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
  const filters = $('#filters');
  const cats = ['Все', ...WORK_CATS];

  filters.innerHTML = cats.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cat="${c}">${c.toLowerCase()}</button>`).join('');

  gallery.innerHTML = WORKS.map((w, i) => `
    <li class="gallery__item${w.size ? ' gallery__item--' + w.size : ''}" data-cat="${w.cat}">
      <button class="gallery__btn" type="button" data-i="${i}" aria-label="Открыть фото: ${w.title}">
        <img src="${w.src}" alt="${w.alt}" loading="lazy">
        <span class="gallery__cap">${w.title}</span>
      </button>
    </li>`).join('');

  let visible = WORKS.map((_, i) => i);
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const cat = btn.dataset.cat;
    $$('button', filters).forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
    visible = [];
    $$('.gallery__item', gallery).forEach((li, i) => {
      const show = cat === 'Все' || li.dataset.cat === cat;
      li.classList.toggle('is-hidden', !show);
      if (show) {
        visible.push(i);
        if (!reduced) li.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', delay: visible.length * 50, fill: 'backwards' });
      }
    });
  });

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

  gallery.addEventListener('click', (e) => {
    const b = e.target.closest('.gallery__btn');
    if (b) openLb(Number(b.dataset.i));
  });
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
  const SKIP = '.hero__title, .hero__genres, .rot, .marquee, .chip, .pill, .flip, .bento__box, script, style, svg, noscript, textarea, input, .footer__nav, .menu__nav';
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
