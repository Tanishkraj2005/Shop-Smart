/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#ff9900',
          'orange-d': '#e68900',
          navy: '#232f3e',
          'navy-d': '#131921',
        },
      },
      animation: {
        'grad-shift': 'gradShift 9s ease infinite',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.2s ease',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        gradShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        blink: {
          '0%,100%': { opacity: 0.7 },
          '50%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
