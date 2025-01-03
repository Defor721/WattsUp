import type { Config } from "tailwindcss";

{
  /*
import { toneMap } from '@nextcss/color-tools';
function generateColors(color) {
    console.log(color, toneMap(color));
    return {
        DEFAULT: color,
        ...toneMap(color),
    };
}
*/
}

const config: Config = {
  mode: "jit",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{js,ts,jsx,tsx}",
    "./src/auth/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: ["class"], // 다크모드 변수 활성화
  theme: {
    extend: {
      colors: {
        mainColor: {
          DEFAULT: "#070f26",
        },
        subColor: {
          DEFAULT: "#050a18",
        },
        primary: {
          DEFAULT: "var(--primary)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          250: "var(--primary-250)",
          300: "var(--primary-300)",
          350: "var(--primary-350)",
          400: "var(--primary-400)",
          450: "var(--primary-450)",
        },
        block: {
          connect: "#DF5C25",
          text: "#6EBD72",
          image: "#6FBADB",
          divide: "#8BCF42",
          video: "#8348E9",
          calendar: "#D144AD",
          event: "#EDB72A",
        },
        input: {
          line: "var(--input-color-line)",
          bg: "var(--input-color-bg)",
        },
        slate: {
          333: "var(--foreground)",
          444: {
            DEFAULT: "#444444",
            dark: "#BBBBBB",
          },
          666: {
            DEFAULT: "#666666",
            dark: "#999999",
          },
          999: {
            DEFAULT: "#999999",
            dark: "#666666",
          },
          ddd: {
            DEFAULT: "#dddddd",
            dark: "#444444",
          },
          ccc: {
            DEFAULT: "#cccccc",
            dark: "#333333",
          },
          eee: {
            DEFAULT: "#eaeaea",
            dark: "#222222",
          },
        },
        warning: {
          DEFAULT: "#FF5B1A",
          dark: "#FF6B31",
        },
        google: {
          text: "#1f1f1f",
          "text-dark": "#FFFFFF",
          bg: "#f2f2f2",
          "bg-dark": "#131314",
        },
        toast: {
          background: "#ffffff",
          foreground: "#000000",
          dark: {
            background: "#1a1a1a",
            foreground: "#f5f5f5",
          },
          destructive: "#ff4d4f",
          "destructive-foreground": "#ffffff",
        },
        dialog: {
          background: "#ffffff",
          foreground: "#000000",
          text: "#1f1f1f",
          dark: {
            background: "#1a1a1a",
            foreground: "#f5f5f5",
            text: "#FFFFFF",
          },
        },
      },
      keyframes: {
        insideout: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
        fadeOut: {
          "0%": { opacity: "100%" },
          "100%": { opacity: "0%" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
      },
      animation: {
        insideout: "insideout 0.6s ease-in-out",
        fadeOut: "fadeOut 0.6s ease-in-out",
        scaleIn: "scaleIn 0.3s ease-in-out",
        scaleOut: "scaleOut 0.3s ease-in-out",
      },
      borderWidth: {
        1: "1px",
      },
    },
    // screens: {
    //   sm: { min: "390px", max: "819px" },
    //   md: { min: "820px", max: "1023px" },
    //   lg: { min: "1080px" },
    // },
  },
  plugins: [],
};

export default config;
