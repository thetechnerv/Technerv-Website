import { Link } from "react-router-dom";
import { SERVICES } from "../../data/services";
import { SERVICE_VISUALS } from "../ServiceVisuals";
import { GlassIcon } from "../GlassIcon";
import { Reveal, SplitText } from "../Reveal";
import "./ServicesBento.css";

// bento order + spans (12-col grid)
const LAYOUT: [string, string][] = [
  ["ai-agents", "span-7 tall"],
  ["websites", "span-5 tall"],
  ["crm", "span-5"],
  ["voice-chat", "span-4"],
  ["mobile", "span-3"],
  ["seo", "span-5"],
  ["google-ads", "span-3"],
  ["creative", "span-4"],
];

export function ServicesBento() {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section bento-section" id="services">
      <div className="wrap">
        <div className="bento-head">
          <span className="eyebrow">What we do</span>
          <SplitText className="h2" text={"Eight services.\nOne team."} highlight={["One", "team"]} />
          <Reveal as="p" className="lead bento-lead" delay={0.15}>
            Choose one service or combine several. They are built to work together: for example, your website can send
            new leads to your CRM, and an AI agent can follow up on them.
          </Reveal>
        </div>

        <Reveal className="bento" stagger={0.06} y={40}>
          {LAYOUT.map(([slug, cls]) => {
            const s = SERVICES.find((x) => x.slug === slug)!;
            const Vis = SERVICE_VISUALS[slug];
            return (
              <Link key={slug} to={`/services#${slug}`} className={`bento-card gi-host ${cls}`} onPointerMove={onMove}>
                <div className="bento-vis">
                  <Vis />
                </div>
                <div className="bento-copy">
                  <div className="bento-title">
                    <GlassIcon name={s.icon} size={44} />
                    <h3>{s.short}</h3>
                    <span className="bento-go" aria-hidden>
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M6 14 14 6m0 0H7.5M14 6v6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <p>{s.summary}</p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
