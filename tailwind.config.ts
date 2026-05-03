import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que busque clases aquí
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;