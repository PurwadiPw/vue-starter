/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  important: true,
  theme: {
    screens: {},
    fontFamily: {
      nunito: ['"Nunito", sans-serif'],
      poppins: ['"Poppins", sans-serif'],
      opensans: ['"Open Sans", sans-serif'],
    },
    container: {
      center: true,
      padding: {},
    },
    extend: {
      colors: {},
      boxShadow: {},
      spacing: {},
    },
  },
};
