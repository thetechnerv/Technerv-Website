// Screenshot helper for design reviews.
// Usage:
//   node scripts/shot.mjs --path / --sel ".hero" --out shots/hero [--vp both|desktop|mobile] [--frames 1] [--full]
// Scrolls gradually to the target so scroll-triggered animations fire, then
// captures viewport frames starting at the section top (frames > 1 steps down by 85% vh).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, []),
);
const base = args.base || "http://localhost:5173";
const url = base + (args.path || "/");
const out = args.out || "shots/shot";
const frames = Number(args.frames || 1);
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const which = args.vp && args.vp !== "both" ? [args.vp] : ["desktop", "mobile"];
fs.mkdirSync(path.dirname(out), { recursive: true });

const browser = await chromium.launch();
for (const name of which) {
  const ctx = await browser.newContext({
    viewport: vps[name],
    deviceScaleFactor: name === "mobile" ? 2 : 1,
    isMobile: name === "mobile",
    hasTouch: name === "mobile",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  let targetY = 0;
  if (args.sel) {
    targetY = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return -1;
      return el.getBoundingClientRect().top + window.scrollY;
    }, args.sel);
    if (targetY < 0) {
      console.error(`selector not found: ${args.sel}`);
      process.exit(1);
    }
  }
  if (args.offset) targetY += Number(args.offset);
  // walk down in steps so ScrollTrigger reveals fire
  for (let y = 0; y < targetY; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate((yy) => window.scrollTo(0, yy), targetY);
  await page.waitForTimeout(1600);

  if (args.full) {
    // reveal everything below as well
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = targetY; y < h; y += 400) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(70);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const f = `${out}-${name}-full.png`;
    await page.screenshot({ path: f, fullPage: true });
    console.log(f);
  } else {
    for (let i = 0; i < frames; i++) {
      if (i > 0) {
        await page.evaluate((dy) => window.scrollBy(0, dy), Math.round(vps[name].height * 0.85));
        await page.waitForTimeout(1300);
      }
      const f = `${out}-${name}${frames > 1 ? `-${i + 1}` : ""}.png`;
      await page.screenshot({ path: f });
      console.log(f);
    }
  }
  await ctx.close();
}
await browser.close();
