/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // The Crazy Journal Brand Palette (Midnight Obsidian Ink & Fiery Ember Vermilion)
        "brand-primary": "#0A1120",
        "brand-accent": "#F05438",
        "brand-accent-hover": "#D83E23",
        // Aliases for seamless component theme binding
        "nqq-blue": "#0A1120",
        "nqq-coral": "#F05438",
        primary: {
          DEFAULT: "#0A1120",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#F05438",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#F05438",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0A1120",
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        sans: ["Open Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
