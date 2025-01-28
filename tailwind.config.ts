import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'zoom-gradient': 'zoom-in 5s infinite linear', // Name and duration of the animation
      },
      keyframes: {
        'zoom-in': {
          '0%': { backgroundSize: '100% 100%' }, // Normal size
          '50%': { backgroundSize: '150% 150%' }, // Enlarged size
          '100%': { backgroundSize: '100% 100%' }, // Back to original
        },
      },
      backgroundImage:{
        'hero-title-gradient':'linear-gradient(70deg ,#656cf3,#fa7c0b,#8d56eb)',
        "signup-button-gradient": "linear-gradient(109deg, #98B5FF,#d196ff,#ff8800)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
