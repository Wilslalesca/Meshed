// tailwind.config.ts
import { type Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        paper: 'var(--color-paper)',
        teal: 'var(--color-teal)',
        gold: 'var(--color-gold)',
        red: 'var(--color-red)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        destructive: 'var(--color-destructive)',
      },
    },
  },
  plugins: [],
};

export default config;
