interface PointsHUDProps {
  points: number
  streak: number
}

export function PointsHUD({ points, streak }: PointsHUDProps) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
      <span className="flex items-center gap-1 font-bold text-amber-600">
        ⭐ {points}
      </span>
      {streak > 0 && (
        <span className="flex items-center gap-1 font-bold text-orange-500">
          🔥 {streak}
        </span>
      )}
    </div>
  )
}
