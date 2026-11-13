import type { Metadata } from "next";
import MapGrid from "../components/MapGrid";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = { title: "Quiz · Kollaut" };

export default function QuizPage() {
  return (
    <div className="container-page">
      <PageHeader
        eyebrow="Picture quiz"
        title="Name that position."
        text="See a spot on the map and pick its correct name from 4 options. Choose a map to begin."
      />
      <MapGrid basePath="/quiz" cta="Start quiz" />
    </div>
  );
}
