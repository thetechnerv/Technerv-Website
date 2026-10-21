import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/motion";
import { GlassIcon, type GlassName } from "../GlassIcon";
import "./Manifesto.css";

// [text, inline icon after it]
const PARTS: [string, GlassName?][] = [
  ["Many businesses use software that doesn't fit the way they work."],
  ["We build software around your processes.", "crm"],
  ["It can take care of routine tasks,", "ai"],
  ["and it asks a person to step in when a decision needs one.", "voice"],
];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) {
      el.querySelectorAll<HTMLElement>(".mw").forEach((w) => (w.style.opacity = "1"));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mw",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: ".manifesto-text", start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        ".mi",
        { scale: 0.6, rotate: -20, opacity: 0.3 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          ease: "back.out(2)",
          stagger: 0.3,
          scrollTrigger: { trigger: ".manifesto-text", start: "top 60%", end: "bottom 50%", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto section" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">Our approach</span>
        <p className="manifesto-text">
          {PARTS.map(([text, icon], pi) => (
            <span key={pi}>
              {text.split(" ").map((w, i) => (
                <span key={i} className={`mw ${pi === 1 ? "is-accent" : ""}`}>
                  {w}{" "}
                </span>
              ))}
              {icon ? (
                <span className="mi" aria-hidden>
                  <GlassIcon name={icon} size={96} />
                </span>
              ) : null}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
