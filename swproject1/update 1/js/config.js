/* ============================================
  Student Hub — Tailwind Config (Warm Neutral Theme)
   js/config.js  (must load BEFORE tailwind CDN)
   ============================================ */

var tailwind = window.tailwind || {};
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        brand: {
          50: "#f1efec",
          100: "#e6e3de",
          200: "#d5c0a0",
          300: "#c2a17e",
          400: "#97724f",
          500: "#734c30",
          600: "#512d1d",
          700: "#442719",
          800: "#2f2017",
          900: "#171411",
        },
        white: "#efeeeb",
        green: {
          50: "#f1efec",
          100: "#e6e3de",
          200: "#d5c0a0",
          300: "#c2a17e",
          400: "#97724f",
          500: "#734c30",
          600: "#512d1d",
          700: "#442719",
          800: "#2f2017",
          900: "#171411",
        },
        emerald: {
          50: "#f1efec",
          100: "#e6e3de",
          200: "#d5c0a0",
          300: "#c2a17e",
          400: "#97724f",
          500: "#734c30",
          600: "#512d1d",
          700: "#442719",
          800: "#2f2017",
          900: "#171411",
        },
        gray: {
          50: "#f5f4f2",
          100: "#e8e6e3",
          200: "#d6d3ce",
          300: "#bbb7b0",
          400: "#98938c",
          500: "#77716a",
          600: "#5f5952",
          700: "#403a34",
          800: "#292521",
          900: "#171411",
        },
        slate: {
          50: "#f5f4f2",
          100: "#e8e6e3",
          200: "#d6d3ce",
          300: "#bbb7b0",
          400: "#98938c",
          500: "#887b6c",
          600: "#6c5c4c",
          700: "#543f31",
          800: "#3d2b21",
          850: "#2f2119",
          900: "#211812",
          950: "#14110f",
        },
      },
      boxShadow: {
        "glow-green": "0 0 20px -2px rgba(22, 163, 74, 0.35)",
        "glow-blue": "0 0 20px -2px rgba(59, 130, 246, 0.35)",
        "glow-emerald": "0 0 20px -2px rgba(16, 185, 129, 0.35)",
        "glow-rose": "0 0 20px -2px rgba(244, 63, 94, 0.35)",
        "glow-purple": "0 0 20px -2px rgba(168, 85, 247, 0.35)",
        "glow-amber": "0 0 20px -2px rgba(245, 158, 11, 0.35)",
      },
    },
  },
};
window.tailwind = tailwind;
