/**
 * Spanish nav/footer link sets and the WordPress-URL rewriter.
 *
 * Every `reference/es/<slug>/spec.md` button/link carries an absolute source
 * URL (e.g. `http://localhost:8080/matanzas-es`). `esHref` rewrites those to
 * the relative `/es/...` Astro route, per `reference/es/README.md`'s slug
 * table and `reference/tools/pages.tsv`.
 */

export type EsNavLink = { label: string; href: string };

/** Observed on `contactos`: identical set feeds both the floating nav and the footer menu. */
export const esNavLinks: EsNavLink[] = [
  { label: "Destinos", href: "/es/destinos" },
  { label: "Servicios", href: "/es/servicios" },
  { label: "Contactos", href: "/es/contactos" },
];

export const esFooterLinks: EsNavLink[] = esNavLinks;

const wpPathToEsPath: Record<string, string> = {
  "/": "/es/",
  "/servicios/": "/es/servicios",
  "/destinos/": "/es/destinos",
  "/la-habana/": "/es/destinos/la-habana",
  "/trinidad-es/": "/es/destinos/trinidad",
  "/cienfuegos-es/": "/es/destinos/cienfuegos",
  "/matanzas-es/": "/es/destinos/matanzas",
  "/santiago-cuba-es/": "/es/destinos/santiago-de-cuba",
  "/pinar-del-rio-es/": "/es/destinos/pinar-del-rio",
  "/contactos/": "/es/contactos",
  "/reservar/": "/es/reservar",
};

/**
 * Rewrites an absolute `http://localhost:8080/...` source URL to its
 * relative `/es/...` Astro path. Falls back to the normalized source path
 * (still relative, never the WordPress origin) if it is not in the map.
 */
export const esHref = (wpUrl: string): string => {
  const path = wpUrl.replace(/^https?:\/\/[^/]+/, "");
  const normalized = path === "" ? "/" : path.endsWith("/") ? path : `${path}/`;
  return wpPathToEsPath[normalized] ?? normalized;
};
