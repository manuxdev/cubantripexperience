export const routes = {
  destinations: "/destinations/",
  services: "/services/",
  contact: "/contact-us/",
  pinarDelRio: "/pinar-del-rio/",
  matanzas: "/matanzas/",
  havana: "/havana/",
  trinidad: "/trinidad/",
  cienfuegos: "/cienfuegos/",
  santiagoDeCuba: "/santiago-cuba/",
} as const;

export type RetainedRoute = (typeof routes)[keyof typeof routes];

export const primaryNavigation: ReadonlyArray<{
  label: string;
  href: RetainedRoute;
}> = [
  { label: "Destinations", href: routes.destinations },
  { label: "Services", href: routes.services },
  { label: "Contact us", href: routes.contact },
];

/** Source destination sequence, shared by the home and destinations pages. */
export const destinationSequence = [
  routes.pinarDelRio,
  routes.matanzas,
  routes.havana,
  routes.trinidad,
  routes.cienfuegos,
  routes.santiagoDeCuba,
] as const;
