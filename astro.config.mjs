import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // The canonical origin, not the deploy origin: a Vercel preview must still
  // point search engines at the real domain, never at its own *.vercel.app.
  site: "https://cubantripexperience.com",
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    mdx(),
    // The booking confirmation is reached only by submitting the form, and says
    // nothing without the `?ref` the submit puts there. Indexing it would offer
    // searchers an empty thank-you page.
    sitemap({
      filter: (page) => !/\/(reserva-confirmada|booking-confirmed|bronirovanie-podtverzhdeno)\/?$/.test(page),
    }),
  ],
});
