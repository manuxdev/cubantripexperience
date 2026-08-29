/**
 * Home-page copy for the three editions, read out of each page's Elementor JSON
 * by `reference/tools/gen-home.py`. Leading whitespace is the source's own.
 */
import type { SiteLang } from "../i18n/site";

/** An Elementor spacer as authored; `null` where the section has none. */
export type Spacer = { desktop: number | null; mobile: number | null; hideMobile: boolean } | null;

export type HomeContent = {
  title: string;
  hero: string;
  /** Two paragraphs, each a 1px line box in the source. */
  heroLines: string[];
  vanHeading: string;
  /** The mobile-only and desktop-only van blocks author different copy. */
  vanBodyMobile: string;
  vanBodyDesktop: string;
  vanButton: string;
  whyHeading: string;
  whyBody: string;
  features: { title: string; body: string }[];
  discoverHeading: string;
  discoverBody: string;
  bandHeading: string;
  bandBody: string;
  testimonialsHeading: string;
  layout: {
    heroSpacer: Spacer;
    vanMobileSpacer: Spacer;
    whySpacer: Spacer;
    gapSpacer: Spacer;
    gapEmpty: boolean;
    bandSpacer: Spacer;
    vanDesktopSpacer: Spacer;
    afterVanSpacer: Spacer;
    beforeBandSpacer: Spacer;
    lastSpacer: Spacer;
    vanMobileBg: { width: number; x: number; y: number };
    featureBasis: number[];
    featureBasisTablet: number[];
    vanDesktopButtonMarginTop: number;
    vanMobileButtonMarginTop: number;
    bookingMarginTopMobile: number;
    bookingWidthMobile: number | null;
    bandMarginBottom: number;
    slidesMargin: number;
    slidesMarginMobile: number;
    bandHeight: number | null;
    bandHeightTablet: number | null;
    emptyMobileSection: boolean;
    blueBandHiddenOnMobile: boolean;
  };
  slides: { heading: string; description: string; button: string; overlay: string; image: string; href: string }[];
};

export const HOME: Record<SiteLang, HomeContent> = {
  es: {
    "title": "Inicio | Cuban Trip Experience",
    "hero": "Cuban Trip Experience",
    "heroLines": [
      "Descubre la belleza de Cuba con nuestro servicio de taxi.",
      "Recorre la isla con comodidad y seguridad."
    ],
    "vanHeading": "Cualquier tamaño de grupo, cualquier distancia.",
    "vanBodyMobile": "No importa el tamaño de su grupo o la<br> distancia que necesitas recorrer,<br> nuestros taxis están listos para<br> recogerte donde necesitas<br> ir. Desde viajes cortos<br> a tiempo tenemos<br> una variedad de <br>vehículos para <br>adaptarse a su <br>necesidades.",
    "vanBodyDesktop": "<p>No importa el tamaño de su grupo o la distancia que necesitas recorrer, nuestros taxis están listos para llevarte a donde necesites ir. Desde viajes cortos a viajes largos, tenemos una variedad de vehículos para adaptarse a sus necesidades.</p>",
    "vanButton": "Ver Servicios",
    "whyHeading": "¿Por qué somos los mejores?",
    "whyBody": "<p>Destacamos por nuestra puntualidad, seguridad y comodidad. Nuestros conductores altamente capacitados ofrecen un trato amable y respetuoso. Además, contamos con una flota variada y bien mantenida, y nos esforzamos por superar las expectativas de nuestros clientes en cada viaje.</p>",
    "features": [
      {
        "title": "Viaje de Calidad",
        "body": "Contamos con numerosos años de experiencia, dominio de idiomas y conocimiento de las mejores rutas, ofreciendo así una experiencia única."
      },
      {
        "title": "Cobertura Nacional",
        "body": "Encuentra con nostros la posibilidad de llegar a cualquier rincón del país, brindándole un servicio confiable y cómodo para sus recorridos a lo largo y ancho de la nación."
      },
      {
        "title": "Esencia Cubana",
        "body": "Conoce la verdadera esencia de Cuba. Nuestros conductores te sumergirán en la cultura, las tradiciones y la calidez del pueblo cubano, asegurando una vivencia auténtica y enriquecedora en cada trayecto."
      }
    ],
    "discoverHeading": "\nDescubre el mejor destino para tus vacaciones.",
    "discoverBody": "Cuba es un país lleno de maravillas naturales, culturales e históricas. Sus playas de aguas cristalinas, montañas, ciudades coloniales, música y danza la han convertido en uno de los destinos turísticos más populares del Caribe.\n\n&nbsp;",
    "bandHeading": "Los mejores lugares para visitar",
    "bandBody": "Los mejores lugares para visitar y pasar unas agradables vacaciones en Cuba",
    "testimonialsHeading": "Testimonios de nuestros clientes:",
    "layout": {
      "heroSpacer": {
        "desktop": 10,
        "mobile": 30,
        "hideMobile": false
      },
      "vanMobileSpacer": {
        "desktop": null,
        "mobile": 72,
        "hideMobile": false
      },
      "whySpacer": {
        "desktop": 33,
        "mobile": 10,
        "hideMobile": true
      },
      "gapSpacer": null,
      "gapEmpty": true,
      "bandSpacer": {
        "desktop": 38,
        "mobile": 20,
        "hideMobile": false
      },
      "vanDesktopSpacer": {
        "desktop": null,
        "mobile": 108,
        "hideMobile": false
      },
      "afterVanSpacer": {
        "desktop": 54,
        "mobile": 10,
        "hideMobile": false
      },
      "beforeBandSpacer": {
        "desktop": null,
        "mobile": 15,
        "hideMobile": false
      },
      "lastSpacer": {
        "desktop": null,
        "mobile": null,
        "hideMobile": false
      },
      "vanMobileBg": {
        "width": 806,
        "x": 2,
        "y": -50
      },
      "featureBasis": [
        34.522,
        33.269,
        31.453
      ],
      "featureBasisTablet": [
        33,
        32,
        33
      ],
      "vanDesktopButtonMarginTop": 10,
      "vanMobileButtonMarginTop": 10,
      "bookingMarginTopMobile": -10,
      "bookingWidthMobile": 83,
      "bandMarginBottom": 0,
      "slidesMargin": -200,
      "slidesMarginMobile": -190,
      "bandHeight": 296,
      "bandHeightTablet": 354,
      "emptyMobileSection": true,
      "blueBandHiddenOnMobile": false
    },
    "slides": [
      {
        "heading": "Pinar del Río",
        "description": "Tabaco, mogotes, playas. Naturaleza exuberante, Patrimonio de la Humanidad, autenticidad caribeña, cultura fascinante.",
        "button": "Ver más >",
        "overlay": "#00000052",
        "image": "/home/pinar-del-rio.webp",
        "href": "/es/destinos/pinar-del-rio"
      },
      {
        "heading": "Matanzas",
        "description": "Playas espectaculares, clima cálido, variadas actividades turísticas y gran hospitalidad.",
        "button": "Ver más >",
        "overlay": "#0000005C",
        "image": "/home/matanzas.webp",
        "href": "/es/destinos/matanzas"
      },
      {
        "heading": "La Habana",
        "description": "Capital de Cuba, historia colonial, arquitectura icónica, cultura vibrante, música y playas cautivadoras.",
        "button": "Ver más >",
        "overlay": "#0000005C",
        "image": "/home/la-habana.webp",
        "href": "/es/destinos/la-habana"
      },
      {
        "heading": "Trinidad",
        "description": "Arquitectura colonial, música tradicional, hermosas playas y parques naturales.",
        "button": "Ver más >",
        "overlay": "#00000052",
        "image": "/home/trinidad.webp",
        "href": "/es/destinos/trinidad"
      },
      {
        "heading": "Cienfuegos",
        "description": "Ciudad cubana con arquitectura colonial, bahía y cultura rica. Perla del Sur, Patrimonio de la Humanidad.",
        "button": "Ver más >",
        "overlay": "#00000052",
        "image": "/home/cienfuegos.webp",
        "href": "/es/destinos/cienfuegos"
      },
      {
        "heading": "Santiago de Cuba",
        "description": "Ciudad vibrante y histórica. Riqueza musical, arquitectura colonial y cuna de la revolución cubana.",
        "button": "Ver más >",
        "overlay": "#00000052",
        "image": "/home/santiago-de-cuba.webp",
        "href": "/es/destinos/santiago-de-cuba"
      }
    ]
  },
  en: {
    "title": "Home | Cuban Trip Experience",
    "hero": "Cuban Trip Experience",
    "heroLines": [
      "Discover the beauty of Cuba with our taxi service.",
      "Tour the island with comfort and safety."
    ],
    "vanHeading": "Any Group Size, Any Distance.",
    "vanBodyMobile": "<p>No matter the size of your group or<br />the distance you need to travel,<br />our taxis are ready to take<br />you where you need to<br />go. From short trips to<br />long we have a variety of<br />vehicles to adapt<br />to your needs.</p>",
    "vanBodyDesktop": "<p>No matter the size of your group or <br />the distance you need to travel, <br />our taxis are ready to take <br />you where you need to<br />go. From short trips to<br />long we have a variety of <br />vehicles to adapt to your <br />needs.</p>",
    "vanButton": "View Services",
    "whyHeading": "WHY ARE WE THE BEST?",
    "whyBody": "We stand out for our punctuality, safety and comfort. Our highly trained drivers offer a friendly and respectful treatment. In addition, we have a modern and well-maintained fleet, and we strive to exceed our customers' expectations on every trip.",
    "features": [
      {
        "title": " Quality Trip",
        "body": "We have many years of experience, command of languages ​​and knowledge of the best routes, thus offering a unique experience."
      },
      {
        "title": " National Coverage",
        "body": "\nFind with us the possibility of reaching any corner of the country, providing a reliable and comfortable service for your journeys throughout the nation."
      },
      {
        "title": " Cuban Essence",
        "body": "Get to know the true essence of Cuba. Our drivers will immerse you in the culture, traditions and warmth of the Cuban people, ensuring an authentic and enriching experience on each journey."
      }
    ],
    "discoverHeading": "Discover the best destination for your holiday",
    "discoverBody": "<p>Cuba is a country full of natural, cultural and historical wonders. Its beaches with crystalline waters, mountains, colonial cities, music and dance have made it one of the most popular tourist destinations in the Caribbean.<p>",
    "bandHeading": "\nBest Places to Visit",
    "bandBody": "<p>Best places to visit and spend a pleasant vacation in Cuba</p>",
    "testimonialsHeading": "\nTestimonials from our clients:",
    "layout": {
      "heroSpacer": {
        "desktop": 10,
        "mobile": 30,
        "hideMobile": false
      },
      "vanMobileSpacer": {
        "desktop": null,
        "mobile": 150,
        "hideMobile": false
      },
      "whySpacer": {
        "desktop": 30,
        "mobile": null,
        "hideMobile": false
      },
      "gapSpacer": null,
      "gapEmpty": false,
      "bandSpacer": {
        "desktop": 45,
        "mobile": null,
        "hideMobile": false
      },
      "vanDesktopSpacer": {
        "desktop": null,
        "mobile": 108,
        "hideMobile": false
      },
      "afterVanSpacer": {
        "desktop": 81,
        "mobile": 10,
        "hideMobile": false
      },
      "beforeBandSpacer": {
        "desktop": null,
        "mobile": 24,
        "hideMobile": false
      },
      "lastSpacer": {
        "desktop": null,
        "mobile": null,
        "hideMobile": false
      },
      "vanMobileBg": {
        "width": 930,
        "x": -35,
        "y": -25
      },
      "featureBasis": [
        34,
        34.331,
        31.331
      ],
      "featureBasisTablet": [
        34,
        34.331,
        31.331
      ],
      "vanDesktopButtonMarginTop": 0,
      "vanMobileButtonMarginTop": 0,
      "bookingMarginTopMobile": -30,
      "bookingWidthMobile": 68,
      "bandMarginBottom": -30,
      "slidesMargin": -130,
      "slidesMarginMobile": -230,
      "bandHeight": 218,
      "bandHeightTablet": 354,
      "emptyMobileSection": false,
      "blueBandHiddenOnMobile": true
    },
    "slides": [
      {
        "heading": "Pinar del Río",
        "description": "Tobacco, mogotes, beaches. Exuberant nature, World Heritage Site, Caribbean authenticity, fascinating culture.",
        "button": "See More >",
        "overlay": "#00000052",
        "image": "/home/pinar-del-rio.webp",
        "href": "/destinations/pinar-del-rio"
      },
      {
        "heading": "Matanzas",
        "description": "Spectacular beaches, warm weather, varied tourist activities and great hospitality.",
        "button": "See More >",
        "overlay": "#0000005C",
        "image": "/home/matanzas.webp",
        "href": "/destinations/matanzas"
      },
      {
        "heading": "Havana",
        "description": "Capital of Cuba, colonial history, iconic architecture, vibrant culture, music and captivating beaches.",
        "button": "See More >",
        "overlay": "#0000005C",
        "image": "/home/la-habana.webp",
        "href": "/destinations/havana"
      },
      {
        "heading": "Trinidad",
        "description": "Colonial architecture, traditional music, beautiful beaches and natural parks.",
        "button": "See More >",
        "overlay": "#00000052",
        "image": "/home/trinidad.webp",
        "href": "/destinations/trinidad"
      },
      {
        "heading": "Cienfuegos",
        "description": "Cuban city with colonial architecture, bay and rich culture. Pearl of the South, World Heritage Site.",
        "button": "See More >",
        "overlay": "#00000052",
        "image": "/home/cienfuegos.webp",
        "href": "/destinations/cienfuegos"
      },
      {
        "heading": "Santiago de Cuba",
        "description": "Vibrant and historic city. Musical richness, colonial architecture and cradle of the Cuban revolution.",
        "button": "See More >",
        "overlay": "#00000052",
        "image": "/home/santiago-de-cuba.webp",
        "href": "/destinations/santiago-cuba"
      }
    ]
  },
  ru: {
    "title": "Главная | Cuban Trip Experience",
    "hero": "Cuban Trip Experience",
    "heroLines": [
      "Откройте для себя красоту Кубы с нашей службой такси",
      ".Путешествуйте по острову с комфортом и безопасностью."
    ],
    "vanHeading": "Любой размер группы, любое расстояние.",
    "vanBodyMobile": "Независимо от размера вашей группы или расстояния, которое вам нужно преодолеть,<br> наши такси готовы отвезти вас туда, куда <br>вам нужно. От коротких поездок до<br> длительных поездок, у нас есть <br> различные транспортные<br> средства в <br>соответствии<br> с вашими<br> потребностями.",
    "vanBodyDesktop": "Независимо от размера вашей группы или расстояния, которое вам нужно преодолеть, наши такси готовы отвезти вас туда, куда вам нужно. От коротких поездок до длительных поездок, у нас есть различные транспортные средства в соответствии с вашими потребностями.",
    "vanButton": " Просмотр услуг",
    "whyHeading": "ПОЧЕМУ МЫ ЛУЧШИЕ?",
    "whyBody": "Нас отличает пунктуальность, безопасность и комфорт. Наши высококвалифицированные водители предлагают дружелюбное и уважительное отношение. Кроме того, у нас есть разнообразный и ухоженный флот, и мы стремимся превзойти ожидания наших клиентов в каждой поездке.",
    "features": [
      {
        "title": " Качественная поездка",
        "body": "У нас есть многолетний опыт, владение языками и знание лучших маршрутов, поэтому мы предлагаем уникальный опыт."
      },
      {
        "title": " Национальное покрытие",
        "body": "Найдите с нами возможность добраться до любого уголка страны, предоставляя надежный и удобный сервис для ваших поездок по всей стране."
      },
      {
        "title": " кубинская эссенция",
        "body": "Познайте истинную сущность Кубы. Наши водители познакомят вас с культурой, традициями и теплотой кубинского народа, обеспечивая подлинный и обогащающий опыт в каждой поездке."
      }
    ],
    "discoverHeading": "\nОткройте для себя лучшее место для вашего отдыха",
    "discoverBody": "Куба – страна, полная природных, культурных и исторических чудес. Его пляжи с кристально чистой водой, горы, колониальные города, музыка и танцы сделали его одним из самых популярных туристических направлений на Карибах.",
    "bandHeading": "\n\nЛучшие места для посещения",
    "bandBody": "Лучшие места для посещения и приятного отдыха на Кубе",
    "testimonialsHeading": "Отзывы наших клиентов:",
    "layout": {
      "heroSpacer": {
        "desktop": 10,
        "mobile": 30,
        "hideMobile": false
      },
      "vanMobileSpacer": {
        "desktop": null,
        "mobile": 108,
        "hideMobile": false
      },
      "whySpacer": {
        "desktop": 30,
        "mobile": null,
        "hideMobile": false
      },
      "gapSpacer": {
        "desktop": 33,
        "mobile": 10,
        "hideMobile": true
      },
      "gapEmpty": false,
      "bandSpacer": {
        "desktop": 27,
        "mobile": 20,
        "hideMobile": false
      },
      "vanDesktopSpacer": {
        "desktop": null,
        "mobile": 108,
        "hideMobile": false
      },
      "afterVanSpacer": {
        "desktop": null,
        "mobile": 10,
        "hideMobile": false
      },
      "beforeBandSpacer": {
        "desktop": null,
        "mobile": 15,
        "hideMobile": false
      },
      "lastSpacer": {
        "desktop": null,
        "mobile": null,
        "hideMobile": false
      },
      "vanMobileBg": {
        "width": 907,
        "x": -10,
        "y": -37
      },
      "featureBasis": [
        32.311,
        35.163,
        31.77
      ],
      "featureBasisTablet": [
        33,
        32,
        33
      ],
      "vanDesktopButtonMarginTop": 0,
      "vanMobileButtonMarginTop": 10,
      "bookingMarginTopMobile": -20,
      "bookingWidthMobile": 90,
      "bandMarginBottom": 0,
      "slidesMargin": -130,
      "slidesMarginMobile": -210,
      "bandHeight": 218,
      "bandHeightTablet": 354,
      "emptyMobileSection": true,
      "blueBandHiddenOnMobile": false
    },
    "slides": [
      {
        "heading": "Пинар-дель-Рио",
        "description": "Табак, моготы, пляжи. Буйная природа, объект Всемирного наследия, карибская аутентичность, увлекательная культура.",
        "button": " узнать больше >",
        "overlay": "#00000052",
        "image": "/home/pinar-del-rio.webp",
        "href": "/ru/napravleniya"
      },
      {
        "heading": "Матансас",
        "description": "\nВпечатляющие пляжи, теплая погода, разнообразные туристические мероприятия и отличное гостеприимство.",
        "button": "узнать больше >",
        "overlay": "#0000005C",
        "image": "/home/matanzas.webp",
        "href": "/ru/napravleniya/matansas"
      },
      {
        "heading": " Гавана",
        "description": "\nСтолица Кубы, колониальная история, культовая архитектура, яркая культура, музыка и очаровательные пляжи.",
        "button": "узнать больше >",
        "overlay": "#0000005C",
        "image": "/home/la-habana.webp",
        "href": "/ru/napravleniya/gavana"
      },
      {
        "heading": " Тринидад",
        "description": "Колониальная архитектура, традиционная музыка, прекрасные пляжи и природные парки.",
        "button": "узнать больше >",
        "overlay": "#00000052",
        "image": "/home/trinidad.webp",
        "href": "/ru/napravleniya/troica"
      },
      {
        "heading": " Сьенфуэгос",
        "description": "\nКубинский город с колониальной архитектурой, заливом и богатой культурой. Жемчужина Юга, объект Всемирного наследия.",
        "button": "узнать больше >",
        "overlay": "#00000052",
        "image": "/home/cienfuegos.webp",
        "href": "/ru/napravleniya/sienfuegos"
      },
      {
        "heading": " Сантьяго-де-Куба",
        "description": "Яркий и исторический город. Музыкальное богатство, колониальная архитектура и колыбель кубинской революции.",
        "button": "узнать больше >",
        "overlay": "#00000052",
        "image": "/home/santiago-de-cuba.webp",
        "href": "/ru/napravleniya/santyago-de-kuba"
      }
    ]
  },
};
