import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

type Props = { text?: string; className?: string };

// signal palette sampled across the wordmark
const STOPS: [number, [number, number, number]][] = [
  [0, [111, 227, 210]], // teal-300
  [0.35, [46, 196, 178]], // teal-400
  [0.62, [124, 140, 255]], // iris
  [0.85, [255, 142, 94]], // apricot
  [1, [255, 214, 196]],
];

function sample(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0);
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/**
 * Dot-matrix wordmark. Letterforms are sampled into a halftone grid; an aurora
 * drifts through the dots and the cursor swells them like a nerve impulse.
 */
export function HalftoneWordmark({ text = "Tech Nerv", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let dots: { x: number; y: number; c: number }[] = [];
    let w = 0,
      h = 0,
      step = 10,
      raf = 0,
      visible = false,
      t = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = prefersReducedMotion();

    const build = async () => {
      try {
        await document.fonts.load('600 200px "Inter Tight"');
      } catch {
        /* fall back to system font */
      }
      w = canvas.clientWidth;
      // fit the type to the width first, then size the canvas tightly to its cap height
      const probe = document.createElement("canvas").getContext("2d")!;
      probe.font = `600 100px "Inter Tight", sans-serif`;
      (probe as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "-2.5px";
      const fitFs = (100 * w) / probe.measureText(text).width;
      h = Math.round(fitFs * 0.8);
      canvas.style.height = `${h}px`;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      step = Math.max(4, Math.round(w / (w < 600 ? 92 : 118)));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const fs = fitFs;
      o.font = `600 ${fs}px "Inter Tight", sans-serif`;
      (o as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.025 * fs}px`;
      const mw2 = o.measureText(text).width;
      o.textBaseline = "alphabetic";
      o.fillStyle = "#fff";
      o.fillText(text, (w - mw2) / 2 + 1, fs * 0.76);
      const data = o.getImageData(0, 0, w, h).data;

      dots = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          // average a few samples for smooth coverage on edges
          let a = 0;
          for (const [dx, dy] of [
            [0, 0],
            [-step / 3, 0],
            [step / 3, 0],
            [0, -step / 3],
            [0, step / 3],
          ]) {
            const sx = Math.min(w - 1, Math.max(0, Math.round(x + dx)));
            const sy = Math.min(h - 1, Math.max(0, Math.round(y + dy)));
            a += data[(sy * w + sx) * 4 + 3];
          }
          a /= 5 * 255;
          if (a > 0.45) dots.push({ x, y, c: a });
        }
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const R = 130;
      for (const d of dots) {
        // drifting aurora field
        const wave =
          0.5 +
          0.25 * Math.sin(d.x * 0.006 + t * 0.9) +
          0.25 * Math.sin(d.y * 0.02 - d.x * 0.002 + t * 0.6);
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - dist / R);
        const ease = near * near * (3 - 2 * near);
        const hueT = d.x / w + (wave - 0.5) * 0.28 + ease * 0.1;
        const [r, g, b] = sample(hueT);
        const size = (step / 2) * d.c * (0.68 + 0.5 * ease);
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.beginPath();
        ctx.arc(d.x - dx * ease * 0.06, d.y - dy * ease * 0.06, Math.max(0.6, Math.min(step * 0.62, size)), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      t += 0.016;
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (mouse.x < -1000) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
      mouse.x = mouse.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let rt: number;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = window.setTimeout(build, 120);
    });
    ro.observe(canvas);
    build();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return <canvas ref={ref} className={className} style={{ width: "100%", display: "block" }} aria-label={text} role="img" />;
}
