import { getLeaderboard } from '../services/leaderboard'

export default function ScoreBoard({ highlightScore }) {
  const board = getLeaderboard()

  if (board.length === 0) return null

  return (
    <div className="glass rounded-2xl p-5 w-full max-w-sm">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <span>🏆</span> Classement local
      </h3>
      <ol className="space-y-2">
        {board.map((entry, i) => {
          const isHighlight = entry.score === highlightScore
          return (
            <li
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                isHighlight ? 'bg-violet-600/30 border border-violet-400/50' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono font-bold w-5 text-center ${
                    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-slate-300">{entry.genre}</span>
                <span className="text-slate-500 text-xs">{entry.date}</span>
              </div>
              <span className={`font-bold ${isHighlight ? 'text-violet-300' : 'text-white'}`}>
                {entry.score}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
