'use client'
import { useState } from 'react'
import { Toggle, TargetChip } from '@/components/ui/primitives'
import { TARGET_MODELS } from '@/lib/types'
import { highlightXML } from '@/lib/promptBuilder'

interface OutputPanelProps {
  promptVI: string
  promptEN: string
  loading: boolean
  targets: string[]
  bilingual: boolean
  onTargetsChange: (t: string[]) => void
  onBilingualChange: (v: boolean) => void
  onCompile: () => void
}

export default function OutputPanel({
  promptVI, promptEN, loading,
  targets, bilingual,
  onTargetsChange, onBilingualChange, onCompile,
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<'vi' | 'en' | 'diff'>('vi')
  const [copied, setCopied] = useState(false)

  const displayText = activeTab === 'en' ? promptEN : promptVI
  const hasOutput = !!promptVI

  async function copyText() {
    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* silent fail */ }
  }

  function toggleTarget(t: string) {
    onTargetsChange(
      targets.includes(t) ? targets.filter(x => x !== t) : [...targets, t]
    )
  }

  const PLACEHOLDER = `<prompt_forge_request>
  <metadata>
    <status>AWAITING_INPUT</status>
    <task_type>coding</task_type>
  </metadata>

  <core_instructions>
    <framework>[Awaiting Input]</framework>
    <objective>
      [Awaiting Input]
    </objective>
  </core_instructions>

  <context>
    <current_data>[Awaiting Input]</current_data>
  </context>
</prompt_forge_request>`

  return (
    <aside style={{
      width: 460, flexShrink: 0,
      background: 'var(--container)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--container-top)',
        borderBottom: '1px solid var(--border)',
        padding: '9px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.1em', color: 'var(--primary-dim)', fontWeight: 700 }}>
          <span className="msi" style={{ fontSize: 16 }}>code_blocks</span>
          OUTPUT.XML PREVIEW
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {hasOutput && (
            <>
              {(['vi', 'en', 'diff'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
                    padding: '3px 8px', cursor: 'pointer',
                    background: activeTab === tab ? 'var(--primary-dim)' : 'transparent',
                    color: activeTab === tab ? 'var(--on-primary)' : 'var(--text-v)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {tab === 'vi' ? 'VI' : tab === 'en' ? 'EN' : 'DIFF'}
                </button>
              ))}
            </>
          )}
          <button
            onClick={copyText}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--primary-dim)' : 'var(--text-v)' }}
            title="Copy"
            aria-label="Copy output"
          >
            <span className="msi" style={{ fontSize: 18 }}>
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
      </div>

      {/* XML body */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 14,
        background: 'var(--bg)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8,
      }}>
        {loading ? (
          <div style={{ color: 'var(--text-v)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pulse-dot" />
            COMPILING PROMPT...
          </div>
        ) : activeTab === 'diff' && hasOutput ? (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 8 }}>
              BEFORE → AFTER (structured)
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-v)', fontSize: 11 }}>
              {promptVI.substring(0, 400)}{promptVI.length > 400 ? '...' : ''}
            </pre>
          </div>
        ) : (
          <pre
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}
            dangerouslySetInnerHTML={{ __html: highlightXML(hasOutput ? displayText : PLACEHOLDER) + (loading ? '' : '<span class="cursor-blink" style="color:var(--primary-dim);font-weight:700">█</span>') }}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: 14, borderTop: '1px solid var(--border)',
        background: 'var(--surface)', flexShrink: 0,
      }}>
        {/* Targets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-v)' }}>TARGET:</span>
          {TARGET_MODELS.map(t => (
            <TargetChip key={t} label={t} selected={targets.includes(t)} onClick={() => toggleTarget(t)} />
          ))}
        </div>

        {/* Bilingual toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Toggle value={bilingual} onChange={onBilingualChange} label="SONG NGỮ VI + EN" />
        </div>

        {/* Compile button */}
        <button
          onClick={onCompile}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'var(--border)' : 'var(--primary-dim)',
            color: 'var(--on-primary)',
            border: 'none',
            fontFamily: 'Space Mono, monospace', fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.01em', padding: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span className="msi" style={{ fontSize: 20 }}>bolt</span>
          {loading ? '> COMPILING...' : '> COMPILE_PROMPT'}
        </button>
      </div>
    </aside>
  )
}
