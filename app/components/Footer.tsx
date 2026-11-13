import Link from "next/link";
import { Logo } from "./NavBar";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/dictionary", label: "Dictionary" },
      { href: "/maps", label: "Maps" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/quiz", label: "Quiz" },
      { href: "/maps", label: "Map quiz" },
    ],
  },
  {
    title: "Kollaut",
    links: [{ href: "/about", label: "About" }],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink/60 backdrop-blur">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-snow/50">
            Learn map callouts in any language. Built for players who want to
            communicate faster.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream/60">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="neon-link text-snow/70"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5">
        <p className="container-page py-6 text-xs text-snow/40">
          © Kollaut. Not affiliated with Valve.
        </p>
      </div>
    </footer>
  );
}
