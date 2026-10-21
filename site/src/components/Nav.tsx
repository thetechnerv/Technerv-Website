import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { getLenis } from "../lib/motion";
import { SERVICES } from "../data/services";
import "./Nav.css";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number; o: number }>({ x: 0, w: 0, o: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // switch to the dark glass treatment while a dark section sits under the bar
      const y = 50;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-nav='dark']")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setOnDark(dark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const movePill = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const parent = listRef.current?.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    if (!parent) return;
    setPill({ x: r.left - parent.left, w: r.width, o: 1 });
  };

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""} ${onDark && !open ? "is-dark" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="Tech Nerv home">
            <Logo inverted={onDark && !open} />
          </Link>

          <nav className="nav-links" ref={listRef} onMouseLeave={() => setPill((p) => ({ ...p, o: 0 }))} aria-label="Primary">
            <span className="nav-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.o }} />
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onMouseEnter={movePill} className={({ isActive }) => (isActive ? "is-active" : "")}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-cta">
            {pathname === "/contact" ? (
              <a href="mailto:hello@technerv.com" className="nav-mail">
                hello@technerv.com
              </a>
            ) : (
              <Link to="/contact" className="btn btn-primary btn-sm">
                Book a free call
              </Link>
            )}
          </div>

          <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`nav-sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="nav-sheet-links">
          {[...LINKS, { to: "/contact", label: "Contact" }].map((l, i) => (
            <Link key={l.to} to={l.to} style={{ ["--i" as string]: i }} tabIndex={open ? 0 : -1}>
              <span className="mono">0{i + 1}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-sheet-services">
          {SERVICES.map((s) => (
            <Link key={s.slug} to={`/services#${s.slug}`} tabIndex={open ? 0 : -1}>
              {s.short}
            </Link>
          ))}
        </div>
        <div className="nav-sheet-foot">
          <a href="mailto:hello@technerv.com">hello@technerv.com</a>
          <Link to="/contact" className="btn btn-primary" tabIndex={open ? 0 : -1}>
            Book a free call
          </Link>
        </div>
      </div>
    </>
  );
}
