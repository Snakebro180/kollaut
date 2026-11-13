import type { Metadata } from "next";
import MapGrid from "../components/MapGrid";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "Maps · Kollaut" };

export default function MapsPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Map quiz"
        title="Click it. Name it."
        text="Choose a map, click a spot on the minimap and type its callout."
      />
      <MapGrid basePath="/maps" cta="Open map" />
    </div>
  );
}
