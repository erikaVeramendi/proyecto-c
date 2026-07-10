import { useState, useEffect } from 'react'
import { formatGrams } from '../utils/helpers'

interface GramSelectorProps {
  grams: number
  onChange: (g: number) => void
}

export default function GramSelector({ grams, onChange }: GramSelectorProps) {
  const presets = [100, 250, 500, 750, 1000, 1500, 2000]
  const [custom, setCustom] = useState(false)
  const [inputValue, setInputValue] = useState(String(grams))

  useEffect(() => { setInputValue(String(grams)) }, [grams])

  const handleCustomChange = (val: string) => {
    setInputValue(val)
    const num = parseInt(val, 10)
    if (!isNaN(num) && num > 0) onChange(num)
  }

  return (
    <div className="gram-selector">
      <label className="gram-label">¿Cuánto deseas? (en gramos)</label>
      {!custom ? (
        <>
          <div className="gram-presets">
            {presets.map(p => (
              <button
                key={p}
                className={`gram-preset ${grams === p ? 'active' : ''}`}
                onClick={() => onChange(p)}
                type="button"
              >
                {p < 1000 ? `${p}g` : `${p/1000}kg`}
              </button>
            ))}
          </div>
          <button className="gram-custom-btn" onClick={() => setCustom(true)} type="button">
            ✏️ Cantidad personalizada
          </button>
        </>
      ) : (
        <div className="gram-custom">
          <div className="gram-input-row">
            <button onClick={() => onChange(Math.max(50, grams - 50))} type="button">−50g</button>
            <input
              type="number"
              min="50"
              step="50"
              value={inputValue}
              onChange={e => handleCustomChange(e.target.value)}
            />
            <span className="gram-unit">g</span>
            <button onClick={() => onChange(grams + 50)} type="button">+50g</button>
          </div>
          <button className="gram-back-btn" onClick={() => setCustom(false)} type="button">
            ← Cantidades rápidas
          </button>
        </div>
      )}
      <div className="gram-equivalent">≈ {formatGrams(grams)}</div>
    </div>
  )
}