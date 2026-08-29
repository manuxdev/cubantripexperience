/**
 * Content for `/es/` (Inicio), from `reference/es/inicio/spec.md`.
 *
 * Only the repeated structures live here — the three feature cards (Section 6),
 * the six destination slides (Section 14) and the three reviews (Section 17).
 * Everything else on the page is a one-off and stays in the page itself.
 *
 * Images resolved by SHA-256 against `reference/es/_media/`, never by filename.
 */
import type { ImageMetadata } from "@astrojs/image/dist/vite-plugin-astro-image";

/** Font Awesome 5 paths — the source authors `far fa-star`, `fas fa-map-signs`
 *  and `fas fa-dna`, all at `#F8F43D`. FA5 metrics, not FA6. */
export const FEATURE_ICONS = {
  star: {
    viewBox: "0 0 576 512",
    path: "M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z",
  },
  mapSigns: {
    viewBox: "0 0 576 512",
    path: "M507.31 84.69L464 41.37c-6-6-14.14-9.37-22.63-9.37H288V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v16H24C10.75 32 0 42.75 0 56v80c0 13.25 10.75 24 24 24h200v96h153.37c8.49 0 16.62-3.37 22.63-9.37l43.31-43.31c6.25-6.26 6.25-16.38 0-22.63zM224 128H48V64h176v64zm328 160H288v-32h-64v32H70.63c-8.49 0-16.62 3.37-22.63 9.37L4.69 340.69c-6.25 6.25-6.25 16.38 0 22.63L48 406.63c6 6 14.14 9.37 22.63 9.37H224v80c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-80h264c13.25 0 24-10.75 24-24v-80c0-13.25-10.75-24-24-24zm-24 96H288v-64h240v64z",
  },
  dna: {
    viewBox: "0 0 512 512",
    path: "M.1 494.1c-1.1 9.5 6.3 17.8 15.9 17.8h32.3c8.1 0 15-6.1 15.9-14.2.5-4.1 1.2-9.4 2.2-15.7h291.7c1 6.3 1.7 11.6 2.2 15.7 1 8.1 7.8 14.2 15.9 14.2h32.3c9.6 0 17-8.3 15.9-17.8-4.6-39.7-23.2-77.7-55.4-113.2-.5-.6-1.1-1.2-1.7-1.8-35.2-38.4-57.5-73.5-57.5-108.9 0-35.4 22.3-70.5 57.5-108.9.6-.6 1.2-1.2 1.7-1.8 32.2-35.5 50.8-73.5 55.4-113.2 1.1-9.5-6.3-17.8-15.9-17.8h-32.3c-8.1 0-15 6.1-15.9 14.2-.5 4.1-1.2 9.4-2.2 15.7H66.4c-1-6.3-1.7-11.6-2.2-15.7C63.2 20.6 56.4 14.5 48.3 14.5H16c-9.6 0-17 8.3-15.9 17.8 4.6 39.7 23.2 77.7 55.4 113.2.5.6 1.1 1.2 1.7 1.8 35.2 38.4 57.5 73.5 57.5 108.9 0 35.4-22.3 70.5-57.5 108.9-.6.6-1.2 1.2-1.7 1.8C23.3 416.4 4.7 454.4.1 494.1zM357.7 80c-2.8 10.1-6.6 20.7-11.5 32H165.8c-4.9-11.3-8.7-21.9-11.5-32h203.4zM256 208c-19.6-14.5-38-30.3-53.4-48h106.9c-15.5 17.7-33.9 33.5-53.5 48zm-90.2 192c2.8-10.1 6.6-20.7 11.5-32h180.4c4.9 11.3 8.7 21.9 11.5 32H165.8zm37.2-80c15.5-17.7 33.9-33.5 53.5-48 19.6 14.5 38 30.3 53.4 48H203z",
  },
} as const;

export type EsFeature = {
  icon: keyof typeof FEATURE_ICONS;
  title: string;
  body: string;
  /** Column `_inline_size` / `_inline_size_tablet`. */
  basis: number;
  tabletBasis: number;
  /** Image-box `_element_custom_width`; absent means Elementor's full width. */
  customWidth?: number;
};

export const esFeatures: EsFeature[] = [
  {
    icon: "star",
    title: "Viaje de Calidad",
    body: "Contamos con numerosos años de experiencia, dominio de idiomas y conocimiento de las mejores rutas, ofreciendo así una experiencia única.",
    basis: 34.522,
    tabletBasis: 33,
  },
  {
    icon: "mapSigns",
    title: "Cobertura Nacional",
    body: "Encuentra con nostros la posibilidad de llegar a cualquier rincón del país, brindándole un servicio confiable y cómodo para sus recorridos a lo largo y ancho de la nación.",
    basis: 33.269,
    tabletBasis: 32,
    customWidth: 101.74,
  },
  {
    icon: "dna",
    title: "Esencia Cubana",
    body: "Conoce la verdadera esencia de Cuba. Nuestros conductores te sumergirán en la cultura, las tradiciones y la calidez del pueblo cubano, asegurando una vivencia auténtica y enriquecedora en cada trayecto.",
    basis: 31.453,
    tabletBasis: 33,
    customWidth: 100,
  },
];

export type EsHomeSlide = {
  heading: string;
  description: string;
  href: string;
  /** `background_overlay_color`; two of the six use `#0000005C`, four `#00000052`. */
  overlay: string;
  image: string;
  alt: string;
};

/** Section 14 `widget:slides`, in source order. Backgrounds live in `public/home/`
 *  because they are CSS backgrounds, not `<img>` — the same as the source. */
export const esHomeSlides: EsHomeSlide[] = [
  {
    heading: "Pinar del Río",
    description:
      "Tabaco, mogotes, playas. Naturaleza exuberante, Patrimonio de la Humanidad, autenticidad caribeña, cultura fascinante.",
    href: "/es/destinos/pinar-del-rio",
    overlay: "#00000052",
    image: "/home/pinar-del-rio.webp",
    alt: "Valle de Viñales, Pinar del Río",
  },
  {
    heading: "Matanzas",
    description:
      "Playas espectaculares, clima cálido, variadas actividades turísticas y gran hospitalidad.",
    href: "/es/destinos/matanzas",
    overlay: "#0000005C",
    image: "/home/matanzas.webp",
    alt: "Matanzas",
  },
  {
    heading: "La Habana",
    description:
      "Capital de Cuba, historia colonial, arquitectura icónica, cultura vibrante, música y playas cautivadoras.",
    href: "/es/destinos/la-habana",
    overlay: "#0000005C",
    image: "/home/la-habana.webp",
    alt: "La Habana",
  },
  {
    heading: "Trinidad",
    description:
      "Arquitectura colonial, música tradicional, hermosas playas y parques naturales.",
    href: "/es/destinos/trinidad",
    overlay: "#00000052",
    image: "/home/trinidad.webp",
    alt: "Trinidad",
  },
  {
    heading: "Cienfuegos",
    description:
      "Ciudad cubana con arquitectura colonial, bahía y cultura rica. Perla del Sur, Patrimonio de la Humanidad.",
    href: "/es/destinos/cienfuegos",
    overlay: "#00000052",
    image: "/home/cienfuegos.webp",
    alt: "Cienfuegos",
  },
  {
    heading: "Santiago de Cuba",
    description:
      "Ciudad vibrante y histórica. Riqueza musical, arquitectura colonial y cuna de la revolución cubana.",
    href: "/es/destinos/santiago-de-cuba",
    overlay: "#00000052",
    image: "/home/santiago-de-cuba.webp",
    alt: "Santiago de Cuba",
  },
];

export type EsReview = {
  name: string;
  handle?: string;
  rating: number;
  content: string;
};

/** Section 17 `widget:reviews`. Every avatar is Elementor's own
 *  `placeholder.png` in the source — no real photographs were uploaded. */
export const esReviews: EsReview[] = [
  { name: "Manuel Pantoja", rating: 4, content: "Muy buen servicio." },
  {
    name: "John Doe",
    handle: "@johndoe",
    rating: 4.5,
    content:
      "The service was exceptional: quick, friendly, and efficient. Very satisfied with the overall experience!",
  },
  {
    name: "Sarah Smith",
    handle: "@sarah",
    rating: 3.8,
    content:
      "I had an amazing experience with their team! Outstanding service, prompt responses, and exceeded my expectations. Highly recommended!",
  },
];

export const TRUSTPILOT_URL =
  "https://www.trustpilot.com/review/cubantripexperience.com";

export type EsHomeImages = Record<string, ImageMetadata>;
