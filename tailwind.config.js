/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        secondaryText: "var(--secondaryText)",
        secondaryBg: "var(--secondaryBg)",
        darker: "var(--darker)",
        border: "var(--border)",
        grayText: "var(--grayText)",
        redText: "var(--redText)",
        greenText: "var(--greenText)",
        yellowText: "var(--yellowText)",
      },
    },
  },
  plugins: [],
};
