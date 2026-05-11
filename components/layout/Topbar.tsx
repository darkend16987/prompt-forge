'use client'
import { useEffect, useState } from 'react'

interface TopbarProps {
  onNewPrompt: () => void
}

export default function Topbar({ onNewPrompt }: TopbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('pf-theme') as 'dark' | 'light' || 'dark'
    setTheme(saved)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('pf-theme', next)
    if (next === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }

  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '2px solid var(--border)',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--primary-dim)',
            letterSpacing: '-0.02em',
          }}
        >
          PROMPT FORGE
        </span>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--container)',
            border: '1px solid var(--border)',
            padding: '4px 10px',
            fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-v)',
          }}
        >
          <span className="pulse-dot" />
          SYS_STATUS: ONLINE
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="icon-btn" title="Terminal" aria-label="Terminal">
          <span className="msi">terminal</span>
        </button>
        <button className="icon-btn" title="Monitoring" aria-label="Monitoring">
          <span className="msi">monitoring</span>
        </button>
        <button className="icon-btn" title="Settings" aria-label="Settings">
          <span className="msi">settings</span>
        </button>

        <button
          onClick={toggleTheme}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, letterSpacing: '0.1em',
            padding: '6px 14px', cursor: 'pointer',
            border: '1px solid var(--border)',
            color: 'var(--text-v)', background: 'transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          aria-label="Toggle theme"
        >
          <span className="msi" style={{ fontSize: 15 }}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>

        <button
          onClick={onNewPrompt}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            padding: '6px 14px', cursor: 'pointer',
            background: 'var(--primary-dim)',
            color: 'var(--on-primary)',
            border: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span className="msi" style={{ fontSize: 15 }}>bolt</span>
          COMPILE
        </button>
      </div>
    </header>
  )
}
