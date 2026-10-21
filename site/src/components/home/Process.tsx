import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/motion";
import { SplitText, Reveal } from "../Reveal";
import { GlassIcon, type GlassName } from "../GlassIcon";
import "./Process.css";

export const PROCESS: { t: string; time: string; d: string; icon: GlassName }[] = [
  {
    icon: "discover",
    t: "Discover",
    time: "1 to 2 weeks",
    d: "We learn how your business works, where time is being lost, and what a good result looks like for you.",
  },
  {
    icon: "design",
    t: "Design",
    time: "2 to 3 weeks",
    d: "We plan the solution and design screens you can click through before any code is written.",
  },
  {
    icon: "build",
    t: "Build",
    time: "Weekly releases",
    d: "We build in short cycles and show you working progress every week, so there are no surprises.",
  },
  {
    icon: "launch",
    t: "Launch & support",
    time: "Ongoing",
    d: "We launch, train your team, and keep improving the product after it goes live.",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(".pr-step");
      const vertical = window.matchMedia("(max-width: 900px)").matches;
      gsap.fromTo(
        ".pr-rail-fill",
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: "none",
          scrollTrigger: {
            trigger: ".pr-steps",
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.4,
            // light each node only once the rail has reached it
            onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle("is-lit", self.progress >= i / (steps.length - 1) - 0.01)),
          },
        },
      );
      gsap.utils.toArray<HTMLElement>(".pr-step").forEach((s, i) => {
        gsap.from(s, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: ".pr-steps", start: "top 80%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section process" ref={ref}>
      <div className="wrap">
        <div className="pr-head">
          <div>
            <span className="eyebrow">How we work</span>
            <SplitText className="h2" text={"A clear process,\nfrom first call to launch."} highlight={["clear"]} />
          </div>
          <Reveal as="p" className="lead pr-lead" delay={0.1}>
            Every project follows the same four steps, so you always know what is happening and what comes next.
          </Reveal>
        </div>

        <div className="pr-steps">
          <div className="pr-rail" aria-hidden>
            <span className="pr-rail-fill" />
          </div>
          {PROCESS.map((p, i) => (
            <article key={p.t} className="pr-step gi-host">
              <span className="pr-node" aria-hidden />
              <div className="pr-top">
                <span className="pr-num mono">0{i + 1}</span>
                <GlassIcon name={p.icon} size={64} />
              </div>
              <h3 className="h3">{p.t}</h3>
              <p>{p.d}</p>
              <span className="pr-time mono">{p.time}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
