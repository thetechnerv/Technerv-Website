import { Link } from "react-router-dom";
import { GlassIcon, type GlassName } from "./GlassIcon";
import { SplitText, Reveal } from "./Reveal";
import "./CtaBand.css";

const FLOAT: { icon: GlassName; x: string; y: string; s: number; d: number }[] = [
  { icon: "ai", x: "7%", y: "14%", s: 120, d: 0 },
  { icon: "crm", x: "84%", y: "10%", s: 104, d: 1.2 },
  { icon: "voice", x: "10%", y: "66%", s: 100, d: 2.1 },
  { icon: "launch", x: "83%", y: "60%", s: 124, d: 0.6 },
  { icon: "web", x: "70%", y: "78%", s: 72, d: 1.7 },
  { icon: "seo", x: "24%", y: "78%", s: 68, d: 2.6 },
];

type Props = { title?: string; text?: string };

export function CtaBand({
  title = "Let's talk about\nyour project.",
  text = "Book a free 30-minute call. We'll talk through your goals and suggest a clear way forward. No commitment.",
}: Props) {
  return (
    <section className="cta-band">
      <div className="cta-panel grain">
        <div className="cta-aurora" aria-hidden />
        {FLOAT.map((f) => (
          <span
            key={f.icon}
            className="cta-float"
            style={{ left: f.x, top: f.y, ["--d" as string]: `${f.d}s` }}
            aria-hidden
          >
            <GlassIcon name={f.icon} size={f.s} />
          </span>
        ))}
        <div className="cta-inner">
          <SplitText className="h1 cta-title" text={title} highlight={["your", "project."]} />
          <Reveal as="p" className="lead" delay={0.2}>
            {text}
          </Reveal>
          <Reveal className="cta-actions" delay={0.3}>
            <Link to="/contact" className="btn btn-primary">
              Book a free call
            </Link>
            <a href="mailto:hello@technerv.com" className="btn btn-glass">
              hello@technerv.com
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
