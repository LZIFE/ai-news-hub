import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm paper palette instead of neutral gray — same key names as before,
        // so every component that already references light.*/dark.*/accent.*
        // picks up the new aesthetic automatically.
        light: {
          bg: '#FAF9F5',      // warm paper, not stark white
          text: '#1F1E1C',    // warm near-black ink
          muted: '#736C5F',   // warm gray, 4.9:1 on bg
          border: '#E8E4DA',
          surface: '#FFFFFF',
        },
        dark: {
          bg: '#1A1915',      // warm near-black, not gray-black
          text: '#F2EFE7',
          muted: '#A19A8A',   // 6.3:1 on bg
          border: '#34302A',
          surface: '#232019',
        },
        accent: {
          DEFAULT: '#B54E2E', // clay/terracotta — 4.9:1 on light bg, 5.1:1 white-on-accent
          dark: '#E08862',    // lighter clay for dark-mode text/icons — 6.6:1 on dark bg
          hover: '#9A3F22',
        },
      },
      fontFamily: {
        // Each role pairs a Latin face with a CJK face of matching character.
        // The browser silently falls through to the CJK family for glyphs the
        // Latin face doesn't have — no JS needed, just font-stack order.
        sans: ['var(--font-sans)', 'var(--font-sans-zh)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-display-zh)', 'system-ui', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
      },
      maxWidth: {
        site: '1200px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '14px',     // softer than 10px — reads more "paper" than "app"
        'card-lg': '20px',  // for the homepage lead story
      },
      boxShadow: {
        // warm-tinted (brown, not pure black) so shadows feel like the palette, not a default
        'card': '0 1px 2px rgba(31,28,24,0.05), 0 1px 1px rgba(31,28,24,0.04)',
        'card-hover': '0 20px 32px -16px rgba(31,28,24,0.18), 0 4px 12px -4px rgba(31,28,24,0.08)',
        'glow': '0 0 24px rgba(181,78,46,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'blink': 'blink 1.1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;