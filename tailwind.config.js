/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dbeafe',
          700: '#1d4f91',
          800: '#163d73',
          900: '#122f57',
        },
      },
      boxShadow: {
        panel: '0 8px 28px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

