import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { metaPrompt, provider, model, apiKey } = await req.json()

    if (!metaPrompt) {
      return NextResponse.json({ error: 'metaPrompt required' }, { status: 400 })
    }

    // Use env var if no key provided (for shared deployments)
    const key = apiKey || process.env[`${provider.toUpperCase()}_API_KEY`] || ''

    if (!key) {
      return NextResponse.json({ error: 'NO_API_KEY' }, { status: 400 })
    }

    let text = ''

    // ── Gemini ──────────────────────────────────────────────────────
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: metaPrompt }] }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.3 },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'Gemini API error')
      const candidate = data?.candidates?.[0]
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new Error('Output bị cắt do vượt quá giới hạn token. Vui lòng thử compact mode hoặc rút gọn mô tả.')
      }
      text = candidate?.content?.parts?.[0]?.text || ''
    }

    // ── Deepseek ────────────────────────────────────────────────────
    else if (provider === 'deepseek') {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: metaPrompt }],
          max_tokens: 8192,
          temperature: 0.3,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'Deepseek API error')
      if (data?.choices?.[0]?.finish_reason === 'length') {
        throw new Error('Output bị cắt do vượt quá giới hạn token. Vui lòng thử compact mode hoặc rút gọn mô tả.')
      }
      text = data?.choices?.[0]?.message?.content || ''
    }

    // ── OpenAI ──────────────────────────────────────────────────────
    else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: metaPrompt }],
          max_tokens: 16000,
          temperature: 0.3,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'OpenAI API error')
      if (data?.choices?.[0]?.finish_reason === 'length') {
        throw new Error('Output bị cắt do vượt quá giới hạn token. Vui lòng thử compact mode hoặc rút gọn mô tả.')
      }
      text = data?.choices?.[0]?.message?.content || ''
    }

    // ── Anthropic ───────────────────────────────────────────────────
    else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 8192,
          messages: [{ role: 'user', content: metaPrompt }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || 'Anthropic API error')
      if (data?.stop_reason === 'max_tokens') {
        throw new Error('Output bị cắt do vượt quá giới hạn token. Vui lòng thử compact mode hoặc rút gọn mô tả.')
      }
      text = data?.content?.[0]?.text || ''
    }

    else {
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
    }

    // Clean up any accidental markdown fences
    text = text.replace(/^```xml\n?/i, '').replace(/\n?```$/i, '').trim()

    const parts = text.split(/---\s*EN\s*---/i)
    return NextResponse.json({
      promptVI: parts[0]?.trim() || '',
      promptEN: parts[1]?.trim() || '',
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
