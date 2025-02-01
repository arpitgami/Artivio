// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#07070A",

          "primary-content": "#1D1D1D",

          secondary: "#00d0ff",

          accent: "#00a5fa",

          neutral: "#07070A",

          "base-100": "#FFFFFA",

          info: "#00d8ff",

          success: "#00e88a",

          warning: "#ff9000",

          error: "#ff6179",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar-hide")],
};
// /** @type {import('tailwindcss').Config} */

// // module.exports = {
// //   content: [
// //     // ...
// //     // make sure it's pointing to the ROOT node_module
// //     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
// //     "./src/**/*.{js,jsx,ts,tsx}", // Include all JSX/TSX files in your project
// //   ],
// //   theme: {
// //     extend: {},
// //   },
// //   darkMode: "class",
// //   plugins: [nextui()],
// // };
