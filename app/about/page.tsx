import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "About · Kollaut" };

export default function AboutPage() {
  return (
    <div className="container-page">
      <PageHeader eyebrow="About" title="Built for clear comms." />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-snow/70">
          <p>
            Kollaut helps you learn map callouts: the names players use for
            positions on a map. When everyone uses the same names, information
            travels faster and rounds are won.
          </p>
          <p>
            Teams are often international, so Kollaut shows callouts in several
            languages side by side. Study them in the dictionary, then test
            yourself with quizzes.
          </p>
          <Link
            href="/dictionary"
            className="neon-btn inline-flex rounded-full bg-brand px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-brand-deep"
          >
            Open the dictionary
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink/50 p-7 backdrop-blur">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cream/60">
            Good to know
          </h2>
          <ul className="mt-5 space-y-4 text-snow/70">
            <li>• Free to use, no account needed.</li>
            <li>• New maps and languages are added over time.</li>
            <li>• Kollaut is a fan project and is not affiliated with Valve.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
