/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "hit-pink": "#FFA876",
        "tickle-pink": "#FF7DB0",
      },
    },
  },
  plugins: [],
}