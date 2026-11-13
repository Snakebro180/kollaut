import Link from "next/link";
import MapLogo from "./MapLogo";
import { maps } from "@/lib/maps";

// Grid of all maps. Each map links to `${basePath}/${map.id}`,
// e.g. basePath "/quiz" → /quiz/dust2.
export default function MapGrid({
  basePath,
  cta,
}: {
  basePath: string;
  cta: string;
}) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {maps.map((map) => (
        <Link
          key={map.id}
          href={`${basePath}/${map.id}`}
          className="neon-card group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-ink/50 px-4 pt-8 pb-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-brand/50"
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-transparent transition-colors group-hover:from-brand/15" />
          <div className="neon-logo relative transition-transform group-hover:scale-105">
            <MapLogo map={map} size={130} />
          </div>
          <h2 className="relative mt-5 text-xl font-bold">{map.name}</h2>
          <span className="relative mt-1 text-sm text-snow/50 transition-colors group-hover:text-brand">
            {cta} →
          </span>
        </Link>
      ))}
    </div>
  );
}
