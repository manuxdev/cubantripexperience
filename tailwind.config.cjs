/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // Elementor breakpoints. Tailwind emits `theme.extend.screens` in
      // declaration order and does not re-sort max-width queries, so `tablet`
      // (max 1024px) MUST be declared before `mobile` (max 767px): both match a
      // 390px viewport and the later rule wins. Declared the other way round,
      // `tablet:` silently overrides every `mobile:` utility. That ordering also
      // matches Elementor, where a mobile viewport inherits the tablet value
      // unless a mobile override exists.
      screens: {
        tablet: { max: "1024px" },
        mobile: { max: "767px" },
        desktop: { min: "1025px" },
      },
      colors: {
        ink: "#111111",
        gold: "#f2cb0f",
        sand: "#f8f5eb",
        es: {
          brand: "#F8F43D",
          cta: "#F8F43D85",
          ctaHover: "#F8F43DCC",
          link: "#CFC725",
          nav: "#3F3F3FCF",
          navB: "#5F5F5F",
          overlay: "#503607",
          cardBorder: "#5DBBFE91",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", ...defaultTheme.fontFamily.sans],
        // Elementor emits `font-family: "Poppins", Sans-serif` for every widget
        // with `typography_font_family=Poppins`; match that stack exactly so the
        // fallback resolves the same way the source does.
        poppins: ["Poppins", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
        prose: "70ch",
      },
      spacing: {
        section: "5rem",
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        primary: "3px 4px 10px 0px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
};
