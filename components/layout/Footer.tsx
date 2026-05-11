export default function Footer({ historyCount }: { historyCount: number }) {
  return (
    <footer style={{
      background: 'var(--container-top)',
      borderTop: '1px solid var(--border)',
      padding: '6px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 11, letterSpacing: '0.1em', flexShrink: 0,
    }}>
      <span style={{ color: 'var(--primary-dim)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
        PROMPT_FORGE_OS [BUILD 88.0]
      </span>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'DOCS', href: '#' },
          { label: 'API', href: '#' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{ color: 'var(--text-v)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
          >
            {label}
          </a>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-v)' }}>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          STATUS_OK
        </div>
        <span style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          HISTORY: {historyCount}
        </span>
      </div>
    </footer>
  )
}
