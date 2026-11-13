"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The links shown in the navigation bar. Add a new line here to add a new page link.
const links = [
  { href: "/maps", label: "Maps" },
  { href: "/quiz", label: "Quiz" },
  { href: "/dictionary", label: "Dictionary" },
  { href: "/about", label: "About" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-deep text-sm font-black text-ink">
        K
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${compact ? "hidden sm:inline" : ""}`}
      >
        Kollaut
      </span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/40 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Logo compact />

        <ul className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-4 ${
                    isActive
                      ? "bg-white/10 text-brand"
                      : "neon-link text-snow/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/quiz"
          className="neon-btn hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-deep md:inline-block"
        >
          Start quiz
        </Link>
      </nav>
    </header>
  );
}
