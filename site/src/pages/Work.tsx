import { useEffect, useState } from "react";
import { PageHero } from "../components/PageHero";
import { PROJECTS } from "../data/projects";
import { ProjectCover } from "../components/ProjectCover";
import { WorksWheel } from "../components/work/WorksWheel";
import { VideoSlot } from "../components/work/VideoSlot";
import { Reveal, SplitText } from "../components/Reveal";
import { CtaBand } from "../components/CtaBand";
import { getLenis } from "../lib/motion";
import { GlassIcon } from "../components/GlassIcon";
import "./Work.css";

// PLACEHOLDER testimonials: replace with real, approved client quotes.
const TESTIMONIALS = [
  {
    quote:
      "Tech Nerv took the time to understand how our team actually works. The tool they built replaced three spreadsheets and our staff picked it up in a day.",
    name: "Client name",
    role: "Operations Manager, Company",
  },
  {
    quote: "Communication was clear from start to finish. We saw progress every week and always knew what was coming next.",
    name: "Client name",
    role: "Founder, Company",
  },
  {
    quote: "The AI agent handles the routine checks, and our team only reviews the cases it flags. It has saved us hours every week.",
    name: "Client name",
    role: "Finance Lead, Company",
  },
];

export default function Work() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = PROJECTS.map((p) => document.getElementById(p.slug)).filter(Boolean) as HTMLElement[];
    // the bar shows only while a case study crosses the middle band of the screen
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target.id) : inBand.delete(e.target.id)));
        const first = PROJECTS.find((p) => inBand.has(p.slug));
        setActive(first ? first.slug : null);
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (slug: string) => {
    const el = document.getElementById(slug);
    const l = getLenis();
    if (el && l) l.scrollTo(el, { offset: -90, duration: 1.4 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="work-hero">
      <PageHero
        eyebrow="Our work"
        title={"Projects we've\ndesigned and built."}
        highlight={["designed", "built."]}
        lead="A selection of websites, apps, CRMs and AI tools. Each case study explains the problem, what we built and the result."
        aside={
          <div className="fan" aria-hidden>
            {[PROJECTS[0], PROJECTS[3], PROJECTS[4]].map((p) => (
              <div key={p.slug} className="fan-card">
                <ProjectCover p={p} />
              </div>
            ))}
          </div>
        }
      >
        <Reveal className="work-note" delay={0.5} y={10}>
          <span className="pulse-dot is-apricot" />
          The projects on this page are examples for illustration. Real case studies will be added soon.
        </Reveal>
      </PageHero>
      </div>

      <WorksWheel />

      {/* touch: simple list in place of the wheel */}
      <section className="work-mobile wrap" aria-label="Projects">
        {PROJECTS.map((p, i) => (
          <button key={p.slug} className="wm-card" onClick={() => go(p.slug)}>
            <div className="wm-media">
              <ProjectCover p={p} />
            </div>
            <div className="wm-meta">
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <b>{p.name}</b>
              <span className="muted">{p.sector}</span>
            </div>
          </button>
        ))}
      </section>

      <div className="cs-list">
        {PROJECTS.map((p, i) => (
          <article key={p.slug} id={p.slug} className="cs wrap">
            <header className="cs-head">
              <Reveal className="cs-title">
                <span className="cs-index mono">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="h2">{p.name}</h2>
                <p className="cs-headline">{p.headline}</p>
              </Reveal>
              <Reveal as="dl" className="cs-facts" delay={0.1}>
                <div>
                  <dt>Client</dt>
                  <dd>{p.client}</dd>
                </div>
                <div>
                  <dt>Sector</dt>
                  <dd>{p.sector}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{p.year}</dd>
                </div>
                <div>
                  <dt>Services</dt>
                  <dd>{p.services.join(", ")}</dd>
                </div>
              </Reveal>
            </header>

            <Reveal className="cs-cover" y={50}>
              <ProjectCover p={p} />
            </Reveal>

            <div className="cs-story">
              <Reveal>
                <h3 className="cs-label mono">The problem</h3>
                <p>{p.challenge}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h3 className="cs-label mono">What we built</h3>
                <p>{p.approach}</p>
              </Reveal>
            </div>

            <Reveal className="cs-metrics" stagger={0.07} y={20}>
              {p.metrics.map((m) => (
                <div key={m.label} className="cs-metric">
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </Reveal>
            <p className="cs-disclaimer mono">Example figures for illustration</p>

            <div className="cs-media">
              <Reveal className="cs-video" y={30}>
                <VideoSlot youtubeId={p.youtubeId} title={`${p.name} walkthrough`} palette={p.palette} />
              </Reveal>
              <Reveal className="cs-shots" stagger={0.08} y={30}>
                {["Screenshot", "Screenshot"].map((s, k) => (
                  <figure key={k} className="cs-shot">
                    <span className="cs-shot-icon">
                      <GlassIcon name="web" size={40} />
                    </span>
                    <figcaption>
                      <b>
                        {s} {k + 1}
                      </b>
                      <span>Placeholder for a product screenshot</span>
                    </figcaption>
                  </figure>
                ))}
              </Reveal>
            </div>
          </article>
        ))}
      </div>

      <nav className={`cs-toc ${active ? "is-visible" : ""}`} aria-label="Case studies">
        {PROJECTS.map((p) => (
          <button key={p.slug} onClick={() => go(p.slug)} className={active === p.slug ? "is-active" : ""}>
            {p.name}
          </button>
        ))}
      </nav>

      <section className="section testimonials">
        <div className="wrap">
          <div className="t-head">
            <span className="eyebrow">Client feedback</span>
            <SplitText className="h2" text={"What clients say."} highlight={["say."]} />
            <p className="muted t-note">Placeholder testimonials. These will be replaced with real client quotes.</p>
          </div>
          <Reveal className="t-grid" stagger={0.08} y={30}>
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className={`t-card ${i === 0 ? "is-featured" : ""}`}>
                <svg className="t-mark" viewBox="0 0 32 24" aria-hidden>
                  <path d="M0 24V14C0 6.3 4.2 1.6 12 0l1.6 3.4C9 4.8 6.9 7.4 6.6 11H12v13H0Zm19 0V14c0-7.7 4.2-12.4 12-14l1.6 3.4C28 4.8 25.9 7.4 25.6 11H31v13H19Z" fill="currentColor" />
                </svg>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <span className="t-avatar" aria-hidden />
                  <span>
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
