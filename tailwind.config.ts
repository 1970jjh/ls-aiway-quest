import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ls: {
          // LS Cable & System brand colors
          navy: "#0A1E3D",          // deep navy (base)
          ink: "#0F2547",           // panel
          deepblue: "#003C71",      // brand primary
          blue: "#0066B3",          // brand accent
          sky: "#3DD9FF",           // AI signal cyan
          green: "#62B645",         // "Greater Value Together" green
          mint: "#7BD389",          // soft mint
          line: "#1E3358",          // border
          panel: "#0C1E3D",         // panel bg
          white: "#F5F8FC",
          dim: "#8FA3C7",
          gold: "#FFC940",
          danger: "#FF5577",
        },
      },
      fontFamily: {
        sans: ["'Pretendard'", "'Inter'", "ui-sans-serif", "system-ui"],
        display: ["'Bebas Neue'", "'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace"],
      },
      animation: {
        "pulse-blue": "pulseBlue 1.6s ease-in-out infinite",
        "scan": "scan 2.4s linear infinite",
        "circuit": "circuit 6s linear infinite",
      },
      keyframes: {
        pulseBlue: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(61, 217, 255, 0.55)" },
          "50%": { boxShadow: "0 0 0 12px rgba(61, 217, 255, 0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        circuit: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-200" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
