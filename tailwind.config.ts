import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode surfaces
        'bg':                    '#131313',
        'surface':               '#1c1b1b',
        'container':             '#201f1f',
        'container-high':        '#2a2a2a',
        'container-highest':     '#353534',
        'surface-variant':       '#353534',
        // Borders
        'border-dim':            '#3b4b37',
        'border-mid':            '#84967e',
        // Primary (green)
        'primary':               '#ebffe2',
        'primary-dim':           '#00e639',
        'primary-container':     '#00ff41',
        'on-primary':            '#003907',
        'on-primary-container':  '#007117',
        // Secondary (amber)
        'secondary':             '#ffd79b',
        'secondary-container':   '#ffb211',
        'amber':                 '#ffba3f',
        // Tertiary (blue)
        'tertiary-dim':          '#adc7ff',
        // Text
        'on-surface':            '#e5e2e1',
        'on-surface-v':          '#b9ccb2',
        // Semantic
        'error':                 '#ff4444',
        'error-dim':             '#ff8a80',
        // Light mode overrides applied via CSS vars
      },
      fontFamily: {
        'space':   ['Space Mono', 'monospace'],
        'mono':    ['JetBrains Mono', 'monospace'],
        'viet':    ['Be Vietnam Pro', 'sans-serif'],
      },
      fontSize: {
        'headline': ['24px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-sm': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'label': ['11px', { lineHeight: '1.0', letterSpacing: '0.1em', fontWeight: '700' }],
        'code': ['13px', { lineHeight: '1.6' }],
        'code-sm': ['11px', { lineHeight: '1.7' }],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
      },
      animation: {
        'blink': 'blink 1.5s infinite',
        'cursor': 'cursor 1s step-end infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        cursor: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
}
export default config
