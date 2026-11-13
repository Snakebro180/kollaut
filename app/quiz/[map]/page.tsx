import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import MapLogo from "../../components/MapLogo";
import PictureQuiz from "../../components/PictureQuiz";
import { getMap, maps } from "@/lib/maps";

// Tells Next.js which map pages exist, so they're built ahead of time.
export async function generateStaticParams() {
  return maps.map((map) => ({ map: map.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/quiz/[map]">): Promise<Metadata> {
  const { map: id } = await params;
  const map = getMap(id);
  return { title: map ? `${map.name} quiz · Kollaut` : "Kollaut" };
}

// The page shell (back link) shows instantly; the map-specific part
// reads the address (params) inside <Suspense>, as Next.js recommends.
export default function Page({ params }: PageProps<"/quiz/[map]">) {
  return (
    <div className="container-page pt-12">
      <Link href="/quiz" className="neon-link text-sm text-snow/60">
        ← All maps
      </Link>
      <Suspense fallback={<Loading />}>
        <MapQuizPage params={params} />
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

async function MapQuizPage({
  params,
}: Pick<PageProps<"/quiz/[map]">, "params">) {
  const { map: id } = await params;
  const map = getMap(id);
  if (!map) notFound();

  return (
    <>
      <div className="mt-8 flex items-center gap-6">
        <MapLogo map={map} size={96} />
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{map.name} quiz</h1>
          <p className="mt-2 text-lg text-snow/60">
            Look at the position and choose its correct name.
          </p>
        </div>
      </div>

      <PictureQuiz
        mapId={map.id}
        mapName={map.name}
        mapColor={map.color}
        positions={map.positions}
      />
    </>
  );
}
