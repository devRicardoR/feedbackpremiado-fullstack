/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', 
        secondary: '#10B981',
        danger: '#EF4444',     
        brandRed: '#E63946',
        brandOrange: '#F3722C',
        brandYellow: '#F9C74F',
        brandBlue: '#577590',
        brandGreen: '#90BE6D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}