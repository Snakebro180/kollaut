"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapPosition } from "@/lib/maps";

// How it works:
// - Drag a position name from the list onto a glowing dot on the map
//   (or click a name, then click a dot — handy on phones and for keyboard users).
// - Right dot  → dot turns green, name disappears from the list.
// - Wrong dot  → dot flashes red for 1 second, name flies back to the list.
// - Hover a green dot to see its name.

const WRONG_FLASH_MS = 1000;
const RETURN_ANIMATION_MS = 300;
const DROP_RADIUS_PX = 26; // how close to a dot you must drop

type DotState = "idle" | "correct" | "wrong";

type Drag = {
  id: string;
  name: string;
  x: number; // pointer position
  y: number;
  dx: number; // where inside the chip the pointer grabbed it
  dy: number;
  startX: number; // pointer position at start (to fly back)
  startY: number;
  moved: boolean;
  returning: boolean;
};

// Same order every time for a given map, but not in the same order as the dots.
function shuffled<T>(items: T[], seedText: string): T[] {
  let seed = [...seedText].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MapQuiz({
  mapId,
  mapName,
  minimap,
  positions,
}: {
  mapId: string;
  mapName: string;
  minimap?: string;
  positions: MapPosition[];
}) {
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hoverDot, setHoverDot] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const mapRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const list = useMemo(() => shuffled(positions, mapId), [positions, mapId]);
  const remaining = list.filter((p) => !placed.has(p.id));
  const done = placed.size === positions.length;

  const dotState = (id: string): DotState =>
    placed.has(id) ? "correct" : wrong.has(id) ? "wrong" : "idle";

  // Find the free dot nearest to the pointer (within DROP_RADIUS_PX)
  function findDot(clientX: number, clientY: number): string | null {
    const box = mapRef.current?.getBoundingClientRect();
    if (!box) return null;
    let best: string | null = null;
    let bestDist = DROP_RADIUS_PX;
    for (const p of positions) {
      if (placed.has(p.id) || wrong.has(p.id)) continue;
      const px = box.left + (p.x / 100) * box.width;
      const py = box.top + (p.y / 100) * box.height;
      const d = Math.hypot(clientX - px, clientY - py);
      if (d <= bestDist) {
        best = p.id;
        bestDist = d;
      }
    }
    return best;
  }

  // Try to put position `nameId` on dot `dotId`. Returns true if correct.
  function attempt(nameId: string, dotId: string): boolean {
    if (placed.has(dotId) || wrong.has(dotId)) return false;
    if (nameId === dotId) {
      setPlaced((s) => new Set(s).add(dotId));
      return true;
    }
    setMistakes((m) => m + 1);
    setWrong((s) => new Set(s).add(dotId));
    timers.current.push(
      window.setTimeout(() => {
        setWrong((s) => {
          const n = new Set(s);
          n.delete(dotId);
          return n;
        });
      }, WRONG_FLASH_MS),
    );
    return false;
  }

  function flyBack(d: Drag) {
    setDrag({ ...d, x: d.startX, y: d.startY, returning: true });
    timers.current.push(window.setTimeout(() => setDrag(null), RETURN_ANIMATION_MS));
  }

  // ---------- Pointer handlers for the name chips ----------
  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, p: MapPosition) {
    if (e.button !== 0 || drag?.returning) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    setDrag({
      id: p.id,
      name: p.name,
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      returning: false,
    });
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag || drag.returning) return;
    const moved =
      drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 5;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
    setHoverDot(moved ? findDot(e.clientX, e.clientY) : null);
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag || drag.returning) return;
    setHoverDot(null);
    if (!drag.moved) {
      // Just a click: select / unselect this name
      setSelected((s) => (s === drag.id ? null : drag.id));
      setDrag(null);
      return;
    }
    const dot = findDot(e.clientX, e.clientY);
    if (dot && attempt(drag.id, dot)) {
      setDrag(null);
      if (selected === drag.id) setSelected(null);
    } else {
      flyBack(drag);
    }
  }

  function onPointerCancel() {
    if (drag && !drag.returning) flyBack(drag);
    setHoverDot(null);
  }

  // ---------- Click on a dot (when a name is selected) ----------
  function onDotClick(dotId: string) {
    if (!selected) return;
    attempt(selected, dotId);
    setSelected(null);
  }

  function reset() {
    setPlaced(new Set());
    setWrong(new Set());
    setSelected(null);
    setMistakes(0);
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* ---------- Map with dots ---------- */}
      <div
        ref={mapRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1b2230] select-none"
      >
        {minimap ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={minimap} alt={`${mapName} minimap`} className="absolute inset-0 size-full object-contain" draggable={false} />
        ) : (
          <MinimapPlaceholder />
        )}

        {positions.map((p) => {
          const state = dotState(p.id);
          const isTarget = hoverDot === p.id;
          const clickable = state === "idle" && !!selected;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onDotClick(p.id)}
              disabled={state === "wrong"}
              aria-label={state === "correct" ? p.name : "Unnamed spot"}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 ${
                clickable ? "cursor-pointer" : "cursor-default"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={`block size-3.5 rounded-full transition-all duration-200 ${
                  state === "correct"
                    ? "bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.9),0_0_18px_4px_rgba(74,222,128,0.5)]"
                    : state === "wrong"
                      ? "dot-shake bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.9),0_0_18px_4px_rgba(239,68,68,0.5)]"
                      : "dot-pulse bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8),0_0_16px_3px_rgba(255,255,255,0.35)]"
                } ${isTarget ? "scale-[1.8] ring-2 ring-brand" : ""} ${
                  clickable ? "group-hover:scale-150 group-hover:ring-2 group-hover:ring-brand" : ""
                }`}
              />
              {state === "correct" && (
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md border border-green-400/50 bg-ink/90 px-2 py-1 text-xs font-semibold whitespace-nowrap text-green-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {p.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------- Position names ---------- */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-snow/60">
            {selected
              ? "Now click a dot on the map."
              : "Drag each name onto its spot on the map."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="neon-link shrink-0 text-sm text-snow/60"
          >
            Reset
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand shadow-[0_0_10px_rgba(238,127,39,0.8)] transition-all duration-500"
              style={{ width: `${(placed.size / positions.length) * 100}%` }}
            />
          </div>
          <span className="tabular-nums text-snow/70">
            {placed.size}/{positions.length}
          </span>
          <span className="tabular-nums text-red-400/80">✕ {mistakes}</span>
        </div>

        {done ? (
          <div className="mt-8 rounded-2xl border border-green-400/40 bg-green-400/10 p-8 text-center">
            <p className="text-2xl font-bold">All positions found!</p>
            <p className="mt-2 text-snow/70">
              {mistakes === 0
                ? `A perfect run on ${mapName}.`
                : `${mistakes} mistake${mistakes === 1 ? "" : "s"} on ${mapName}.`}
            </p>
            <button
              type="button"
              onClick={reset}
              className="neon-btn mt-6 rounded-full bg-brand px-6 py-3 font-semibold text-ink"
            >
              Play again
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {remaining.map((p) => {
              const isDragging = drag?.id === p.id;
              const isSelected = selected === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onPointerDown={(e) => onPointerDown(e, p)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected((s) => (s === p.id ? null : p.id));
                      }
                    }}
                    aria-pressed={isSelected}
                    className={`neon-ghost w-full touch-none rounded-full border-2 px-3 py-2 text-sm font-medium select-none ${
                      isSelected
                        ? "border-brand bg-brand/20 text-brand"
                        : "border-brand/80 bg-ink/60 text-snow"
                    } ${isDragging ? "opacity-30" : "cursor-grab"}`}
                  >
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ---------- The chip that follows the pointer while dragging ---------- */}
      {drag?.moved && (
        <div
          className="pointer-events-none fixed z-50 rounded-full border-2 border-brand bg-ink/90 px-4 py-2 text-sm font-semibold text-brand shadow-[0_0_8px_rgba(238,127,39,0.9),0_0_24px_rgba(238,127,39,0.5)]"
          style={{
            left: drag.x - drag.dx,
            top: drag.y - drag.dy,
            transition: drag.returning
              ? `left ${RETURN_ANIMATION_MS}ms ease, top ${RETURN_ANIMATION_MS}ms ease, opacity ${RETURN_ANIMATION_MS}ms ease`
              : "none",
            opacity: drag.returning ? 0.4 : 1,
            cursor: "grabbing",
          }}
        >
          {drag.name}
        </div>
      )}
    </div>
  );
}

// Simple stand-in drawing until real minimap images are added.
function MinimapPlaceholder() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      <g fill="#3b4250" stroke="#525a68" strokeWidth="0.4">
        <rect x="14" y="10" width="22" height="18" rx="1" />
        <rect x="64" y="12" width="24" height="20" rx="1" />
        <rect x="40" y="38" width="20" height="20" rx="1" />
        <rect x="70" y="46" width="20" height="18" rx="1" />
        <rect x="8" y="72" width="22" height="20" rx="1" />
        <rect x="46" y="64" width="34" height="24" rx="1" />
        <rect x="22" y="26" width="6" height="48" />
        <rect x="34" y="16" width="32" height="6" />
        <rect x="28" y="56" width="20" height="6" />
        <rect x="58" y="30" width="6" height="12" />
        <rect x="78" y="30" width="6" height="18" />
        <rect x="78" y="80" width="12" height="6" />
      </g>
      <text x="50" y="97" textAnchor="middle" fontSize="2.6" fill="rgb(255 255 255 / 0.3)">
        Minimap placeholder
      </text>
    </svg>
  );
}
