import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import MapLogo from "../../components/MapLogo";
import { getMap, languages, maps } from "@/lib/maps";

// Tells Next.js which map pages exist, so they're built ahead of time.
export async function generateStaticParams() {
  return maps.map((map) => ({ map: map.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/dictionary/[map]">): Promise<Metadata> {
  const { map: id } = await params;
  const map = getMap(id);
  return { title: map ? `${map.name} callouts · Kollaut` : "Kollaut" };
}

// The page shell (back link) shows instantly; the map-specific part
// reads the address (params) inside <Suspense>, as Next.js recommends.
export default function Page({ params }: PageProps<"/dictionary/[map]">) {
  return (
    <div className="container-page pt-12">
      <Link href="/dictionary" className="neon-link text-sm text-snow/60">
        ← All maps
      </Link>
      <Suspense fallback={<Loading />}>
        <MapDictionaryPage params={params} />
      </Suspense>
    </div>
  );
}

function Loading() {
  return (
    <div className="mt-6 flex animate-pulse items-center gap-6">
      <div className="size-24 rounded-full bg-white/10" />
      <div className="h-8 w-48 rounded bg-white/10" />
    </div>
  );
}

async function MapDictionaryPage({
  params,
}: Pick<PageProps<"/dictionary/[map]">, "params">) {
  const { map: id } = await params;
  const map = getMap(id);
  if (!map) notFound();

  return (
    <>
      <div className="mt-8 flex items-center gap-6">
        <MapLogo map={map} size={96} />
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{map.name}</h1>
          <p className="mt-2 text-lg text-snow/60">
            Callouts in {languages.map((l) => l.label).join(", ")}.
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-ink/50 backdrop-blur">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-cream/70">
            <tr>
              {languages.map((lang) => (
                <th key={lang.code} className="px-4 py-3 font-semibold">
                  {lang.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {map.callouts.length === 0 ? (
              <tr>
                <td
                  colSpan={languages.length}
                  className="px-4 py-14 text-center text-snow/50"
                >
                  Callouts for {map.name} are coming soon.
                </td>
              </tr>
            ) : (
              map.callouts.map((callout) => (
                <tr
                  key={callout.id}
                  className="border-t border-white/5 transition-colors hover:bg-white/5"
                >
                  {languages.map((lang) => (
                    <td key={lang.code} className="px-4 py-3">
                      {callout.names[lang.code] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
