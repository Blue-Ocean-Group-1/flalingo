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
        pistachio: '#98D079',
        jet: '#343434',
        pear: '#C6E600',
        argentBlue: '#6AB9F2',
        wisteria: '#B5A3EC',
        webViolet: '#FF8DE6',
        platinum: '#E6E6E6',
        silver: '#CDCDCD',
        battleship: '#9A9A9A',
        whiteSmoke: '#f5f5f5',
      },
      textColors: {
        pistachio: '#98D079',
        jet: '#343434',
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
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      heartBeat: {
        '0%': { transform: 'scale(1);' },
        '14%': { transform: 'scale(1.3);' },
        '28%': { transform: 'scale(1);' },
        '42%': { transform: 'scale(1.3);' },
        '70%': { transform: 'scale(1);' },
      },
    },
    animation: {
      wiggle: 'wiggle 1s ease-in-out',
      heartBeat: 'heartBeat 1s ease-in-out',
    },
  },

  plugins: [],
};
