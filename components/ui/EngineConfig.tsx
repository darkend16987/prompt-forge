'use client'
import { EngineConfig, Provider, MODELS } from '@/lib/types'
import { SectionCard, FieldLabel, PrefixInput, FieldSelect } from '@/components/ui/primitives'

interface Props {
  config: EngineConfig
  onChange: (c: EngineConfig) => void
}

const PROVIDERS: Provider[] = ['gemini', 'deepseek', 'openai', 'anthropic']

export default function EngineConfigSection({ config, onChange }: Props) {
  const set = (key: keyof EngineConfig) => (val: string) => {
    const next = { ...config, [key]: val }
    if (key === 'provider') next.model = MODELS[val as Provider][0]
    onChange(next)
  }

  return (
    <SectionCard icon="memory" title="AI ENGINE CONFIG">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <FieldLabel>API_KEY</FieldLabel>
          <PrefixInput
            prefix=">"
            type="password"
            value={config.apiKey}
            onChange={set('apiKey')}
            placeholder="Cole vào đây — sẽ được gửi server-side, không lộ ra browser"
          />
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, letterSpacing: '0.04em' }}>
            * Key được xử lý qua Next.js API Route — không expose ra client
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>PROVIDER</FieldLabel>
            <FieldSelect
              value={config.provider}
              onChange={set('provider')}
              options={PROVIDERS}
            />
          </div>
          <div>
            <FieldLabel>MODEL</FieldLabel>
            <FieldSelect
              value={config.model}
              onChange={set('model')}
              options={MODELS[config.provider]}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
