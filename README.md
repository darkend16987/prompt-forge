# PROMPT FORGE — Structured Prompt Builder

Biến raw prompt thành structured XML prompt chất lượng cao.

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** — retro DOS/terminal aesthetic
- **JetBrains Mono** + **Space Mono** + **Be Vietnam Pro**
- **Vercel** deploy

## Deploy lên Vercel (5 bước)

### 1. Clone & push lên GitHub
```bash
cd prompt-forge
git init
git add .
git commit -m "init: prompt forge v2"
gh repo create prompt-forge --public --push
```

### 2. Import vào Vercel
- Vào https://vercel.com/new
- Chọn repo vừa tạo → Import
- Framework preset: **Next.js** (tự detect)
- Click **Deploy**

### 3. (Tùy chọn) Thêm API key mặc định
Trong Vercel dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY = AIza...
```
Nếu không set, user tự nhập key trong UI (key xử lý server-side, không lộ ra browser).

### 4. Redeploy
Sau khi add env var → Deployments → Redeploy.

## Chạy local
```bash
npm install
cp .env.example .env.local  # thêm key nếu muốn
npm run dev
# → http://localhost:3000
```

## Cấu trúc
```
app/
  page.tsx          ← Main orchestrator
  layout.tsx        ← Root layout + theme init
  globals.css       ← CSS vars, retro styles
  api/forge/
    route.ts        ← Server-side API (ẩn key)
components/
  layout/
    Topbar.tsx
    Sidebar.tsx
    Footer.tsx
  ui/
    primitives.tsx  ← SectionCard, FieldLabel, etc.
    CodingTab.tsx
    OtherTabs.tsx   ← Content, Analytics, Synthesis
    OutputPanel.tsx ← XML preview + compile
    EngineConfig.tsx
    TaskTabs.tsx
lib/
  types.ts          ← Types + constants
  promptBuilder.ts  ← Meta-prompt builder + fallback XML
  history.ts        ← localStorage helpers
```

## Features
- 4 task types: Coding, Content Writing, Data Analysis, Synthesis
- Multi-provider: Gemini, Deepseek, OpenAI, Anthropic
- Server-side API key handling (secure)
- Bilingual output VI + EN
- localStorage history (50 prompts)
- Dark / Light mode
- Fully responsive
