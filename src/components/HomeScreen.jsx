import { useState } from 'react'
import { getLeaderboard } from './ScoreBoard'

const GENRES = [
  { name: 'Pop',     emoji: '🎤', color: 'from-pink-500 to-rose-500',      desc: 'Hits du moment' },
  { name: 'Rock',    emoji: '🎸', color: 'from-orange-500 to-red-500',     desc: 'Classiques & moderne' },
  { name: 'Hip-Hop', emoji: '🎧', color: 'from-yellow-400 to-amber-500',   desc: 'Rap & R&B' },
  { name: 'Électro', emoji: '🎹', color: 'from-cyan-400 to-blue-600',      desc: 'Dance & Electronic' },
  { name: 'French',  emoji: '🥐', color: 'from-violet-500 to-fuchsia-600', desc: 'Chanson française' },
  { name: 'Techno',  emoji: '💀', color: 'from-violet-800 to-indigo-900',  desc: 'Hardcore & Uptempo' },
]

const RULES = [
  { icon: '🎵', text: '10 questions par partie' },
  { icon: '⏱️', text: '20 secondes par titre' },
  { icon: '⚡', text: 'Bonus de vitesse' },
]

export default function HomeScreen({ onStart, error }) {
  const [isInverted, setIsInverted] = useState(false)
  const board = getLeaderboard()
  const best = board[0]?.score ?? null

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-[#0f0f1a]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-pink-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-5 pt-14 pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/30 mb-5">
            🎵
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Music<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Quiz</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Reconnais l&apos;artiste en 30 secondes</p>

          {best !== null && (
            <div className="mt-3 flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm">
              <span>🏆</span>
              <span className="text-slate-300">Meilleur score :</span>
              <span className="text-violet-300 font-bold">{best} pts</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="w-full mb-5 px-4 py-3 rounded-xl bg-red-900/40 border border-red-500/40 text-red-300 text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Settings */}
        <div className="w-full mb-6 glass rounded-2xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg">
              🔄
            </div>
            <div>
              <div className="text-white font-bold text-sm">Musique Inversée</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Mode Défi</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isInverted}
              onChange={(e) => setIsInverted(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {/* Genre label */}
        <p className="w-full text-left text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          Choisis un genre
        </p>

        {/* Genre cards */}
        <div className="w-full flex flex-col gap-3 animate-slide-up">
          {GENRES.map((g, i) => (
            <button
              key={g.name}
              onClick={() => onStart(g.name)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`
                group relative overflow-hidden rounded-2xl p-4
                flex items-center gap-4
                bg-gradient-to-r ${g.color}
                shadow-lg transition-all duration-200
                hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-white/40
              `}
            >
              {/* Large ghost emoji */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-5xl opacity-20 group-hover:opacity-30 transition-opacity select-none">
                {g.emoji}
              </div>

              {/* Small emoji badge */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                {g.emoji}
              </div>

              {/* Text */}
              <div className="text-left">
                <div className="text-white font-bold text-base leading-tight">{g.name}</div>
                <div className="text-white/70 text-xs mt-0.5">{g.desc}</div>
              </div>

              {/* Arrow */}
              <div className="ml-auto mr-8 text-white/60 group-hover:text-white transition-colors text-lg">
                →
              </div>
            </button>
          ))}
        </div>

        {/* Rules */}
        <div className="w-full mt-8 flex justify-around">
          {RULES.map((r) => (
            <div key={r.text} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg">
                {r.icon}
              </div>
              <span className="text-slate-500 text-xs leading-tight max-w-[70px]">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
