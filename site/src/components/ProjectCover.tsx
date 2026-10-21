import type { Project } from "../data/projects";
import "./ProjectCover.css";

/**
 * Placeholder cover art for a project: a rich gradient field with a glass mock
 * of the product inside. Swap for real screenshots by passing `image`.
 */
export function ProjectCover({ p, image, compact = false }: { p: Project; image?: string; compact?: boolean }) {
  const [a, b, c] = p.palette;
  return (
    <div
      className={`pcover pcover-${p.kind} ${compact ? "is-compact" : ""}`}
      style={{ ["--a" as string]: a, ["--b" as string]: b, ["--c" as string]: c }}
    >
      {image ? (
        <img src={image} alt="" loading="lazy" />
      ) : (
        <>
          <div className="pc-field" />
          <div className="pc-dots" />
          <div className="pc-mock">{MOCKS[p.kind]}</div>
        </>
      )}
    </div>
  );
}

const Lines = ({ n = 3 }: { n?: number }) => (
  <>
    {Array.from({ length: n }).map((_, i) => (
      <i key={i} className="pc-line" style={{ width: `${88 - i * 18}%` }} />
    ))}
  </>
);

const MOCKS: Record<Project["kind"], React.ReactElement> = {
  agent: (
    <div className="pc-glass pc-agent">
      <div className="pc-row">
        <span className="pc-dot" /> <b>reconcile.nightly</b> <em>running</em>
      </div>
      {["1,281 matched", "3 flagged → review", "audit trail saved"].map((t, i) => (
        <div key={t} className="pc-log">
          <span>0{i + 2}:1{i}</span>
          {t}
        </div>
      ))}
      <div className="pc-bar">
        <span />
      </div>
    </div>
  ),
  mobile: (
    <div className="pc-phones">
      <div className="pc-phone">
        <span className="pc-notch" />
        <div className="pc-hero-tile" />
        <Lines />
        <div className="pc-chips">
          <i />
          <i />
        </div>
      </div>
      <div className="pc-phone is-alt">
        <span className="pc-notch" />
        <div className="pc-map" />
        <Lines n={2} />
      </div>
    </div>
  ),
  crm: (
    <div className="pc-glass pc-crm">
      {["Lead", "Quote", "Won"].map((c, i) => (
        <div key={c} className="pc-col">
          <span className="pc-colhead">{c}</span>
          {Array.from({ length: 3 - i }).map((_, j) => (
            <div key={j} className="pc-card">
              <i />
              <Lines n={1} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  voice: (
    <div className="pc-glass pc-voice">
      <div className="pc-orb" />
      <div className="pc-wave">
        {Array.from({ length: 22 }).map((_, i) => (
          <i key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <span className="pc-caption">“Tuesday at 3:30 works. You're booked.”</span>
    </div>
  ),
  web: (
    <div className="pc-browser">
      <div className="pc-browser-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="pc-browser-body">
        <div className="pc-h" />
        <div className="pc-h short" />
        <Lines n={2} />
        <div className="pc-tiles">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  ),
  creative: (
    <div className="pc-reels">
      {[0, 1, 2].map((i) => (
        <div key={i} className="pc-reel" style={{ ["--i" as string]: i }}>
          <Lines n={2} />
        </div>
      ))}
    </div>
  ),
};
