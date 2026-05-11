'use client'
import { ContentForm, AnalyticsForm, SynthesisForm, CONTENT_TYPES } from '@/lib/types'
import { SectionCard, FieldLabel, FieldTextarea, FieldSelect } from '@/components/ui/primitives'

const p: React.CSSProperties = { padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }

// ── Content Writing ──────────────────────────────────────
interface ContentProps { form: ContentForm; onChange: (f: ContentForm) => void }
export function ContentTab({ form, onChange }: ContentProps) {
  const set = (k: keyof ContentForm) => (v: string) => onChange({ ...form, [k]: v })
  return (
    <>
      <SectionCard icon="edit_note" title="CONTENT SPECS">
        <div style={p}>
          <div style={grid2}>
            <div>
              <FieldLabel>LOẠI NỘI DUNG</FieldLabel>
              <FieldSelect value={form.contentType} onChange={set('contentType')} options={CONTENT_TYPES} />
            </div>
            <div>
              <FieldLabel>ĐỘ DÀI</FieldLabel>
              <FieldSelect
                value={form.length}
                onChange={set('length')}
                options={['Ngắn (dưới 150 từ)', 'Trung bình (150–400 từ)', 'Dài (400+ từ)']}
              />
            </div>
          </div>
          <div>
            <FieldLabel>MÔ TẢ NỘI DUNG CẦN VIẾT</FieldLabel>
            <FieldTextarea
              value={form.description}
              onChange={set('description')}
              placeholder="Mô tả nội dung cần viết — bằng tiếng Việt hoặc English..."
              rows={3}
            />
          </div>
          <div style={grid2}>
            <div>
              <FieldLabel>ĐỐI TƯỢNG ĐỌC</FieldLabel>
              <FieldTextarea value={form.audience} onChange={set('audience')} placeholder="Nhân viên nội bộ, đối tác, báo chí..." rows={2} />
            </div>
            <div>
              <FieldLabel>TONE / GIỌNG VĂN</FieldLabel>
              <FieldTextarea value={form.tone} onChange={set('tone')} placeholder="Chuyên nghiệp, Gen Z thân thiện, formal..." rows={2} />
            </div>
          </div>
          <div>
            <FieldLabel>KEY MESSAGES</FieldLabel>
            <FieldTextarea
              value={form.keyMessages}
              onChange={set('keyMessages')}
              placeholder="Các điểm quan trọng cần nhấn mạnh trong nội dung..."
              rows={2}
            />
          </div>
        </div>
      </SectionCard>
    </>
  )
}

// ── Data Analytics ───────────────────────────────────────
interface AnalyticsProps { form: AnalyticsForm; onChange: (f: AnalyticsForm) => void }
export function AnalyticsTab({ form, onChange }: AnalyticsProps) {
  const set = (k: keyof AnalyticsForm) => (v: string) => onChange({ ...form, [k]: v })
  return (
    <SectionCard icon="analytics" title="DATA ANALYSIS">
      <div style={p}>
        <div style={grid2}>
          <div>
            <FieldLabel>LOẠI DỮ LIỆU</FieldLabel>
            <FieldTextarea value={form.dataType} onChange={set('dataType')} placeholder="Excel, CSV, SQL query, Google Sheets..." rows={2} />
          </div>
          <div>
            <FieldLabel>MỤC TIÊU PHÂN TÍCH</FieldLabel>
            <FieldTextarea value={form.goal} onChange={set('goal')} placeholder="Tìm trend, so sánh performance, dự báo..." rows={2} />
          </div>
        </div>
        <div>
          <FieldLabel>MÔ TẢ BÀI TOÁN</FieldLabel>
          <FieldTextarea
            value={form.description}
            onChange={set('description')}
            placeholder="Ví dụ: file excel doanh thu 3 chi nhánh theo tháng, muốn so sánh performance và tìm branch tăng trưởng tốt nhất..."
            rows={4}
          />
        </div>
        <div>
          <FieldLabel>FORMAT OUTPUT MONG MUỐN</FieldLabel>
          <FieldTextarea
            value={form.outputFormat}
            onChange={set('outputFormat')}
            placeholder="Bảng tóm tắt, biểu đồ, báo cáo văn bản, executive summary..."
            rows={2}
          />
        </div>
      </div>
    </SectionCard>
  )
}

// ── Synthesis ────────────────────────────────────────────
interface SynthesisProps { form: SynthesisForm; onChange: (f: SynthesisForm) => void }
export function SynthesisTab({ form, onChange }: SynthesisProps) {
  const set = (k: keyof SynthesisForm) => (v: string) => onChange({ ...form, [k]: v })
  return (
    <SectionCard icon="hub" title="DOCUMENT SYNTHESIS">
      <div style={p}>
        <div style={grid2}>
          <div>
            <FieldLabel>LOẠI TÀI LIỆU NGUỒN</FieldLabel>
            <FieldTextarea value={form.sourceType} onChange={set('sourceType')} placeholder="PDF báo cáo, web articles, meeting notes..." rows={2} />
          </div>
          <div>
            <FieldLabel>MỤC ĐÍCH TỔNG HỢP</FieldLabel>
            <FieldTextarea value={form.purpose} onChange={set('purpose')} placeholder="Tóm tắt cho ban lãnh đạo, tạo FAQ, extract action items..." rows={2} />
          </div>
        </div>
        <div>
          <FieldLabel>MÔ TẢ YÊU CẦU</FieldLabel>
          <FieldTextarea
            value={form.description}
            onChange={set('description')}
            placeholder="Ví dụ: tổng hợp 5 bài báo về thị trường BĐS Hà Nội Q1/2025 thành báo cáo 1 trang cho ban lãnh đạo..."
            rows={4}
          />
        </div>
        <div>
          <FieldLabel>FOCUS AREAS</FieldLabel>
          <FieldTextarea
            value={form.focusAreas}
            onChange={set('focusAreas')}
            placeholder="Số liệu quan trọng, xu hướng, rủi ro, cơ hội, khuyến nghị..."
            rows={2}
          />
        </div>
      </div>
    </SectionCard>
  )
}
