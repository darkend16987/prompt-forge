'use client'
import { useState, ReactNode } from 'react'

// ── Section Card ─────────────────────────────────────────
interface SectionCardProps {
  icon: string
  title: string
  children: ReactNode
}
export function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      marginBottom: 16, overflow: 'hidden',
    }}>
      <div style={{
        background: 'var(--container-top)',
        borderBottom: '1px solid var(--border)',
        padding: '7px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.1em', color: 'var(--primary-dim)', fontWeight: 700 }}>
          <span className="msi" style={{ fontSize: 16 }}>{icon}</span>
          {title}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', opacity: 0.5, letterSpacing: '0.05em' }}>[_][X]</span>
      </div>
      {children}
    </div>
  )
}

// ── Field Label ──────────────────────────────────────────
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: '0.1em',
      color: 'var(--text-v)', marginBottom: 5,
      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
    }}>
      {children}
    </div>
  )
}

// ── Input with prefix ────────────────────────────────────
interface PrefixInputProps {
  prefix: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}
export function PrefixInput({ prefix, value, onChange, placeholder, type = 'text' }: PrefixInputProps) {
  return (
    <div style={{
      display: 'flex', background: 'var(--bg)',
      border: '1px solid var(--border)',
    }}
      onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary-dim)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{
        padding: '7px 10px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
        color: 'var(--text-v)', borderRight: '1px solid var(--border)',
        background: 'var(--container)',
      }}>
        {prefix}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none',
          color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, padding: '7px 10px', outline: 'none',
        }}
      />
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────
interface FieldTextareaProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  mono?: boolean
  danger?: boolean
}
export function FieldTextarea({ value, onChange, placeholder, rows = 3, mono, danger }: FieldTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: 'var(--bg)',
        border: '1px solid var(--border)',
        color: danger ? '#ff8a80' : 'var(--text)',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Be Vietnam Pro, sans-serif',
        fontSize: mono ? 12 : 13,
        padding: '7px 10px', resize: 'vertical',
        outline: 'none', lineHeight: 1.6,
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--primary-dim)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    />
  )
}

// ── Select ───────────────────────────────────────────────
interface FieldSelectProps {
  value: string
  onChange: (v: string) => void
  options: string[]
}
export function FieldSelect({ value, onChange, options }: FieldSelectProps) {
  return (
    <div style={{ position: 'relative', background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, padding: '7px 32px 7px 10px',
          appearance: 'none', cursor: 'pointer', outline: 'none',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="msi" style={{
        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
        fontSize: 18, color: 'var(--text-v)', pointerEvents: 'none',
      }}>
        arrow_drop_down
      </span>
    </div>
  )
}

// ── Collapse Section ─────────────────────────────────────
interface CollapseSectionProps {
  icon: string
  title: string
  optional?: boolean
  children: ReactNode
  defaultOpen?: boolean
}
export function CollapseSection({ icon, title, optional, children, defaultOpen }: CollapseSectionProps) {
  const [open, setOpen] = useState(defaultOpen || false)
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 14px', cursor: 'pointer',
          background: 'var(--container)', border: 'none',
          fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-v)',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="msi" style={{ fontSize: 16 }}>{icon}</span>
          {title}
          {optional && (
            <span style={{
              fontSize: 9, letterSpacing: '0.08em',
              border: '1px solid var(--border)', color: 'var(--text-dim)',
              padding: '1px 5px',
            }}>
              TÙY CHỌN
            </span>
          )}
        </span>
        <span className="msi" style={{
          fontSize: 16,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>
          expand_more
        </span>
      </button>
      {open && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Toggle ───────────────────────────────────────────────
interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  label: string
}
export function Toggle({ value, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-v)' }}>{label}</span>
      <div
        className={`toggle-track ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <div className="toggle-thumb" />
      </div>
    </label>
  )
}

// ── Target chip ──────────────────────────────────────────
interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}
export function TargetChip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.06em',
        color: selected ? 'var(--primary-dim)' : 'var(--text-v)',
        borderBottom: selected ? '1px solid var(--primary-dim)' : '1px solid transparent',
        background: 'none', border: 'none',
        borderBottomWidth: 1, borderBottomStyle: 'solid',
        borderBottomColor: selected ? 'var(--primary-dim)' : 'transparent',
        cursor: 'pointer', padding: '2px 0',
      }}
    >
      {label}
    </button>
  )
}
