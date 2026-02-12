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
        brand: {
          50: '#FFF0F6',
          100: '#FFE0EB',
          200: '#FFC2D9',
          300: '#FF94B8',
          400: '#FF6B9D',
          500: '#FF3D85',
          600: '#E6266E',
          700: '#C41858',
          800: '#A11247',
          900: '#7D0D38',
        },
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        candy: {
          pink: '#FF6B9D',
          magenta: '#FF3D85',
          mint: '#2DD4BF',
          lavender: '#C4B5FD',
          lemon: '#FDE68A',
          peach: '#FDBA74',
          bubblegum: '#F472B6',
          grape: '#A78BFA',
        },
        surface: {
          50: '#FFFBFE',
          100: '#FFF5F8',
          200: '#FFE4ED',
          700: '#3D2B35',
          800: '#2A1B24',
          900: '#1A1015',
          950: '#120B0F',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
