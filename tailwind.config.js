/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",         // Ajoute ton fichier HTML principal
    "./src/**/*.{js,ts,jsx,tsx,vue}",  // Ajoute les fichiers source (JS, Vue, etc.)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
