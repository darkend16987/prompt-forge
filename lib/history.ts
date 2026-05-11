import { HistoryItem, TaskType } from './types'

const KEY = 'pf-history'
const MAX = 50

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
}

export function saveHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: Date.now(),
  }
  const history = [newItem, ...getHistory()].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(history))
  return newItem
}

export function deleteHistory(id: string): void {
  const history = getHistory().filter(h => h.id !== id)
  localStorage.setItem(KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  return `${days} ngày trước`
}

export function getTaskColor(taskType: TaskType): string {
  return {
    coding:    'var(--primary-dim)',
    content:   'var(--tertiary)',
    analytics: 'var(--amber)',
    synthesis: 'var(--secondary)',
  }[taskType]
}
