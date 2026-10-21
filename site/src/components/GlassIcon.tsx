import "./GlassIcon.css";

/** 3D glass icon set, sliced from one generated sheet (see IMAGE_ASSETS.md). */
export const GLASS_ICONS = [
  "web",
  "ai",
  "seo",
  "ads",
  "marketing",
  "mobile",
  "crm",
  "voice",
  "discover",
  "design",
  "build",
  "launch",
] as const;

export type GlassName = (typeof GLASS_ICONS)[number];

type Props = { name: GlassName; size?: number; className?: string; eager?: boolean };

export function GlassIcon({ name, size = 64, className, eager = false }: Props) {
  return (
    <img
      className={`glass-icon ${className ?? ""}`}
      src={`/icons/${name}.webp`}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
