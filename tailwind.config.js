/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wordle: {
          dark: '#121213',
          darkCard: '#1a1a1b',
          darkBorder: '#3a3a3c',
          darkKey: '#818384',
          darkText: '#f8f8f8',
          correct: '#538d4e',
          present: '#b59f3b',
          absent: '#3a3a3c',
          // High contrast
          hcCorrect: '#f5793a',
          hcPresent: '#85c0f9',
        }
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '40%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-2px)' },
          '20%, 80%': { transform: 'translateX(4px)' },
          '30%, 50%, 70%': { transform: 'translateX(-6px)' },
          '40%, 60%': { transform: 'translateX(6px)' },
        },
        bounce: {
          '0%, 20%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-24px)' },
          '50%': { transform: 'translateY(0)' },
          '60%': { transform: 'translateY(-10px)' },
          '80%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(0)' },
        },
        flipIn: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        }
      },
      animation: {
        pop: 'pop 0.12s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
        bounce: 'bounce 0.8s ease-in-out',
        flip: 'flipIn 0.6s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
