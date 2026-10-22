/* Лисса Миляева — фотограф. Плавный скролл (Lenis) и анимации GSAP + ScrollTrigger.
   Библиотеки подключены через CDN в index.html; если они не загрузились — сайт работает как раньше. */
(() => {
  'use strict';

  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const release = () => html.classList.remove('motion-wait');   // показать то, что ждало анимации

  if (reduced || !window.gsap || !window.ScrollTrigger) { release(); return; }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const EASE = 'expo.out';   // как во всех анимациях сайта: резкий старт, долгое мягкое торможение
  const rem = () => parseFloat(getComputedStyle(html).fontSize);

  /* ---------------- Lenis: плавный скролл, связанный с ScrollTrigger ---------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: false,   // кадры Lenis считает тикер GSAP — один цикл на всё
      // внутри окон, меню, лайтбокса и панели кадра колесо прокручивает их, а не страницу
      prevent: (node) => !!(node.closest && node.closest('dialog, #menu, #lightbox, #wpanel, [data-lenis-prevent]')),
    });
    window.lenis = lenis;   // main.js прокручивает через него (кнопки, раскрытие «Кто я», лента кадров)

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // меню и окна запирают страницу — Lenis на это время останавливается
    const locked = () => html.classList.contains('menu-open') || html.style.overflow === 'hidden' || !!document.querySelector('dialog[open]');
    const sync = () => { if (locked()) lenis.stop(); else lenis.start(); };
    new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['class', 'style'] });
    document.querySelectorAll('dialog').forEach((d) => new MutationObserver(sync).observe(d, { attributes: true, attributeFilter: ['open'] }));

    // ссылки на разделы (#about, #works…) — плавно через Lenis, без якоря в адресе
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#"]');
      const id = a && a.getAttribute('href');
      if (!id || id.length < 2) return;
      let t = null;
      try { t = document.querySelector(id); } catch (x) { return; }
      if (!t) return;
      e.preventDefault();
      lenis.start();
      lenis.resize();   // высота страницы могла только что измениться
      // раздел мог только что появиться (раскрытие «Кто я» меняет высоту) — в конце доводим точно
      lenis.scrollTo(t, {
        force: true,
        onComplete: () => { if (Math.abs(t.getBoundingClientRect().top) > 2) lenis.scrollTo(t, { force: true }); },
      });
    });
  }

  // высота страницы меняется (раскрытие «Кто я», догрузка фото) — пересчитываем точки срабатывания
  let refreshT = 0;
  const refresh = () => { clearTimeout(refreshT); refreshT = setTimeout(() => { if (lenis) lenis.resize(); ScrollTrigger.refresh(); }, 150); };
  new ResizeObserver(refresh).observe(document.body);
  // разделы после «Кто я» появляются разом — пересчитываем сразу, не дожидаясь перерисовки
  document.querySelectorAll('main > section[hidden]').forEach((sec) => new MutationObserver(() => {
    if (lenis) lenis.resize();
    refresh();
  }).observe(sec, { attributes: true, attributeFilter: ['hidden'] }));

  /* ---------------- первый экран: заголовок выезжает снизу при загрузке ---------------- */
  const hero = document.querySelector('.hero--shapes');
  if (hero && html.classList.contains('motion-wait')) {
    const slide = hero.querySelector('.shapes__slide.is-current') || hero.querySelector('.shapes__slide');
    // у заголовка две копии строк (поверх фото и под ним) — каждая пара едет вместе
    const rows = slide ? [...slide.querySelectorAll('figcaption .text-row > span')] : [];
    const lite = slide ? [...slide.querySelectorAll('.shapes__cap--light .text-row > span')] : [];
    const name = hero.querySelector('.hero__name');
    const pairs = rows.map((r, i) => [r, lite[i]].filter(Boolean));

    pairs.forEach((p) => gsap.set(p, { yPercent: 160 }));   // строки прячутся под край своей маски
    if (name) gsap.set(name, { yPercent: 100, opacity: 0 });
    release();

    const start = () => {
      const tl = gsap.timeline({ delay: 0.1 });
      // строки — в такт с раскрытием круга с фото (та же длительность и кривая, что у слайдшоу)
      pairs.forEach((p, i) => tl.to(p, { yPercent: 0, duration: 1.5, ease: 'power2.inOut', clearProps: 'transform' }, i * 0.1));
      // имя — следом, мягко всплывает
      if (name) tl.to(name, { yPercent: 0, opacity: 1, duration: 1.2, ease: EASE, clearProps: 'transform,opacity' }, 0.7);
    };
    // шрифт заголовка в preload — обычно готов сразу; ждём его, но не дольше 0,3 с
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 300))]).then(start);
  } else {
    release();
  }

  /* ---------------- «О чём мои кадры»: карточки появляются каскадом при скролле ---------------- */
  const gsec = document.querySelector('#genres');
  const cards = gsec ? gsap.utils.toArray('.genre', gsec) : [];
  if (cards.length) {
    gsap.set(cards, { opacity: 0, y: () => rem() * 6 });
    const initCards = () => {
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08, overwrite: true, clearProps: 'transform,opacity',
        }),
      });
      ScrollTrigger.refresh();
    };
    // раздел скрыт, пока не раскрыта «Кто я»: точки срабатывания считаем, когда он появится
    if (!gsec.hidden) initCards();
    else {
      new MutationObserver((m, obs) => {
        if (gsec.hidden) return;
        obs.disconnect();
        initCards();
      }).observe(gsec, { attributes: true, attributeFilter: ['hidden'] });
    }
  }
})();
