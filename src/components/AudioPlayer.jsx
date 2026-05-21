import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src, playing, volume = 0.5, isInverted = false }) {
  const [loading, setLoading] = useState(true)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const gainNodeRef = useRef(null)
  const bufferRef = useRef(null)

  useEffect(() => {
    // Initialize AudioContext
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      gainNodeRef.current = audioCtxRef.current.createGain()
      gainNodeRef.current.connect(audioCtxRef.current.destination)
    }
    gainNodeRef.current.gain.value = volume

    const loadAudio = async () => {
      setLoading(true)
      try {
        const response = await fetch(src)
        const arrayBuffer = await response.arrayBuffer()
        let audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer)

        if (isInverted) {
          // Clone and reverse the buffer
          const reversedBuffer = audioCtxRef.current.createBuffer(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
          )

          for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            const channelData = audioBuffer.getChannelData(i)
            const reversedData = reversedBuffer.getChannelData(i)
            for (let j = 0; j < audioBuffer.length; j++) {
              reversedData[j] = channelData[audioBuffer.length - 1 - j]
            }
          }
          audioBuffer = reversedBuffer
        }

        bufferRef.current = audioBuffer
        setLoading(false)
      } catch (error) {
        console.error("Error loading or reversing audio:", error)
        setLoading(false)
      }
    }

    loadAudio()

    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop()
        sourceRef.current = null
      }
    }
  }, [src, isInverted])

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    if (!loading && playing && bufferRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      if (sourceRef.current) {
        sourceRef.current.stop()
      }

      sourceRef.current = audioCtxRef.current.createBufferSource()
      sourceRef.current.buffer = bufferRef.current
      sourceRef.current.connect(gainNodeRef.current)
      sourceRef.current.loop = true
      sourceRef.current.start(0)
    } else {
      if (sourceRef.current) {
        sourceRef.current.stop()
        sourceRef.current = null
      }
    }
  }, [playing, loading])

  return (
    <>
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          {isInverted ? 'Inversion…' : 'Chargement…'}
        </div>
      )}
      {!loading && playing && (
        <div className="flex items-end gap-1 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1.5 rounded-sm ${isInverted ? 'bg-fuchsia-400' : 'bg-violet-400'}`}
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
