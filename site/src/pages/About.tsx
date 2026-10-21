import { PageHero } from "../components/PageHero";
import { GlassIcon, type GlassName } from "../components/GlassIcon";
import { Reveal, SplitText } from "../components/Reveal";
import { PROCESS } from "../components/home/Process";
import { CtaBand } from "../components/CtaBand";
import "./About.css";

const PRINCIPLES: { icon: GlassName; t: string; d: string }[] = [
  {
    icon: "build",
    t: "Build what is needed",
    d: "We focus on the features your team will actually use. Simpler software is easier to learn, maintain and change.",
  },
  {
    icon: "ai",
    t: "Keep people in control",
    d: "Our AI tools handle routine work, but important decisions go to a person. Every automated action is logged.",
  },
  {
    icon: "discover",
    t: "Be clear about cost and time",
    d: "You get a written scope, timeline and price before work starts, and regular updates while we build.",
  },
  {
    icon: "launch",
    t: "Stay after launch",
    d: "We support what we build. When your business changes, your software can change with it.",
  },
];

const FOCUS = [
  { t: "B2B software companies", d: "Marketing websites, product sites, internal tools and AI features for SaaS teams." },
  { t: "Service businesses", d: "Booking, scheduling, CRMs and voice agents for teams that work with customers every day." },
  { t: "Operations-heavy teams", d: "Automations and agents for finance, logistics and back-office work." },
];

const STACK: [string, string[]][] = [
  ["Web", ["React", "Next.js", "TypeScript", "Astro", "Node.js"]],
  ["Mobile", ["Swift", "Kotlin", "React Native", "Expo"]],
  ["Data & AI", ["Python", "Postgres", "Supabase", "Claude", "OpenAI", "Twilio"]],
  ["Marketing & design", ["Google Ads", "GA4", "Search Console", "Figma", "After Effects"]],
];

// 8×8 grid: the Tech Nerv "T" mark lit in signal teal, impulse in apricot
const MARK = new Set([9, 10, 11, 12, 13, 14, 19, 20, 27, 28, 35, 36, 43, 44]);
const IMPULSE = new Set([53, 54]);

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={"A software studio\nfor businesses."}
        highlight={["software", "studio"]}
        lead="Tech Nerv designs and builds websites, mobile apps, custom CRMs and AI tools. Our main focus is software for B2B companies, and we also work with service businesses of all sizes."
        aside={
          <div className="ab-intro-card" aria-hidden>
            <div className="ab-grid-art">
              {Array.from({ length: 64 }).map((_, i) => (
                <span
                  key={i}
                  className={MARK.has(i) ? "is-mark" : IMPULSE.has(i) ? "is-impulse" : ""}
                  style={{ animationDelay: `${((i % 8) + Math.floor(i / 8)) * 110}ms` }}
                />
              ))}
            </div>
          </div>
        }
      />

      <section className="section ab-intro">
        <div className="wrap ab-intro-grid">
          <div className="ab-intro-copy">
            <span className="eyebrow">What we do</span>
            <SplitText className="h2" text={"We build software\naround your business."} highlight={["your", "business."]} />
          </div>
          <div className="ab-intro-text">
            <Reveal as="p" className="lead" delay={0.1}>
              Many teams use tools that were not made for the way they work. We start by learning how your business
              runs, then build the website, app or system that fits it.
            </Reveal>
            <Reveal as="p" className="ab-text" delay={0.15}>
              One team handles design, development, AI and marketing, so everything we build works together. You talk to
              the people doing the work, not a chain of account managers.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section ab-principles">
        <div className="wrap">
          <span className="eyebrow">How we work</span>
          <SplitText className="h2" text={"Four things we\nalways do."} highlight={["always"]} />
          <Reveal className="ab-p-grid" stagger={0.07} y={30}>
            {PRINCIPLES.map((p, i) => (
              <article key={p.t} className={`ab-p gi-host tone-${i}`}>
                <span className="ab-p-num mono">0{i + 1}</span>
                <h3 className="h3">{p.t}</h3>
                <p>{p.d}</p>
                <GlassIcon name={p.icon} size={200} />
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section ab-focus">
        <div className="wrap ab-focus-grid">
          <div className="ab-focus-side">
            <span className="eyebrow">Who we work with</span>
            <SplitText className="h2" text={"Our focus."} highlight={["focus."]} />
            <p className="muted">Most of our work is for B2B companies, but the same skills help any business that wants better tools.</p>
          </div>
          <Reveal className="ab-focus-list" stagger={0.07}>
            {FOCUS.map((f) => (
              <div key={f.t} className="ab-focus-item">
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section ab-process">
        <div className="wrap">
          <span className="eyebrow">Working together</span>
          <SplitText className="h2" text={"What to expect."} highlight={["expect."]} />
          <Reveal className="ab-steps" stagger={0.08} y={24}>
            {PROCESS.map((p, i) => (
              <div key={p.t} className="ab-step">
                <span className="mono">0{i + 1}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section ab-stack">
        <div className="wrap">
          <span className="eyebrow">Tools and technology</span>
          <SplitText className="h2" text={"What we build with."} highlight={["build"]} />
          <Reveal className="ab-stack-groups" stagger={0.06} y={16}>
            {STACK.map(([g, items]) => (
              <div key={g} className="ab-stack-row">
                <span className="mono">{g}</span>
                <div className="ab-stack-list">
                  {items.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
