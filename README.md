# Василиса Ёлкина — фотограф

Сайт-портфолио: статичный HTML/CSS/JS, без сборки.

- `index.html` — страница
- `assets/css/style.css` — стили
- `assets/js/main.js` — анимации и интерактив
- `assets/js/depth-gallery.js` — исходник WebGL-галереи на первом экране (по мотивам [Atmospheric Depth Gallery](https://github.com/houmahani/codrops-depth-gallery), MIT)
- `assets/js/depth-gallery.bundle.js` — собранная версия, её подключает страница (работает и при открытии `index.html` файлом)
- `assets/js/depth-images.js` — фото галереи, встроенные в скрипт; грузятся только при открытии файлом (`file://`)
- `assets/js/ribbon-glow.js` — фон карточки гарантий (WebGL2)

После правок в `depth-gallery.js` пересоберите бандл:

```
npx esbuild assets/js/depth-gallery.js --bundle --format=iife --minify --target=es2019 --outfile=assets/js/depth-gallery.bundle.js
```

После замены фото `assets/img/depth-*.jpg` обновите и `depth-images.js`.
- `assets/vendor/three/` — Three.js 0.183 (MIT)

Публикуется через GitHub Pages из ветки `main`.
