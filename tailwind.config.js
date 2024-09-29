/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screen: {
        xxsm: "320px",
        xsm: "425px",
      },
      colors: {
        brandRed: "#FD7E7E",
      },
    },
  },
  plugins: [],
};
