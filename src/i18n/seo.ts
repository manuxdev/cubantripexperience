/**
 * Per-page search metadata.
 *
 * Keyed by path rather than passed down from each page, so all 36 routes are
 * covered from one place and a new page cannot silently ship the shared
 * fallback — which is what every page carried before this file existed: the
 * same seven-word description, on all of them.
 *
 * Descriptions are drawn from each page's own copy, not invented, and kept
 * under ~155 characters so Google shows them whole.
 */
import type { SiteLang } from "./site";
import { TRANSLATIONS } from "./translations";

export const SITE_NAME = "Cuban Trip Experience";

/** Open Graph needs an absolute URL; `Astro.site` supplies the origin. */
export const OG_IMAGE = "/opengraph.jpg";

/** `og:locale`, which wants a full locale rather than a bare language. */
export const OG_LOCALE: Record<SiteLang, string> = {
  es: "es_ES",
  en: "en_US",
  ru: "ru_RU",
};

type Meta = { description: string };

/**
 * Keys are the canonical pathname with no trailing slash; `/` is the English
 * home. A page missing here falls back to `FALLBACK`, which is a real sentence
 * rather than the site name.
 */
const PAGES: Record<string, Meta> = {
  // ── English ──────────────────────────────────────────────────────────────
  "/": {
    description:
      "Classic car taxi tours across Cuba. Travel the island in comfort and safety with an English-speaking driver. Book your transfer online.",
  },
  "/services": {
    description:
      "Standard, van and classic car taxis in Cuba. Airport transfers, day trips and private tours — pick the vehicle that fits your group.",
  },
  "/destinations": {
    description:
      "Havana, Trinidad, Cienfuegos, Matanzas, Santiago de Cuba and Pinar del Río: what to see in each, and how to get there by classic car.",
  },
  "/destinations/havana": {
    description:
      "Old Havana, the Malecón and the Capitolio. What to see in Havana and how to tour the city by classic American car.",
  },
  "/destinations/trinidad": {
    description:
      "Trinidad's Plaza Mayor, cobbled streets and colonial houses — a UNESCO town on Cuba's south coast. Plan your trip by classic car.",
  },
  "/destinations/cienfuegos": {
    description:
      "The Malecón, Punta Gorda and the Tomás Terry theatre. What to see in Cienfuegos, the French-founded city on Cuba's south coast.",
  },
  "/destinations/matanzas": {
    description:
      "The Sauto theatre, the Bellamar caves and the Yumurí valley. What to see in Matanzas, on the road between Havana and Varadero.",
  },
  "/destinations/santiago-cuba": {
    description:
      "The cathedral, El Morro castle and Cuba's most famous carnival. What to see in Santiago de Cuba, the island's second city.",
  },
  "/destinations/pinar-del-rio": {
    description:
      "Viñales, its mogotes and the tobacco fields that grow the world's best leaf. What to see in Pinar del Río, western Cuba.",
  },
  "/contact-us": {
    description:
      "Questions about a transfer or a tour in Cuba? Write to us or message us on WhatsApp — we answer every enquiry.",
  },
  "/bookings": {
    description:
      "Book a classic car, van or standard taxi in Cuba. Choose your vehicle, date and pick-up point, and we confirm by email.",
  },

  // ── Spanish ──────────────────────────────────────────────────────────────
  "/es": {
    description:
      "Recorridos por Cuba en autos clásicos. Viaja por la isla con comodidad y seguridad. Reserva tu traslado en línea.",
  },
  "/es/servicios": {
    description:
      "Taxis estándar, van y clásicos en Cuba. Traslados desde el aeropuerto, excursiones y tours privados — elige el vehículo para tu grupo.",
  },
  "/es/destinos": {
    description:
      "La Habana, Trinidad, Cienfuegos, Matanzas, Santiago de Cuba y Pinar del Río: qué ver en cada uno y cómo llegar en auto clásico.",
  },
  "/es/destinos/la-habana": {
    description:
      "La Habana Vieja, el Malecón y el Capitolio. Qué ver en La Habana y cómo recorrer la ciudad en un auto clásico americano.",
  },
  "/es/destinos/trinidad": {
    description:
      "La Plaza Mayor de Trinidad, sus calles empedradas y sus casas coloniales — villa Patrimonio de la Humanidad en el sur de Cuba.",
  },
  "/es/destinos/cienfuegos": {
    description:
      "El Malecón, Punta Gorda y el teatro Tomás Terry. Qué ver en Cienfuegos, la ciudad de fundación francesa en el sur de Cuba.",
  },
  "/es/destinos/matanzas": {
    description:
      "El teatro Sauto, las cuevas de Bellamar y el valle de Yumurí. Qué ver en Matanzas, en la ruta entre La Habana y Varadero.",
  },
  "/es/destinos/santiago-de-cuba": {
    description:
      "La catedral, el castillo del Morro y el carnaval más famoso de Cuba. Qué ver en Santiago de Cuba, la segunda ciudad de la isla.",
  },
  "/es/destinos/pinar-del-rio": {
    description:
      "Viñales, sus mogotes y los campos de tabaco que dan la mejor hoja del mundo. Qué ver en Pinar del Río, al occidente de Cuba.",
  },
  "/es/contactos": {
    description:
      "¿Dudas sobre un traslado o un tour en Cuba? Escríbenos o mándanos un WhatsApp — respondemos todas las consultas.",
  },
  "/es/reservar": {
    description:
      "Reserva un auto clásico, una van o un taxi estándar en Cuba. Elige vehículo, fecha y lugar de recogida; confirmamos por correo.",
  },

  // ── Russian ──────────────────────────────────────────────────────────────
  "/ru": {
    description:
      "Поездки по Кубе на классических автомобилях. Путешествуйте по острову с комфортом и безопасностью. Забронируйте трансфер онлайн.",
  },
  "/ru/uslugi": {
    description:
      "Стандартные такси, фургоны и классические автомобили на Кубе. Трансферы из аэропорта, экскурсии и частные туры.",
  },
  "/ru/napravleniya": {
    description:
      "Гавана, Тринидад, Сьенфуэгос, Матансас, Сантьяго-де-Куба: что посмотреть в каждом городе и как добраться на классическом авто.",
  },
  "/ru/napravleniya/gavana": {
    description:
      "Старая Гавана, Малекон и Капитолий. Что посмотреть в Гаване и как объехать город на классическом американском автомобиле.",
  },
  "/ru/napravleniya/troica": {
    description:
      "Главная площадь Тринидада, мощёные улицы и колониальные дома — город из списка ЮНЕСКО на южном побережье Кубы.",
  },
  "/ru/napravleniya/sienfuegos": {
    description:
      "Малекон, Пунта-Горда и театр Томаса Терри. Что посмотреть в Сьенфуэгосе, городе французского основания на юге Кубы.",
  },
  "/ru/napravleniya/matansas": {
    description:
      "Театр Сауто, пещеры Бельямар и долина Юмури. Что посмотреть в Матансасе, по дороге из Гаваны в Варадеро.",
  },
  "/ru/napravleniya/santyago-de-kuba": {
    description:
      "Собор, крепость Эль-Морро и самый известный карнавал Кубы. Что посмотреть в Сантьяго-де-Куба, втором городе острова.",
  },
  "/ru/kontakty": {
    description:
      "Вопросы о трансфере или туре по Кубе? Напишите нам или отправьте сообщение в WhatsApp — мы отвечаем на каждое обращение.",
  },
  "/ru/bronirovat": {
    description:
      "Забронируйте классический автомобиль, фургон или стандартное такси на Кубе. Выберите машину, дату и место подачи.",
  },
};

const FALLBACK: Record<SiteLang, string> = {
  es: "Recorridos por Cuba en autos clásicos, con traslados y tours privados en toda la isla.",
  en: "Classic car tours across Cuba, with private transfers and day trips island-wide.",
  ru: "Поездки по Кубе на классических автомобилях: трансферы и частные туры по всему острову.",
};

/**
 * The confirmation screens say nothing without the `?ref` the submit puts
 * there, so they are no use to a searcher and are kept out of the index.
 */
const NOINDEX = new Set([
  "/booking-confirmed",
  "/es/reserva-confirmada",
  "/ru/bronirovanie-podtverzhdeno",
]);

/** A pathname with no trailing slash; the site root stays `/`. */
export const canonicalPath = (path: string): string => path.replace(/\/+$/, "") || "/";

export const describe = (path: string, lang: SiteLang): string =>
  PAGES[canonicalPath(path)]?.description ?? FALLBACK[lang];

export const isNoIndex = (path: string): boolean => NOINDEX.has(canonicalPath(path));

/**
 * The same page in the other editions, for `hreflang`.
 *
 * Only real counterparts are listed. Russian has no Pinar del Río, and pointing
 * its `hreflang` at the Russian home — which is what the language switcher does
 * for a human — would tell Google two different pages are translations of each
 * other, which they are not.
 */
export const alternates = (path: string): { lang: SiteLang; href: string }[] => {
  const clean = canonicalPath(path);
  const group = TRANSLATIONS.find((g) =>
    Object.values(g).some((p) => canonicalPath(p) === clean)
  );
  if (!group) return [];
  return (Object.entries(group) as [SiteLang, string][]).map(([lang, href]) => ({ lang, href }));
};
