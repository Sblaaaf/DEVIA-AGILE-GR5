import { useState } from 'react'

export default function VolumeControl({ volume, onVolumeChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:bg-white/10 transition-all active:scale-90"
        title="Paramètres son"
      >
        {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </button>

      {isOpen && (
        <div className="mt-2 glass rounded-2xl p-4 w-48 shadow-2xl animate-slide-up border border-white/10 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Volume</span>
            <span className="text-xs font-mono text-violet-300">{Math.round(volume * 100)}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  )
}
