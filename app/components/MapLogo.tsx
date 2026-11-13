import type { GameMap } from "@/lib/maps";

// Shows the map's real logo if it has one, otherwise a colored placeholder badge.
export default function MapLogo({
  map,
  size = 160,
}: {
  map: GameMap;
  size?: number;
}) {
  if (map.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={map.logo}
        alt={`${map.name} logo`}
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }

  const gradientId = `grad-${map.id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${map.name} logo placeholder`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={map.color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={map.color} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="#1d1d1f" />
      <circle cx="50" cy="50" r="42" fill={`url(#${gradientId})`} />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="28"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="1"
      >
        {map.short}
      </text>
    </svg>
  );
}
