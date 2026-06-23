import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#ffffff",
          light: "#9d5cf4",
          dark: "#5a1eb5",
        },
        secondary: {
          DEFAULT: "#00F5FF",
          foreground: "#050816",
        },
        accent: {
          DEFAULT: "#FF00FF",
          foreground: "#ffffff",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        glass: "rgba(255,255,255,0.05)",
        "glass-border": "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        heading: ["var(--font-clash)", "sans-serif"],
        subheading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-aurora": "linear-gradient(135deg, #7C3AED, #00F5FF, #FF00FF)",
        "gradient-dark": "linear-gradient(180deg, #050816 0%, #0a0f2e 50%, #050816 100%)",
        "neon-border": "linear-gradient(90deg, #7C3AED, #00F5FF, #FF00FF, #7C3AED)",
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(124, 58, 237, 0.3)",
        "neon-cyan": "0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)",
        "neon-pink": "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glow": "0 0 60px rgba(124, 58, 237, 0.4)",
        "card": "0 25px 50px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "aurora": "aurora 10s ease infinite",
        "neon-border": "neonBorder 3s linear infinite",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        aurora: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        neonBorder: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
