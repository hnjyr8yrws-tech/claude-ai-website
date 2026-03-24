/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ──────────────────────────────────────
        brand: {
          blue:   '#2563eb',   // spec primary
          purple: '#7c3aed',   // spec secondary
          teal:   '#14b8a6',   // spec optional accent
          green:  '#22C55E',
          orange: '#F97316',
          amber:  '#D97706',
          gold:   '#F59E0B',
        },
        cream: {
          DEFAULT: '#FEFDFB',
          warm:    '#FFF7ED',
          amber:   '#FEF3C7',
        },
        ink: {
          DEFAULT: '#111827',
          mid:     '#374151',
          light:   '#6B7280',
          pale:    '#9CA3AF',
        },
        // ── Dark nav / hero palette (Notion-style) ─────────────
        navy: {
          DEFAULT: '#0F172A',
          mid:     '#1E293B',
          light:   '#334155',
          border:  '#2D3F55',
        },
        sky: {
          soft: '#60A5FA',
          teal: '#67E8F9',
          glow: '#38BDF8',
        },
        // ── Pastel accent blocks (light sections) ─────────────
        pastel: {
          blue:   '#BAE6FD',
          green:  '#A7F3D0',
          yellow: '#FEF3C7',
          teal:   '#99F6E4',
          coral:  '#FECACA',
          purple: '#DDD6FE',
        },
        // ── shadcn/ui CSS variable tokens ──────────────────────
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border:  'hsl(var(--border))',
        input:   'hsl(var(--input))',
        ring:    'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'marquee':      'marquee 35s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        'shine-rotate': 'shine-rotate 4s linear infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
        'fade-in-up':   'fade-in-up 0.5s ease-out forwards',
        'bounce-dot':   'bounce-dot 1s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'shine-rotate': {
          '0%':   { '--shine-angle': '0deg' },
          '100%': { '--shine-angle': '360deg' },
        },
        'pulse-soft': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(96,165,250,0.2)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(96,165,250,0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%':     { transform: 'translateY(-5px)', opacity: '1' },
        },
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'card-blue':  '0 4px 20px rgba(59,130,246,0.18)',
        'card-green': '0 4px 20px rgba(34,197,94,0.18)',
        'nav':        '0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.3)',
        'sky-glow':   '0 4px 24px rgba(96,165,250,0.35)',
        'teal-glow':  '0 4px 24px rgba(103,232,249,0.30)',
        'amber-glow': '0 4px 24px rgba(217,119,6,0.35)',
      },
    },
  },
  plugins: [],
};
