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
      img: 'assets/img/approach-portrait.jpg',
      alt: 'Портрет при естественном свете у окна',
      includes: ['1 час съёмки на локации', '20 кадров в обработке', 'подбор локации и времени света'],
    },
  ];

  const WORKS = [
    { src: 'assets/img/hero-portrait.jpg', cat: 'Портрет', title: 'Студийный портрет', alt: 'Студийный портрет женщины с рыжими волосами на тёмном фоне', size: 'tall' },
    { src: 'assets/img/about-arch.jpg', cat: 'Пейзаж', title: 'Осенняя арка', alt: 'Каменная арка и тропинка среди осенней листвы', size: 'wide' },
    { src: 'assets/img/approach-fox.jpg', cat: 'Реклама', title: 'Лиса-оригами, предметная съёмка', alt: 'Фигурка лисы в технике оригами' },
    { src: 'assets/img/approach-owl.jpg', cat: 'Реклама', title: 'Сова, предметная съёмка', alt: 'Металлическая фигурка совы на фоне боке' },
    { src: 'assets/img/approach-portrait.jpg', cat: 'Портрет', title: 'Деловой портрет', alt: 'Женщина в светлом жакете у окна' },
    { src: 'assets/img/about-flower.jpg', cat: 'Пейзаж', title: 'Хризантема', alt: 'Крупный план цветка хризантемы' },
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

  /* ---------------- services ---------------- */
  const list = $('#svc-list');
  const card = {
    img: $('#svc-img'), kicker: $('#svc-kicker'), price: $('#svc-price'),
    includes: $('#svc-includes'), order: $('#svc-order'),
  };
  list.innerHTML = SERVICES.map((s, i) => `
    <li class="svc__item rv" style="--d:${i * 0.06}s" tabindex="0" data-i="${i}" aria-label="${s.title}, ${s.price}">
      <span class="chip">${s.title}</span>
      <p>${s.text}</p>
    </li>`).join('');

  let activeSvc = -1;
  const showService = (i) => {
    if (i === activeSvc) return;
    activeSvc = i;
    const s = SERVICES[i];
    $$('.svc__item', list).forEach((el) => el.classList.toggle('is-active', Number(el.dataset.i) === i));
    card.kicker.textContent = s.title.toLowerCase();
    card.price.textContent = s.price;
    card.includes.innerHTML = s.includes.map((t) => `<li>${t}</li>`).join('');
    card.order.dataset.type = s.title;
    card.img.classList.add('is-swapping');
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      card.img.src = s.img;
      card.img.alt = s.alt;
      requestAnimationFrame(() => card.img.classList.remove('is-swapping'));
    };
    pre.src = s.img;
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

  // «заказать съёмку» → выбрать тип в форме
  card.order.addEventListener('click', () => {
    const r = $(`.form__types input[value="${card.order.dataset.type}"]`);
    if (r) r.checked = true;
  });

  /* ---------------- gallery + filters ---------------- */
  const gallery = $('#gallery');
  const filters = $('#filters');
  const cats = ['Все', ...new Set(WORKS.map((w) => w.cat))];

  filters.innerHTML = cats.map((c, i) => {
    const n = c === 'Все' ? WORKS.length : WORKS.filter((w) => w.cat === c).length;
    return `<button type="button" role="tab" aria-selected="${i === 0}" data-cat="${c}">${c.toLowerCase()}<sup>${n}</sup></button>`;
  }).join('');

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
  $('#contact-links').innerHTML = `
    <li><a href="https://t.me/${CONTACTS.telegram}" target="_blank" rel="noopener"><span>telegram</span>@${CONTACTS.telegram}</a></li>
    <li><a href="tel:${tel}"><span>телефон</span>${CONTACTS.phone}</a></li>
    <li><a href="mailto:${CONTACTS.email}"><span>почта</span>${CONTACTS.email}</a></li>`;

  /* ---------------- form ---------------- */
  // Сайт статичный: заявка собирается в письмо и открывается в почтовом клиенте.
  // Для приёма заявок в Telegram подключите бота.
  const form = $('#form');
  const status = $('#form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['name', 'contact'].forEach((n) => {
      const input = form.elements[n];
      const bad = !input.value.trim();
      input.closest('.field').classList.toggle('is-invalid', bad);
      if (bad && ok) { input.focus(); ok = false; }
    });
    const consent = form.elements.consent;
    consent.closest('.consent').classList.toggle('is-invalid', !consent.checked);
    if (!consent.checked) ok = false;
    if (!ok) { status.textContent = 'Проверьте отмеченные поля'; return; }

    const d = new FormData(form);
    const body = `Тип съёмки: ${d.get('type')}\nИмя: ${d.get('name')}\nКонтакт: ${d.get('contact')}\n\n${d.get('message') || ''}`;
    window.location.href = `mailto:${CONTACTS.email}?subject=${encodeURIComponent('Заявка на съёмку — ' + d.get('type'))}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Спасибо! Письмо с заявкой открыто в вашей почте — осталось нажать «Отправить».';
    form.reset();
  });
  $$('.field input', form).forEach((i) => i.addEventListener('input', () => i.closest('.field').classList.remove('is-invalid')));

  $('#year').textContent = new Date().getFullYear();
})();
