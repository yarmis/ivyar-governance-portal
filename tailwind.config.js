/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        'ivyar-blue': '#0066CC',
        'success-green': '#00CC66',
        'warning-yellow': '#FFAA00',
        'error-red': '#CC0000',
        'layer-v12': '#4CAF50',
        'layer-gov': '#FFC107',
        'layer-hbs': '#2196F3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
