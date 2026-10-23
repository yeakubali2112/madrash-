import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#006837",
          "green-dark": "#004e29",
          "green-light": "#008a49",
          gold: "#DDAA00",
          "gold-light": "#f0bb18",
          "gold-dark": "#b88e00",
          blue: "#003580",
          "blue-dark": "#002456",
          "blue-light": "#0a4da6",
        },
        madrasah: {
          50: "#e6f5ed",
          100: "#cceadc",
          200: "#99d6b8",
          300: "#66c195",
          400: "#33ad71",
          500: "#008a49",
          600: "#006837", // Primary requested color: #006837
          700: "#00542c",
          800: "#004022",
          900: "#002d18",
          950: "#001a0e",
        },
        gold: {
          50: "#fffef0",
          100: "#fdfbd0",
          200: "#fbf6a1",
          300: "#f8f06a",
          400: "#f0bb18",
          500: "#DDAA00", // Requested color: #DDAA00
          600: "#bf9300",
          700: "#997500",
          800: "#735800",
          900: "#4d3b00",
        },
        navy: {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0066ff",
          600: "#003580", // Requested color: #003580
          700: "#002b66",
          800: "#00204d",
          900: "#001533",
          950: "#000b1a",
        }
      },
      fontFamily: {
        sans: [
          "'Kalpurush'",
          "'Google Sans'",
          "'Product Sans'",
          "'Plus Jakarta Sans'",
          "'Noto Sans Bengali'",
          "'Hind Siliguri'",
          "'SolaimanLipi'",
          "system-ui",
          "-apple-system",
          "sans-serif"
        ],
        arabic: [
          "'Amiri'",
          "'Traditional Arabic'",
          "'Scheherazade New'",
          "serif"
        ]
      }
    },
  },
  plugins: [],
};
export default config;
