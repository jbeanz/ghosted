import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f6f1ff",
        muted: "#b8adc9",
        mint: "#7dffc3",
        lavender: "#c9b6ff",
        rose: "#ff7aa2",
        gold: "#ffd56a",
        orange: "#ff9b61",
        night: "#07060c",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
} satisfies Config;
