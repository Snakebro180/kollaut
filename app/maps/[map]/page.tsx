import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import MapLogo from "../../components/MapLogo";
import MapQuiz from "../../components/MapQuiz";
import { getMap, maps } from "@/lib/maps";

// Tells Next.js which map pages exist, so they're built ahead of time.
export async function generateStaticParams() {
  return maps.map((map) => ({ map: map.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/maps/[map]">): Promise<Metadata> {
  const { map: id } = await params;
  const map = getMap(id);
  return { title: map ? `${map.name} map · Kollaut` : "Kollaut" };
}

// The page shell (back link) shows instantly; the map-specific part
// reads the address (params) inside <Suspense>, as Next.js recommends.
export default function Page({ params }: PageProps<"/maps/[map]">) {
  return (
    <div className="container-page pt-12">
      <Link href="/maps" className="neon-link text-sm text-snow/60">
        ← All maps
      </Link>
      <Suspense fallback={<Loading />}>
        <MapPage params={params} />
      </Suspense>
    </div>
  );
}

function Loading() {
  return (
    <div className="mt-8 flex animate-pulse items-center gap-6">
      <div className="size-24 rounded-full bg-white/10" />
      <div className="h-8 w-48 rounded bg-white/10" />
    </div>
  );
}

async function MapPage({ params }: Pick<PageProps<"/maps/[map]">, "params">) {
  const { map: id } = await params;
  const map = getMap(id);
  if (!map) notFound();

  return (
    <>
      <div className="mt-8 flex items-center gap-6">
        <MapLogo map={map} size={96} />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {map.name}
        </h1>
      </div>
      <MapQuiz
        mapId={map.id}
        mapName={map.name}
        minimap={map.minimap}
        positions={map.positions}
      />
    </>
  );
}
