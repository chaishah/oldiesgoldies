import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bakelite: "#2E211A",
        walnut: "#5A3726",
        cabinet: "#7A4E32",
        cream: "#F5F5DC",
        paper: "#FFF8E6",
        robin: "#8BC6C6",
        mustard: "#D9A441",
        cherry: "#A4463F",
        ink: "#27231F"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "\"Courier New\"", "monospace"]
      },
      boxShadow: {
        cabinet: "0 28px 70px rgba(46, 33, 26, 0.32)",
        insetTube: "inset 0 0 55px rgba(46, 33, 26, 0.32)"
      },
      backgroundImage: {
        wood:
          "linear-gradient(90deg, rgba(255,255,255,0.07), transparent 18%, rgba(0,0,0,0.10) 42%, transparent 68%), repeating-linear-gradient(0deg, #72472e 0 10px, #825337 10px 18px, #613b28 18px 30px)"
      }
    }
  },
  plugins: []
};

export default config;
