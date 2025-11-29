export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hospitalBlue: "#3A8DFF",
        hospitalLightBlue: "#E6F0FF",
        hospitalWhite: "#FFFFFF",
        hospitalGray: "#F5F7FA",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 10px rgba(58, 141, 255, 0.4)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};