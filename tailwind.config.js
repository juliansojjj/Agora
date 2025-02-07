/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xxsm: "360px",
        xsm: "425px",
        "3xl": "1920px",
        "4xl": "2560px"
      },
      colors: {
        brandGrey:"#F8F8F8",
        brandViolet:"#5E0060",
        brandRed:"#FD7E7E",
        brandShade:"#EBDFEB"
      },
    },
  },
  plugins: [],
};
