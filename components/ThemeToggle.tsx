'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('protocoldiff-theme', theme)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('protocoldiff-theme')
    const resolved =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

    setTheme(resolved)
    applyTheme(resolved)
  }, [])

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle dark mode"
      onClick={() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }}
    >
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" data-theme-state={theme} />
      </span>
    </button>
  )
}
