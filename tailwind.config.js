/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./node_modules/expo-linear-gradient/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["VarelaRound", "System"],
        medium: ["MPLUSRounded-Medium"],
        bold: ["MPLUSRounded-Bold"],
      },
      colors: {
        primary: "#001F85",
        lightGrey: "#FCF8FF",
        lightPrimary: "#001FB9", // 001FB9, 6E7FB9
        circle: "#EFF6FF",
        lightBlue: "#E0ECFF",
        darkGrey: "#021431",
        grey: "#EEE9F0",
        alert: "#C40000",
        medium: "#9f9aa1",
        mediumDark: "#3C506C",
        green: "#437919",
        light: {
          text: "#000",
          background: "#fff",
          tabIconDefault: "#ccc",
        },
        dark: {
          text: "#fff",
          background: "#000",
          tabIconDefault: "#ccc",
        },
      },
    },
  },
  plugins: [],
};
