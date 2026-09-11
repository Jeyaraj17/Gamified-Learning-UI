import { motion } from 'framer-motion'

function SkyDecor() {
  return (
    <svg viewBox="0 0 400 100" className="h-full w-1/2" preserveAspectRatio="none">
      <ellipse cx="60" cy="40" rx="40" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="100" cy="30" rx="30" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="260" cy="50" rx="45" ry="20" fill="white" opacity="0.8" />
      <ellipse cx="300" cy="38" rx="26" ry="12" fill="white" opacity="0.8" />
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

function Bird({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute flex items-center gap-0.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 9, repeat: Infinity, delay, times: [0, 0.08, 0.9, 1] }}
      style={{ top: `${10 + delay * 6}%` }}
    >
      <motion.span
        className="block h-[6px] w-[10px] origin-bottom-right border-t-[2px] border-slate-600"
        animate={{ rotate: [25, -15, 25] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="block h-[6px] w-[10px] origin-bottom-left border-t-[2px] border-slate-600"
        animate={{ rotate: [-25, 15, -25] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export function ParallaxBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50">
      <motion.div
        className="absolute top-6 right-10 h-14 w-14 rounded-full bg-amber-200"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 40px 12px rgba(253,224,71,0.55)' }}
      />

      <div className="absolute top-2 h-24 w-full overflow-hidden">
        <Bird delay={0} />
        <Bird delay={3} />
        <Bird delay={6} />
      </div>

      <div
        className="absolute top-4 left-0 flex h-20 w-[200%]"
        style={{ animation: 'scroll-slow 26s linear infinite' }}
      >
        <SkyDecor />
        <SkyDecor />
      </div>

      <div
        className="absolute bottom-0 left-0 flex h-28 w-[200%]"
        style={{ animation: 'scroll-mid 14s linear infinite' }}
      >
        <Hills />
        <Hills />
      </div>

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]" />
    </div>
  )
}
