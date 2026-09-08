interface ParallaxBackgroundProps {
  moving: boolean
}

function SkyDecor() {
  return (
    <svg viewBox="0 0 400 100" className="h-full w-1/2" preserveAspectRatio="none">
      <circle cx="340" cy="24" r="16" fill="#fde68a" opacity="0.9" />
      <ellipse cx="60" cy="40" rx="40" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="100" cy="30" rx="30" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="260" cy="50" rx="45" ry="20" fill="white" opacity="0.8" />
      <ellipse cx="300" cy="38" rx="26" ry="12" fill="white" opacity="0.8" />
      <path d="M150 20 L160 14 L170 20" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M180 34 L190 28 L200 34" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Hills() {
  return (
    <svg viewBox="0 0 400 120" className="h-full w-1/2" preserveAspectRatio="none">
      <path d="M0 120 Q60 40 140 100 T280 90 T400 110 V120 Z" fill="#4ade80" opacity="0.55" />
      <path d="M0 120 Q100 70 200 110 T400 100 V120 Z" fill="#22c55e" opacity="0.7" />
      <g opacity="0.85">
        <circle cx="70" cy="78" r="14" fill="#15803d" />
        <rect x="66" y="88" width="8" height="14" fill="#78350f" />
        <circle cx="230" cy="70" r="16" fill="#16a34a" />
        <rect x="225" y="82" width="9" height="16" fill="#78350f" />
        <circle cx="330" cy="82" r="12" fill="#15803d" />
        <rect x="326" y="90" width="7" height="12" fill="#78350f" />
      </g>
    </svg>
  )
}

function GroundStripes() {
  return (
    <svg viewBox="0 0 400 40" className="h-full w-1/2" preserveAspectRatio="none">
      <rect width="400" height="40" fill="#15803d" />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={i * 40 + 6} y="14" width="20" height="6" rx="3" fill="#166534" />
          <path
            d={`M${i * 40 + 32} 14 l3 -8 l3 8 Z`}
            fill="#22c55e"
          />
        </g>
      ))}
    </svg>
  )
}

export function ParallaxBackground({ moving }: ParallaxBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      <div
        className="absolute top-4 left-0 flex h-20 w-[200%]"
        style={{ animation: moving ? 'scroll-slow 22s linear infinite' : 'none' }}
      >
        <SkyDecor />
        <SkyDecor />
      </div>

      <div
        className="absolute bottom-14 left-0 flex h-28 w-[200%]"
        style={{ animation: moving ? 'scroll-mid 10s linear infinite' : 'none' }}
      >
        <Hills />
        <Hills />
      </div>

      <div
        className="absolute bottom-0 left-0 flex h-14 w-[200%]"
        style={{ animation: moving ? 'scroll-fast 2.2s linear infinite' : 'none' }}
      >
        <GroundStripes />
        <GroundStripes />
      </div>
    </div>
  )
}
