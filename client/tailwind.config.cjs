// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-pistachio',
    'text-jet',
    'text-pear',
    'text-argentBlue',
    'text-wisteria',
    'text-webViolet',
  ],
  theme: {
    extend: {
      colors: {
        jet: '#343434',
        pistachio: '#98D079',
        pear: '#C6E600',
        argentBlue: '#6AB9F2',
        wisteria: '#B5A3EC',
        webViolet: '#FF8DE6',
        platinum: '#E6E6E6',
        silver: '#CDCDCD',
        battleship: '#9A9A9A',
        whiteSmoke: '#f5f5f5',
      },
    },
  },

  plugins: [],
};
