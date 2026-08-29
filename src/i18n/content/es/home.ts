import { routes } from "../../../data/routes";

export const spanishHome = {
  title: "Cuban Trip Experience | Servicio de Taxis en Cuba",
  description:
    "Descubra la esencia de Cuba con nuestro experto servicio de taxi. Maravillas culturales y paisajes impresionantes esperan su exploración.",
  hero: {
    title: "Cuban Trip Experience",
    lines: [
      "Descubre la belleza de Cuba con nuestro servicio de taxi.",
      "Recorre la isla con comodidad y seguridad.",
    ],
  },
  group: {
    title: "Cualquier tamaño de grupo, cualquier distancia.",
    desktopBody: "No importa el tamaño de su grupo o la distancia que necesitas recorrer, nuestros taxis están listos para llevarte a donde necesites ir. Desde viajes cortos a viajes largos, tenemos una variedad de vehículos para adaptarse a sus necesidades.",
    mobileBody: "No importa el tamaño de su grupo o la distancia que necesitas recorrer, nuestros taxis están listos para recogerte donde necesitas ir. Desde viajes cortos a tiempo tenemos una variedad de vehículos para adaptarse a su necesidades.",
  },
  whyUs: {
    title: "¿Por qué somos los mejores?",
    body: "Destacamos por nuestra puntualidad, seguridad y comodidad. Nuestros conductores altamente capacitados ofrecen un trato amable y respetuoso. Además, contamos con una flota variada y bien mantenida, y nos esforzamos por superar las expectativas de nuestros clientes en cada viaje.",
    cards: [
      {
        title: "Viaje de Calidad",
        body: "Contamos con numerosos años de experiencia, dominio de idiomas y conocimiento de las mejores rutas, ofreciendo así una experiencia única.",
      },
      {
        title: "Cobertura Nacional",
        body: "Encuentra con nostros la posibilidad de llegar a cualquier rincón del país, brindándole un servicio confiable y cómodo para sus recorridos a lo largo y ancho de la nación.",
      },
      {
        title: "Esencia Cubana",
        body: "Conoce la verdadera esencia de Cuba. Nuestros conductores te sumergirán en la cultura, las tradiciones y la calidez del pueblo cubano, asegurando una vivencia auténtica y enriquecedora en cada trayecto.",
      },
    ],
  },
  destination: {
    title: "Descubre el mejor destino para tus vacaciones.",
    body: "Cuba es un país lleno de maravillas naturales, culturales e históricas. Sus playas de aguas cristalinas, montañas, ciudades coloniales, música y danza la han convertido en uno de los destinos turísticos más populares del Caribe.",
  },
  places: [
    { title: "Pinar del Río", body: "Tabaco, mogotes, playas. Naturaleza exuberante, Patrimonio de la Humanidad, autenticidad caribeña, cultura fascinante.", image: "/home/pinar-del-rio.webp", href: routes.pinarDelRio },
    { title: "Matanzas", body: "Playas espectaculares, clima cálido, variadas actividades turísticas y gran hospitalidad.", image: "/home/matanzas.webp", href: routes.matanzas },
    { title: "La Habana", body: "Capital de Cuba, historia colonial, arquitectura icónica, cultura vibrante, música y playas cautivadoras.", image: "/home/la-habana.webp", href: routes.havana },
    { title: "Trinidad", body: "Arquitectura colonial, música tradicional, hermosas playas y parques naturales.", image: "/home/trinidad.webp", href: routes.trinidad },
    { title: "Cienfuegos", body: "Ciudad cubana con arquitectura colonial, bahía y cultura rica. Perla del Sur, Patrimonio de la Humanidad.", image: "/home/cienfuegos.webp", href: routes.cienfuegos },
    { title: "Santiago de Cuba", body: "Ciudad vibrante y histórica. Riqueza musical, arquitectura colonial y cuna de la revolución cubana.", image: "/home/santiago-de-cuba.webp", href: routes.santiagoDeCuba },
  ],
  testimonials: [
    { name: "Manuel Pantoja", rating: 4.0, body: "Muy buen servicio." },
    { name: "John Doe", rating: 4.5, handle: "@johndoe", body: "The service was exceptional: quick, friendly, and efficient. Very satisfied with the overall experience!" },
    { name: "Sarah Smith", rating: 3.8, handle: "@sarah", body: "I had an amazing experience with their team! Outstanding service, prompt responses, and exceeded my expectations. Highly recommended!" },
  ],
} as const;

export type SpanishHomeContent = typeof spanishHome;
