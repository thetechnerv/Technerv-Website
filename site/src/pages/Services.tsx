import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { SERVICES } from "../data/services";
import { SERVICE_VISUALS } from "../components/ServiceVisuals";
import { PixelIcon } from "../components/PixelIcon";
import { GlassIcon } from "../components/GlassIcon";
import { Reveal, SplitText } from "../components/Reveal";
import { CtaBand } from "../components/CtaBand";
import { getLenis } from "../lib/motion";
import { LogoMark } from "../components/Logo";
import "./Services.css";

const FAQ = [
  {
    q: "How much does a project cost?",
    a: "It depends on the scope. After a first call, we send a written proposal with what we will build, the timeline and the cost, so you know what to expect before any work starts.",
  },
  {
    q: "How long does a typical project take?",
    a: "A website usually takes a few weeks. Apps, CRMs and AI systems take longer depending on their size. We share a timeline in the proposal and show progress every week.",
  },
  {
    q: "Can you work with the tools we already use?",
    a: "Yes. Most of our work connects to existing systems such as your CRM, accounting software, email, calendar or database.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. We can maintain and improve what we build, fix issues, and add features as your needs change.",
  },
  {
    q: "Who owns the code and data?",
    a: "You do. The code we write for you and the data in your systems belong to your business.",
  },
];

export default function Services() {
  const [active, setActive] = useState(SERVICES[0].slug);

  useEffect(() => {
    const els = SERVICES.map((s) => document.getElementById(s.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    const l = getLenis();
    if (el && l) l.scrollTo(el, { offset: -100, duration: 1.3 });
    else el?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${slug}`);
  };

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={"What we can\nbuild for you."}
        highlight={["build"]}
        lead="We offer eight services. You can use one on its own, or combine several so your website, tools and AI work together."
        aside={
          <div className="mosaic">
            {[...SERVICES.slice(0, 4), null, ...SERVICES.slice(4)].map((s, i) =>
              s ? (
                <a key={s.slug} href={`#${s.slug}`} onClick={go(s.slug)} className="mosaic-tile gi-host" style={{ animationDelay: `${i * -0.7}s` }}>
                  <GlassIcon name={s.icon} size={56} eager />
                  <span>{s.short}</span>
                </a>
              ) : (
                <span key="brand" className="mosaic-tile is-brand" style={{ animationDelay: `${i * -0.7}s` }}>
                  <LogoMark size={48} inverted />
                </span>
              ),
            )}
          </div>
        }
      >
        <Reveal className="sv-chips" delay={0.45} stagger={0.03} y={12}>
          {SERVICES.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} onClick={go(s.slug)} className="chip pi-host">
              <GlassIcon name={s.icon} size={22} eager />
              {s.short}
            </a>
          ))}
        </Reveal>
      </PageHero>

      <section className="sv-body wrap">
        <aside className="sv-index" aria-label="Services list">
          <span className="eyebrow">Index</span>
          <ol>
            {SERVICES.map((s, i) => (
              <li key={s.slug} className={active === s.slug ? "is-active" : ""}>
                <a href={`#${s.slug}`} onClick={go(s.slug)}>
                  <span className="mono">0{i + 1}</span>
                  {s.short}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="sv-list">
          {SERVICES.map((s, i) => {
            const Vis = SERVICE_VISUALS[s.slug];
            return (
              <article
                key={s.slug}
                id={s.slug}
                className={`sv-item ${s.slug === "ai-agents" ? "is-wide is-dark" : ""} ${s.slug === "voice-chat" ? "is-wide" : ""} ${["crm", "google-ads"].includes(s.slug) ? "is-compact" : ""}`}
              >
                <Reveal className="sv-visual gi-host" y={30}>
                  <div className="sv-visual-inner bento-card" data-nav={s.slug === "ai-agents" ? "dark" : undefined}>
                    <Vis />
                  </div>
                  <span className="sv-num mono">
                    0{i + 1} / 0{SERVICES.length}
                  </span>
                </Reveal>
                <div className="sv-copy">
                  <Reveal className="sv-title">
                    <GlassIcon name={s.icon} size={72} />
                    <h2 className="h3">{s.short}</h2>
                    {["seo", "ai-agents"].includes(s.slug) ? <span className="sv-full mono">{s.title}</span> : null}
                  </Reveal>
                  <Reveal as="p" className="sv-tagline" delay={0.05}>
                    {s.tagline}
                  </Reveal>
                  <Reveal as="p" className="sv-text" delay={0.1}>
                    {s.body}
                  </Reveal>
                  <Reveal className="sv-cols" delay={0.15}>
                    <div>
                      <h3 className="sv-label mono">What's included</h3>
                      <ul className="sv-outcomes">
                        {s.outcomes.map((o) => (
                          <li key={o}>
                            <PixelIcon name="check" size={16} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="sv-label mono">Tools we often use</h3>
                      <ul className="sv-stack">
                        {s.stack.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section sv-faq">
        <div className="wrap sv-faq-grid">
          <div className="faq-side">
            <span className="eyebrow">Questions</span>
            <SplitText className="h2" text={"Common\nquestions."} highlight={["questions."]} />
            <p className="muted">Can't find what you are looking for? Ask us on a free 30-minute call.</p>
            <Link to="/contact" className="btn btn-primary btn-sm">
              Book a free call
            </Link>
          </div>
          <div className="faq-list">
            {FAQ.map((f) => (
              <details key={f.q} className="faq">
                <summary>
                  {f.q}
                  <span className="faq-icon" aria-hidden />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
