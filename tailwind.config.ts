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
        light: {
          bg: '#FAFAF9',
          text: '#1C1917',
          muted: '#78716C',
          border: '#E7E5E4',
        },
        dark: {
          bg: '#0C0A09',
          text: '#E7E5E4',
          muted: '#A8A29E',
          border: '#292524',
        },
        accent: {
          DEFAULT: '#2563EB',
          dark: '#60A5FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
