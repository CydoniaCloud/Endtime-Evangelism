import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.tsx",
  ],
  darkMode: "class",
  theme: {
    // Override defaults so colors stay tightly controlled.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Surfaces & text — warm-paper palette, never pure white/black.
      bg: {
        DEFAULT: "#FAF8F4",
        dark: "#1C1A16",
      },
      surface: {
        DEFAULT: "#F2EFE7",
        dark: "#23211C",
      },
      ink: {
        DEFAULT: "#1A1A1A",
        2: "#5C5A55",
        // ink-3 darkened from the original #9A968D / #807B71 to meet
        // WCAG AA contrast (4.5:1) for body-size text against the bg.
        // See globals.css for the full rationale.
        3: "#706B65",
        dark: "#EAE6DC",
        "dark-2": "#B5B0A4",
        "dark-3": "#8A857A",
      },
      rule: {
        DEFAULT: "#E8E4DA",
        dark: "#2E2B25",
      },
      accent: {
        DEFAULT: "#2A4365",
        dark: "#7FA3D1",
      },
      // Audience tags (text + fill pairs).
      seeker: { ink: "#185FA5", fill: "#E6F1FB" },
      believer: { ink: "#0F6E56", fill: "#E1F5EE" },
      student: { ink: "#534AB7", fill: "#EEEDFE" },
    },
    fontFamily: {
      // Wired up in app/layout.tsx via next/font.
      serif: ["var(--font-serif)", "Georgia", "serif"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        "monospace",
      ],
    },
    fontWeight: {
      // Two weights only — non-negotiable per design system.
      regular: "400",
      medium: "500",
    },
    fontSize: {
      caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
      small: ["0.875rem", { lineHeight: "1.5" }],
      body: ["1.125rem", { lineHeight: "1.7" }], // 18px mobile baseline
      "body-lg": ["1.1875rem", { lineHeight: "1.7" }], // 19px desktop
      h3: ["1.125rem", { lineHeight: "1.3" }],
      "h3-lg": ["1.25rem", { lineHeight: "1.3" }],
      h2: ["1.375rem", { lineHeight: "1.2" }],
      "h2-lg": ["1.625rem", { lineHeight: "1.2" }],
      h1: ["2rem", { lineHeight: "1.15" }],
      "h1-lg": ["2.5rem", { lineHeight: "1.15" }],
    },
    extend: {
      maxWidth: {
        // 65ch reading column — body text, headings, inline asides.
        prose: "36rem",
        // Medium breakout — pull quotes. Sits between body and chrome.
        breakout: "44rem",
        // Outer page chrome (header/footer/article wrapper) and the wide
        // breakout column for figures, audio, video, read-next grids.
        page: "56rem",
      },
      spacing: {
        // 4px base unit additions.
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderWidth: {
        hairline: "0.5px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [typography],
};

export default config;
