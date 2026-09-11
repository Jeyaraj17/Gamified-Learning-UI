import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '../types'

type Outcome = 'finished' | 'gameover'
type View = 'result' | 'confirm' | 'answers'

interface ChallengeResultProps {
  outcome: Outcome
  questions: Question[]
  correct: number
  points: number
  justRecorded: boolean
  answersViewed: boolean
  onShowAnswers: () => void
  onRestart: () => void
}

const COPY: Record<Outcome, { emoji: string; title: string; sub: string; accent: string; tone: string }> = {
  gameover: {
    emoji: '💀',
    title: 'GAME OVER',
    sub: 'You ran out of lives!',
    accent: 'border-red-300',
    tone: 'text-red-500',
  },
  finished: {
    emoji: '🏁',
    title: 'CHALLENGE COMPLETE!',
    sub: 'You made it to the finish flag.',
    accent: 'border-emerald-300',
    tone: 'text-emerald-600',
  },
}

export function ChallengeResult({
  outcome,
  questions,
  correct,
  points,
  justRecorded,
  answersViewed,
  onShowAnswers,
  onRestart,
}: ChallengeResultProps) {
  const [view, setView] = useState<View>(answersViewed ? 'answers' : 'result')
  const copy = COPY[outcome]

  function confirmShowAnswers() {
    onShowAnswers()
    setView('answers')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      className={`rounded-3xl border-4 ${copy.accent} bg-white/95 p-8 text-center text-slate-800 shadow-2xl`}
    >
      <p className="text-5xl">{copy.emoji}</p>
      <h2 className={`font-display mt-2 text-4xl ${copy.tone}`}>{copy.title}</h2>
      <p className="mt-1 text-slate-500">{copy.sub}</p>

      <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-slate-100 p-4">
        <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
          {justRecorded ? 'Final score' : 'Your recorded score'}
        </p>
        <p className="font-display mt-1 text-2xl text-indigo-700">
          {correct} / {questions.length} correct · {points} pts
        </p>
      </div>

      {view === 'result' && (
        <>
          <p className="mx-auto mt-4 max-w-sm text-xs text-slate-400">
            {justRecorded
              ? 'This score is final and has been recorded on the leaderboard.'
              : 'Practice run — your recorded score is unchanged.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onRestart}
              className="btn-game rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-6 py-3 font-bold text-white"
            >
              {outcome === 'gameover' ? 'Restart 🔁' : 'Replay 🔁'}
            </button>
            <button
              onClick={() => setView('confirm')}
              className="btn-game rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 px-6 py-3 font-bold text-white"
            >
              Show answers 📖
            </button>
            <Link
              to="/"
              className="btn-game rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-6 py-3 font-bold text-white"
            >
              Back to archive
            </Link>
          </div>
        </>
      )}

      {view === 'confirm' && (
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
          <p className="font-bold text-slate-700">Reveal the answers?</p>
          <p className="mt-1 text-sm text-slate-500">
            Once you see them you can’t play this challenge again — pick one or the other.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={confirmShowAnswers}
              className="btn-game rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 px-5 py-2 font-bold text-white"
            >
              Yes, show me
            </button>
            <button
              onClick={() => setView('result')}
              className="btn-game rounded-2xl bg-gradient-to-b from-slate-300 to-slate-400 px-5 py-2 font-bold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === 'answers' && (
        <>
          <div className="mt-6 grid gap-3 text-left">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">
                  {i + 1}. {q.prompt}
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  ✅ {q.choices[q.correctIndex]}
                </p>
                {q.explanation && <p className="mt-1 text-xs text-slate-500">{q.explanation}</p>}
              </div>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-sm text-xs text-slate-400">
            You chose to see the answers, so replay is disabled for this challenge.
          </p>
          <Link
            to="/"
            className="btn-game mt-4 inline-block rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-6 py-3 font-bold text-white"
          >
            Back to archive
          </Link>
        </>
      )}
    </motion.div>
  )
}
