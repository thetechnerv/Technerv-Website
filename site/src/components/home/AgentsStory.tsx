import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion, snapSection } from "../../lib/motion";
import { AgentRun } from "./AgentRun";
import { AgentMoment } from "./AgentMoment";
import "./AgentsStory.css";

const STEPS = [
  {
    k: "Monitor",
    t: "It watches your data.",
    d: "The agent connects to your systems, such as your ERP, inbox or database, and notices when something changes.",
    log: ["watch  14 sources connected", "event  invoice.received #4471", "event  shipment.updated #A-2290"],
  },
  {
    k: "Check",
    t: "It applies your rules.",
    d: "It compares the data against your rules. Routine items are processed and anything unusual is flagged.",
    log: ["match  invoice #4471 ↔ PO-8812", "check  amount differs by $1,240", "flag   above refund limit"],
  },
  {
    k: "Ask",
    t: "It asks before important steps.",
    d: "For decisions that involve money or risk, it pauses and asks the right person, with all the details in one place.",
    log: ["pause  approval needed", "notify @maria via Slack", "human  approved"],
    human: true,
  },
  {
    k: "Act",
    t: "It completes the task.",
    d: "It updates records, sends emails and files documents in the tools you already use.",
    log: ["erp    invoice #4471 approved", "email  remittance sent", "crm    timeline updated"],
  },
  {
    k: "Report",
    t: "It reports back.",
    d: "Every action is logged, and your team gets a short summary of what was done.",
    log: ["audit  37 actions logged", "digest sent to #finance", "done   1,281 handled, 3 escalated"],
  },
];

export function AgentsStory() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const st = ScrollTrigger.create({
        trigger: ".agents-pin",
        start: "top top",
        end: "+=320%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999))),
      });
      // settle in the middle of a step; the ends stay open so you can scroll past
      return snapSection(st, [0, 0.3, 0.5, 0.7, 1]);
    });
    mm.add("(max-width: 899px)", () => {
      el.querySelectorAll<HTMLElement>(".as-step").forEach((s, i) => {
        gsap.timeline({
          scrollTrigger: { trigger: s, start: "top 65%", end: "bottom 35%", onToggle: (st) => st.isActive && setActive(i) },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="agents" ref={root}>
      <div className="agents-pin">
        <div className="agents-panel grain" data-nav="dark">
          <div className="agents-glow" aria-hidden />
          <div className="agents-grid">
            <div className="agents-copy">
              <span className="eyebrow is-dark">AI agents &amp; pipelines</span>
              <h2 className="h2">
                How our AI
                <br />
                agents work.
              </h2>
              <ol className="as-steps">
                {STEPS.map((s, i) => (
                  <li key={s.k} className={`as-step ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}>
                    <span className="as-num mono">0{i + 1}</span>
                    <div>
                      <b>
                        {s.k}. <span>{s.t}</span>
                      </b>
                      <p>{s.d}</p>
                      <AgentMoment step={i} />
                    </div>
                  </li>
                ))}
              </ol>
              <Link to="/services#ai-agents" className="btn btn-glass-dark">
                More about AI agents
              </Link>
            </div>

            <div className="agents-vis" aria-hidden>
              <AgentRun step={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
