import { useEffect, useRef, useState } from 'react'

const TOTAL = 20

export default function Timer({ onTimeout, running }) {
  const [elapsed, setElapsed] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const firedRef = useRef(false)

  useEffect(() => {
    setElapsed(0)
    firedRef.current = false
    startRef.current = null

    if (!running) return

    function tick(ts) {
      if (!startRef.current) startRef.current = ts
      const e = Math.min((ts - startRef.current) / 1000, TOTAL)
      setElapsed(e)
      if (e >= TOTAL) {
        if (!firedRef.current) {
          firedRef.current = true
          onTimeout()
        }
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, onTimeout])

  const remaining = Math.max(0, TOTAL - elapsed)
  const pct = (elapsed / TOTAL) * 100
  const isUrgent = remaining <= 5

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-sm font-mono">
        <span className="text-slate-400">Temps</span>
        <span className={isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-slate-200'}>
          {Math.ceil(remaining)}s
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            isUrgent ? 'bg-red-500' : pct > 60 ? 'bg-yellow-400' : 'bg-violet-500'
          }`}
          style={{ width: `${100 - pct}%` }}
        />
      </div>
    </div>
  )
}

Timer.elapsed = () => {}
