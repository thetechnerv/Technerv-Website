import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import "./AgentRun.css";

/**
 * A high-fidelity mock of an agent run, driven by `step` (0 to 4):
 * Monitor → Check → Ask → Act → Report.
 * Built at a fixed 780×560 and scaled to fit its container.
 */

const W = 780;
const H = 520;

type Status = "idle" | "running" | "done" | "flagged" | "waiting";

export const I = {
  mail: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" />
      <path d="m3.5 6 6.5 5 6.5-5" strokeLinecap="round" />
    </svg>
  ),
  erp: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1.6" />
      <rect x="11" y="3" width="6" height="6" rx="1.6" />
      <rect x="3" y="11" width="6" height="6" rx="1.6" />
      <rect x="11" y="11" width="6" height="6" rx="1.6" />
    </svg>
  ),
  db: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="10" cy="5" rx="6" ry="2.5" />
      <path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7.5 3v14M12.5 3v14M3 7.5h14M3 12.5h14" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2.5c.5 3.6 1.9 5 5.5 5.5-3.6.5-5 1.9-5.5 5.5-.5-3.6-1.9-5-5.5-5.5 3.6-.5 5-1.9 5.5-5.5Z" />
      <path d="M15.5 12.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z" opacity=".6" />
    </svg>
  ),
  rule: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 6h8M4 10h12M4 14h6" />
      <circle cx="15" cy="6" r="1.6" />
    </svg>
  ),
  person: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.8 17c.8-3.2 3.3-5 6.2-5s5.4 1.8 6.2 5" strokeLinecap="round" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M17 3 8.5 11.5M17 3l-5 14-3.5-5.5L3 8l14-5Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2.5 6.2 2.3 2.3 4.7-5" />
    </svg>
  ),
};

type Node = { id: string; x: number; y: number; icon: ReactElement; title: string; sub: string; human?: boolean };
const NW = 164;
const NH = 66;
const NODES: Node[] = [
  { id: "n0", x: 18, y: 34, icon: I.mail, title: "Invoice received", sub: "Email · #4471" },
  { id: "n1", x: 224, y: 34, icon: I.spark, title: "Read invoice", sub: "AI · 14 fields" },
  { id: "n2", x: 430, y: 34, icon: I.rule, title: "Match to PO", sub: "PO-8812" },
  { id: "n3", x: 430, y: 196, icon: I.person, title: "Ask finance", sub: "Maria · Slack", human: true },
  { id: "n4", x: 224, y: 196, icon: I.erp, title: "Update ERP", sub: "Approve payment" },
  { id: "n5", x: 18, y: 196, icon: I.send, title: "Send summary", sub: "#finance · after run" },
];

const STATUS: Status[][] = [
  ["running", "idle", "idle", "idle", "idle", "idle"],
  ["done", "done", "flagged", "idle", "idle", "idle"],
  ["done", "done", "flagged", "waiting", "idle", "idle"],
  ["done", "done", "done", "done", "running", "idle"],
  ["done", "done", "done", "done", "done", "done"],
];

const mid = (n: Node, side: "l" | "r" | "t" | "b") =>
  side === "l"
    ? [n.x, n.y + NH / 2]
    : side === "r"
      ? [n.x + NW, n.y + NH / 2]
      : side === "t"
        ? [n.x + NW / 2, n.y]
        : [n.x + NW / 2, n.y + NH];

const [n0, n1, n2, n3, n4, n5] = NODES;
const h = (a: number[], b: number[]) => `M${a[0]} ${a[1]} C ${(a[0] + b[0]) / 2} ${a[1]}, ${(a[0] + b[0]) / 2} ${b[1]}, ${b[0]} ${b[1]}`;
const v = (a: number[], b: number[]) => `M${a[0]} ${a[1]} C ${a[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${b[1]}`;
const EDGES = [
  { id: "e01", d: h(mid(n0, "r"), mid(n1, "l")), on: 1 },
  { id: "e12", d: h(mid(n1, "r"), mid(n2, "l")), on: 1 },
  { id: "e23", d: v(mid(n2, "b"), mid(n3, "t")), on: 2, human: true, label: "3 need review" },
  { id: "e24", d: v([n2.x + 30, n2.y + NH], mid(n4, "t")), on: 3, label: "1,281 routine" },
  { id: "e34", d: h(mid(n3, "l"), mid(n4, "r")), on: 3 },
  { id: "e45", d: h(mid(n4, "l"), mid(n5, "r")), on: 4 },
];

const SOURCES = [
  { k: "mail", name: "Email inbox", icon: I.mail, on: [0, 3] },
  { k: "erp", name: "ERP", icon: I.erp, on: [1, 3] },
  { k: "db", name: "Shipments DB", icon: I.db, on: [1] },
  { k: "chat", name: "Slack", icon: I.chat, on: [2, 4] },
];

const LOGS = [
  ["02:00:01  run started · 14 sources", "02:00:03  invoice.received  #4471", "02:00:03  queued 1,284 invoices"],
  ["02:00:09  extracted 14 fields  #4471", "02:00:11  matched PO-8812", "02:00:11  amount over limit by $1,240"],
  ["02:00:12  paused · approval needed", "02:00:12  message sent to @maria", "08:14:05  approved by Maria"],
  ["02:03:40  1,281 routine invoices posted", "08:14:06  invoice #4471 approved in ERP", "08:14:07  remittance email sent"],
  ["08:14:08  37 actions written to audit log", "08:15:00  summary posted to #finance", "08:15:00  run complete"],
];

const LABEL: Record<Status, string> = {
  idle: "Queued",
  running: "Running",
  done: "Done",
  flagged: "Flagged",
  waiting: "Waiting",
};

function useCount(target: number, active: boolean, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return active ? n : target;
}

export function AgentRun({ step }: { step: number }) {
  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [approved, setApproved] = useState(false);

  useLayoutEffect(() => {
    const el = fit.current!;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setApproved(step > 2);
    if (step !== 2) return;
    const id = window.setTimeout(() => setApproved(true), 2300);
    return () => window.clearTimeout(id);
  }, [step]);

  const status = STATUS[step].map((s, i) => (i === 3 && step === 2 && approved ? "done" : s));
  const routine = useCount(1281, step === 1, 900);
  const runState = step === 4 ? "done" : step === 2 && !approved ? "waiting" : "running";
  const elapsed = ["00:00:03", "00:00:11", approved ? "06:14:05" : "00:00:12", "06:14:07", "06:15:00"][step];

  return (
    <div className="ar-fit" ref={fit} style={{ height: H * scale }}>
      <div className="ar" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        {/* Title bar */}
        <div className="ar-bar">
          <span className="ar-lights">
            <i />
            <i />
            <i />
          </span>
          <span className="ar-name">
            <b>invoice-check</b>
            <span>Run #1,482</span>
          </span>
          <span className={`ar-state is-${runState}`}>
            <i />
            {runState === "done" ? "Completed" : runState === "waiting" ? "Waiting for approval" : "Running"}
          </span>
          <span className="ar-time">{elapsed}</span>
        </div>
        <div className="ar-progress">
          <span style={{ transform: `scaleX(${(step + (runState === "done" ? 1 : 0.6)) / 5})` }} />
        </div>

        <div className="ar-body">
          {/* Sidebar */}
          <aside className="ar-side">
            <span className="ar-label">Sources</span>
            {SOURCES.map((s) => {
              const on = s.on.includes(step);
              return (
                <div key={s.k} className={`ar-src ${on ? "is-on" : ""}`}>
                  <span className="ar-src-icon">{s.icon}</span>
                  <span className="ar-src-name">{s.name}</span>
                  <span className="ar-src-dot" />
                </div>
              );
            })}
            <span className="ar-label">Rules</span>
            <div className={`ar-rule ${step === 1 ? "is-on" : ""}`}>
              Refund limit <b>$1,000</b>
            </div>
            <div className={`ar-rule ${step === 1 ? "is-on" : ""}`}>
              PO tolerance <b>1%</b>
            </div>
            <div className={`ar-rule ${step === 2 ? "is-on" : ""}`}>
              Approver <b>Finance</b>
            </div>
          </aside>

          {/* Canvas */}
          <div className={`ar-canvas ${(step === 2 && !approved) || step === 4 ? "is-dim" : ""}`}>
            <svg className="ar-edges" viewBox="0 0 612 380" width="612" height="380">
              <defs>
                {[
                  ["idle", "rgba(255,255,255,0.3)"],
                  ["on", "#6FE3D2"],
                  ["human", "#FF8E5E"],
                ].map(([k, c]) => (
                  <marker key={k} id={`ar-arrow-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M1 1.5 8.5 5 1 8.5" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </marker>
                ))}
              </defs>
              {EDGES.map((e) => {
                const state = step > e.on ? "done" : step === e.on ? "active" : "idle";
                return (
                  <g key={e.id} className={`ar-edge is-${state} ${e.human ? "is-human" : ""}`}>
                    <path d={e.d} className="ar-edge-base" markerEnd={`url(#ar-arrow-${state === "idle" ? "idle" : e.human ? "human" : "on"})`} />
                    <path d={e.d} className="ar-edge-flow" />
                    {state === "active" ? (
                      <>
                        <circle r="3.4" className="ar-pulse">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path={e.d} />
                        </circle>
                        <circle r="3.4" className="ar-pulse">
                          <animateMotion dur="1.4s" begin="0.7s" repeatCount="indefinite" path={e.d} />
                        </circle>
                      </>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {/* edge labels */}
            <span className={`ar-tag is-human ${step >= 2 ? "is-on" : ""}`} style={{ left: 512, top: 148 }}>
              3 need review
            </span>
            <span className={`ar-tag ${step >= 1 ? "is-on" : ""}`} style={{ left: 383, top: 148 }}>
              {routine.toLocaleString()} routine
            </span>

            {NODES.map((n, i) => {
              const s = status[i];
              return (
                <div
                  key={n.id}
                  className={`ar-node is-${s} ${n.human ? "is-human" : ""}`}
                  style={{ left: n.x, top: n.y, width: NW, height: NH }}
                >
                  <span className="ar-node-icon">{n.icon}</span>
                  <span className="ar-node-text">
                    <b>{n.title}</b>
                    <span>{i === 2 && step >= 1 ? "+$1,240 over PO" : n.sub}</span>
                  </span>
                  <span className="ar-chip">
                    {s === "done" ? I.check : <i />}
                    {i === 3 && s === "done" ? "Approved" : LABEL[s]}
                  </span>
                </div>
              );
            })}

            {/* Human-in-the-loop message */}
            <div className={`ar-msg ${step === 2 ? "is-on" : ""}`} aria-hidden={step !== 2}>
              <div className="ar-msg-head">
                <span className="ar-msg-avatar">TN</span>
                <b>Invoice agent</b>
                <span className="ar-app">APP</span>
                <span className="ar-msg-time">2:00 AM</span>
              </div>
              <p>
                Invoice <b>#4471</b> from Acme Freight is <b>$1,240</b> over the purchase order. Approve payment?
              </p>
              <div className="ar-msg-fields">
                <span>
                  Invoice <b>$13,240</b>
                </span>
                <span>
                  PO-8812 <b>$12,000</b>
                </span>
              </div>
              {approved ? (
                <div className="ar-msg-done">
                  <span>{I.check}</span>
                  Approved by Maria at 8:14 AM
                </div>
              ) : (
                <div className="ar-msg-actions">
                  <span className="ar-mbtn is-primary">Approve</span>
                  <span className="ar-mbtn">Edit</span>
                  <span className="ar-mbtn">Reject</span>
                </div>
              )}
              {step === 2 && !approved ? (
                <svg className="ar-cursor" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M5 3l14 8-6.5 1.6L9.6 19 5 3Z" fill="#0A1416" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>

            {/* Run summary */}
            <div className={`ar-summary ${step === 4 ? "is-on" : ""}`} aria-hidden={step !== 4}>
              <div className="ar-sum-head">
                <span className="ar-sum-ok">{I.check}</span>
                <b>Nightly run complete</b>
              </div>
              <div className="ar-sum-grid">
                <span>
                  <b>1,284</b>invoices checked
                </span>
                <span>
                  <b>1,281</b>approved automatically
                </span>
                <span>
                  <b>3</b>reviewed by a person
                </span>
                <span>
                  <b>37</b>actions logged
                </span>
              </div>
              <div className="ar-sum-bar">
                <i style={{ width: "99.7%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Log */}
        <div className="ar-log">
          <span className="ar-label">Activity</span>
          <ul key={`${step}-${approved}`}>
            {LOGS[step].slice(0, step === 2 && !approved ? 2 : 3).map((l, i) => (
              <li key={l} style={{ ["--i" as string]: i }}>
                <span className="ar-log-t">{l.slice(0, 8)}</span>
                {l.slice(8)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
