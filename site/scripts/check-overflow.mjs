// Reports elements wider than the viewport on mobile for each route.
import { chromium } from "playwright";
const routes = ["/", "/services", "/work", "/about", "/contact"];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
for (const r of routes) {
  await p.goto("http://localhost:5173" + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const res = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll("body *").forEach((el) => {
      const rc = el.getBoundingClientRect();
      if (rc.width === 0) return;
      if (rc.right > vw + 1 && !el.closest(".ticker, .wc-scroller, .cs-toc, .hero-terrain, .footer-mark, canvas")) {
        bad.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 2).join(".")} right=${Math.round(rc.right)}`);
      }
    });
    return { vw, sw: document.documentElement.scrollWidth, bad: bad.slice(0, 8) };
  });
  console.log(r, JSON.stringify(res));
}
await b.close();
