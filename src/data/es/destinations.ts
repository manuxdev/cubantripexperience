/**
 * Spanish destination-detail content, one entry per `reference/es/<slug>/spec.md`.
 *
 * The six destination specs are the same eight-section skeleton; only the copy and
 * the per-card geometry differ, so the geometry is data and the section structure
 * is a template constant in `src/pages/es/destinos/[slug].astro`.
 *
 * Geometry fields map 1:1 onto Elementor settings:
 *   textBasis/imageBasis   column `_inline_size`   (43.535/56.465, 44.949/55.051, 50/50)
 *   imageSpace(+Mobile)    image widget `space` / `space_mobile`
 *   imageMarginLeft        image widget `_margin` left  (0 at mobile on all six specs)
 *   imageCustomWidth       image widget `_element_custom_width` (+ `_element_width=initial`)
 *   imageAlignEnd          image column `align=flex-end`
 *
 * Images resolve through the same eager `import.meta.glob` used by the English
 * `src/data/pages/destination-details.ts`; a path key means two entries may point at
 * one asset, which the source does (`trinidad`'s main square is also its card photo).
 */
import type { ImageMetadata } from "@astrojs/image/dist/vite-plugin-astro-image";

const media = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/pages/*/*.webp",
  { eager: true }
);

/** Shared by the English and Russian editions, whose data files are generated. */
export const destinationImage = (dir: string, name: string): ImageMetadata =>
  media[`../../assets/pages/${dir}/${name}.webp`].default;

const image = destinationImage;

export type EsLandmark = {
  /** Literal `title`, source colon included. */
  title: string;
  /** Literal `editor` text, source typography included. */
  body: string;
  /**
   * The source renders the card body as bare text inside the text-editor
   * widget on 29 of the site's 30 cards. `pinar-del-rio`'s Viñales card is the
   * single exception: its body is wrapped in a `<p>`, whose `1.6em` bottom
   * margin counts toward the text column's height and makes that column — not
   * the image — drive the card height. Without the flag the column loses,
   * the text re-centres and the card renders ~5px short.
   */
  bodyParagraph?: boolean;
  image: ImageMetadata;
  alt: string;
  textBasis: number;
  imageBasis: number;
  imageSpace: number;
  imageSpaceMobile: number;
  imageMarginLeft?: number;
  imageCustomWidth?: number;
  /** `_element_custom_width_mobile`, a literal px value (unlike the desktop
   * `_element_custom_width`, which is a percent). Only present on three of
   * `cienfuegos`'s five cards; no other destination's Section 3 uses it. */
  imageCustomWidthMobile?: number;
  imageAlignEnd?: boolean;
  /**
   * Column `align_mobile=center`, which compiles to `justify-content: center`
   * on the widget wrap. Present only on `cienfuegos` and `santiago-de-cuba`'s
   * five card columns, and only visible where the widget is narrower than the
   * column (`_element_custom_width`). `spec.md` omits `align_mobile`, so this
   * comes from `elementor.json`.
   */
  columnAlignMobileCenter?: boolean;
  /**
   * Elementor's `space`/`space_mobile` compile to `max-width`, not `width` —
   * confirmed live (`getComputedStyle` on the source: `max-width: 72%`,
   * rendered box pinned to the served derivative's own pixel size). This is
   * invisible whenever the imported asset is large enough to get downscaled
   * to that cap anyway (every card except one). The one card whose source
   * `image_size` is a WordPress `medium` derivative (300x300, smaller than
   * the `space`-computed cap) needs its real served pixel size here so the
   * `<img>` attributes — not the larger locally-imported asset — drive the
   * intrinsic size the `max-width` cap measures against.
   */
  imageNativeWidth?: number;
  imageNativeHeight?: number;
};

/**
 * Section 4 adjacent-destination button. Authored per page and NOT derivable from
 * array order: `la-habana` points back to `matanzas` and forward to `trinidad`,
 * while `matanzas` points forward to `la-habana`. `santiago-de-cuba` has only a
 * `prev` and `pinar-del-rio` only a `next`, so the list is 1 or 2 entries.
 */
export type EsDestinationLink = {
  label: string;
  href: string;
  direction: "prev" | "next";
  /** `_margin_mobile` right (15px on five specs, 0 on `santiago-de-cuba`). */
  mobileMarginRight?: number;
  /** `_margin_mobile` left (10px on `santiago-de-cuba` only). */
  mobileMarginLeft?: number;
};

export type EsDestination = {
  slug: string;
  /** `<title>`; not part of `spec.md`, never measured by the pixel gate. */
  title: string;
  /** Section 1 heading, literal. */
  heroTitle: string;
  landmarks: EsLandmark[];
  /** Section 4 `content_width`; omitted = Elementor's 1140px boxed default. */
  navContentWidth?: number;
  /** Section 4 column `align`. */
  navAlign: "space-around" | "flex-start" | "flex-end";
  /**
   * Section 6 heading, authored per page: `la-habana` and `trinidad` say
   * "A TIEMPO Y AL LUGAR", the other four omit the "Y".
   */
  ctaTitle?: string;
  /** `EsFooter` copyright override; only `matanzas` differs. */
  footerCopyright?: string;
  /**
   * Section 6's mobile widths, authored per page and not derivable:
   * `_element_width_mobile` + `_element_custom_width_mobile` on the heading and
   * the button. `"auto"` is Elementor's `_element_width_mobile=auto` (shrink to
   * content, custom width ignored). Defaults are the four-page majority.
   */
  ctaTitleMobileWidth?: string;
  ctaButtonMobileWidth?: string;
  /**
   * Section 5's spacer `space`: 13px on four pages, 10px on `la-habana` and
   * `trinidad`. Three pixels, but it offsets everything below it — the CTA
   * strip, the footer and the yellow-van artwork all misregister without it.
   */
  section5Spacer?: number;
  links: EsDestinationLink[];
};

export const esDestinations: EsDestination[] = [
  {
    slug: "la-habana",
    section5Spacer: 10,
    ctaTitleMobileWidth: "237.297px",
    ctaButtonMobileWidth: "98.438px",
    ctaTitle: "TE LLEVAMOS A TIEMPO Y AL LUGAR CORRECTO",
    title: "La Habana | Cuban Trip Experience",
    heroTitle: "La Habana",
    navAlign: "space-around",
    landmarks: [
      {
        title: "La Habana Vieja:",
        body: "El centro histórico de la ciudad es uno de los lugares más visitados por los turistas debido a su impresionante arquitectura colonial, plazas, calles empedradas y edificios históricos como la Catedral de La Habana, el Castillo de la Real Fuerza y ​​la Plaza de Armas.",
        image: image("havana", "old-havana"),
        alt: "La Habana Vieja",
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 66,
        imageSpaceMobile: 97,
        imageMarginLeft: 50,
      },
      {
        title: "El Malecón:",
        body: "Esta avenida costera es un lugar popular para caminar y disfrutar de la vista del mar y la ciudad. Es especialmente popular por la noche, cuando se llena de gente que viene a disfrutar de la brisa marina y del ambiente relajado.",
        image: image("havana", "el-malecon"),
        alt: "El Malecón de La Habana",
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 71,
        imageSpaceMobile: 95,
        imageMarginLeft: 40,
        imageCustomWidth: 98.566,
        imageAlignEnd: true,
      },
      {
        title: "El Capitolio:",
        body: "Esta impresionante estructura fue construida en la década de 1920 y es uno de los edificios más emblemáticos de la ciudad. Hoy es la sede de la Academia de Ciencias de Cuba y es un lugar popular para tomar fotos y disfrutar de la arquitectura.",
        image: image("havana", "the-capitol"),
        alt: "El Capitolio de La Habana",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 71,
        imageSpaceMobile: 95,
      },
      {
        title: "El cementerio de Colón:",
        body: "Este cementerio es uno de los más grandes y antiguos de América Latina y cuenta con una gran cantidad de impresionantes tumbas y monumentos. Es un lugar popular para explorar la historia y la cultura de la ciudad.",
        image: image("havana", "the-colon-cemetery"),
        alt: "El cementerio de Colón",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 74,
        imageSpaceMobile: 95,
      },
      {
        title: "El Morro y La Cabaña:",
        body: "Estas dos fortalezas son estructuras impresionantes que datan de la época colonial. Son un lugar popular para disfrutar de vistas panorámicas de la ciudad y el mar, especialmente al atardecer.",
        image: image("havana", "el-morro-and-la-cabana"),
        alt: "El Morro y La Cabaña",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 74,
        imageSpaceMobile: 94,
      },
    ],
    links: [
      {
        label: "Matanzas",
        href: "/es/destinos/matanzas",
        direction: "prev",
        mobileMarginRight: 15,
      },
      {
        label: "Trinidad",
        href: "/es/destinos/trinidad",
        direction: "next",
        mobileMarginRight: 15,
      },
    ],
  },
  {
    slug: "trinidad",
    section5Spacer: 10,
    ctaTitleMobileWidth: "auto",
    ctaButtonMobileWidth: "auto",
    ctaTitle: "TE LLEVAMOS A TIEMPO Y AL LUGAR CORRECTO",
    title: "Trinidad | Cuban Trip Experience",
    heroTitle: "Trinidad",
    navAlign: "space-around",
    landmarks: [
      {
        title: "La Plaza Principal:",
        body: "Esta es la plaza principal de la ciudad y es uno de los lugares más emblemáticos de Trinidad. Aquí se encuentran algunos de los edificios coloniales más importantes de la ciudad, como el Palacio Brunet y la Torre Manaca-Iznaga.",
        image: image("trinidad", "the-main-square"),
        alt: "La Plaza Principal",
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 67,
        imageSpaceMobile: 100,
        imageMarginLeft: 50,
      },
      {
        title: "Valle de los Ingenios:",
        body: "Este valle es Patrimonio de la Humanidad por la UNESCO y es un lugar importante en la historia de la industria azucarera en Cuba. Los turistas pueden visitar las antiguas haciendas y los ingenios azucareros para conocer la historia de esta industria y disfrutar de la belleza natural de la zona.",
        image: image("trinidad", "valley-of-the-sugar-mills"),
        alt: "Valle de los Ingenios",
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 71,
        imageSpaceMobile: 100,
        imageMarginLeft: 40,
        imageCustomWidth: 98.566,
        imageAlignEnd: true,
      },
      {
        title: "Playa Ancón:",
        body: "Esta playa es una de las más populares de la región de Trinidad debido a su hermosa arena blanca y aguas cristalinas. Los turistas pueden disfrutar de actividades como esnórquel, buceo y pesca deportiva.",
        image: image("trinidad", "ancon-beach"),
        alt: "Playa Ancón",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 74,
        imageSpaceMobile: 100,
      },
      {
        title: "La Iglesia de la Santísima Trinidad:",
        body: "Esta iglesia es una de las más antiguas de Cuba y es conocida por su impresionante arquitectura y su altar de plata. Los visitantes pueden admirar la belleza de la iglesia y conocer su historia y su importancia en la vida religiosa de la ciudad.",
        image: image("trinidad", "the-church-of-the-holy-trinity"),
        alt: "La Iglesia de la Santísima Trinidad",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 75,
        imageSpaceMobile: 100,
      },
      {
        title: "El Museo Romántico:",
        body: "Este museo está ubicado en una casa colonial restaurada y cuenta la historia de la vida cotidiana de las familias ricas de la ciudad en el siglo XIX. Los visitantes pueden ver muebles, artículos personales y obras de arte de la época.",
        image: image("trinidad", "the-romantic-museum"),
        alt: "El Museo Romántico",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 75,
        imageSpaceMobile: 100,
      },
    ],
    links: [
      {
        label: "La Habana",
        href: "/es/destinos/la-habana",
        direction: "prev",
        mobileMarginRight: 15,
      },
      {
        label: "Cienfuegos",
        href: "/es/destinos/cienfuegos",
        direction: "next",
        mobileMarginRight: 15,
      },
    ],
  },
  {
    slug: "cienfuegos",
    title: "Cienfuegos | Cuban Trip Experience",
    heroTitle: "Cienfuegos",
    navContentWidth: 930,
    navAlign: "space-around",
    landmarks: [
      {
        title: "El Malecón:",
        body: "Este es un malecón popular y hermoso a lo largo de la costa de Cienfuegos. Es un lugar perfecto para caminar, disfrutar de la vista al mar y relajarse.",
        image: image("cienfuegos", "el-malecon"),
        alt: "El Malecón",
        columnAlignMobileCenter: true,
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 72,
        imageSpaceMobile: 100,
        // `image_size=medium` in the source; the served derivative is
        // 300x300 (confirmed via the live page's `<img>` attributes), well
        // under the `space`/`space_mobile` cap on every breakpoint.
        imageNativeWidth: 300,
        imageNativeHeight: 300,
      },
      {
        title: "El Teatro Thomas Terry:",
        body: "Este teatro es un impresionante edificio histórico que fue construido en el siglo XIX. Ofrece una amplia variedad de espectáculos de música y danza.",
        image: image("cienfuegos", "the-thomas-terry-theater"),
        alt: "El Teatro Thomas Terry",
        columnAlignMobileCenter: true,
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 60,
        imageSpaceMobile: 81,
        imageCustomWidth: 100,
        imageAlignEnd: true,
      },
      {
        title: "Catedral de la Purísima Concepción:",
        body: "Esta catedral es una impresionante estructura arquitectónica que data del siglo XIX. Es uno de los lugares más emblemáticos de Cienfuegos.",
        image: image("cienfuegos", "the-purest-conception-cathedral"),
        alt: "Catedral de la Purísima Concepción",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 77,
        imageSpaceMobile: 100,
        imageCustomWidth: 90,
        imageCustomWidthMobile: 300,
      },
      {
        title: "El Palacio del Valle:",
        body: "Este es un hermoso palacio construido en estilo morisco, con una decoración impresionante y una vista panorámica del océano.",
        image: image("cienfuegos", "the-valley-palace"),
        alt: "El Palacio del Valle",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 79,
        imageSpaceMobile: 100,
        imageCustomWidth: 89,
        imageCustomWidthMobile: 300,
      },
      {
        title: "El Nicho:",
        body: "El Nicho es un paraje natural en las montañas cerca de Cienfuegos, Cuba, conocido por sus hermosas cascadas y senderos naturales. Es un destino ideal para la observación de aves, senderismo, natación y para aquellos que quieran disfrutar de la belleza natural de la zona.",
        image: image("cienfuegos", "el-nicho"),
        alt: "El Nicho",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 75,
        imageSpaceMobile: 100,
        imageCustomWidth: 90,
        imageCustomWidthMobile: 300,
      },
    ],
    links: [
      {
        label: "Trinidad",
        href: "/es/destinos/trinidad",
        direction: "prev",
        mobileMarginRight: 15,
      },
      {
        label: "Santiago de Cuba",
        href: "/es/destinos/santiago-de-cuba",
        direction: "next",
        mobileMarginRight: 15,
      },
    ],
  },
  {
    slug: "matanzas",
    footerCopyright: "Todos los derechos Reservados.",
    title: "Matanzas | Cuban Trip Experience",
    heroTitle: "Matanzas",
    navContentWidth: 930,
    navAlign: "space-around",
    landmarks: [
      {
        title: "Teatro Sauto:",
        body: "Este teatro neoclásico fue construido a finales del siglo XIX y es considerado uno de los más bellos de Cuba. Ofrece una amplia variedad de espectáculos, desde ópera y ballet hasta conciertos y obras de teatro.",
        image: image("matanzas", "sauto-theater"),
        alt: "Teatro Sauto",
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 72,
        imageSpaceMobile: 100,
      },
      {
        title: "Parque de la libertad:",
        body: "Este parque es un lugar popular para relajarse y disfrutar de la naturaleza. Tiene una gran cantidad de árboles y zonas verdes, así como una fuente central. También es un lugar popular para eventos culturales y festivales.",
        image: image("matanzas", "liberty-park"),
        alt: "Parque de la libertad",
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 73,
        imageSpaceMobile: 100,
        imageCustomWidth: 98.566,
        imageAlignEnd: true,
      },
      {
        title: "Río Canímar:",
        body: "Este río serpentea a través de un hermoso paisaje natural y es ideal para excursiones en bote o kayak. Los visitantes pueden disfrutar de la belleza natural de la región y explorar las cuevas y cascadas cercanas.",
        image: image("matanzas", "canimar-river"),
        alt: "Río Canímar",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 82,
        imageSpaceMobile: 100,
      },
      {
        title: "Cueva de Saturno:",
        body: "Esta cueva subterránea tiene un lago de agua cristalina y es ideal para la práctica del buceo y el snorkel. Los visitantes pueden explorar las formaciones rocosas del lago y la rica vida marina.",
        image: image("matanzas", "saturn-cave"),
        alt: "Cueva de Saturno",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 82,
        imageSpaceMobile: 100,
      },
      {
        title: "Playa Varadero:",
        body: "La playa de Varadero es uno de los destinos turísticos más populares de Cuba. La playa cuenta con aguas cristalinas y arenas blancas, además de una gran cantidad de hoteles, restaurantes y actividades acuáticas.",
        image: image("matanzas", "varadero-beach"),
        alt: "Playa Varadero",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 82,
        imageSpaceMobile: 100,
      },
    ],
    links: [
      {
        label: "Pinar del Rio",
        href: "/es/destinos/pinar-del-rio",
        direction: "prev",
        mobileMarginRight: 15,
      },
      {
        label: "La Habana",
        href: "/es/destinos/la-habana",
        direction: "next",
        mobileMarginRight: 15,
      },
    ],
  },
  {
    slug: "santiago-de-cuba",
    ctaButtonMobileWidth: "33.701%",
    title: "Santiago de Cuba | Cuban Trip Experience",
    heroTitle: "Santiago de Cuba",
    navContentWidth: 930,
    navAlign: "flex-start",
    landmarks: [
      {
        title: "Catedral de Santiago de Cuba:",
        body: "Es una impresionante catedral ubicada en el centro de Santiago de Cuba. Es uno de los edificios más antiguos de la ciudad y es conocido por su impresionante arquitectura. Es un lugar popular para visitar y tomar fotografías.",
        image: image("santiago-cuba", "catedral-de-santiago-de-cuba"),
        alt: "Catedral de Santiago de Cuba",
        columnAlignMobileCenter: true,
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 63,
        imageSpaceMobile: 100,
      },
      {
        title: "La Gran Piedra:",
        body: "Es una enorme roca ubicada en lo alto de una montaña en la Sierra Maestra. Se puede llegar a la cima haciendo senderismo, y desde allí se tiene una vista panorámica impresionante de la región.",
        image: image("santiago-cuba", "the-great-stone"),
        alt: "La Gran Piedra",
        columnAlignMobileCenter: true,
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 66,
        imageSpaceMobile: 100,
        imageCustomWidth: 100,
        imageAlignEnd: true,
      },
      {
        title: "Castillo de San Pedro de la Roca del Morro:",
        body: "Es un antiguo castillo español ubicado en el puerto de Santiago de Cuba. Fue construido en el siglo XVII para proteger la ciudad de piratas y corsarios. Hoy es un museo que ofrece vistas panorámicas del puerto y de la ciudad.",
        image: image("santiago-cuba", "castillo-de-san-pedro-de-la-roca-del-morro"),
        alt: "Castillo de San Pedro de la Roca del Morro",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 64,
        imageSpaceMobile: 100,
        imageCustomWidth: 100,
      },
      {
        title: "Sierra Maestra:",
        body: "Es una cadena montañosa ubicada en el sureste de Cuba. Es conocido por su importancia histórica durante la Revolución Cubana, ya que fue el lugar donde Fidel Castro estableció su base de operaciones. Es un destino popular para los amantes de la naturaleza y la historia.",
        image: image("santiago-cuba", "sierra-maestra"),
        alt: "Sierra Maestra",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 67,
        imageSpaceMobile: 100,
      },
      {
        title: "El Salto del Caburni:",
        body: "Es una hermosa cascada ubicada en las montañas cercanas a Santiago de Cuba. Se puede llegar caminando por la selva tropical. Es una atracción popular para los amantes de la naturaleza y aquellos que buscan una aventura.",
        image: image("santiago-cuba", "el-salto-del-caburni"),
        alt: "El Salto del Caburni",
        columnAlignMobileCenter: true,
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 68,
        imageSpaceMobile: 100,
      },
    ],
    links: [
      {
        label: "Cienfuegos",
        href: "/es/destinos/cienfuegos",
        direction: "prev",
        mobileMarginLeft: 10,
      },
    ],
  },
  {
    slug: "pinar-del-rio",
    title: "Pinar del Rio | Cuban Trip Experience",
    heroTitle: "Pinar del Rio",
    navContentWidth: 930,
    navAlign: "flex-end",
    landmarks: [
      {
        title: "Viñales:",
        body: "Situada en un impresionante valle rodeado de mogotes, formaciones rocosas únicas, Viñales es uno de los destinos turísticos más destacados de la provincia. Los amantes de la naturaleza pueden explorar sus extensas plantaciones de tabaco y disfrutar de excursiones a las cuevas y mogotes cercanos.",
        bodyParagraph: true,
        image: image("pinar-del-rio", "vinales"),
        alt: "Viñales",
        textBasis: 43.535,
        imageBasis: 56.465,
        imageSpace: 72,
        imageSpaceMobile: 100,
      },
      {
        title: "Las Terrazas:",
        body: "Este proyecto ecológico y cultural es un remanso de paz situado en las montañas de Sierra del Rosario. Ofrece una experiencia única con senderos, cascadas, pozas naturales y una comunidad artística vibrante. Además, se promueve el turismo sostenible y la conservación del medio ambiente.",
        image: image("pinar-del-rio", "terrazas"),
        alt: "Las Terrazas",
        textBasis: 44.949,
        imageBasis: 55.051,
        imageSpace: 77,
        imageSpaceMobile: 100,
        imageCustomWidth: 98.566,
        imageAlignEnd: true,
      },
      {
        title: "Soroa:",
        body: "Conocida como \"el arcoíris de Cuba\", Soroa es famosa por sus exuberantes jardines y cascadas. El Jardín Botánico de Soroa alberga una impresionante colección de plantas tropicales y especies autóctonas. También es un excelente lugar para practicar senderismo y disfrutar de la naturaleza.",
        image: image("pinar-del-rio", "soroa"),
        alt: "Soroa",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 79,
        imageSpaceMobile: 100,
      },
      {
        title: "Cueva del Indio:",
        body: "Ubicada cerca de Viñales, la Cueva del Indio es una maravilla subterránea que ofrece un recorrido en barca a través de un río subterráneo. Los visitantes pueden explorar sus impresionantes formaciones rocosas y observar antiguos petroglifos, remanentes de la presencia aborigen.",
        image: image("pinar-del-rio", "indian-cave"),
        alt: "Cueva del Indio",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 79,
        imageSpaceMobile: 100,
      },
      {
        title: "Cayo Levisa:",
        body: "Este pequeño cayo paradisíaco se encuentra en la costa norte de Pinar del Río. Sus playas de arena blanca y aguas cristalinas hacen que sea el lugar perfecto para bucear, practicar esnórquel y relajarse bajo el sol caribeño. Es un paraíso natural que ofrece tranquilidad y una experiencia de playa inolvidable.",
        image: image("pinar-del-rio", "levisa-fell"),
        alt: "Cayo Levisa",
        textBasis: 50,
        imageBasis: 50,
        imageSpace: 79,
        imageSpaceMobile: 100,
      },
    ],
    links: [
      {
        label: "Matanzas",
        href: "/es/destinos/matanzas",
        direction: "next",
        mobileMarginRight: 15,
      },
    ],
  },
];
