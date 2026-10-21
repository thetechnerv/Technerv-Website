import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

/**
 * Snap a pinned/scrubbed section to fixed progress points once scrolling settles.
 * ScrollTrigger's own `snap` fights Lenis, so this waits for Lenis to go quiet,
 * then glides to the nearest point. Only acts while the page sits inside the section.
 */
export function snapSection(st: ScrollTrigger, points: number[] | (() => number[]), { delay = 140, duration = 0.7 } = {}) {
  const l = lenis;
  let timer = 0;
  let snapping = false;

  const settle = () => {
    if (snapping || !st.isActive) return;
    const y = window.scrollY;
    const span = st.end - st.start;
    if (span <= 0) return;
    const p = (y - st.start) / span;
    const pts = typeof points === "function" ? points() : points;
    const nearest = pts.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a), pts[0]);
    const target = st.start + nearest * span;
    if (Math.abs(target - y) < 2) return;
    snapping = true;
    const done = () => (snapping = false);
    if (l) l.scrollTo(target, { duration, easing: (t) => 1 - Math.pow(1 - t, 3), onComplete: done });
    else {
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(done, duration * 1000);
    }
  };

  const onScroll = () => {
    if (snapping) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, delay);
  };

  const unsubscribe = l ? l.on("scroll", onScroll) : null;
  if (!l) window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    window.clearTimeout(timer);
    if (unsubscribe) unsubscribe();
    else window.removeEventListener("scroll", onScroll);
  };
}

export { gsap, ScrollTrigger };
