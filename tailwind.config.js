/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': {
          DEFAULT: '#63ab45', // Original client color
          '50': '#ecf6e8',    // Very Light Green
          '100': '#d9edcf',   // Lighter Green
          '200': '#b4db9f',   // Light Green
          '300': '#8fca6f',   // Medium Light Green
          '400': '#6aad4f',   // Medium Green
          '500': '#63ab45',   // Default Green (client's color)
          '600': '#4e8737',   // Medium Dark Green
          '700': '#3a6628',   // Dark Green
          '800': '#26441b',   // Very Dark Green
          '900': '#13220d',   // Deep Dark Green
        },
        'secondary-blue': '#4579ab',
      },
    },
  },
  plugins: [],
};