import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "zoom-gradient": "zoom-in 5s infinite linear",
      },
      keyframes: {
        "zoom-in": {
          "0%": {
            backgroundSize: "100% 100%",
          },
          "50%": {
            backgroundSize: "150% 150%",
          },
          "100%": {
            backgroundSize: "100% 100%",
          },
        },
      },
      backgroundImage: {
        "hero-title-gradient": "linear-gradient(70deg ,#656cf3,#fa7c0b,#8d56eb)",
        "signup-button-gradient": "linear-gradient(109deg, #98B5FF,#d196ff,#ff8800)",
        "healing-gradient": "linear-gradient(135deg, #E6F3F3 0%, #5DA3A6 100%)",
        "mindful-gradient": "linear-gradient(135deg, #FFF3E6 0%, #FFA726 100%)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        healing: {
          "100": "#E6F3F3",
          "200": "#C2E7E8",
          "300": "#89C4C5",
          "400": "#5DA3A6",
          "500": "#387B7E",
        },
        mindful: {
          "100": "#FFF3E6",
          "200": "#FFE0B2",
          "300": "#FFCC80",
          "400": "#FFB74D",
          "500": "#FFA726",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
