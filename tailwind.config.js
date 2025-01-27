/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode:'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'cyan': '#F5F5F5 ', // Adjust the hex codes to your gradient colors
        'tl': '#00100F',
        'tm':'#85B7B6'
      },
      backgroundImage: {
        'custom-bg': "url('/src/pages/img.png')",
      },
    },
  },
  plugins: [],
};
