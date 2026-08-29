import { chromium } from 'playwright-core';
import fs from 'node:fs';

const pages = JSON.parse(process.argv[2]);
const outRoot = process.argv[3];
const origin  = process.argv[4] || 'http://localhost:8080';
const VIEWPORTS = [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]];

const b = await chromium.launch({ channel: 'chrome' });
for (const [slug, path] of pages) {
  const dir = `${outRoot}/${slug}`;
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, width, height] of VIEWPORTS) {
    const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(origin + path, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    // Elementor gives entrance-animated sections `.elementor-invisible` and only
    // reveals them when its observer fires. A full-page screenshot re-scrolls the
    // page itself, so a section can be captured mid-animation -- or never revealed
    // at all, leaving a blank band where real content lives. Capture the settled
    // state instead: reveal them and collapse every animation/transition to zero.
    await p.addStyleTag({ content: `
      .elementor-invisible { visibility: visible !important; opacity: 1 !important; animation: none !important; }
      /* The Astro side's equivalent of elementor-invisible: an entrance-animated
         block waiting for its reveal. Neutralised the same way, on both sides, so
         neither is captured mid-animation or stuck hidden. */
      .es-anim-idle { opacity: 1 !important; animation: none !important; }
      *, *::before, *::after {
        animation-duration: 0s !important; animation-delay: 0s !important;
        transition-duration: 0s !important; transition-delay: 0s !important;
      }` });

    // force lazy-loaded / animated-on-scroll content to render
    await p.evaluate(async () => {
      await new Promise(r => { let y = 0; const t = setInterval(() => {
        window.scrollTo(0, y); y += 400;
        if (y > document.body.scrollHeight + 1000) { clearInterval(t); window.scrollTo(0,0); r(); }
      }, 60); });
    });
    // lazysizes swaps `data-src` in only once its observer fires, and a long page
    // can outrun the settle wait below: `la-habana` at 390px reached the
    // screenshot with its last landmark photo still an SVG placeholder, so the
    // reference showed a blank card where a real image lives -- reproducibly, not
    // as a flake. Force every still-unswapped lazy image to its authored source
    // and wait for it to settle, so what is captured is the settled page rather
    // than a race against the observer. Already-swapped images are untouched, so
    // a reference whose images all loaded in time is byte-identical to before.
    // `background_ken_burns=yes` slowly scales the active slide. Zeroing
    // transition durations makes it JUMP to the end scale instead of sitting at
    // its start, so the capture framed the photograph differently from a plain
    // `cover` render. Drop the active class: the start scale is the state the
    // page actually loads in.
    await p.evaluate(async () => {
      document
        .querySelectorAll('.elementor-ken-burns--active')
        .forEach((el) => el.classList.remove('elementor-ken-burns--active'));
    });

    // Swiper autoplays. Neutralising CSS animations does not stop it, because it
    // is JS driving inline transforms -- so `inicio`'s slider was captured on a
    // different slide at every viewport, mid-transition and with its caption not
    // yet faded in. Stop every autoplay and rewind to the first slide so the
    // capture is the page's initial state rather than whatever frame the timer
    // happened to be on.
    await p.evaluate(async () => {
      for (const el of document.querySelectorAll('.swiper, .swiper-container')) {
        const sw = el.swiper;
        if (!sw) continue;
        try { sw.autoplay && sw.autoplay.stop(); } catch {}
        try { sw.setTranslate && sw.setTransition(0); } catch {}
        try { sw.slideToLoop ? sw.slideToLoop(0, 0, false) : sw.slideTo(0, 0, false); } catch {}
      }
    });
    await p.waitForTimeout(400);

    // Elementor's media-carousel paints its slides as swiper-lazy background
    // images, not <img>: an unloaded slide carries `data-background` and no
    // `background-image` at all. Swiper only loads the slides near the viewport,
    // so on a long page the lower carousels reach the screenshot blank -- the
    // same class of reference defect as the unswapped `img[data-src]` below,
    // and reproducible, not a flake. Force every slide to its authored source.
    await p.evaluate(async () => {
      document.querySelectorAll('[data-background]').forEach((el) => {
        el.style.backgroundImage = `url("${el.dataset.background}")`;
        el.classList.add('swiper-lazy-loaded');
      });
    });
    await p.evaluate(async () => {
      // Native `loading="lazy"` defers the fetch for anything far below the
      // viewport. The scroll pass above returns to the top, so forcing `src` on
      // a lazy image low on the page queues a request the browser then declines
      // to make and the capture shows a blank box -- `inicio`'s Trustpilot badge
      // reached the screenshot that way. Opt every image out first.
      document.querySelectorAll('img[loading]').forEach((img) => {
        img.loading = 'eager';
      });
      document.querySelectorAll('img[data-src]').forEach((img) => {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        if (img.dataset.sizes && img.dataset.sizes !== 'auto') img.sizes = img.dataset.sizes;
        if (img.src !== img.dataset.src) img.src = img.dataset.src;
      });
      const settled = (i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((r) => {
              i.addEventListener('load', r, { once: true });
              i.addEventListener('error', r, { once: true });
            });
      // Bounded: an image that never settles must not hang the capture.
      await Promise.race([
        Promise.all([...document.images].map(settled)),
        new Promise((r) => setTimeout(r, 5000)),
      ]);
    });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
    if (name === 'desktop') {
      fs.writeFileSync(`${dir}/rendered.html`, await p.content());
    }
    await ctx.close();
    console.log(slug, name, 'ok');
  }
}
await b.close();
