/**
 * The three language editions of the WordPress site, as Astro routes.
 *
 * Polylang runs with `default_lang: en` and `hide_default: 1`, so English is
 * unprefixed at the source and stays unprefixed here; Spanish keeps `/es/` and
 * Russian gets `/ru/`.
 *
 * Russian route slugs are transliterated ASCII rather than the source's own
 * slugs. WordPress stores those as percent-encoded Cyrillic that mixes in Latin
 * homoglyphs — `hаправления`, `mатансас`, `tроица`, `cантьяго-де-kуба` all begin
 * with a Latin letter followed by Cyrillic. Reproducing that in a URL would be
 * unlinkable and impossible to type correctly. Routes are not part of the pixel
 * gate, so this is a deliberate, documented deviation; the `wp_path` in
 * `reference/tools/pages.tsv` still carries the source's real URL.
 */
export type SiteLang = "es" | "en" | "ru";

export type NavLink = { label: string; href: string };

export type LangRoutes = {
  /** `<html lang>`. */
  htmlLang: string;
  home: string;
  services: string;
  destinations: string;
  contact: string;
  booking: string;
  /** Where a submitted booking lands. Ours — the source has no such page. */
  confirmation: string;
  /** `${destinations}/${slug}` for a destination detail page. */
  destination: (slug: string) => string;
};

export type LangStrings = {
  reserve: string;
  menuLabel: string;
  footerMenuLabel: string;
  socialLabel: string;
  skipToContent: string;
  copyright: string;
  /** `<title>` suffix, after the page name. */
  titleSuffix: string;
  /** Accessible name for a destination gallery, `${galleryOf} ${title}`. */
  galleryOf: string;
  previousPhoto: string;
  nextPhoto: string;
  openMenu: string;
  closeMenu: string;
  /** Section 6's CTA button. Russian carries the source's own leading space. */
  ctaButton: string;
};

const build = (prefix: string, slugs: Record<string, string>): LangRoutes => ({
  htmlLang: prefix === "" ? "en" : prefix.slice(1),
  home: prefix === "" ? "/" : `${prefix}/`,
  services: `${prefix}/${slugs.services}`,
  destinations: `${prefix}/${slugs.destinations}`,
  contact: `${prefix}/${slugs.contact}`,
  booking: `${prefix}/${slugs.booking}`,
  confirmation: `${prefix}/${slugs.confirmation}`,
  destination: (slug) => `${prefix}/${slugs.destinations}/${slug}`,
});

export const ROUTES: Record<SiteLang, LangRoutes> = {
  es: build("/es", {
    services: "servicios",
    destinations: "destinos",
    contact: "contactos",
    booking: "reservar",
    confirmation: "reserva-confirmada",
  }),
  en: build("", {
    services: "services",
    destinations: "destinations",
    contact: "contact-us",
    booking: "bookings",
    confirmation: "booking-confirmed",
  }),
  ru: build("/ru", {
    services: "uslugi",
    destinations: "napravleniya",
    contact: "kontakty",
    booking: "bronirovat",
    confirmation: "bronirovanie-podtverzhdeno",
  }),
};

/**
 * Menu labels, verbatim from each edition's `nav-menu` widget. Russian keeps the
 * source's own Latin/Cyrillic homoglyph spellings (`Hаправления`, `Yслуги`,
 * `Kонтакты` all start with a Latin capital) — that is what the site renders and
 * what the pixel gate measures.
 *
 * English carries a fourth item, Bookings, that Spanish and Russian do not.
 */
const MENU: Record<SiteLang, NavLink[]> = {
  es: [
    { label: "Destinos", href: ROUTES.es.destinations },
    { label: "Servicios", href: ROUTES.es.services },
    { label: "Contactos", href: ROUTES.es.contact },
  ],
  en: [
    { label: "Destinations", href: ROUTES.en.destinations },
    { label: "Services", href: ROUTES.en.services },
    { label: "Contact us", href: ROUTES.en.contact },
    { label: "Bookings", href: ROUTES.en.booking },
  ],
  ru: [
    { label: "Hаправления", href: ROUTES.ru.destinations },
    { label: "Yслуги", href: ROUTES.ru.services },
    { label: "Kонтакты", href: ROUTES.ru.contact },
  ],
};

const withoutBooking = (lang: SiteLang): NavLink[] =>
  MENU[lang].filter((l) => l.href !== ROUTES[lang].booking);

/**
 * The floating nav ends in a Book button on every edition, so the English menu's
 * fourth item pointed at the page its own neighbour already opens. Dropped here
 * rather than from `MENU`, because the footer still needs it: that block carries
 * no button, and its menu is the only way to the booking page from down there.
 */
export const navLinks = (lang: SiteLang): NavLink[] => withoutBooking(lang);

/**
 * `matanzas` and `pinar-del-rio` are the two English pages whose footer menu
 * drops the Bookings item — a per-page difference in the source, not an
 * oversight.
 */
export const footerLinks = (lang: SiteLang, dropBookings = false): NavLink[] =>
  dropBookings ? withoutBooking(lang) : MENU[lang];

export const STRINGS: Record<SiteLang, LangStrings> = {
  es: {
    reserve: "Reservar",
    menuLabel: "Principal",
    footerMenuLabel: "Pie de página",
    socialLabel: "Redes sociales",
    skipToContent: "Saltar al contenido",
    copyright: "Todos los Derechos Reservados.",
    titleSuffix: "Cuban Trip Experience",
    galleryOf: "Fotos de",
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    ctaButton: "RESERVA AHORA",
  },
  en: {
    reserve: "Book",
    menuLabel: "Main",
    footerMenuLabel: "Footer",
    socialLabel: "Social media",
    skipToContent: "Skip to main content",
    copyright: "All rights reserved.",
    titleSuffix: "Cuban Trip Experience",
    galleryOf: "Photos of",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    ctaButton: "BOOK NOW",
  },
  ru: {
    reserve: "Бронировать",
    menuLabel: "Главное",
    footerMenuLabel: "Нижнее меню",
    socialLabel: "Социальные сети",
    skipToContent: "Перейти к содержанию",
    copyright: "Все права защищены.",
    titleSuffix: "Cuban Trip Experience",
    galleryOf: "Фотографии:",
    previousPhoto: "Предыдущее фото",
    nextPhoto: "Следующее фото",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    ctaButton: " ЗАБРОНИРУЙТЕ СЕЙЧАС",
  },
};

/** Shared across every edition — one company, one set of accounts. */
export const SOCIAL = {
  email: "mailto:cubantripexperience@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61551441593993",
  instagram: "https://www.instagram.com/cubantripexperience/",
  whatsapp: "https://wa.me/+5353788250/",
  whatsappApi: "https://api.whatsapp.com/send?phone=5353788250",
  trustpilot: "https://www.trustpilot.com/review/cubantripexperience.com",
} as const;
