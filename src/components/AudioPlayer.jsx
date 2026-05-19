import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src, playing }) {
  const audioRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || loading) return

    if (playing) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Audio play failed:", err)
          // Don't show error for autoplay blocks, just wait for next interaction
          if (err.name !== 'NotAllowedError') {
            setError(true)
          }
        })
      }
    } else {
      audio.pause()
    }
  }, [playing, loading])

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        onCanPlay={() => setLoading(false)}
        onError={() => {
          console.error("Audio loading error for src:", src)
          setError(true)
          setLoading(false)
        }}
      />
      
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          Chargement…
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <span>⚠️ Erreur audio</span>
        </div>
      )}

      {!loading && !error && playing && (
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
