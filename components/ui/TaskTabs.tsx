'use client'
import { TaskType } from '@/lib/types'

interface Props {
  active: TaskType
  onChange: (t: TaskType) => void
}

const TABS: { task: TaskType; icon: string; label: string }[] = [
  { task: 'coding',    icon: 'code',       label: 'CODING' },
  { task: 'content',   icon: 'edit_note',  label: 'CONTENT WRITING' },
  { task: 'analytics', icon: 'analytics',  label: 'DATA ANALYSIS' },
  { task: 'synthesis', icon: 'hub',        label: 'TỔNG HỢP' },
]

export default function TaskTabs({ active, onChange }: Props) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      marginBottom: 16,
    }}>
      <div style={{
        background: 'var(--container-top)',
        borderBottom: '1px solid var(--border)',
        padding: '7px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.1em', color: 'var(--primary-dim)', fontWeight: 700 }}>
          <span className="msi" style={{ fontSize: 16 }}>category</span>
          LOẠI TÁC VỤ
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', opacity: 0.5 }}>[_][X]</span>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TABS.map(({ task, label }) => (
          <button
            key={task}
            onClick={() => onChange(task)}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.05em',
              padding: '5px 12px', cursor: 'pointer',
              background: active === task ? 'var(--primary-dim)' : 'transparent',
              color: active === task ? 'var(--on-primary)' : 'var(--text-v)',
              border: active === task ? '1px solid var(--primary-dim)' : '1px solid transparent',
              fontWeight: active === task ? 700 : 400,
            }}
            onMouseEnter={e => {
              if (active !== task) e.currentTarget.style.borderColor = 'var(--border)'
            }}
            onMouseLeave={e => {
              if (active !== task) e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            {active === task ? `[ ${label} ]` : `| ${label}`}
          </button>
        ))}
      </div>
    </div>
  )
}
