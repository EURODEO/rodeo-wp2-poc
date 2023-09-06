import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "slow-spin": "spin-slow 15s ease-in-out infinite",
      },
      keyframes: {
        "spin-slow": {
          "0%, 100%": { "background-position": "0% 0%" },

          "50%": { "background-position": "10% 10%" },
        },
      },
    },
    backgroundSize: {
      "min-plus": "calc(120vw + 120vh) calc(120vw + 120vh)",
    },
    boxShadow: {
      "inner-dark": "20px 20px 40px black inset, -20px 20px 40px black inset",
      "inner-light":
        "40px 40px 40px rgb(244 244 245) inset, -40px 40px 40px rgb(244 244 245) inset",
    },
  },
  plugins: [],
};
export default config;
