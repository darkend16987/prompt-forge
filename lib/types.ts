// ── Types ──────────────────────────────────────────────────
export type TaskType = 'coding' | 'content' | 'analytics' | 'synthesis'
export type Provider = 'gemini' | 'deepseek' | 'openai' | 'anthropic'
export type ContentType =
  | 'Press release / Thông cáo báo chí'
  | 'Social media — LinkedIn'
  | 'Social media — Facebook'
  | 'Nội dung internal'
  | 'Technical documentation'
  | 'Email / Partner communication'

export interface EngineConfig {
  apiKey: string
  provider: Provider
  model: string
}

export interface CodingForm {
  language: string
  goal: string
  description: string
  inputData: string
  outputFormat: string
  constraints: string
  schema: string
  contextCode: string
  errorLog: string
  alreadyTried: string
}

export interface ContentForm {
  contentType: ContentType
  length: string
  description: string
  audience: string
  tone: string
  keyMessages: string
}

export interface AnalyticsForm {
  dataType: string
  goal: string
  description: string
  outputFormat: string
}

export interface SynthesisForm {
  sourceType: string
  purpose: string
  description: string
  focusAreas: string
}

export type AnyForm = CodingForm | ContentForm | AnalyticsForm | SynthesisForm

export type OutputMode = 'full' | 'compact'

export interface HistoryItem {
  id: string
  taskType: TaskType
  title: string
  promptVI: string
  promptEN: string
  createdAt: number
}

export interface ForgeResult {
  promptVI: string
  promptEN: string
}

// ── Constants ─────────────────────────────────────────────
export const MODELS: Record<Provider, string[]> = {
  gemini:    ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'],
  deepseek:  ['deepseek-chat', 'deepseek-reasoner'],
  openai:    ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
  anthropic: ['claude-sonnet-4-5', 'claude-opus-4-5', 'claude-haiku-4-5'],
}

export const TASK_LABELS: Record<TaskType, string> = {
  coding:    'CODING',
  content:   'CONTENT',
  analytics: 'DATA',
  synthesis: 'SYNTHESIS',
}

export const TARGET_MODELS = ['Claude', 'Gemini', 'GPT-4', 'Kimi', 'Deepseek']

export const CONTENT_TYPES: ContentType[] = [
  'Press release / Thông cáo báo chí',
  'Social media — LinkedIn',
  'Social media — Facebook',
  'Nội dung internal',
  'Technical documentation',
  'Email / Partner communication',
]

export const DEFAULT_CODING: CodingForm = {
  language: '', goal: '', description: '', inputData: '',
  outputFormat: '', constraints: '', schema: '', contextCode: '',
  errorLog: '', alreadyTried: '',
}

export const DEFAULT_CONTENT: ContentForm = {
  contentType: 'Press release / Thông cáo báo chí',
  length: 'Trung bình (150–400 từ)',
  description: '', audience: '', tone: '', keyMessages: '',
}

export const DEFAULT_ANALYTICS: AnalyticsForm = {
  dataType: '', goal: '', description: '', outputFormat: '',
}

export const DEFAULT_SYNTHESIS: SynthesisForm = {
  sourceType: '', purpose: '', description: '', focusAreas: '',
}
