import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SignalTerrain } from "../SignalTerrain";
import { SplitText } from "../Reveal";
import { PixelIcon } from "../PixelIcon";
import { GlassIcon } from "../GlassIcon";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/motion";
import "./Hero.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // entrance
      gsap.from(".hero-chip, .hero-lead, .hero-ctas", {
        y: 18,
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.45,
        clearProps: "filter",
      });
      gsap.from(".hero-card", {
        y: 60,
        autoAlpha: 0,
        scale: 0.94,
        duration: 1.6,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.8,
      });
      gsap.from(".hero-terrain", { autoAlpha: 0, duration: 2.2, ease: "power2.out", delay: 0.2 });

      // scroll parallax — layered depth
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-copy", { yPercent: -12, ease: "none", scrollTrigger: st });
      gsap.to(".hero-terrain", { yPercent: 5, ease: "none", scrollTrigger: st });
      // fromTo + immediateRender:false so the entrance offset is never captured as the parallax start
      ([[".hc-a", -140], [".hc-b", -220], [".hc-c", -90]] as const).forEach(([sel, y]) =>
        gsap.fromTo(sel, { y: 0 }, { y, ease: "none", immediateRender: false, scrollTrigger: st }),
      );
      // Anything that reaches the nav dissolves first, measured from its real on-screen position
      // (after parallax), and comes back on the way up.
      const faders = gsap.utils.toArray<HTMLElement>(".hero-title, .hero-lead, .hero-ctas, .hero-card-inner");
      const pillBottom = () => (document.querySelector(".nav-inner")?.getBoundingClientRect().bottom ?? 74) + 6;
      const fade = () => {
        const edge = pillBottom();
        faders.forEach((f) => {
          const top = f.getBoundingClientRect().top;
          // stay solid until the element meets the pill, then pass quickly (CTAs almost instantly)
          const travel = f.classList.contains("hero-ctas") ? 16 : 40;
          const k = Math.max(0, Math.min(1, (top - edge) / travel));
          f.style.opacity = String(k);
          if (f.classList.contains("hero-card-inner")) f.style.scale = String(0.96 + 0.04 * k);
        });
      };
      ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom top", onUpdate: fade, onLeaveBack: () => faders.forEach((f) => ((f.style.opacity = ""), (f.style.scale = ""))) });
    }, el);

    // pointer parallax on cards
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".hero-card-inner"));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      cards.forEach((c) => {
        const d = Number(c.dataset.depth || 1);
        gsap.to(c, { x: nx * 22 * d, y: ny * 16 * d, rotateY: nx * 5 * d, rotateX: -ny * 5 * d, duration: 1.2, ease: "power3.out" });
      });
    };
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) window.addEventListener("pointermove", onMove);
    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="hero" ref={root}>
      <div className="hero-aura" aria-hidden />
      <SignalTerrain className="hero-terrain" />

      <div className="hero-copy wrap">
        <span className="chip hero-chip">
          <span className="pulse-dot" />
          Software studio for businesses
        </span>
        <SplitText
          as="h1"
          className="display hero-title"
          text={"Software that helps\nyour business run better."}
          highlight={["run", "better"]}
          immediate
          delay={0.15}
        />
        <p className="lead hero-lead">
          We build websites, mobile apps, custom CRMs and AI tools that help your team save time and spend less of it
          on manual work.
        </p>
        <div className="hero-ctas">
          <Link to="/contact" className="btn btn-primary">
            Book a free call
            <svg className="btn-arrow" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/work" className="btn btn-glass">
            See our work
          </Link>
        </div>
      </div>

      <div className="hero-stage" aria-hidden>
        {/* A — an agent at work */}
        <div className="hero-card hc-a">
          <div className="hero-card-inner glass" data-depth="1.4">
            <div className="hcard-head">
              <GlassIcon name="ai" size={24} eager />
              <span className="mono">Agent · Invoice watch</span>
              <span className="hcard-status">
                <span className="pulse-dot" />
                Running
              </span>
            </div>
            <ul className="hcard-log mono">
              <li>
                <span className="t">02:14</span> Scanned 1,284 invoices
              </li>
              <li>
                <span className="t">02:15</span> Matched 1,281 to shipments
              </li>
              <li className="warn">
                <span className="t">02:15</span> 3 anomalies → review queue
              </li>
            </ul>
            <div className="hcard-bar">
              <span style={{ width: "86%" }} />
            </div>
          </div>
        </div>

        {/* B — human in the loop */}
        <div className="hero-card hc-b">
          <div className="hero-card-inner glass" data-depth="2">
            <div className="hcard-head">
              <span className="hcard-avatar" />
              <span className="mono">Needs approval</span>
              <span className="hcard-time mono">now</span>
            </div>
            <p className="hcard-text">
              Refund of <b>$1,240</b> to Acme Freight is above policy. Approve?
            </p>
            <div className="hcard-actions">
              <span className="hbtn">Review</span>
              <span className="hbtn is-primary">
                <PixelIcon name="check" size={14} mono />
                Approve
              </span>
            </div>
          </div>
        </div>

        {/* C — a live voice call */}
        <div className="hero-card hc-c">
          <div className="hero-card-inner glass" data-depth="1">
            <div className="hcard-head">
              <span className="pulse-dot is-apricot" />
              <span className="mono">Voice agent · Live</span>
              <span className="hcard-time mono">01:42</span>
            </div>
            <div className="hcard-wave">
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} style={{ ["--i" as string]: i }} />
              ))}
            </div>
            <p className="hcard-sub">Booked: Tuesday, 3:30 pm with Dr. Patel</p>
          </div>
        </div>
      </div>

    </section>
  );
}
