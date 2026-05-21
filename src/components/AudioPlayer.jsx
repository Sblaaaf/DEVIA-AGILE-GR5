import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src, playing, volume = 0.5 }) {
  const audioRef = useRef(null)
  const [loading, setLoading] = useState(true)

  // Utiliser une key basée sur src pour forcer le remounting du composant audio
  // Cela garantit que le navigateur réinitialise proprement le flux
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    setLoading(true)
    audio.src = src
    audio.volume = volume
    audio.load()

    const onCanPlay = () => setLoading(false)
    const onError = () => {
      console.error("Audio error for:", src)
      setLoading(false)
    }

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    
    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
    }
  }, [src])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    if (playing && !loading) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Gérer le blocage de l'autoplay
          console.log("Autoplay blocked or play interrupted")
        })
      }
    } else {
      audio.pause()
    }
  }, [playing, loading])

  return (
    <>
      <audio ref={audioRef} preload="auto" loop />
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          Chargement…
        </div>
      )}
      {!loading && playing && (
        <div className="flex items-end gap-1 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-violet-400 rounded-sm"
              style={{
                height: `${40 + i * 15}%`,
                animation: `equalizer 0.${5 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes equalizer {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}
