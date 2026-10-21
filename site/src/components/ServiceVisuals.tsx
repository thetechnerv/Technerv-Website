import { PixelIcon } from "./PixelIcon";
import "./ServiceVisuals.css";

/* Each service gets a small living diagram, built in code. */

export function VisAgents() {
  const nodes = [
    { label: "Monitor", sub: "ERP · inbox · DB" },
    { label: "Check", sub: "your rules" },
    { label: "Ask", sub: "approve / edit", human: true },
    { label: "Act", sub: "update · notify" },
  ];
  return (
    <div className="vis vis-agents">
      <div className="va-track">
        <span className="va-line" />
        <span className="va-packet" />
        <span className="va-packet is-2" />
        {nodes.map((n, i) => (
          <div key={n.label} className={`va-node ${n.human ? "is-human" : ""}`} style={{ ["--i" as string]: i }}>
            <span className="va-dot" />
            <b>{n.label}</b>
            <span className="mono">{n.sub}</span>
          </div>
        ))}
      </div>
      <div className="va-log mono">
        <span>
          <i className="pulse-dot" /> nightly-invoice-check
        </span>
        <span className="va-hide-sm">every night · 02:00</span>
        <span className="ok">1,281 done · 3 to review</span>
      </div>
    </div>
  );
}

export function VisWeb() {
  return (
    <div className="vis vis-web">
      <div className="vw-window">
        <div className="vw-bar">
          <i />
          <i />
          <i />
          <span className="vw-url mono">yourcompany.com</span>
        </div>
        <div className="vw-body">
          <span className="vw-h" />
          <span className="vw-h short" />
          <span className="vw-p" />
          <div className="vw-cards">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="vw-score">
        <svg viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" />
          <circle className="arc" cx="22" cy="22" r="19" />
        </svg>
        <b>Fast</b>
      </div>
    </div>
  );
}

export function VisCrm() {
  const cols = [
    ["Acme", "North", "Kite", "Pine"],
    ["Halo", "Vela", "Lumen"],
    ["Orbit", "Atlas"],
  ];
  return (
    <div className="vis vis-crm">
      {cols.map((c, i) => (
        <div key={i} className="vc-col">
          <span className="vc-head mono">{["Lead", "Quote", "Won"][i]}</span>
          {c.map((n, j) => (
            <span key={n} className={`vc-card ${i === 1 && j === 0 ? "is-moving" : ""}`}>
              <i style={{ background: ["var(--teal-300)", "var(--iris)", "var(--apricot)"][(i + j) % 3] }} />
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function VisVoice() {
  return (
    <div className="vis vis-voice">
      <div className="vv-orb">
        <span />
        <span />
        <span />
      </div>
      <div className="vv-bubble mono">
        <span className="pulse-dot is-apricot" /> booking.create()
      </div>
      <div className="vv-chat">
        <p className="is-caller">Can I move my appointment to Tuesday?</p>
        <p>Tuesday at 3:30 pm is free. Shall I book it?</p>
        <p className="is-caller">Yes, please.</p>
        <p>Done. You'll get a text to confirm.</p>
      </div>
    </div>
  );
}

export function VisMobile() {
  return (
    <div className="vis vis-mobile">
      <div className="vm-phone">
        <span className="vm-notch" />
        <span className="vm-card big" />
        <span className="vm-card" />
        <span className="vm-card" />
        <span className="vm-tab" />
      </div>
      <div className="vm-phone is-back">
        <span className="vm-notch" />
        <span className="vm-card big alt" />
        <span className="vm-card" />
      </div>
    </div>
  );
}

export function VisSeo() {
  return (
    <div className="vis vis-seo">
      <svg viewBox="0 0 200 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="seo-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--teal-300)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--teal-300)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="area" d="M0 80 C30 78 40 70 60 66 S95 60 110 48 S150 30 165 22 S190 10 200 6 V90 H0Z" fill="url(#seo-fill)" />
        <path className="line" d="M0 80 C30 78 40 70 60 66 S95 60 110 48 S150 30 165 22 S190 10 200 6" />
      </svg>
      <div className="vs-rank">
        <span className="mono">Search traffic</span>
        <b>↗</b>
      </div>
    </div>
  );
}

export function VisAds() {
  return (
    <div className="vis vis-ads">
      <div className="vd-target">
        <span />
        <span />
        <span />
        <PixelIcon name="arrow" size={28} />
      </div>
      <div className="vd-stats">
        <span>
          <b>Search</b>
        </span>
        <span>
          <b>YouTube</b>
        </span>
        <span>
          <b>Display</b>
        </span>
      </div>
    </div>
  );
}

export function VisCreative() {
  return (
    <div className="vis vis-creative">
      {[0, 1, 2].map((i) => (
        <div key={i} className="vcr-frame" style={{ ["--i" as string]: i }}>
          <span className="vcr-play">
            <PixelIcon name="play" size={18} mono />
          </span>
          <span className="vcr-cap" />
          <span className="vcr-cap short" />
        </div>
      ))}
    </div>
  );
}

export const SERVICE_VISUALS: Record<string, () => React.ReactElement> = {
  "ai-agents": VisAgents,
  websites: VisWeb,
  crm: VisCrm,
  "voice-chat": VisVoice,
  mobile: VisMobile,
  seo: VisSeo,
  "google-ads": VisAds,
  creative: VisCreative,
};
