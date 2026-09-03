import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette derived directly from the Seawise whale mark.
        "forest-dark": "#132A22", // primary text, dominant on light sections
        "near-black": "#0A1712", // dark section background
        "off-white": "#FAFAF8", // main background
        "sea-foam": "#5C8577", // secondary accent, hover, rules
        "warm-neutral": "#E8E4D9", // card background on light sections
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Deret logo partner. -50% karena isinya dua salinan daftar yang sama
        // dan tiap salinan sudah membawa satu jarak di kanannya, jadi titik
        // ulangnya jatuh persis di logo pertama. Lihat PartnerMarquee.
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        // Durasinya ditimpa per komponen supaya lajunya tidak berubah
        // mengikuti jumlah logo.
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
