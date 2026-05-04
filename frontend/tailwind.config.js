/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EMPRESA
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',

        // CLIENTE
        clientPrimary: '#F97316',
        clientSecondary: '#FB923C',
        clientAccent: '#FDBA74',

        // ESTADOS
        danger: '#EF4444',
        success: '#10B981',

        // BASE DARK
        surface: '#050505',
        surfaceLight: '#111111',
        card: 'rgba(255,255,255,0.05)',

        muted: '#A1A1AA',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },

      boxShadow: {
        neon: '0 0 15px rgba(168,85,247,0.35)',
        neonClient: '0 0 15px rgba(249,115,22,0.35)',
      }
    },
  },
  plugins: [],
}