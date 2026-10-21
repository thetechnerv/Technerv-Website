import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

type Props = { className?: string; step?: number };

/**
 * Halftone landscape. A uniform screen-space dot grid; each dot is projected
 * back onto a 3D ground plane where a signal wave rolls toward the viewer.
 * Dot size + lift encode wave height, apricot impulses ripple outward, and
 * the cursor raises a swell — the business "nervous system" at rest.
 */
export function SignalTerrain({ className, step: stepProp }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = prefersReducedMotion();
    let w = 0,
      h = 0,
      raf = 0,
      t = 0,
      step = 12,
      visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6, a: 0, ta: 0 };
    const impulses: { x: number; z: number; b: number }[] = [];
    let lastImpulse = -2.4;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = stepProp ?? (w < 700 ? 11 : 13);
    };

    const sm = (a: number, b: number, x: number) => {
      const k = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;
      pointer.a += (pointer.ta - pointer.a) * 0.05;

      const horizon = h * 0.08;
      const f = h * 1.05;
      const camH = 1.0;
      const toWorld = (sx: number, sy: number) => {
        const z = (camH * f) / Math.max(1, sy - horizon);
        return { x: ((sx - w / 2) * z) / f, z };
      };

      if (t - lastImpulse > 3.4) {
        const p = toWorld(w * (0.2 + Math.random() * 0.6), h * (0.45 + Math.random() * 0.35));
        impulses.push({ x: p.x, z: p.z, b: t });
        lastImpulse = t;
        if (impulses.length > 3) impulses.shift();
      }
      const pw = toWorld(pointer.x * w, Math.max(horizon + 20, pointer.y * h));

      const half = step / 2;
      for (let sy = horizon + half; sy < h; sy += step) {
        const depth = (sy - horizon) / (h - horizon); // 0 far → 1 near
        const { z } = toWorld(0, sy);
        const fadeIn = sm(0, 0.28, depth);
        for (let sx = half; sx < w; sx += step) {
          const x = ((sx - w / 2) * z) / f;
          // rolling signal — long swell plus a finer chop
          let y =
            0.5 +
            0.32 * Math.sin(x * 0.9 + z * 0.35 - t * 0.9) +
            0.18 * Math.sin(x * 2.1 - z * 1.3 + t * 1.25) * Math.cos(z * 0.6 + t * 0.4);
          let heat = 0;
          for (const im of impulses) {
            const age = t - im.b;
            const d = Math.hypot(x - im.x, (z - im.z) * 1.4);
            const ring = Math.exp(-Math.pow((d - age * 1.15) * 3.2, 2)) * Math.max(0, 1 - age / 4.5);
            heat = Math.max(heat, ring);
            y += ring * 0.55;
          }
          const dp = Math.hypot(x - pw.x, (z - pw.z) * 1.2);
          const swell = Math.exp(-dp * dp * 2.2) * pointer.a;
          y += swell * 0.7;
          const v = Math.max(0, Math.min(1.4, y));

          const r = half * (0.12 + 0.62 * v * (0.35 + 0.65 * depth)) * (0.55 + 0.45 * depth);
          if (r < 0.35) continue;
          const lift = v * step * 0.9 * depth;

          // colour: mist → teal by height, apricot on impulse
          const k = Math.min(1, v * 0.85 + swell * 0.6);
          let cr = 170 + (12 - 170) * k;
          let cg = 184 + (150 - 184) * k;
          let cb = 186 + (140 - 186) * k;
          if (swell > 0.05) {
            cr += (124 - cr) * swell * 0.5;
            cg += (140 - cg) * swell * 0.5;
            cb += (255 - cb) * swell * 0.5;
          }
          if (heat > 0.02) {
            cr += (255 - cr) * heat;
            cg += (142 - cg) * heat;
            cb += (94 - cb) * heat;
          }
          ctx.globalAlpha = fadeIn * (0.55 + 0.45 * Math.min(1, v + heat));
          ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
          ctx.beginPath();
          ctx.arc(sx, sy - lift, r, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += 0.0125;
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {
      t = 2;
      draw();
    } else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - r.left) / r.width;
      pointer.ty = (e.clientY - r.top) / r.height;
      pointer.ta = pointer.ty > 0 ? 1 : 0;
    };
    const onLeave = () => (pointer.ta = 0);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [stepProp]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
