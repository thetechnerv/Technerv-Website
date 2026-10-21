import "./Ticker.css";

const TOOLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Swift",
  "Kotlin",
  "React Native",
  "Postgres",
  "Supabase",
  "Claude",
  "OpenAI",
  "Twilio",
  "Google Ads",
  "GA4",
  "Search Console",
  "Figma",
  "After Effects",
];

/** A quiet strip of the tools we build with. */
export function Ticker() {
  return (
    <section className="ticker" aria-label="Tools we use">
      <span className="ticker-label mono">Tools we use</span>
      <div className="ticker-mask">
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <ul key={k} className="ticker-row" aria-hidden={k === 1}>
              {TOOLS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
