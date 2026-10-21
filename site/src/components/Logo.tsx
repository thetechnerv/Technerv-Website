type Props = { className?: string; inverted?: boolean };

/** Pixel "T" mark: a signal travelling down a nerve, ending in an impulse. */
export function LogoMark({ size = 26, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6FE3D2" />
          <stop offset="1" stopColor={inverted ? "#2EC4B2" : "#0A6E67"} />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8.5"
        fill={inverted ? "#12302c" : "#0A1416"}
        stroke={inverted ? "rgba(255,255,255,0.16)" : "none"}
      />
      <g fill="url(#lm-g)">
        <rect x="7" y="7" width="4.2" height="4.2" rx="1.2" />
        <rect x="13.9" y="7" width="4.2" height="4.2" rx="1.2" />
        <rect x="20.8" y="7" width="4.2" height="4.2" rx="1.2" />
        <rect x="13.9" y="13.9" width="4.2" height="4.2" rx="1.2" />
        <rect x="13.9" y="20.8" width="4.2" height="4.2" rx="1.2" />
      </g>
      <rect x="20.8" y="20.8" width="4.2" height="4.2" rx="1.2" fill="#FF8E5E" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: Props) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark inverted={inverted} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 19,
          letterSpacing: "-0.04em",
          color: inverted ? "#fff" : "var(--ink)",
        }}
      >
        Tech Nerv
      </span>
    </span>
  );
}
