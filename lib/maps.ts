import { calloutsFor } from "./callouts";

// All map data for Kollaut lives here.
// Dictionary callouts are in lib/callouts.ts.
// To add a map: copy one entry and change its values.
// To use a real logo: put the image in public/maps/ (e.g. public/maps/dust2.png)
// and set logo: "/maps/dust2.png" on that map.
// To use a real minimap: put it in public/minimaps/ and set minimap: "/minimaps/dust2.png".

export type Callout = {
  id: string;
  // The callout name in each language, e.g. { en: "Long A", ru: "Длинка" }
  names: Partial<Record<LanguageCode, string>>;
};

// A spot on the minimap for the map quiz.
// x and y are percentages of the minimap: x 0 = left edge, 100 = right edge;
// y 0 = top edge, 100 = bottom edge.
export type MapPosition = {
  id: string;
  name: string;
  x: number;
  y: number;
  // In-game screenshot for the picture quiz, e.g. "/positions/inferno/banana.jpg"
  // (put the file in public/positions/inferno/). Without it a placeholder is shown.
  image?: string;
};

export type GameMap = {
  id: string; // used in the web address: /dictionary/dust2
  name: string;
  short: string; // shown on the placeholder logo
  color: string; // placeholder logo color
  logo?: string; // path to a real logo image, when you have one
  minimap?: string; // path to a real minimap image, when you have one
  callouts: Callout[];
  positions: MapPosition[]; // spots for the map quiz
};

export const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uk", label: "Українська" },
  { code: "de", label: "Deutsch" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

// ---------- PLACEHOLDER quiz positions (replace with real ones per map) ----------
const PLACEHOLDER_NAMES = [
  "A Site", "B Site", "Mid", "CT Spawn", "T Spawn", "A Long",
  "A Short", "B Tunnels", "Connector", "Window", "Heaven", "Ramp",
];
const PLACEHOLDER_SPOTS: [number, number][] = [
  [24, 18], [76, 24], [50, 48], [82, 56], [16, 82], [36, 30],
  [62, 34], [28, 62], [56, 70], [72, 82], [44, 14], [88, 88],
];
// Mirrors the spots differently per map so every map looks a bit different.
function placeholderPositions(variant: number): MapPosition[] {
  return PLACEHOLDER_NAMES.map((name, i) => {
    let [x, y] = PLACEHOLDER_SPOTS[i];
    if (variant % 2 === 1) x = 100 - x;
    if (variant % 3 === 1) y = 100 - y;
    return { id: name.toLowerCase().replace(/\s+/g, "-"), name, x, y };
  });
}
// -------------------------------------------------------------------------------

export const maps: GameMap[] = [
  { id: "dust2", name: "Dust 2", short: "D2", color: "#b8925a", callouts: calloutsFor("dust2"), positions: placeholderPositions(0) },
  { id: "mirage", name: "Mirage", short: "MI", color: "#c0392b", callouts: calloutsFor("mirage"), positions: placeholderPositions(1) },
  { id: "inferno", name: "Inferno", short: "IN", color: "#a3201b", callouts: calloutsFor("inferno"), positions: placeholderPositions(2) },
  { id: "nuke", name: "Nuke", short: "NU", color: "#1f6f8b", callouts: calloutsFor("nuke"), positions: placeholderPositions(3) },
  { id: "anubis", name: "Anubis", short: "AN", color: "#5b5b66", callouts: calloutsFor("anubis"), positions: placeholderPositions(4) },
  { id: "ancient", name: "Ancient", short: "AC", color: "#4f7a4a", callouts: calloutsFor("ancient"), positions: placeholderPositions(5) },
  { id: "cache", name: "Cache", short: "CA", color: "#c8642d", callouts: calloutsFor("cache"), positions: placeholderPositions(6) },
  { id: "vertigo", name: "Vertigo", short: "VE", color: "#2e3f8f", callouts: calloutsFor("vertigo"), positions: placeholderPositions(7) },
];

export function getMap(id: string) {
  return maps.find((m) => m.id === id);
}
