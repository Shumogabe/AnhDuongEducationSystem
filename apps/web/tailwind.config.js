/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8E2424',
          deep: '#5A1515',
          tint: '#FBF1EF',
          tint2: '#F5DEDA',
          tint3: '#EDC3BD',
          yellow: '#EFE77B',
          gold: '#A07F00',
          green: '#2E7D32',
          cream: '#FFF9F0',
          dark: '#2D3748',
          blue: '#0068FF',
        },
      },
      fontFamily: { sans: ['Lexend', 'sans-serif'] },
    },
  },
  plugins: [],
};
