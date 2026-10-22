import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          DEFAULT: "#183B2B",
          dark: "#0F261C",
          light: "#2A5A44",
          surface: "#1F4A37"
        },
        defense: {
          navy: "#0F3B66",
          darkNavy: "#09223D",
          aero: "#0284C7"
        },
        honor: {
          gold: "#C59B27",
          light: "#FDF6E2",
          dark: "#9E7B1E"
        },
        brand: {
          whatsapp: "#25D366",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      }
    },
  },
  plugins: [],
};

export default config;
