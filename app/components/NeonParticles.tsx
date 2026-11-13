"use client";

import { useEffect, useRef } from "react";

// Glowing orange specks that float slowly upward behind the page,
// like embers / dust in a lit-up CS2 map.
// Tweak these numbers to change the look:
const PARTICLES_PER_100K_PX = 7; // density (more = busier)
const MAX_PARTICLES = 110;
const COLORS = ["#ee7f27", "#d9641e", "#ffb15c", "#eae2d3"]; // oranges + a little cream

type Particle = {
  x: number;
  y: number;
  r: number; // size
  vy: number; // upward speed
  drift: number; // side-to-side sway amount
  phase: number; // where it is in its sway / twinkle cycle
  twinkle: number; // twinkle speed
  sprite: HTMLCanvasElement;
};

// Pre-draw one soft glowing dot per color, then reuse it (much faster than drawing blur every frame).
function makeSprite(color: string) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "#fff8ef");
  grad.addColorStop(0.12, color);
  grad.addColorStop(0.35, color + "66");
  grad.addColorStop(1, color + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function NeonParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = COLORS.map(makeSprite);
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const spawn = (anywhere: boolean): Particle => {
      // Mostly orange, sometimes cream
      const sprite = Math.random() < 0.85 ? sprites[Math.floor(Math.random() * 3)] : sprites[3];
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 20,
        r: 1 + Math.random() * 2.6,
        vy: 0.15 + Math.random() * 0.45,
        drift: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.01 + Math.random() * 0.03,
        sprite,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(MAX_PARTICLES, Math.round((width * height) / 100_000 * PARTICLES_PER_100K_PX));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter"; // overlapping glows add up, like real light
      for (const p of particles) {
        if (!reduceMotion) {
          p.phase += p.twinkle;
          p.y -= p.vy;
          p.x += Math.sin(p.phase) * p.drift * 0.3;
          if (p.y < -20) Object.assign(p, spawn(false));
        }
        // Twinkle + fade out near the top of the screen
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 2);
        const fade = Math.min(1, p.y / (height * 0.25));
        ctx.globalAlpha = Math.max(0, twinkle * fade);
        const s = p.r * 8;
        ctx.drawImage(p.sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-1 h-full w-full"
    />
  );
}
