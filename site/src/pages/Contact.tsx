import { useState, type FormEvent } from "react";
import { PixelIcon } from "../components/PixelIcon";
import { Reveal, SplitText } from "../components/Reveal";
import "./Contact.css";

/** Set to a form endpoint (e.g. Formspree, a serverless function) to post directly. */
const FORM_ENDPOINT = "";
/** Set to a scheduling link (e.g. Calendly, Cal.com) to let people pick a time themselves. */
const BOOKING_URL = "";
const EMAIL = "hello@technerv.com";

const CALL_POINTS = [
  "We learn about your business and what you want to achieve.",
  "We suggest options that fit your goals and budget.",
  "You get a rough idea of the timeline and cost.",
];

export default function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = { name: f.get("name"), email: f.get("email"), message: f.get("message") };

    if (FORM_ENDPOINT) {
      setState("sending");
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        setState(r.ok ? "sent" : "error");
      } catch {
        setState("error");
      }
      return;
    }

    // No endpoint configured: open the visitor's email app with the details filled in.
    const body = `Hi Tech Nerv,\n\nI'd like to book the free 30-minute call.\n\nName: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message || ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Free 30-minute call")}&body=${encodeURIComponent(body)}`;
    setState("sent");
  };

  return (
    <section className="contact">
      <div className="ct-bg" aria-hidden />
      <div className="wrap ct-grid">
        <div className="ct-intro">
          <Reveal className="ct-badge" y={10}>
            <span className="pulse-dot" />
            Free · 30 minutes · No commitment
          </Reveal>
          <SplitText as="h1" className="h1 ct-title" text={"Book a free\n30-minute call."} highlight={["free"]} immediate delay={0.1} />
          <Reveal as="p" className="lead" delay={0.3}>
            Tell us what you need and we'll set up a short call. It's free, and there's nothing to prepare.
          </Reveal>

          <Reveal as="ul" className="ct-points" delay={0.4} stagger={0.06}>
            {CALL_POINTS.map((p) => (
              <li key={p}>
                <PixelIcon name="check" size={20} />
                {p}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal className="ct-card" delay={0.2} y={40}>
          {state === "sent" ? (
            <div className="ct-done">
              <span className="ct-done-icon">
                <PixelIcon name="check" size={40} />
              </span>
              <h2 className="h3">Thank you.</h2>
              <p>
                {FORM_ENDPOINT
                  ? "We'll email you within a day or two to pick a time for your call."
                  : "Your email app should now be open with your message ready to send. If it did not open, email us at "}
                {!FORM_ENDPOINT && <a href={`mailto:${EMAIL}`}>{EMAIL}</a>}
              </p>
              <button className="btn btn-glass btn-sm" onClick={() => setState("idle")}>
                Back
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="ct-form">
              <h2 className="ct-form-title">Request your call</h2>
              <label className="ct-field">
                <span>Name</span>
                <input name="name" required autoComplete="name" placeholder="Your name" />
              </label>
              <label className="ct-field">
                <span>Email</span>
                <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
              </label>
              <label className="ct-field">
                <span>
                  What do you need help with? <em>Optional</em>
                </span>
                <textarea name="message" rows={3} placeholder="For example: a new website, an AI agent, a CRM…" />
              </label>

              <button type="submit" className="btn btn-primary ct-send" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Request free call"}
                <svg className="btn-arrow" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {state === "error" ? (
                <p className="ct-error">Something went wrong. Please email us at {EMAIL}.</p>
              ) : (
                <p className="ct-next-line">
                  We'll email you to pick a time. Or write to{" "}
                  <a href={`mailto:${EMAIL}`} className="ct-mail">
                    {EMAIL}
                  </a>
                </p>
              )}

              {BOOKING_URL ? (
                <>
                  <div className="ct-or">
                    <span>or</span>
                  </div>
                  <a href={BOOKING_URL} className="btn btn-glass" target="_blank" rel="noreferrer">
                    Pick a time in our calendar
                  </a>
                </>
              ) : null}

            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
