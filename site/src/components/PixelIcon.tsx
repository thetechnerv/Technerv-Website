import { useId } from "react";
import "./PixelIcon.css";

/**
 * Tech Nerv pixel icon pack — 12×12 grid.
 *  #  signal pixel (teal gradient)
 *  o  mist pixel (pale teal)
 *  *  impulse pixel (apricot)
 */
export const ICONS = {
  web: [
    "............",
    ".##########.",
    ".#*.o.o....#",
    ".##########.",
    ".#.........#",
    ".#.oooo....#",
    ".#.oo......#",
    ".#.........#",
    ".#.####.oo.#",
    ".#.........#",
    ".##########.",
    "............",
  ],
  ai: [
    "....#.......",
    "....#.......",
    "...###......",
    "...###......",
    "#########...",
    "...###......",
    "...###...*..",
    "....#...***.",
    "....#..*****",
    ".........*..",
    "...o.....*..",
    "..ooo.......",
  ],
  seo: [
    "............",
    "...####.....",
    "..#....#....",
    ".#......#...",
    ".#...*..#...",
    ".#..o*o.#...",
    ".#.oo*o.#...",
    "..#....##...",
    "...####.##..",
    ".........##.",
    "..........##",
    "............",
  ],
  ads: [
    "............",
    "...######...",
    "..#......#..",
    ".#..oooo..#.",
    ".#.o....o.#.",
    ".#.o.**.o.#.",
    ".#.o.**.o.#.",
    ".#.o....o.#.",
    ".#..oooo..#.",
    "..#......#..",
    "...######...",
    "............",
  ],
  marketing: [
    "..########..",
    ".#o......o#.",
    ".#........#.",
    ".#..*.....#.",
    ".#..**....#.",
    ".#..***...#.",
    ".#..****..#.",
    ".#..***...#.",
    ".#..**....#.",
    ".#..*.....#.",
    ".#o......o#.",
    "..########..",
  ],
  mobile: [
    "...######...",
    "..#..**..#..",
    "..#......#..",
    "..#.oooo.#..",
    "..#......#..",
    "..#.oo.o.#..",
    "..#.oo.o.#..",
    "..#......#..",
    "..#.oooo.#..",
    "..#......#..",
    "..#..##..#..",
    "...######...",
  ],
  crm: [
    "............",
    ".###.###.###",
    "............",
    ".ooo.ooo.***",
    ".ooo.ooo.***",
    "............",
    ".ooo.ooo....",
    ".ooo.ooo....",
    "............",
    ".ooo........",
    ".ooo........",
    "............",
  ],
  voice: [
    "............",
    "......#.....",
    "......#.....",
    "...#..#..#..",
    "...#.##..#..",
    ".#.#.##.*#.#",
    ".#.#.##.*#.#",
    "...#.##..#..",
    "...#..#..#..",
    "......#.....",
    "......#.....",
    "............",
  ],
  arrow: [
    "............",
    "............",
    "......#.....",
    ".......#....",
    "........#...",
    ".#########*.",
    "........#...",
    ".......#....",
    "......#.....",
    "............",
    "............",
    "............",
  ],
  check: [
    "............",
    "............",
    "..........#.",
    ".........##.",
    "........##..",
    ".*.....##...",
    ".**...##....",
    "..**.##.....",
    "...###......",
    "....#.......",
    "............",
    "............",
  ],
  play: [
    "............",
    "...#........",
    "...##.......",
    "...###......",
    "...####.....",
    "...#####*...",
    "...#####*...",
    "...####.....",
    "...###......",
    "...##.......",
    "...#........",
    "............",
  ],
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  /** monochrome rendering using currentColor */
  mono?: boolean;
  title?: string;
};

export function PixelIcon({ name, size = 48, className, mono = false, title }: Props) {
  const id = useId().replace(/:/g, "");
  const grid = ICONS[name];
  const cells: { x: number; y: number; t: string; i: number }[] = [];
  let i = 0;
  grid.forEach((row, y) =>
    row.split("").forEach((t, x) => {
      if (t !== ".") cells.push({ x, y, t, i: i++ });
    }),
  );
  const fill = (t: string) => {
    if (mono) return t === "o" ? "currentColor" : "currentColor";
    if (t === "#") return `url(#pg-${id})`;
    if (t === "o") return "var(--teal-200)";
    return "var(--apricot)";
  };

  return (
    <svg
      className={`pixel-icon ${className ?? ""}`}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      shapeRendering="geometricPrecision"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`pg-${id}`} x1="0" y1="0" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--teal-400)" />
          <stop offset="0.55" stopColor="var(--teal-600)" />
          <stop offset="1" stopColor="var(--teal-800)" />
        </linearGradient>
      </defs>
      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x + 0.08}
          y={c.y + 0.08}
          width={0.84}
          height={0.84}
          rx={0.22}
          fill={fill(c.t)}
          opacity={mono && c.t === "o" ? 0.35 : 1}
          style={{ ["--d" as string]: `${(c.x + c.y) * 18}ms` }}
        />
      ))}
    </svg>
  );
}
