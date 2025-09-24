import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1f2937'
        }
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
