/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Important pour le dark mode
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        orange: {
          50: '#fff6ed',
          100: '#ffead5',
          200: '#fddcab',
          300: '#feb273',
          400: '#fd853a',
          500: '#FF5F00', // Couleur principale SIXT
          600: '#ec4a0a',
          700: '#c4320a',
          800: '#9c2a10',
          900: '#7e2410',
        },
        gray: {
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          dark: '#1a2231',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          500: '#12b76a',
          600: '#039855',
        },
        error: {
          50: '#fef3f2',
          100: '#fee4e2',
          500: '#f04438',
          600: '#d92d20',
        },
        warning: {
          50: '#fffaeb',
          100: '#fef0c7',
          500: '#f79009',
          600: '#dc6803',
        },
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '62.5': '15.625rem',
        '72.5': '18.125rem',
        '125': '31.25rem',
      },
      zIndex: {
        1: '1',
        40: '40',
        50: '50',
        999: '999',
        9999: '9999',
        99999: '99999',
      },
      screens: {
        '2xsm': '375px',
        'xsm': '425px',
        '3xl': '2000px',
      },
      keyframes: {
        'ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'fadeIn': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
        'slideInDown': {
          'from': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.95)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      animation: {
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'in': 'slideInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
};