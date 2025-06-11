/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BF63',
        secondary: '#F5F5F5',
      },
    },
  },
  plugins: [],
}