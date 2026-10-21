import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../../data/projects";
import { ProjectCover } from "../ProjectCover";
import { SplitText } from "../Reveal";
import { gsap, prefersReducedMotion, snapSection } from "../../lib/motion";
import "./WorkCarousel.css";

/**
 * A concave wall of work: cards curve in from the edges, flatten as they reach
 * the centre and swing away again — scrubbed by vertical scroll on desktop,
 * native swipe on touch.
 */
export function WorkCarousel() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const tr = track.current!;
    const sc = scroller.current!;
    const cards = Array.from(tr.querySelectorAll<HTMLElement>(".wc-card"));

    const curve = () => {
      const vw = window.innerWidth;
      // the track only ever translates, so its own box gives the live origin
      const origin = tr.getBoundingClientRect().left;
      let nearest = 0,
        best = Infinity;
      cards.forEach((c, i) => {
        const center = origin + c.offsetLeft + c.offsetWidth / 2;
        if (Math.abs(center - vw / 2) < best) {
          best = Math.abs(center - vw / 2);
          nearest = i;
        }
        const o = Math.max(-1.8, Math.min(1.8, (center - vw / 2) / (vw / 2)));
        const a = Math.abs(o);
        // curve only the image; captions stay flat and sharp
        const media = c.firstElementChild as HTMLElement;
        media.style.transform = `perspective(1600px) rotateY(${-o * 24}deg) translateZ(${a * 26}px) scale(${1 - a * 0.03})`;
        c.style.setProperty("--shade", `${Math.min(0.3, a * 0.22)}`);
        c.style.opacity = `${Math.max(0.75, 1 - Math.max(0, a - 1.15) * 1.2)}`;
      });
      if (count.current) count.current.textContent = `${String(nearest + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      if (bar.current) {
        const max = tr.scrollWidth - sc.clientWidth;
        const p = sc.scrollLeft > 0 ? sc.scrollLeft / Math.max(1, sc.scrollWidth - sc.clientWidth) : -Number(gsap.getProperty(tr, "x")) / Math.max(1, max);
        bar.current.style.transform = `scaleX(${Math.max(0.04, Math.min(1, p))})`;
      }
    };

    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      // first card lines up with the heading's left edge
      const start = () => (el.querySelector(".wc-head") as HTMLElement).getBoundingClientRect().left + parseFloat(getComputedStyle(el.querySelector(".wc-head")!).paddingLeft);
      const dist = () => tr.scrollWidth - window.innerWidth + start();
      const tw = gsap.fromTo(
        tr,
        { x: () => start() },
        {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ".wc-pin",
            start: "top top",
            end: () => `+=${dist()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: curve,
            onRefresh: curve,
          },
        },
      );
      curve();
      // come to rest with a card centred (plus the two ends so the section can be left)
      return snapSection(tw.scrollTrigger!, () => {
        const s0 = start();
        const total = s0 + dist();
        const centres = cards.map((c) => (s0 - (window.innerWidth / 2 - (c.offsetLeft + c.offsetWidth / 2))) / total);
        return [0, ...centres.filter((p) => p > 0.02 && p < 0.98), 1];
      });
    });
    mm.add("(max-width: 899px)", () => {
      sc.addEventListener("scroll", curve, { passive: true });
      curve();
      return () => sc.removeEventListener("scroll", curve);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="wc" ref={root}>
      <div className="wc-pin">
        <div className="wrap wc-head">
          <div>
            <span className="eyebrow">Projects</span>
            <SplitText className="h2" text={"A look at\nour work."} highlight={["our", "work"]} />
          </div>
          <div className="wc-head-side">
            <p className="muted">Example projects for illustration. Real case studies are coming soon.</p>
            <Link to="/work" className="btn btn-glass btn-sm">
              All work
            </Link>
          </div>
        </div>

        <div className="wc-scroller" ref={scroller}>
          <div className="wc-track" ref={track}>
            {PROJECTS.map((p, i) => (
              <Link key={p.slug} to={`/work#${p.slug}`} className="wc-card">
                <div className="wc-media">
                  <ProjectCover p={p} />
                  <span className="wc-index mono">
                    {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="wc-meta">
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.headline}</p>
                  </div>
                  <span className="wc-tags mono">{p.services.join(" · ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="wrap wc-foot">
          <span className="mono wc-count" ref={count}>
            01 / 06
          </span>
          <span className="wc-progress">
            <span ref={bar} />
          </span>
          <span className="mono wc-hint">Swipe to explore</span>
        </div>
      </div>
    </section>
  );
}
