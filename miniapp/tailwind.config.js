/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6', // Off-white
        primary: '#FF5B22',    // Laranja Claude Code
        foreground: '#1A1A1A', // Texto principal (quase preto)
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tipografia clean 
      }
    },
  },
  plugins: [],
}
