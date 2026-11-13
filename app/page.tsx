import Link from "next/link";
import MapLogo from "./components/MapLogo";
import NeonParticles from "./components/NeonParticles";
import { languages, maps } from "@/lib/maps";

// ---------- Small icons (inline SVG, no extra library needed) ----------
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5-9 9" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M8 7h7M8 11h5" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const features = [
  {
    icon: <IconTarget />,
    title: "Map quiz",
    text: "Click a spot on the minimap and type its name. The fastest way to lock callouts into memory.",
    href: "/maps",
    cta: "Choose a map",
  },
  {
    icon: <IconImage />,
    title: "Picture quiz",
    text: "See a position from in-game and pick the right name out of four. Quick rounds, instant feedback.",
    href: "/quiz",
    cta: "Start a quiz",
  },
  {
    icon: <IconBook />,
    title: "Callout dictionary",
    text: "Every callout for every map, side by side in multiple languages. Perfect for mixed-language teams.",
    href: "/dictionary",
    cta: "Open dictionary",
  },
];

const steps = [
  { n: "01", title: "Pick a map", text: "Start with the map you play most." },
  { n: "02", title: "Study the callouts", text: "Read them in your language — and your teammates'." },
  { n: "03", title: "Test yourself", text: "Run quizzes until every name comes instantly." },
];

// Decorative preview of a quiz question, shown in the hero.
function QuizPreview() {
  const options = ["Jungle", "Connector", "Palace", "Stairs"];
  const correct = "Connector";
  return (
    <div className="relative isolate">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/30 blur-3xl" />
      <div className="rounded-2xl border border-white/10 bg-ink/70 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs text-snow/50">
          <span className="font-semibold uppercase tracking-widest text-brand">
            Mirage · Question 3/10
          </span>
          <span>Score 2</span>
        </div>
        <div className="mt-4 grid aspect-video place-items-center rounded-xl bg-gradient-to-br from-olive to-ink text-sm text-snow/40">
          <div className="text-center">
            <div className="mx-auto mb-2 size-10 rounded-full border-2 border-dashed border-brand/60" />
            Position screenshot
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {options.map((o) => (
            <div
              key={o}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${
                o === correct
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-white/10 bg-white/5 text-snow/70"
              }`}
            >
              {o}
              {o === correct && <span className="float-right">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const stats = [
    { value: maps.length, label: "Maps" },
    { value: languages.length, label: "Languages" },
    { value: 3, label: "Ways to learn" },
    { value: "Free", label: "Forever" },
  ];

  return (
    <>
      <NeonParticles />

      {/* ---------- Hero ---------- */}
      <section className="container-page grid items-center gap-14 pt-20 pb-24 lg:grid-cols-[1.15fr_1fr] lg:pt-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand" />
            Counter-Strike 2 callouts · {maps.length} maps
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Speak the map.
            <br />
            <span className="bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-transparent">
              Win the round.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-snow/70">
            Kollaut teaches you every position name on every map — in your
            language and your teammates&apos;. Learn with a dictionary, then
            lock it in with quick quizzes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="neon-btn inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-deep"
            >
              Start the quiz <IconArrow />
            </Link>
            <Link
              href="/dictionary"
              className="neon-ghost inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold backdrop-blur"
            >
              Browse callouts
            </Link>
          </div>
        </div>
        <QuizPreview />
      </section>

      {/* ---------- Stats ---------- */}
      <section className="container-page">
        <dl className="grid grid-cols-2 divide-white/10 rounded-2xl border border-white/10 bg-ink/50 backdrop-blur sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="p-6 text-center">
              <dt className="text-xs uppercase tracking-widest text-cream/60">
                {s.label}
              </dt>
              <dd className="mt-2 text-3xl font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Features ---------- */}
      <section className="container-page pt-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Three ways to learn
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
          Everything you need to call it right the first time.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="neon-card group flex flex-col rounded-2xl border border-white/10 bg-ink/60 p-7 backdrop-blur transition-all hover:-translate-y-1 hover:border-brand/50"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-brand/15 text-brand">
                {f.icon}
              </span>
              <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-snow/60">{f.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                {f.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  <IconArrow />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Maps ---------- */}
      <section className="container-page pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Map pool
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Pick your battlefield.
            </h2>
          </div>
          <Link href="/dictionary" className="neon-link text-sm font-semibold text-snow/70">
            See all callouts →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-4 gap-4 sm:grid-cols-8">
          {maps.map((m) => (
            <Link
              key={m.id}
              href={`/dictionary/${m.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
            >
              <div className="neon-logo transition-transform group-hover:scale-110">
                <MapLogo map={m} size={72} />
              </div>
              <span className="text-xs font-medium text-snow/70 group-hover:text-snow">
                {m.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="container-page pt-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          How it works
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          From zero to fluent in three steps.
        </h2>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-white/10 bg-ink/50 p-7 backdrop-blur">
              <span className="font-mono text-sm text-brand">{s.n}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-snow/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="container-page pt-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep px-8 py-16 text-center text-ink sm:px-16">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-cream/30 blur-3xl" />
          <h2 className="relative text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to make the call?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-lg text-ink/75">
            Jump into a quiz now — no sign-up, no downloads.
          </p>
          <Link
            href="/quiz"
            className="neon-btn relative mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 font-semibold text-snow transition-colors hover:bg-olive"
          >
            Start the quiz <IconArrow />
          </Link>
        </div>
      </section>
    </>
  );
}
