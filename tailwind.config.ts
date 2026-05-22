import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        caramel: {
          25: "#fffaf7",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        cacao: {
          25: "#faf8f7",
          50: "#f7f2f0",
          100: "#eaded9",
          150: "#e0cec4",
          200: "#d6bcb2",
          300: "#bf9787",
          400: "#a26f5c",
          500: "#84523f",
          600: "#6f4334",
          700: "#5c372c",
          800: "#4b2d25",
          900: "#3d261f",
        },
        creme: {
          DEFAULT: "#fff9f1",
          50: "#fffbf8",
          100: "#fff9f1",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(62, 36, 28, 0.08)",
        "soft-sm": "0 4px 12px rgba(62, 36, 28, 0.06)",
        "soft-lg": "0 20px 40px rgba(62, 36, 28, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.2s linear infinite",
        fadeIn: "fadeIn 0.3s ease-out",
      },
      spacing: {
        "safe-4": "max(1rem, safe-area-inset-left)",
        "safe-6": "max(1.5rem, safe-area-inset-left)",
      },
    },
  },
  plugins: [],
} satisfies Config;
