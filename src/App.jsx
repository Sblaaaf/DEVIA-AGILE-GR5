import { useState, useEffect } from 'react'
import './index.css'
import { useQuiz } from './hooks/useQuiz'
import HomeScreen from './components/HomeScreen'
import QuizCard from './components/QuizCard'
import ResultsScreen from './components/ResultsScreen'
import VolumeControl from './components/VolumeControl'

function LoadingScreen({ genre }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-violet-500/30 border-t-violet-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🎵</div>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-lg">Chargement du quiz</p>
        <p className="text-slate-400 text-sm mt-1">{genre} · Connexion à Deezer…</p>
      </div>
    </div>
  )
}

export default function App() {
  const {
    screen,
    genre,
    score,
    roundIndex,
    totalRounds,
    currentRound,
    answers,
    error,
    startGame,
    answer,
    timeout,
    playAgain,
  } = useQuiz()

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('quiz-volume')
    return saved !== null ? parseFloat(saved) : 0.5
  })

  useEffect(() => {
    localStorage.setItem('quiz-volume', volume.toString())
  }, [volume])

  return (
    <div className="bg-[#0f0f1a] min-h-screen">
      <VolumeControl volume={volume} onVolumeChange={setVolume} />

      {screen === 'home' && <HomeScreen onStart={startGame} error={error} />}

      {screen === 'loading' && <LoadingScreen genre={genre} />}

      {screen === 'playing' && currentRound && (
        <QuizCard
          key={roundIndex}
          round={currentRound}
          roundIndex={roundIndex}
          totalRounds={totalRounds}
          score={score}
          onAnswer={answer}
          onTimeout={timeout}
          volume={volume}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          score={score}
          answers={answers}
          genre={genre}
          totalRounds={totalRounds}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  )
}
