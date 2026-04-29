/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',      // Índigo vibrante — ações principais
        secondary: '#8B5CF6',    // Roxo médio — destaques
        accent: '#A78BFA',       // Roxo claro — hover, badges
        danger: '#EF4444',       // Vermelho — erros, alertas
        success: '#10B981',      // Verde — confirmações, descontos
        surface: '#F5F3FF',      // Fundo levíssimo lilás
        muted: '#6B7280',        // Cinza — textos secundários
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}