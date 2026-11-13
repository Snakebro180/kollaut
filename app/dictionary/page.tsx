import type { Metadata } from "next";
import MapGrid from "../components/MapGrid";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "Dictionary · Kollaut" };

export default function DictionaryPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Dictionary"
        title="Every callout, in every language."
        text="Choose a map to see all of its position names side by side."
      />
      <MapGrid basePath="/dictionary" cta="View callouts" />
    </div>
  );
}
