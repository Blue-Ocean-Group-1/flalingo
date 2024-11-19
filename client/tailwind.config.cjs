// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pistachio: '#98D079',
        jest: '#343434',
        pear: '#C6E600',
        argentBlue: '#6AB9F2',
        wisteria: '#B5A3EC',
        webViolet: '#FF8DE6',
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
