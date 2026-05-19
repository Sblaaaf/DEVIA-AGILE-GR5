import { useEffect } from 'react'
import ScoreBoard, { saveScore } from './ScoreBoard'

function grade(score, total) {
  const pct = score / (total * 150)
  if (pct >= 0.9) return { label: 'Légendaire !', emoji: '🌟' }
  if (pct >= 0.7) return { label: 'Excellent !', emoji: '🔥' }
  if (pct >= 0.5) return { label: 'Bien joué !', emoji: '👏' }
  if (pct >= 0.3) return { label: 'Pas mal !', emoji: '🎵' }
  return { label: 'Réessaie !', emoji: '💪' }
}

export default function ResultsScreen({ score, answers, genre, totalRounds, onPlayAgain }) {
  const correct = answers.filter((a) => a.correct).length
  const { label, emoji } = grade(score, totalRounds)

  useEffect(() => {
    saveScore(score, genre)
  }, [score, genre])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 animate-slide-up">
      {/* Score hero */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{emoji}</div>
        <h2 className="text-3xl font-black text-white mb-1">{label}</h2>
        <p className="text-slate-400">
          {correct}/{totalRounds} bonnes réponses
        </p>
      </div>

      {/* Big score */}
      <div className="glass rounded-3xl px-10 py-8 text-center mb-8 glow-purple">
        <div className="text-7xl font-black text-white mb-1">{score}</div>
        <div className="text-violet-300 font-medium">points</div>
      </div>

      {/* Per-round breakdown */}
      <div className="flex gap-1.5 mb-8 flex-wrap justify-center max-w-xs">
        {answers.map((a, i) => (
          <div
            key={i}
            title={`Q${i + 1}: ${a.points} pts`}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              a.correct ? 'bg-green-600/50 text-green-300' : 'bg-red-600/30 text-red-400'
            }`}
          >
            {a.correct ? '✓' : '✗'}
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="mb-8 w-full max-w-sm">
        <ScoreBoard highlightScore={score} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onPlayAgain}
          className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 glow-purple"
        >
          Rejouer
        </button>
        <button
          onClick={onPlayAgain}
          className="glass hover:bg-white/10 text-slate-300 font-medium py-3 rounded-2xl transition-all duration-200"
        >
          Changer de genre
        </button>
      </div>
    </div>
  )
}
