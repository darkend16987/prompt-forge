'use client'
import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import TaskTabs from '@/components/ui/TaskTabs'
import EngineConfigSection from '@/components/ui/EngineConfig'
import CodingTab from '@/components/ui/CodingTab'
import { ContentTab, AnalyticsTab, SynthesisTab } from '@/components/ui/OtherTabs'
import OutputPanel from '@/components/ui/OutputPanel'
import {
  TaskType, EngineConfig, CodingForm, ContentForm, AnalyticsForm, SynthesisForm,
  HistoryItem, MODELS,
  DEFAULT_CODING, DEFAULT_CONTENT, DEFAULT_ANALYTICS, DEFAULT_SYNTHESIS,
} from '@/lib/types'
import { getHistory, saveHistory } from '@/lib/history'
import { buildMetaPrompt, generateFallbackXML } from '@/lib/promptBuilder'

export default function ForgePage() {
  // ── Engine ──────────────────────────────────────────────
  const [engine, setEngine] = useState<EngineConfig>({
    apiKey: '', provider: 'gemini', model: 'gemini-3-flash-preview',
  })

  // ── Task & forms ────────────────────────────────────────
  const [task, setTask]           = useState<TaskType>('coding')
  const [codingForm, setCodingForm]     = useState<CodingForm>(DEFAULT_CODING)
  const [contentForm, setContentForm]   = useState<ContentForm>(DEFAULT_CONTENT)
  const [analyticsForm, setAnalyticsForm] = useState<AnalyticsForm>(DEFAULT_ANALYTICS)
  const [synthesisForm, setSynthesisForm] = useState<SynthesisForm>(DEFAULT_SYNTHESIS)

  // ── Output ───────────────────────────────────────────────
  const [promptVI, setPromptVI] = useState('')
  const [promptEN, setPromptEN] = useState('')
  const [loading, setLoading]   = useState(false)
  const [targets, setTargets]   = useState<string[]>(['Claude', 'Gemini'])
  const [bilingual, setBilingual] = useState(false)

  // ── History ──────────────────────────────────────────────
  const [history, setHistory] = useState<HistoryItem[]>([])
  useEffect(() => { setHistory(getHistory()) }, [])

  function refreshHistory() { setHistory(getHistory()) }

  function getActiveForm() {
    if (task === 'coding')    return codingForm
    if (task === 'content')   return contentForm
    if (task === 'analytics') return analyticsForm
    return synthesisForm
  }

  function getFormDesc(): string {
    const f = getActiveForm() as any
    return (f.description || f.goal || '').substring(0, 60) || 'Prompt'
  }

  // ── Compile ──────────────────────────────────────────────
  async function handleCompile() {
    const form = getActiveForm()
    const desc = (form as any).description || ''
    if (!desc.trim()) {
      alert('Vui lòng điền mô tả vấn đề trước!')
      return
    }

    setLoading(true)
    setPromptVI('')
    setPromptEN('')

    try {
      const metaPrompt = buildMetaPrompt(task, form, targets, bilingual)

      if (!engine.apiKey) {
        // Fallback — no API key
        await new Promise(r => setTimeout(r, 700))
        const result = generateFallbackXML(task, form, targets, bilingual)
        const parts = result.split(/---\s*EN\s*---/i)
        const pVI = parts[0].trim()
        const pEN = parts[1]?.trim() || ''
        setPromptVI(pVI)
        setPromptEN(pEN)

        saveHistory({
          taskType: task,
          title: getFormDesc(),
          promptVI: pVI,
          promptEN: pEN,
        })
        refreshHistory()
      } else {
        const res = await fetch('/api/forge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metaPrompt,
            provider: engine.provider,
            model: engine.model,
            apiKey: engine.apiKey,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'API error')
        setPromptVI(data.promptVI || '')
        setPromptEN(data.promptEN || '')

        // Save to history
        saveHistory({
          taskType: task,
          title: getFormDesc(),
          promptVI: data.promptVI || '',
          promptEN: data.promptEN || '',
        })
        refreshHistory()
      }
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleHistoryClick(item: HistoryItem) {
    setTask(item.taskType)
    setPromptVI(item.promptVI)
    setPromptEN(item.promptEN)
  }

  function handleNewPrompt() {
    setCodingForm(DEFAULT_CODING)
    setContentForm(DEFAULT_CONTENT)
    setAnalyticsForm(DEFAULT_ANALYTICS)
    setSynthesisForm(DEFAULT_SYNTHESIS)
    setPromptVI('')
    setPromptEN('')
  }

  return (
    <>
      <Topbar onNewPrompt={handleNewPrompt} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — hidden on mobile */}
        <div style={{ display: 'none' }} className="lg-sidebar">
          <Sidebar
            activeTask={task}
            onTaskChange={t => { setTask(t); setPromptVI(''); setPromptEN('') }}
            history={history}
            engineModel={engine.model}
            onHistoryClick={handleHistoryClick}
          />
        </div>
        <SidebarWrapper
          activeTask={task}
          onTaskChange={t => { setTask(t); setPromptVI(''); setPromptEN('') }}
          history={history}
          engineModel={engine.model}
          onHistoryClick={handleHistoryClick}
        />

        {/* Main area */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left column — inputs */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 40 }}>
              <EngineConfigSection config={engine} onChange={setEngine} />
              <TaskTabs active={task} onChange={t => { setTask(t); setPromptVI(''); setPromptEN('') }} />

              {task === 'coding'    && <CodingTab    form={codingForm}    onChange={setCodingForm} />}
              {task === 'content'   && <ContentTab   form={contentForm}   onChange={setContentForm} />}
              {task === 'analytics' && <AnalyticsTab form={analyticsForm} onChange={setAnalyticsForm} />}
              {task === 'synthesis' && <SynthesisTab form={synthesisForm} onChange={setSynthesisForm} />}
            </div>
          </div>

          {/* Right column — output preview */}
          <div style={{ flexShrink: 0, width: 460 }} className="output-col">
            <OutputPanel
              promptVI={promptVI}
              promptEN={promptEN}
              loading={loading}
              targets={targets}
              bilingual={bilingual}
              onTargetsChange={setTargets}
              onBilingualChange={setBilingual}
              onCompile={handleCompile}
            />
          </div>
        </main>
      </div>

      <Footer historyCount={history.length} />
    </>
  )
}

// SSR-safe sidebar wrapper
function SidebarWrapper(props: Parameters<typeof Sidebar>[0]) {
  return (
    <div style={{ flexShrink: 0 }}>
      <Sidebar {...props} />
    </div>
  )
}
