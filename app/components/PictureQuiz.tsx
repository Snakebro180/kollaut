"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MapPosition } from "@/lib/maps";
import PositionImage from "./PositionImage";

// Picture quiz: show a position's image, pick its name from 4 options.
// Keyboard: 1–4 to answer, Enter to go to the next question.

const QUESTIONS_PER_ROUND = 10;
const OPTIONS_PER_QUESTION = 4;

type Question = { answer: MapPosition; options: MapPosition[] };

// Random numbers from a seed, so the server and browser build the same round.
function seededRandom(seedText: string) {
  let seed = [...seedText].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}
function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(positions: MapPosition[], seed: string): Question[] {
  const rand = seededRandom(seed);
  return shuffle(positions, rand)
    .slice(0, QUESTIONS_PER_ROUND)
    .map((answer) => {
      // 3 wrong answers from other positions on the same map
      const wrong = shuffle(
        positions.filter((p) => p.id !== answer.id),
        rand,
      ).slice(0, OPTIONS_PER_QUESTION - 1);
      return { answer, options: shuffle([answer, ...wrong], rand) };
    });
}

export default function PictureQuiz({
  mapId,
  mapName,
  mapColor,
  positions,
}: {
  mapId: string;
  mapName: string;
  mapColor: string;
  positions: MapPosition[];
}) {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(string | null)[]>([]);

  const questions = useMemo(
    () => buildQuestions(positions, `${mapId}-${round}`),
    [positions, mapId, round],
  );

  const total = questions.length;
  const finished = index >= total;
  const q = questions[index];
  const picked = picks[index] ?? null;
  const score = picks.filter((p, i) => p === questions[i]?.answer.id).length;

  function choose(optionId: string) {
    if (picked || finished) return;
    setPicks((p) => {
      const next = [...p];
      next[index] = optionId;
      return next;
    });
  }

  function next() {
    if (picked) setIndex((i) => i + 1);
  }

  function restart() {
    setRound((r) => r + 1);
    setIndex(0);
    setPicks([]);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (finished || !q) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(q.options[n - 1].id);
      // (Enter on a focused button already clicks it, so skip it here to avoid a double jump)
      const onButton = e.target instanceof HTMLButtonElement;
      if (picked && (e.key === "ArrowRight" || (e.key === "Enter" && !onButton))) next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---------- Results screen ----------
  if (finished) {
    const ratio = score / total;
    const message =
      ratio === 1
        ? "Flawless. You know this map inside out."
        : ratio >= 0.7
          ? "Great comms! Just a few to polish."
          : ratio >= 0.4
            ? "Getting there. Check the dictionary and try again."
            : "Time to study. The dictionary will help.";
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-ink/60 p-10 text-center backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          {mapName} · Results
        </p>
        <p className="mt-4 text-7xl font-bold tabular-nums">
          {score}
          <span className="text-snow/40">/{total}</span>
        </p>
        <p className="mt-4 text-lg text-snow/70">{message}</p>
        <div className="mt-6 flex justify-center gap-1.5">
          {questions.map((qq, i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full ${
                picks[i] === qq.answer.id ? "bg-green-400" : "bg-red-500"
              }`}
            />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={restart}
            className="neon-btn rounded-full bg-brand px-6 py-3 font-semibold text-ink"
          >
            Play again
          </button>
          <Link
            href={`/dictionary/${mapId}`}
            className="neon-ghost rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold"
          >
            Study {mapName} callouts
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Question screen ----------
  const isRight = picked === q.answer.id;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-ink/60 p-5 backdrop-blur sm:p-6">
      {/* Header: question number, progress dots, score */}
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold uppercase tracking-widest text-brand">
          Question {index + 1}/{total}
        </span>
        <div className="hidden flex-1 justify-center gap-1.5 sm:flex">
          {questions.map((qq, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < index || (i === index && picked)
                  ? picks[i] === qq.answer.id
                    ? "bg-green-400"
                    : "bg-red-500"
                  : i === index
                    ? "bg-brand"
                    : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <span className="tabular-nums text-snow/60">Score {score}</span>
      </div>

      {/* Image */}
      <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-ink">
        <PositionImage
          key={`${round}-${index}`}
          id={q.answer.id}
          mapId={mapId}
          mapColor={mapColor}
          image={q.answer.image}
          alt={`A position on ${mapName}`}
        />
        {picked && (
          <div
            className={`absolute inset-x-0 bottom-0 px-4 py-3 text-center font-semibold backdrop-blur ${
              isRight ? "bg-green-500/25 text-green-300" : "bg-red-500/25 text-red-300"
            }`}
          >
            {isRight ? "Correct!" : `Not quite. It's ${q.answer.name}.`}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const isAnswer = o.id === q.answer.id;
          const isPicked = o.id === picked;
          let style = "neon-ghost border-white/15 bg-white/5 text-snow";
          if (picked) {
            style = isAnswer
              ? "border-green-400 bg-green-400/15 text-green-300 shadow-[0_0_14px_rgba(74,222,128,0.45)]"
              : isPicked
                ? "border-red-500 bg-red-500/15 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.45)]"
                : "border-white/10 bg-white/5 text-snow/40";
          }
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              disabled={!!picked}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors ${style}`}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/10 text-xs text-snow/60">
                {i + 1}
              </span>
              {o.name}
              {picked && isAnswer && <span className="ml-auto">✓</span>}
              {picked && isPicked && !isAnswer && <span className="ml-auto">✕</span>}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <div className="mt-5 flex h-12 items-center justify-end">
        {picked && (
          <button
            type="button"
            onClick={next}
            autoFocus
            className="neon-btn rounded-full bg-brand px-6 py-3 font-semibold text-ink"
          >
            {index + 1 === total ? "See results" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}
