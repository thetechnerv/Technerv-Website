import { I } from "./AgentRun";
import "./AgentRun.css";

/**
 * Mobile companion to <AgentRun>: one readable, full-size "moment" from the run
 * per step, reusing the same visual language at 12px+ type.
 */
const check = (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);

function Node({ title, sub, status, label, human, icon }: { title: string; sub: string; status: string; label: string; human?: boolean; icon: React.ReactElement }) {
  return (
    <div className={`ar-node is-${status} ${human ? "is-human" : ""}`}>
      <span className="ar-node-icon">{icon}</span>
      <span className="ar-node-text">
        <b>{title}</b>
        <span>{sub}</span>
      </span>
      <span className="ar-chip">
        {status === "done" ? check : <i />}
        {label}
      </span>
    </div>
  );
}

export function AgentMoment({ step }: { step: number }) {
  return (
    <div className="am" aria-hidden>
      {step === 0 && (
        <>
          {(
            [
              ["Email inbox", I.mail],
              ["ERP", I.erp],
              ["Shipments DB", I.db],
            ] as const
          ).map(([s, ic], i) => (
            <div key={s} className={`ar-src ${i === 0 ? "is-on" : ""}`}>
              <span className="ar-src-icon">{ic}</span>
              <span className="ar-src-name">{s}</span>
              <span className="ar-src-dot" />
            </div>
          ))}
          <Node icon={I.mail} title="Invoice received" sub="Email · #4471" status="running" label="Running" />
        </>
      )}
      {step === 1 && (
        <>
          <Node icon={I.spark} title="Read invoice" sub="AI · 14 fields" status="done" label="Done" />
          <Node icon={I.rule} title="Match to PO" sub="+$1,240 over PO" status="flagged" label="Flagged" />
          <span className="ar-tag is-on am-tag">1,281 routine invoices approved</span>
        </>
      )}
      {step === 2 && (
        <div className="ar-msg is-on">
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
          <div className="ar-msg-actions">
            <span className="ar-mbtn is-primary am-static">Approve</span>
            <span className="ar-mbtn">Edit</span>
            <span className="ar-mbtn">Reject</span>
          </div>
        </div>
      )}
      {step === 3 && (
        <>
          <Node icon={I.person} title="Ask finance" sub="Maria · 8:14 AM" status="done" label="Approved" human />
          <Node icon={I.erp} title="Update ERP" sub="Approve payment" status="running" label="Running" />
        </>
      )}
      {step === 4 && (
        <div className="ar-summary is-on">
          <div className="ar-sum-head">
            <span className="ar-sum-ok">{check}</span>
            <b>Nightly run complete</b>
          </div>
          <div className="ar-sum-grid">
            <span>
              <b>1,284</b>invoices checked
            </span>
            <span>
              <b>3</b>reviewed by a person
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
