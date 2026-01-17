module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "modern-calm": {
          "ink-black": "#0d1b2a",
          "prussian-blue": "#1b263b",
          "dusk-blue": "#415a77",
          "dusty-denim": "#778da9",
          "alabaster-grey": "#e0e1dd",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        shine: "shine 3s infinite",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "200% center" },
          "50%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
