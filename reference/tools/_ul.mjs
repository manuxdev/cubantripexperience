import { chromium } from "playwright-core";
const br = await chromium.launch({ channel: "chrome" });
const p = await (await br.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:8080/destinos/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const items = [...document.querySelectorAll(".elementor-nav-menu--main .elementor-item")];
  const idle = items.find((i) => !i.classList.contains("elementor-item-active")) || items[0];
  const a = getComputedStyle(idle, "::after");
  const b = getComputedStyle(idle, "::before");
  const own = getComputedStyle(idle);
  return {
    text: idle.textContent.trim(),
    after: { content: a.content, w: a.width, h: a.height, opacity: a.opacity, bg: a.backgroundColor, start: a.insetInlineStart, bottom: a.bottom, transform: a.transform, transition: a.transitionProperty },
    before: { content: b.content, w: b.width, h: b.height, opacity: b.opacity },
    item: { overflow: own.overflow, position: own.position },
  };
}), null, 1));
await br.close();
