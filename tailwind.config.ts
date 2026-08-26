// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marvel: {
          navy: '#0B1B3D',      // Primary Deep Navy
          navyLight: '#142752', // Hover / Card Navy
          gold: '#D4AF37',      // Primary Gold Accent
          goldLight: '#E8C766', // Highlight Gold
          bg: '#F8FAFC',        // Clean Spotless Off-White Background
        },
      },
    },
  },
  plugins: [],
};

export default config;