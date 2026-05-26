/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        citrus: {
          cream: "var(--citrus-cream)",
          surface: "var(--surface)",
          soft: "var(--surface-soft)",
          forest: "var(--deep-forest)",
          lime: "var(--lime)",
          limeSoft: "var(--lime-soft)",
          lemon: "var(--lemon)",
          yellowSoft: "var(--yellow-soft)",
          orange: "var(--orange)",
          orangeSoft: "var(--orange-soft)",
          coral: "var(--coral)",
          coralSoft: "var(--coral-soft)",
          mint: "var(--mint)",
          mintSoft: "var(--mint-soft)",
          teal: "var(--teal)",
        },
        qayta: {
          earth: "#1c3a28",
          clay: "#c05a2a",
          cream: "#f4efe4",
          stone: "#e2dac8",
          charcoal: "#252520",
          muted: "#6b6355",
          leaf: "#3d7a4f",
          sand: "#d4c9a8",
          white: "#fdfaf5",
        },
        auth: {
          base: "rgb(var(--auth-base) / <alpha-value>)",
          surface: "rgb(var(--auth-surface) / <alpha-value>)",
          elevated: "rgb(var(--auth-elevated) / <alpha-value>)",
          green: "rgb(var(--auth-green) / <alpha-value>)",
          greenMid: "rgb(var(--auth-green-mid) / <alpha-value>)",
          greenSoft: "rgb(var(--auth-green-soft) / <alpha-value>)",
          mist: "rgb(var(--auth-mist) / <alpha-value>)",
          stone: "rgb(var(--auth-stone) / <alpha-value>)",
          wash: "rgb(var(--auth-wash) / <alpha-value>)",
          line: "rgb(var(--auth-line) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ['"Manrope"', '"Geist"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        "auth-display": ['"Plus Jakarta Sans"', '"IBM Plex Sans"', "sans-serif"],
        body: ['"Manrope"', '"Geist"', '"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        "auth-panel": "0 24px 64px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
