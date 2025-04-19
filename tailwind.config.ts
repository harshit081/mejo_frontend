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
      backgroundImage: {
        'hero-title-gradient': 'linear-gradient(70deg ,#656cf3,#fa7c0b,#8d56eb)',
        "signup-button-gradient": "linear-gradient(109deg, #98B5FF,#d196ff,#ff8800)",
        'healing-gradient': 'linear-gradient(135deg, #E6F3F3 0%, #5DA3A6 100%)',
        'mindful-gradient': 'linear-gradient(135deg, #FFF3E6 0%, #FFA726 100%)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'healing': {
          100: '#E6F3F3', // Light mint
          200: '#C2E7E8', // Soft teal
          300: '#89C4C5', // Calming teal
          400: '#5DA3A6', // Serene blue
          500: '#387B7E', // Deep teal
        },
        'mindful': {
          100: '#FFF3E6', // Warm light
          200: '#FFE0B2', // Soft orange
          300: '#FFCC80', // Muted orange
          400: '#FFB74D', // Warm orange
          500: '#FFA726', // Deep orange
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
