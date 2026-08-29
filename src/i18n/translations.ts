/**
 * Which page each edition shows for the same content, so the language switcher
 * lands on the equivalent page rather than the home. Derived from Polylang's own
 * `post_translations` groups, not hand-paired.
 */
import type { SiteLang } from "./site";

export const TRANSLATIONS: Partial<Record<SiteLang, string>>[] = [
  { en: "/", es: "/es/", ru: "/ru/" },
  { en: "/bookings", es: "/es/reservar", ru: "/ru/bronirovat" },
  { en: "/contact-us", es: "/es/contactos", ru: "/ru/kontakty" },
  { en: "/destinations", es: "/es/destinos", ru: "/ru/napravleniya" },
  { en: "/destinations/cienfuegos", es: "/es/destinos/cienfuegos", ru: "/ru/napravleniya/sienfuegos" },
  { en: "/destinations/havana", es: "/es/destinos/la-habana", ru: "/ru/napravleniya/gavana" },
  { en: "/destinations/matanzas", es: "/es/destinos/matanzas", ru: "/ru/napravleniya/matansas" },
  { en: "/destinations/pinar-del-rio", es: "/es/destinos/pinar-del-rio" },
  { en: "/destinations/santiago-cuba", es: "/es/destinos/santiago-de-cuba", ru: "/ru/napravleniya/santyago-de-kuba" },
  { en: "/destinations/trinidad", es: "/es/destinos/trinidad", ru: "/ru/napravleniya/troica" },
  { en: "/services", es: "/es/servicios", ru: "/ru/uslugi" },
  // Ours, not Polylang's: the booking confirmation has no counterpart in the
  // source, but the switcher still has to find its way across editions.
  {
    en: "/booking-confirmed",
    es: "/es/reserva-confirmada",
    ru: "/ru/bronirovanie-podtverzhdeno",
  },
];

/** The equivalent of `path` in `lang`, or that edition's home when untranslated. */
export const translate = (path: string, lang: SiteLang, home: string): string => {
  const clean = path.replace(/\/$/, "") || "/";
  const group = TRANSLATIONS.find((g) =>
    Object.values(g).some((p) => (p.replace(/\/$/, "") || "/") === clean)
  );
  return group?.[lang] ?? home;
};
