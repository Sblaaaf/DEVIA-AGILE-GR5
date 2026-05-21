import { useState, useEffect } from 'react'

const KEY = 'musicquiz_leaderboard'
const MAX = 10

export function saveScore(score, genre, pseudo = '') {
  const board = getLeaderboard()
  const entry = { score, genre, pseudo, date: new Date().toLocaleDateString('fr-FR') }
  const updated = [...board, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export default function ScoreBoard({ highlightScore, highlightPseudo }) {
  const [board, setBoard] = useState([])

  useEffect(() => {
    setBoard(getLeaderboard())
  }, [highlightScore])

  if (board.length === 0) return null

  return (
    <div className="glass rounded-2xl p-5 w-full max-w-sm">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <span>🏆</span> Classement local
      </h3>
      <ol className="space-y-2">
        {board.map((entry, i) => {
          const isHighlight =
            entry.score === highlightScore &&
            (highlightPseudo ? entry.pseudo === highlightPseudo : true)
          return (
            <li
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                isHighlight ? 'bg-violet-600/30 border border-violet-400/50' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono font-bold w-5 text-center flex-shrink-0 ${
                    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
                {entry.pseudo && (
                  <span className={`font-semibold truncate max-w-[80px] ${isHighlight ? 'text-violet-300' : 'text-white'}`}>
                    {entry.pseudo}
                  </span>
                )}
                <span className="text-slate-400 truncate">{entry.genre}</span>
                <span className="text-slate-500 text-xs flex-shrink-0">{entry.date}</span>
              </div>
              <span className={`font-bold flex-shrink-0 ml-2 ${isHighlight ? 'text-violet-300' : 'text-white'}`}>
                {entry.score}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
