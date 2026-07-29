import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nebula: {
          black: '#000000',
          white: '#FFFFFF',
          cosmos: '#24007C',
          supernova: '#E58AC3',
          stardust: '#EEAD70',
          horizon: '#7E84E5',
          galaxy: '#E4ADCF',
          sundust: '#FFE3BA',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(36,0,124,0.35)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(126,132,229,0.24), rgba(0,0,0,0) 36%), radial-gradient(circle at 80% 20%, rgba(229,138,195,0.16), rgba(0,0,0,0) 22%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
};

export default config;
