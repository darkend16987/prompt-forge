'use client'
import { CodingForm } from '@/lib/types'
import { SectionCard, FieldLabel, PrefixInput, FieldTextarea, CollapseSection } from '@/components/ui/primitives'

interface Props {
  form: CodingForm
  onChange: (f: CodingForm) => void
}

export default function CodingTab({ form, onChange }: Props) {
  const set = (key: keyof CodingForm) => (val: string) =>
    onChange({ ...form, [key]: val })

  const p = { padding: '14px', display: 'flex', flexDirection: 'column' as const, gap: 12 }

  return (
    <>
      <SectionCard icon="terminal" title="CORE PROMPT">
        <div style={p}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>NGÔN NGỮ / FRAMEWORK</FieldLabel>
              <PrefixInput prefix="$" value={form.language} onChange={set('language')} placeholder="Python, React, FastAPI..." />
            </div>
            <div>
              <FieldLabel>MỤC TIÊU CHÍNH</FieldLabel>
              <PrefixInput prefix=">" value={form.goal} onChange={set('goal')} placeholder="Build API, fix bug, refactor..." />
            </div>
          </div>
          <div>
            <FieldLabel>MÔ TẢ VẤN ĐỀ</FieldLabel>
            <FieldTextarea
              value={form.description}
              onChange={set('description')}
              placeholder="Mô tả bài toán — viết thô cũng được, bằng tiếng Việt hoặc English..."
              rows={3}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon="database" title="DATA & CONTEXT">
        <div style={p}>
          <div>
            <FieldLabel>DỮ LIỆU ĐẦU VÀO HIỆN CÓ</FieldLabel>
            <FieldTextarea
              value={form.inputData}
              onChange={set('inputData')}
              placeholder="user_id từ JWT, file CSV upload, query params page=1&limit=20..."
              rows={2}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>OUTPUT MONG ĐỢI</FieldLabel>
              <FieldTextarea
                value={form.outputFormat}
                onChange={set('outputFormat')}
                placeholder={'{"data":[], "total":0, "page":1}'}
                rows={2}
                mono
              />
            </div>
            <div>
              <FieldLabel>CONSTRAINTS</FieldLabel>
              <FieldTextarea
                value={form.constraints}
                onChange={set('constraints')}
                placeholder="No ORM, có error handling, viết unit test..."
                rows={2}
              />
            </div>
          </div>
        </div>

        <CollapseSection icon="storage" title="REF DATA / SCHEMA" optional>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <FieldLabel>SCHEMA / DB STRUCTURE</FieldLabel>
              <FieldTextarea
                value={form.schema}
                onChange={set('schema')}
                placeholder={'CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n-- hoặc TypeScript interface, Pydantic model...'}
                rows={4}
                mono
              />
            </div>
            <div>
              <FieldLabel>CONTEXT CODE</FieldLabel>
              <FieldTextarea
                value={form.contextCode}
                onChange={set('contextCode')}
                placeholder="Paste code liên quan, function hiện có, boilerplate..."
                rows={3}
                mono
              />
            </div>
          </div>
        </CollapseSection>

        <CollapseSection icon="bug_report" title="ERROR LOG / STACK TRACE" optional>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <FieldLabel>PASTE LOG TỪ TERMINAL</FieldLabel>
              <FieldTextarea
                value={form.errorLog}
                onChange={set('errorLog')}
                placeholder={'Traceback (most recent call last):\n  File "main.py", line 42...\nAttributeError: \'NoneType\'...'}
                rows={4}
                mono
                danger
              />
            </div>
            <div>
              <FieldLabel>ĐÃ THỬ FIX NHƯ THẾ NÀO?</FieldLabel>
              <FieldTextarea
                value={form.alreadyTried}
                onChange={set('alreadyTried')}
                placeholder="Đã thử: thêm null check, restart server... nhưng vẫn lỗi"
                rows={2}
              />
            </div>
          </div>
        </CollapseSection>
      </SectionCard>
    </>
  )
}
