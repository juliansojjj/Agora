/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xxsm: "320px",
        xsm: "425px",
        "3xl": "1920px",
        "4xl": "2560px"
      },
      colors: {
        brandGrey:"#F8F8F8",
        brandViolet:"#5E0060",
        brandShade:"#EBDFEB"
      },
    },
  },
  plugins: [],
};
