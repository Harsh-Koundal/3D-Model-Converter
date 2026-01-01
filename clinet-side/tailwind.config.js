/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0F0F0F",
        charcoal: "#1C1C1C",
        wjgold: "#C5A059",
        higold: "#E6C877",
        textlight: "#EAEAEA",
        textdark: "#333333",
      },
      fontFamily: {
        headline: ["Cinzel", "serif"],
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
