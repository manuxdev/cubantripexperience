/**
 * Content for `/es/destinos`, one entry per source section pair.
 *
 * `reference/es/destinos/spec.md` Sections 7 to 17. Each destination is a
 * two-column Elementor section: a `media-carousel` and a heading/text/button
 * stack. The source authors each block twice at the markup level — the
 * text-first blocks carry a second carousel marked
 * `hide_desktop`+`hide_tablet` inside the text column, and their visible
 * carousel column carries `hide_mobile` — so exactly one carousel renders per
 * breakpoint. Both carry the same five photographs (the mobile copies of
 * `la-habana` and `cienfuegos` are the JPEG originals of the same shots), so
 * one carousel per block reproduces every breakpoint.
 *
 * Slides resolved by SHA-256 against `reference/es/_media/`, never by filename:
 * the English migration renamed these assets semantically. The five whose
 * digests differ are WordPress derivatives of the same attachment, matched
 * through their landmark titles in the destination-page specs.
 */
import type { ImageMetadata } from "@astrojs/image/dist/vite-plugin-astro-image";

const media = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/pages/*/*.webp",
  { eager: true }
);

/** Shared by the English and Russian editions, whose data files are generated. */
export const blockImage = (dir: string, name: string): ImageMetadata =>
  media[`../../assets/pages/${dir}/${name}.webp`].default;

const image = blockImage;

export type EsDestinationBlock = {
  title: string;
  body: string;
  /** Literal button label: `pinar-del-rio` alone says "See More". */
  buttonText: string;
  /**
   * `pinar-del-rio` is the one block whose copy the source wraps in a `<p>`;
   * its 1.6em bottom margin escapes the widget container and adds 23.35px to
   * the widget. `.es-copy` is `flow-root`, so the margin stays inside and the
   * measured height matches.
   */
  bodyParagraph?: boolean;
  href: string;
  slides: { image: ImageMetadata; alt: string }[];
  /**
   * `true` when the source puts the text column first (Sections 7, 11, 15).
   * At mobile every block stacks carousel-first regardless.
   */
  textFirst: boolean;
  /** Column `_inline_size`. */
  textBasis: number;
  mediaBasis: number;
  /** `_inline_size_tablet`, authored on `matanzas` only. */
  tabletBasis?: number;
  /**
   * `widget:button` `_margin`. Only `pinar-del-rio` pulls its button up by
   * 30px; the other five sit at their natural offset.
   */
  buttonMarginTop?: number;
  /** `_margin_mobile` top; several blocks pull the button up 10px there only. */
  buttonMarginTopMobile?: number;
};

export const esDestinationBlocks: EsDestinationBlock[] = [
  {
    title: "Pinar del Río",
    body: "Ubicada en el extremo occidental de la isla de Cuba, la provincia de Pinar del Río es una joya que combina la riqueza de su entorno natural con una historia fascinante que se remonta a siglos atrás. Conocida como la cuna del mejor tabaco del mundo, esta región ofrece a sus visitantes un paisaje de belleza única y un ambiente auténtico que los enamora desde el primer momento.",
    buttonText: "See More",
    bodyParagraph: true,
    href: "/es/destinos/pinar-del-rio",
    textFirst: true,
    textBasis: 51.316,
    mediaBasis: 48.641,
    buttonMarginTop: -30,
    slides: [
      { image: image("pinar-del-rio", "terrazas"), alt: "Terrazas, Pinar del Rio Cuba" },
      { image: image("pinar-del-rio", "soroa"), alt: "Soroa, Pinar del Rio Cuba" },
      { image: image("pinar-del-rio", "indian-cave"), alt: "Indian Cave, Pinar del Rio Cuba" },
      { image: image("pinar-del-rio", "levisa-fell"), alt: "Cayo Levisa, Pinar del Rio Cuba." },
      { image: image("pinar-del-rio", "vinales"), alt: "Viñales Valley, Pinar del Rio Cuba" },
    ],
  },
  {
    title: "Matanzas",
    body: 'Es una ciudad ubicada en la costa norte de Cuba, fundada en 1693. Durante la época colonial española, Matanzas se convirtió en un importante centro económico gracias a la producción de azúcar y el comercio marítimo. La ciudad fue también un importante centro cultural y literario en el siglo XIX, conocida como "La Atenas de Cuba". Hoy, Matanzas es un popular destino turístico gracias a su arquitectura colonial, su rica vida cultural y su cercanía a hermosas playas.',
    buttonText: "Ver más",
    href: "/es/destinos/matanzas",
    textFirst: false,
    textBasis: 53.598,
    mediaBasis: 46.402,
    tabletBasis: 50,
    slides: [
      { image: image("matanzas", "canimar-river"), alt: "Canimar River, Matanzas Cuba" },
      { image: image("matanzas", "varadero-beach"), alt: "Varadero Beach, Matanzas Cuba" },
      { image: image("matanzas", "sauto-theater"), alt: "Sauto Theater, Matanzas Cuba" },
      { image: image("matanzas", "saturn-cave"), alt: "Saturn Cave, Matanzas Cuba" },
      { image: image("matanzas", "liberty-park"), alt: "Liberty Park, Matanzas Cuba" },
    ],
  },
  {
    title: "La Habana",
    body: "La Habana es la capital de Cuba y una de las ciudades más antiguas de América. Fue fundada en 1519 por los españoles y se convirtió en un importante centro comercial y militar durante la época colonial. En el siglo XX, La Habana se convirtió en un centro cultural y político de la región, y fue escenario de importantes acontecimientos como la Revolución Cubana en 1959. La ciudad cuenta con una rica arquitectura colonial española, así como importantes monumentos históricos como El Malecón, La Plaza de la Revolución y El Castillo del Morro.",
    buttonText: "Ver más",
    href: "/es/destinos/la-habana",
    textFirst: true,
    textBasis: 51.316,
    mediaBasis: 48.641,
    slides: [
      { image: image("havana", "old-havana"), alt: "Old Havana, Havana Cuba" },
      { image: image("havana", "el-malecon"), alt: "El Malecon, Havana Cuba" },
      { image: image("havana", "the-capitol"), alt: "The Capitol, Havana Cuba" },
      {
        image: image("havana", "the-colon-cemetery"), alt: "The Cristobal Colon Cementery of Havana, Havana Cuba",
      },
      {
        image: image("havana", "el-morro-and-la-cabana"), alt: "El Morro and La Cabaña, Havana Cuba",
      },
    ],
  },
  {
    title: "Trinidad",
    body: "Trinidad es una ciudad colonial ubicada en la costa sur de Cuba, fundada en 1514. Durante la época colonial, la ciudad se convirtió en un importante centro de producción de azúcar y esclavitud, y tiene muchas casas coloniales y museos bien conservados que muestran la historia de la ciudad. Hoy, Trinidad es un popular destino turístico debido a su arquitectura colonial, sus playas cercanas y su animada vida cultural.",
    buttonText: "Ver más",
    href: "/es/destinos/trinidad",
    textFirst: false,
    textBasis: 51.14,
    mediaBasis: 48.86,
    slides: [
      {
        image: image("trinidad", "valley-of-the-sugar-mills"), alt: "Valley of the Sugar Mills, Trinidad Cuba",
      },
      {
        image: image("trinidad", "the-romantic-museum"), alt: "The Romantic Museum, Trinidad Cuba",
      },
      {
        image: image("trinidad", "the-church-of-the-holy-trinity"), alt: "The Holy Trinity Church, Trinidad Cuba",
      },
      { image: image("trinidad", "ancon-beach"), alt: "Beach Ancon, Trinidad Cuba" },
      { image: image("trinidad", "the-main-square"), alt: "The Main Square, Trinidad Cuba" },
    ],
  },
  {
    title: "Cienfuegos",
    body: "Cienfuegos es una ciudad en la costa sur de Cuba, fundada en 1819 por colonos franceses. Durante los siglos XIX y XX se convirtió en un importante puerto comercial e industrial gracias a la producción de azúcar. La ciudad es famosa por su arquitectura neoclásica, su rica historia cultural, su carnaval anual y sus playas cercanas. Hoy en día, es un popular destino turístico en Cuba, atractivo por su patrimonio cultural y belleza natural.",
    buttonText: "Ver más",
    href: "/es/destinos/cienfuegos",
    textFirst: true,
    textBasis: 51.316,
    mediaBasis: 48.641,
    slides: [
      { image: image("destinations", "cienfuegos"), alt: "Cienfuegos Cuba" },
      {
        image: image("cienfuegos", "el-malecon"), alt: "El Malecon, Cienfuegos Cuba",
      },
      { image: image("cienfuegos", "el-nicho"), alt: "El Nicho, Cienfuegos Cuba" },
    ],
  },
  {
    title: "Santiago de Cuba",
    body: "Santiago de Cuba es la segunda ciudad más grande de Cuba, ubicada en la costa este de la isla. Fue fundada en 1515 por los españoles y se convirtió en un importante centro económico y militar durante la época colonial. La ciudad es conocida por su música, carnaval e importancia histórica en la lucha por la independencia de Cuba. Santiago cuenta con varios monumentos históricos, como El Castillo del Morro, el Cementerio Santa Ifigenia y el Cuartel Moncada, donde se inició la Revolución Cubana.",
    buttonText: "Ver más",
    href: "/es/destinos/santiago-de-cuba",
    textFirst: false,
    textBasis: 51.14,
    mediaBasis: 48.86,
    slides: [
      { image: image("santiago-cuba", "sierra-maestra"), alt: "Sierra Maestra, Santiago de Cuba" },
      { image: image("santiago-cuba", "the-great-stone"), alt: "The Great Stone, Santiago de Cuba" },
      {
        image: image("santiago-cuba", "el-salto-del-caburni"), alt: "Cascada, Santiago de Cuba",
      },
      {
        image: image("santiago-cuba", "castillo-de-san-pedro-de-la-roca-del-morro"), alt: "EL Morro de Santiago, Santiago de Cuba",
      },
      {
        image: image("santiago-cuba", "catedral-de-santiago-de-cuba"), alt: "Santiago de Cuba",
      },
    ],
  },
];
