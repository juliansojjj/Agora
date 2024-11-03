/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xxsm: "320px",
        xsm: "425px",
      },
      colors: {
        brandRed: "#FD7E7E",
        darkBrandRed: "#523434",
      },
    },
  },
  plugins: [],
};
