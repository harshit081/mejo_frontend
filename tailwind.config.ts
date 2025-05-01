import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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
        "cool-gradient": "linear-gradient(135deg, #edf6f9 0%, #d0f4de 25%, #a9def9 50%, #89c2d9 75%, #468faf 100%)",
        "cool-gradient-dark": "linear-gradient(45deg, #1b262c 0%, #1d3557 25%, #264653 50%, #2a9d8f 80%, #457b9d 100%)",



      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        healing: {
          "50": "#f0f9ff",
          "100": "#e0f2fe",
          "200": "#bae6fd",
          "300": "#7dd3fc", 
          "400": "#38bdf8",
          "500": "#0ea5e9",
          "600": "#0284c7",
          "700": "#0369a1",
          "800": "#075985",
          "900": "#0c4a6e",
          "fg": "#a5f3fc",  // Light text for dark mode
          "bg": "#164e63",  // Dark background for dark mode
        },
        mindful: {
          "50": "#f8f9fa",
          "100": "#f1f3f5",
          "200": "#e9ecef",
          "300": "#dee2e6",
          "400": "#ced4da",
          "500": "#adb5bd",
          "600": "#868e96",
          "700": "#495057",
          "800": "#343a40",
          "900": "#212529",
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
        teal: {
          50: '#b2d8d8',
          100: '#66b2b2',
          500: '#008080',
          600: '#006666',
          900: '#004c4c',
        },
        nature: {
          50: '#ececa3',    // Light wheat
          100: '#b5e550',   // Bright lime
          500: '#abc32f',   // Fresh green
          600: '#809c13',   // Deep olive
          900: '#607c3c',   // Dark moss
        },
        cool: {
          50:  '#0d1b2a',   // deep-navy
          100: '#1b262c',   // charcoal-navy
          200: '#1d3557',   // midnight-blue
          300: '#223843',   // dark-slate
          400: '#264653',   // dark-cyan
          500: '#2a9d8f',   // teal
          600: '#457b9d',   // muted-blue
          700: '#6a94a5',   // soft-steel
          800: '#89b0ae',   // misty-sea
          900: '#b3cde0',   // pale-blue


        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'handwritten': ['Mansalva', 'cursive']
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
