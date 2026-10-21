import { useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "../../data/projects";
import { ProjectCover } from "../ProjectCover";
import { gsap, getLenis, prefersReducedMotion, snapSection } from "../../lib/motion";
import "./WorksWheel.css";

const STEP_DEG = 15;

/** Project names on a turning drum; the cover beside it follows the active name. */
export function WorksWheel() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current!;
    const names = Array.from(el.querySelectorAll<HTMLElement>(".ww-name"));
    const covers = Array.from(el.querySelectorAll<HTMLElement>(".ww-cover"));
    const n = PROJECTS.length;

    const render = (f: number) => {
      names.forEach((nm, i) => {
        const d = i - f;
        const a = Math.abs(d);
        nm.style.transform = `rotateX(${-d * STEP_DEG}deg)`;
        nm.style.opacity = `${Math.max(0, 1 - a * 0.28)}`;
        nm.style.setProperty("--lit", `${Math.max(0, 1 - a * 1.6)}`);
      });
      covers.forEach((c, i) => {
        const d = i - f;
        const a = Math.abs(d);
        c.style.opacity = `${Math.max(0, 1 - a * 1.6)}`;
        c.style.transform = `translateY(${d * -6}%) scale(${1.06 - Math.min(a, 1) * 0.06 + (a < 0.01 ? 0 : 0)})`;
        c.style.zIndex = `${100 - Math.round(a * 10)}`;
      });
      setActive(Math.round(f));
    };
    render(0);
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const st = { f: 0 };
      const tw = gsap.to(st, {
        f: n - 1,
        ease: "none",
        onUpdate: () => render(st.f),
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (n - 1) * 0.55}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      });
      // rest on a project, never between two
      return snapSection(tw.scrollTrigger!, Array.from({ length: n }, (_, i) => i / (n - 1)));
    });
    return () => mm.revert();
  }, []);

  const jump = (slug: string) => {
    const t = document.getElementById(slug);
    const l = getLenis();
    if (t && l) l.scrollTo(t, { offset: -90, duration: 1.6 });
    else t?.scrollIntoView({ behavior: "smooth" });
  };

  const p = PROJECTS[active];

  return (
    <div className="ww" ref={root}>
      <div className="ww-left">
        <div className="ww-drum" aria-label="Projects">
          {PROJECTS.map((pr, i) => (
            <button key={pr.slug} className="ww-name" onClick={() => jump(pr.slug)} aria-current={i === active}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {pr.name}
            </button>
          ))}
        </div>
        <span className="ww-caret" aria-hidden />
      </div>

      <div className="ww-right">
        <div className="ww-stage">
          {PROJECTS.map((pr) => (
            <div key={pr.slug} className="ww-cover">
              <ProjectCover p={pr} />
            </div>
          ))}
        </div>
        <div className="ww-info" key={p.slug}>
          <div>
            <span className="mono ww-sector">
              {p.sector} · {p.year}
            </span>
            <p>{p.summary}</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => jump(p.slug)}>
            Read case study
          </button>
        </div>
      </div>
    </div>
  );
}
