'use client'

import { useEffect, useState } from 'react'

export type AppMode = 'demo' | 'real-wallet'

const STORAGE_KEY = 'protocoldiff-app-mode'

export function getDefaultMode(): AppMode {
  if (typeof window === 'undefined') return 'demo'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'real-wallet' ? 'real-wallet' : 'demo'
}

export default function ModeSwitch({
  value,
  onChange
}: {
  value?: AppMode
  onChange?: (mode: AppMode) => void
}) {
  const [mode, setMode] = useState<AppMode>(value ?? 'demo')

  useEffect(() => {
    if (value) {
      setMode(value)
      return
    }
    setMode(getDefaultMode())
  }, [value])

  const updateMode = (nextMode: AppMode) => {
    setMode(nextMode)
    window.localStorage.setItem(STORAGE_KEY, nextMode)
    onChange?.(nextMode)
  }

  return (
    <div className="mode-switch" role="tablist" aria-label="ProtocolDiff mode">
      <button
        type="button"
        className={mode === 'demo' ? 'mode-chip active' : 'mode-chip'}
        onClick={() => updateMode('demo')}
      >
        Demo mode
      </button>
      <button
        type="button"
        className={mode === 'real-wallet' ? 'mode-chip active' : 'mode-chip'}
        onClick={() => updateMode('real-wallet')}
      >
        Real wallet mode
      </button>
    </div>
  )
}
