import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'hero-title-gradient':'linear-gradient(90deg, #9de8ee ,#656cf3,#fa7c0b,#8d56eb)',
        "signup-button-gradient": "linear-gradient(90deg, #5ed4ff,#d196ff,#ff8800)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
