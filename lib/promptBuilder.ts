import {
  TaskType, CodingForm, ContentForm, AnalyticsForm, SynthesisForm,
  EngineConfig, OutputMode,
} from './types'

/* ── helpers ─────────────────────────────────────────────── */
function has(val: string | undefined) {
  return !!(val && val.trim())
}

function quote(val: string) {
  return val.trim() || 'chưa xác định'
}

// ── Meta-prompt builder (sent to AI to generate the structured prompt) ──
export function buildMetaPrompt(
  taskType: TaskType,
  form: any,
  targets: string[],
  bilingual: boolean,
  mode: OutputMode = 'full',
): string {
  const targetStr = targets.join(', ') || 'Claude, Gemini'
  const biNote = bilingual
    ? '\n\nSau phần XML tiếng Việt, thêm dòng "---EN---" rồi dịch toàn bộ XML sang tiếng Anh chuyên nghiệp.'
    : ''

  const baseInstruction = `Bạn là Prompt Engineer chuyên nghiệp. Nhiệm vụ: tạo structured XML prompt chất lượng cao.
Chỉ trả về XML, không giải thích, không markdown fence, không preamble.
Target AI: ${targetStr}${biNote}\n\n`

  if (taskType === 'coding') {
    const f = form as CodingForm
    const hasSchema = has(f.schema)
    const hasCode   = has(f.contextCode)
    const hasError  = has(f.errorLog)

    if (mode === 'compact') {
      return `${baseInstruction}Người dùng điền:
- Ngôn ngữ / Framework: ${quote(f.language)}
- Mục tiêu chính: ${quote(f.goal)}
- Mô tả vấn đề: ${f.description.trim()}
${has(f.inputData)    ? `- Input data: ${f.inputData}` : ''}
${has(f.outputFormat) ? `- Output mong đợi: ${f.outputFormat}` : ''}
${has(f.constraints)  ? `- Constraints: ${f.constraints}` : ''}
${hasSchema ? '- Có schema / DB structure đính kèm' : ''}
${hasCode   ? '- Có context code đính kèm' : ''}
${hasError  ? '- Có error log — task debug/fix' : ''}
${has(f.alreadyTried) ? `- Đã thử fix: ${f.alreadyTried}` : ''}

Tạo XML prompt CÓ THỰC TẾ, dùng đúng mô tả người dùng cung cấp. KHÔNG bịa, KHÔNG phóng đại role. structure:
<prompt>
  <context>${f.description.trim()}</context>
  <task>${quote(f.goal)}</task>
  <technical_specs>
    <language>${quote(f.language)}</language>
    ${has(f.inputData) ? `<input_data>${f.inputData}</input_data>` : ''}
    ${has(f.outputFormat) ? `<output_format>${f.outputFormat}</output_format>` : ''}
  </technical_specs>
  ${hasSchema ? '<reference_data><schema/></reference_data>' : ''}
  ${hasError  ? `<debug_context><error_log/><already_tried>${f.alreadyTried || ''}</already_tried><ask_ai>Phân tích root cause. Không suggest cách đã thử. Giải thích WHY trước fix.</ask_ai></debug_context>` : ''}
  ${has(f.constraints) ? `<constraints>${f.constraints}</constraints>` : ''}
  <thinking>step-by-step trước khi viết code</thinking>
</prompt>
${hasSchema ? `\n[SCHEMA]\n${f.schema}` : ''}${hasCode   ? `\n[CODE CONTEXT]\n${f.contextCode}` : ''}${hasError  ? `\n[ERROR LOG]\n${f.errorLog}` : ''}`
    }

    return `${baseInstruction}Người dùng điền:
- Ngôn ngữ / Framework: ${quote(f.language)}
- Mục tiêu chính: ${quote(f.goal)}
- Mô tả vấn đề: ${f.description.trim()}
- Input data: ${quote(f.inputData)}
- Output mong đợi: ${quote(f.outputFormat)}
- Constraints: ${has(f.constraints) ? f.constraints : 'không có'}
${hasSchema ? '- Có schema / DB structure đính kèm' : ''}
${hasCode   ? '- Có context code đính kèm' : ''}
${hasError  ? '- Có error log — task debug/fix' : ''}
${has(f.alreadyTried) ? `- Đã thử fix: ${f.alreadyTried}` : ''}

Tạo XML prompt CÓ THỰC TẾ, dùng đúng mô tả người dùng cung cấp. KHÔNG bịa role lớn, KHÔNG phóng đại scope. Các tag chứa đúng nội dung user cung cấp — nếu thiếu thì để placeholder "chưa xác định", không tự điền.
Cấu trúc XML:
<prompt>
  <context>${f.description.trim()}</context>
  <task>${quote(f.goal)}</task>
  <technical_specs>
    <language>${quote(f.language)}</language>
    <input_data>${quote(f.inputData)}</input_data>
    <output_format>${quote(f.outputFormat)}</output_format>
  </technical_specs>${hasSchema ? '\n  <reference_data><schema/></reference_data>' : ''}${hasError ? '\n  <debug_context><error_log/><already_tried/><ask_ai>Phân tích root cause. Không suggest cách đã thử. Giải thích WHY trước khi fix.</ask_ai></debug_context>' : ''}
  ${has(f.constraints) ? `<constraints>${f.constraints}</constraints>` : ''}
  <thinking>step-by-step trước khi viết code</thinking>
</prompt>
${hasSchema ? `\n[SCHEMA]\n${f.schema}` : ''}${hasCode   ? `\n[CODE CONTEXT]\n${f.contextCode}` : ''}${hasError  ? `\n[ERROR LOG]\n${f.errorLog}` : ''}`
  }

  if (taskType === 'content') {
    const f = form as ContentForm
    return `${baseInstruction}Tạo XML prompt cho CONTENT WRITING task:
- Loại content: ${f.contentType}
- Độ dài: ${f.length}
- Mô tả: ${f.description}
- Đối tượng: ${f.audience || 'chưa xác định'}
- Tone: ${f.tone || 'chưa xác định'}
- Key messages: ${f.keyMessages || 'chưa xác định'}

Cấu trúc XML:
<prompt>
  <role/>
  <context/>
  <task/>
  <content_specs>
    <content_type/><target_audience/><tone_voice/><length/><platform_context/>
  </content_specs>
  <key_messages/>
  <constraints/>
  <thinking>Lên dàn ý trước khi viết: hook → body → CTA</thinking>
</prompt>`
  }

  if (taskType === 'analytics') {
    const f = form as AnalyticsForm
    return `${baseInstruction}Tạo XML prompt cho DATA ANALYSIS task:
- Loại dữ liệu: ${f.dataType}, Mục tiêu: ${f.goal}
- Mô tả: ${f.description}, Output: ${f.outputFormat}

Cấu trúc: <prompt><role/><context/><task/><data_specs><source/><analysis_type/><depth/></data_specs><output_format/><thinking>step-by-step analysis</thinking></prompt>`
  }

  // synthesis
  const f = form as SynthesisForm
  return `${baseInstruction}Tạo XML prompt cho DOCUMENT SYNTHESIS task:
- Nguồn: ${f.sourceType}, Mục đích: ${f.purpose}
- Mô tả: ${f.description}, Focus: ${f.focusAreas}

Cấu trúc: <prompt><role/><context/><task/><synthesis_specs><source_type/><output_format/><focus_areas/></synthesis_specs><constraints/><thinking>step-by-step synthesis</thinking></prompt>`
}

// ── Fallback XML generator (no API key) ─────────────────────────────────
export function generateFallbackXML(
  taskType: TaskType,
  form: any,
  targets: string[],
  bilingual: boolean,
  mode: OutputMode = 'full',
): string {
  const targetStr = targets.join(', ')
  let vi = ''

  if (taskType === 'coding') {
    const f = form as CodingForm
    if (mode === 'compact') {
      const specItems = [
        f.language && `    <language>${f.language}</language>`,
        f.inputData && `    <input_data>${f.inputData}</input_data>`,
        f.outputFormat && `    <output_format>${f.outputFormat}</output_format>`,
      ].filter(Boolean).join('\n')
      vi = `<prompt>
  <context>${f.description || ''}</context>
  <task>${f.goal || ''}</task>${specItems ? `
  <technical_specs>\n${specItems}\n  </technical_specs>` : ''}${f.schema ? `
  <reference_data>
    <schema>${f.schema.substring(0, 500)}${f.schema.length > 500 ? '...' : ''}</schema>
  </reference_data>` : ''}${f.errorLog ? `
  <debug_context>
    <error_log>${f.errorLog.substring(0, 600)}${f.errorLog.length > 600 ? '...' : ''}</error_log>
    <already_tried>${f.alreadyTried || ''}</already_tried>
    <ask_ai>Phân tích root cause. Không suggest cách đã thử.</ask_ai>
  </debug_context>` : ''}${f.constraints ? `
  <constraints>${f.constraints}</constraints>` : ''}
  <thinking>step-by-step trước khi viết code</thinking>
  <target_ai>${targetStr}</target_ai>
</prompt>`
    } else {
      vi = `<prompt>
  <context>${f.description || ''}</context>
  <task>${f.goal || ''}</task>
  <technical_specs>
    <language>${f.language || 'chưa xác định'}</language>
    <input_data>${f.inputData || 'xác định từ context'}</input_data>
    <output_format>${f.outputFormat || 'xác định từ context'}</output_format>
  </technical_specs>${f.schema ? `
  <reference_data>
    <schema>${f.schema.substring(0, 500)}${f.schema.length > 500 ? '...' : ''}</schema>
  </reference_data>` : ''}${f.errorLog ? `
  <debug_context>
    <error_log>${f.errorLog.substring(0, 600)}${f.errorLog.length > 600 ? '...' : ''}</error_log>
    <already_tried>${f.alreadyTried || 'không có thông tin'}</already_tried>
    <ask_ai>Phân tích root cause từ stack trace. Không suggest cách đã thử. Giải thích WHY lỗi xảy ra trước khi đề xuất fix.</ask_ai>
  </debug_context>` : ''}
  ${f.constraints ? `<constraints>${f.constraints}</constraints>` : ''}
  <thinking>step-by-step trước khi viết code</thinking>
  <target_ai>${targetStr}</target_ai>
</prompt>`
    }
  } else if (taskType === 'content') {
    const f = form as ContentForm
    vi = `<prompt>
  <context>
    ${f.description}
  </context>
  <task>Viết ${f.contentType} theo yêu cầu bên dưới</task>
  <content_specs>
    <content_type>${f.contentType}</content_type>
    <target_audience>${f.audience || 'xác định từ context'}</target_audience>
    <tone_voice>${f.tone || 'chuyên nghiệp, thân thiện'}</tone_voice>
    <length>${f.length}</length>
    <platform_context>${getPlatformContext(f.contentType)}</platform_context>
  </content_specs>
  <key_messages>${f.keyMessages || 'xác định từ context'}</key_messages>
  <constraints>Hook mạnh ở câu đầu tiên. Không dùng buzzword chung chung. Kết thúc có CTA rõ ràng.</constraints>
  <thinking>Lên dàn ý: (1) hook mở đầu thu hút, (2) body với key messages, (3) CTA kết thúc hành động.</thinking>
  <target_ai>${targetStr}</target_ai>
</prompt>`
  } else if (taskType === 'analytics') {
    const f = form as AnalyticsForm
    vi = `<prompt>
  <context>${f.description}</context>
  <task>${f.goal}</task>
  <data_specs>
    <source>${f.dataType}</source>
    <analysis_type>exploratory + comparative</analysis_type>
    <depth>comprehensive</depth>
  </data_specs>
  <output_format>${f.outputFormat || 'Báo cáo có cấu trúc với số liệu cụ thể'}</output_format>
  <thinking>Phân tích từng bước: (1) overview data, (2) identify patterns, (3) compare, (4) insights, (5) recommendations.</thinking>
  <target_ai>${targetStr}</target_ai>
</prompt>`
  } else {
    const f = form as SynthesisForm
    vi = `<prompt>
  <context>${f.description}</context>
  <task>${f.purpose}</task>
  <synthesis_specs>
    <source_type>${f.sourceType}</source_type>
    <output_format>Báo cáo có cấu trúc rõ ràng</output_format>
    <focus_areas>${f.focusAreas || 'Các điểm chính và insights quan trọng'}</focus_areas>
  </synthesis_specs>
  <constraints>Trích dẫn nguồn cụ thể. Phân biệt fact vs opinion. Ngôn ngữ súc tích.</constraints>
  <thinking>Quy trình: (1) đọc toàn bộ, (2) extract key points, (3) organize by theme, (4) synthesize, (5) write output.</thinking>
  <target_ai>${targetStr}</target_ai>
</prompt>`
  }

  if (!bilingual) return vi

  // Simple EN translation for fallback
  const en = vi
    .replace(/Bạn là/g, 'You are')
    .replace(/senior /g, 'senior ')
    .replace(/chuyên nghiệp/g, 'professional')
    .replace(/Viết code production-ready/g, 'Write production-ready code')
    .replace(/Lên dàn ý/g, 'Create an outline')
    .replace(/Phân tích từng bước/g, 'Analyze step by step')
    .replace(/Trước khi viết code/g, 'Before writing code')
    .replace(/xác định từ context/g, 'determine from context')

  return vi + '\n\n---EN---\n\n' + en
}

function getPlatformContext(contentType: string): string {
  if (contentType.includes('LinkedIn')) return 'LinkedIn: ưu tiên professional insights, thought leadership, không quá promotional'
  if (contentType.includes('Facebook')) return 'Facebook: engagement-first, relatable, conversational, có thể dùng emoji'
  if (contentType.includes('Press release')) return 'Báo chí: cấu trúc inverted pyramid, 5W1H, quote từ leadership, AP style'
  if (contentType.includes('internal')) return 'Internal: clear, direct, action-oriented, tránh jargon không cần thiết'
  if (contentType.includes('documentation')) return 'Technical docs: precise, structured, examples cụ thể, scannable'
  return 'Email: professional, concise, clear subject và CTA'
}

// ── XML syntax highlighter (returns HTML string) ─────────────────────
export function highlightXML(xml: string): string {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>')
    .replace(/(&lt;\/?[\w_]+)/g, '<span class="xml-tag2">$1</span>')
    .replace(/(&gt;)(?![\s\S]*&lt;\/)/g, '<span class="xml-tag2">$1</span>')
    .replace(/(&lt;\/[\w_]+&gt;)/g, '<span class="xml-tag2">$1</span>')
    .replace(/(&lt;prompt&gt;|&lt;\/prompt&gt;)/g, '<span class="xml-tag">$1</span>')
    .replace(/>([^<\n]+)</g, (m, val) =>
      val.trim() ? `><span class="xml-val">${val}</span><` : m
    )
}
