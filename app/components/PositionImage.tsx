// Shows a position's real screenshot if it has one, otherwise a drawn
// placeholder "corridor" scene. The placeholder layout is picked from the
// position id, so each position always looks the same but different from others.

function hash(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export default function PositionImage({
  id,
  mapId,
  mapColor,
  image,
  alt,
}: {
  id: string;
  mapId: string;
  mapColor: string;
  image?: string;
  alt: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={alt} className="size-full object-cover" draggable={false} />
    );
  }

  const h = hash(mapId + ":" + id);
  const pick = (shift: number, n: number) => (h >>> shift) % n;

  const vx = 200 + pick(0, 7) * 40; // vanishing point x (200–440)
  const vy = 150 + pick(3, 5) * 10; // vanishing point y
  const doorLeft = pick(6, 2) === 0;
  const crates = 1 + pick(8, 3);
  const arch = pick(11, 2) === 0;
  const gid = `pos-${mapId}-${id}`;

  return (
    <svg viewBox="0 0 640 360" className="size-full" role="img" aria-label={alt}>
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2f38" />
          <stop offset="1" stopColor="#14161a" />
        </linearGradient>
        <linearGradient id={`${gid}-wall`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mapColor} stopOpacity="0.55" />
          <stop offset="1" stopColor={mapColor} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`${gid}-light`} cx={vx / 640} cy={vy / 360} r="0.5">
          <stop offset="0" stopColor="#ffd9a8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd9a8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky / ceiling and floor */}
      <rect width="640" height="360" fill={`url(#${gid}-sky)`} />
      <polygon points={`0,360 640,360 ${vx + 60},${vy + 20} ${vx - 60},${vy + 20}`} fill="#3a3a33" />

      {/* left and right walls */}
      <polygon points={`0,0 ${vx - 60},${vy - 70} ${vx - 60},${vy + 20} 0,360`} fill={`url(#${gid}-wall)`} />
      <polygon points={`640,0 ${vx + 60},${vy - 70} ${vx + 60},${vy + 20} 640,360`} fill={`url(#${gid}-wall)`} opacity="0.8" />

      {/* far opening (bright) */}
      {arch ? (
        <path d={`M${vx - 60},${vy + 20} V${vy - 40} Q${vx},${vy - 95} ${vx + 60},${vy - 40} V${vy + 20} Z`} fill="#e9d6b8" opacity="0.85" />
      ) : (
        <rect x={vx - 60} y={vy - 70} width="120" height="90" fill="#e9d6b8" opacity="0.85" />
      )}
      <rect width="640" height="360" fill={`url(#${gid}-light)`} />

      {/* side door */}
      {doorLeft ? (
        <polygon points={`70,110 150,135 150,300 70,330`} fill="#111" opacity="0.7" />
      ) : (
        <polygon points={`570,110 490,135 490,300 570,330`} fill="#111" opacity="0.7" />
      )}

      {/* crates */}
      {Array.from({ length: crates }, (_, i) => {
        const size = 70 - i * 14;
        const x = (doorLeft ? 400 : 170) + i * 55 - size / 2;
        const y = 330 - size - i * 18;
        return (
          <g key={i}>
            <rect x={x} y={y} width={size} height={size} fill="#6b5233" stroke="#3b2c1a" strokeWidth="3" />
            <path d={`M${x} ${y} L${x + size} ${y + size} M${x + size} ${y} L${x} ${y + size}`} stroke="#3b2c1a" strokeWidth="2" />
          </g>
        );
      })}

      {/* crosshair */}
      <g stroke="#7CFC00" strokeWidth="2" opacity="0.9">
        <line x1="320" y1="168" x2="320" y2="176" />
        <line x1="320" y1="184" x2="320" y2="192" />
        <line x1="308" y1="180" x2="316" y2="180" />
        <line x1="324" y1="180" x2="332" y2="180" />
      </g>

      <text x="14" y="346" fontSize="12" fill="rgb(255 255 255 / 0.4)" fontFamily="Arial, sans-serif">
        Placeholder image
      </text>
    </svg>
  );
}
