import { useState, useEffect, useCallback, useRef } from 'react'
import Timer from './Timer'
import AudioPlayer from './AudioPlayer'

export default function QuizCard({ round, roundIndex, totalRounds, score, onAnswer, onTimeout, volume, onQuit, isInverted }) {
  const { correct, choices } = round
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const startTimeRef = useRef(null)

  useEffect(() => {
    setSelected(null)
    setAnswered(false)
    const t = setTimeout(() => {
      setTimerRunning(true)
      startTimeRef.current = Date.now()
    }, 300)
    return () => clearTimeout(t)
  }, [roundIndex])

  const handleAnswer = useCallback(
    (choice) => {
      if (answered) return
      setAnswered(true)
      setTimerRunning(false)
      setSelected(choice.id)
      const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 20
      setTimeout(() => onAnswer(choice.id === correct.id, elapsed), 1000)
    },
    [answered, correct.id, onAnswer]
  )

  const handleTimeout = useCallback(() => {
    if (answered) return
    setAnswered(true)
    setTimerRunning(false)
    setTimeout(onTimeout, 1000)
  }, [answered, onTimeout])

  function choiceClass(choice) {
    const base = 'w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 flex items-center gap-3'
    if (!answered) return `${base} glass border-white/10 hover:border-violet-400/70 hover:bg-white/8 active:scale-95`
    if (choice.id === correct.id) return `${base} bg-green-600/25 border-green-400/80 glow-green`
    if (choice.id === selected) return `${base} bg-red-600/25 border-red-400/80 glow-red`
    return `${base} bg-white/3 border-white/5 opacity-40`
  }

  const isWrong = answered && selected !== correct.id

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f1a]">
      {/* Blurred album background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 blur-3xl scale-110 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${correct.album.cover_medium})` }}
      />

      <div className="relative z-10 flex flex-col items-center px-4 py-6 max-w-lg mx-auto w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-5">
          <button 
            onClick={onQuit}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
          >
            ← <span className="hidden sm:inline">Quitter</span>
          </button>
          <span className="text-slate-400 text-sm font-medium">
            Question <span className="text-white">{roundIndex + 1}</span>/{totalRounds}
          </span>
          <span className="text-violet-300 font-bold tabular-nums">{score} pts</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6 w-full max-w-xs">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < roundIndex ? 'bg-violet-500' : i === roundIndex ? 'bg-violet-300' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Album cover — blurred until answered */}
        <div className="relative mb-5">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
            <img
              src={correct.album.cover_medium}
              alt="Album cover"
              className={`w-full h-full object-cover transition-all duration-500 ${
                answered ? 'blur-0 scale-100' : 'blur-xl scale-110'
              }`}
            />
            {/* Dark overlay while blurred */}
            {!answered && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-5xl opacity-60">🎵</div>
              </div>
            )}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm whitespace-nowrap">
            <AudioPlayer src={correct.preview} playing={!answered} volume={volume} isInverted={isInverted} />
          </div>
        </div>

        {/* Timer */}
        <div className="w-full mt-5 mb-5">
          <Timer onTimeout={handleTimeout} running={timerRunning} />
        </div>

        {/* Question */}
        <p className="text-slate-400 mb-4 text-xs font-semibold uppercase tracking-widest">
          Quel est cet artiste ?
        </p>

        {/* Choices */}
        <div className="flex flex-col gap-2.5 w-full">
          {choices.map((choice) => {
            const isCorrectChoice = choice.id === correct.id
            const isSelectedWrong = choice.id === selected && !isCorrectChoice
            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice)}
                disabled={answered}
                className={choiceClass(choice)}
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold
                  bg-white/5 border border-white/10">
                  {answered && isCorrectChoice && <span className="text-green-400">✓</span>}
                  {answered && isSelectedWrong && <span className="text-red-400">✗</span>}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {choice.artist.name}
                  </div>
                  <div className="text-slate-400 text-xs truncate mt-0.5">
                    {choice.title}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Timeout message */}
        {answered && !selected && (
          <p className="mt-4 text-slate-400 text-sm animate-fade-in">
            Temps écoulé ! La réponse était{' '}
            <span className="text-green-400 font-semibold">{correct.artist.name}</span>
          </p>
        )}

        {/* Wrong answer reveal */}
        {isWrong && (
          <p className="mt-3 text-slate-400 text-sm animate-fade-in">
            C&apos;était{' '}
            <span className="text-green-400 font-semibold">{correct.artist.name}</span>
          </p>
        )}
      </div>
    </div>
  )
}
