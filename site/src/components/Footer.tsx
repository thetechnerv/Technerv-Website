import { Link } from "react-router-dom";
import { HalftoneWordmark } from "./HalftoneWordmark";
import { SERVICES } from "../data/services";
import { getLenis } from "../lib/motion";
import "./Footer.css";

export function Footer() {
  const toTop = () => {
    const l = getLenis();
    if (l) l.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" data-nav="dark">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <p>
            Tech Nerv builds websites, mobile apps, custom CRMs and AI tools for businesses.
          </p>
          <a className="footer-mail" href="mailto:hello@technerv.com">
            hello@technerv.com
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="footer-col fc-studio">
          <span className="footer-label mono">Studio</span>
          <Link to="/services">Services</Link>
          <Link to="/work">Work</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col fc-caps">
          <span className="footer-label mono">What we build</span>
          {SERVICES.map((s) => (
            <Link key={s.slug} to={`/services#${s.slug}`}>
              {s.short}
            </Link>
          ))}
        </div>

        <div className="footer-col fc-else">
          <span className="footer-label mono">Elsewhere</span>
          <a href="#" aria-disabled>
            LinkedIn
          </a>
          <a href="#" aria-disabled>
            Instagram
          </a>
          <a href="#" aria-disabled>
            YouTube
          </a>
        </div>
      </div>

      <div className="footer-mark wrap">
        <HalftoneWordmark />
      </div>

      <div className="wrap footer-legal">
        <span className="mono">© {new Date().getFullYear()} Tech Nerv</span>
        <button className="mono footer-top-btn" onClick={toTop}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
