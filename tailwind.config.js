/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        darkerBg: "var(--darkerBg)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        border: "var(--border)",
        grayText: "var(--grayText)",
        redText: "var(--redText)",
        greenText: "var(--greenText)",
        yellowText: "var(--yellowText)",
        shimmer: "var(--shimmer)",
      },
    },
  },
  plugins: [],
};
