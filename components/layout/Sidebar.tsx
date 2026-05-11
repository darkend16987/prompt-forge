'use client'
import { TaskType, HistoryItem, TASK_LABELS } from '@/lib/types'
import { formatRelativeTime, getTaskColor } from '@/lib/history'

interface SidebarProps {
  activeTask: TaskType
  onTaskChange: (t: TaskType) => void
  history: HistoryItem[]
  engineModel: string
  onHistoryClick: (item: HistoryItem) => void
}

const NAV_ITEMS: { task: TaskType; icon: string }[] = [
  { task: 'coding',    icon: 'code' },
  { task: 'content',   icon: 'edit_note' },
  { task: 'analytics', icon: 'analytics' },
  { task: 'synthesis', icon: 'hub' },
]

export default function Sidebar({
  activeTask, onTaskChange, history, engineModel, onHistoryClick,
}: SidebarProps) {
  const s: React.CSSProperties = {
    width: 220, flexShrink: 0,
    background: 'var(--surface)',
    borderRight: '2px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    overflowY: 'auto',
  }

  return (
    <nav style={s}>
      {/* Directory label */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-v)', marginBottom: 4, opacity: 0.7 }}>
          DIRECTORY
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 12, opacity: 0.6 }}>
          SYS_READY_V2
        </div>
        <button
          style={{
            width: '100%', border: '1px solid var(--primary-dim)',
            color: 'var(--primary-dim)', background: 'transparent',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.08em',
            padding: '7px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginBottom: 6,
          }}
          onClick={() => onTaskChange('coding')}
        >
          <span className="msi" style={{ fontSize: 16 }}>add</span>
          NEW_PROMPT
        </button>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ task, icon }) => (
        <button
          key={task}
          onClick={() => onTaskChange(task)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 16px', fontSize: 12, letterSpacing: '0.08em',
            fontFamily: 'JetBrains Mono, monospace',
            color: activeTask === task ? 'var(--on-primary-ctr)' : 'var(--text-v)',
            background: activeTask === task ? 'var(--primary-ctr)' : 'transparent',
            borderLeft: activeTask === task ? '4px solid var(--on-primary-ctr)' : '4px solid transparent',
            border: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none',
            borderLeftWidth: 4, borderLeftStyle: 'solid',
            borderLeftColor: activeTask === task ? 'var(--on-primary-ctr)' : 'transparent',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            fontWeight: activeTask === task ? 700 : 400,
          }}
        >
          <span className="msi" style={{ fontSize: 18 }}>{icon}</span>
          {TASK_LABELS[task]}
        </button>
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '8px 16px' }} />

      {/* Model card */}
      <div
        style={{
          margin: '0 12px 8px',
          border: '1px solid var(--border)',
          padding: 10, background: 'var(--container)',
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-v)', marginBottom: 4 }}>
          ACTIVE ENGINE
        </div>
        <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700, marginBottom: 6 }}>
          {engineModel.toUpperCase()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 10, color: 'var(--text-v)', letterSpacing: '0.06em' }}>CONNECTED</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '4px 16px' }} />

      {/* Recent history */}
      <div style={{ padding: '10px 16px 6px', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-v)', opacity: 0.7 }}>
        RECENT
      </div>
      {history.slice(0, 5).map(item => (
        <button
          key={item.id}
          onClick={() => onHistoryClick(item)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
            padding: '8px 16px', background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--container-high)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 9, letterSpacing: '0.1em', color: getTaskColor(item.taskType) }}>
            {TASK_LABELS[item.taskType]}
          </span>
          <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
            {item.title}
          </span>
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>
            {formatRelativeTime(item.createdAt)}
          </span>
        </button>
      ))}

      {/* Bottom nav */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: 1, background: 'var(--border)', margin: '8px 16px' }} />
        {[{ icon: 'list_alt', label: 'LOGS' }, { icon: 'settings', label: 'SETTINGS' }].map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 16px', fontSize: 12, letterSpacing: '0.08em',
              color: 'var(--text-v)', cursor: 'pointer',
            }}
          >
            <span className="msi" style={{ fontSize: 18 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </nav>
  )
}
