import { useLayoutEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  /** stagger direct children instead of the element itself */
  stagger?: number;
  blur?: boolean;
};

/** Fades + lifts content as it enters the viewport. */
export function Reveal({ as: Tag = "div", children, className, style, delay = 0, y = 28, stagger, blur = true }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, autoAlpha: 0, filter: blur ? "blur(8px)" : "none" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          delay,
          stagger: stagger ?? 0,
          clearProps: "filter",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger, blur]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

type SplitProps = {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  /** words to wrap in the signal gradient */
  highlight?: string[];
  immediate?: boolean;
};

/** Masked word-by-word rise — the Apple keynote headline move. */
export function SplitText({ as: Tag = "h2", text, className, delay = 0, highlight = [], immediate = false }: SplitProps) {
  const ref = useRef<HTMLElement>(null);
  const lines = text.split("\n");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>(".sw > span");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.045,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, immediate]);

  const clean = (w: string) => w.replace(/[.,!?—]/g, "");
  // one continuous gradient across all highlighted words
  const hiCount = text.split(/\s+/).filter((w) => highlight.includes(clean(w))).length;
  let hiIndex = 0;
  const hiStyle = () => {
    const k = hiIndex++;
    return hiCount > 1
      ? { backgroundSize: `${hiCount * 100}% 100%`, backgroundPosition: `${(k / (hiCount - 1)) * 100}% 0` }
      : undefined;
  };

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} className="split-row" style={{ display: "block" }} aria-hidden>
          {line.split(" ").map((w, wi) => (
            <span key={wi} className="sw" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
              <span
                style={{ display: "inline-block", transformOrigin: "0 100%", ...(highlight.includes(clean(w)) ? hiStyle() : {}) }}
                className={highlight.includes(clean(w)) ? "grad-text" : undefined}
              >
                {w}
                {wi < line.split(" ").length - 1 ? " " : ""}
              </span>
            </span>
          ))}{" "}
        </span>
      ))}
    </Tag>
  );
}
