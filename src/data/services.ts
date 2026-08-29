/**
 * Services-page copy for the three editions, read out of each page's Elementor
 * JSON by `reference/tools/gen-services.py`. Leading spaces are the source's own.
 *
 * English authors a fourth paragraph in Section 7 that Spanish and Russian do
 * not, so `paragraphs` is a list rather than a fixed pair.
 */
import type { SiteLang } from "../i18n/site";

export type ServicesContent = {
  title: string;
  hero: string;
  vehiclesHeading: string;
  /** The three selector buttons, in source order. */
  tabs: string[];
  vehicles: { title: string; description: string }[];
  ctaHeading: string;
  ctaButton: string;
  proHeading: string;
  /** Section 7, split across two columns: the first two go left, the rest right. */
  paragraphs: string[];
  discoverHeading: string;
  discoverButton: string;
};

export const SERVICES: Record<SiteLang, ServicesContent> = {
  es: {
    "title": "Servicios | Cuban Trip Experience",
    "hero": "Servicios",
    "vehiclesHeading": "Tipos de Vehículos",
    "tabs": [
      "Estándar",
      "Van",
      "Clásico"
    ],
    "vehicles": [
      {
        "title": "Estándar",
        "description": "Descubre la comodidad y eficiencia de nuestro taxi estándar de 4 puertas. Perfecto para viajes cortos en la ciudad o para traslados al aeropuerto. Disfrute de un viaje seguro y cómodo con nuestra flota de taxis modernos y bien mantenidos."
      },
      {
        "title": "Van",
        "description": "¿Viajas en grupo? Nuestro taxi van es ideal para ti. Con capacidad para hasta 9 pasajeros, es perfecto para excursiones familiares o de negocios. Disfruta de un viaje amplio y cómodo con nuestro servicio de taxi van."
      },
      {
        "title": "Clásico",
        "description": "¿Quieres vivir el encanto de Cuba de una manera única? Nuestro taxi clásico es perfecto para ti. Viaje en un auto antiguo restaurado y acondicionado para turismo. Descubre la historia y la belleza de Cuba en un viaje inolvidable en nuestro taxi clásico.\n"
      }
    ],
    "ctaHeading": "TE LLEVAMOS A TIEMPO AL LUGAR CORRECTO",
    "ctaButton": "RESERVA AHORA",
    "proHeading": "¡Profesionalismo!",
    "paragraphs": [
      "Nuestros conductores son verdaderos conocedores de su trabajo y estarán a su servicio para satisfacer sus necesidades de viajar a los sitios de historia, cultura y tradiciones que usted les solicite, permitiéndole cumplir su deseo de experimentar la esencia misma de la isla.",
      "Nuestros taxis están cuidadosamente mantenidos y equipados para brindar el máximo confort durante el viaje. Además, nuestros conductores son profesionales altamente capacitados que le ofrecerán un viaje seguro y tranquilo, garantizando la llegada a su destino sin preocupaciones.",
      "Nos adaptamos a sus preferencias y necesidades, ofreciéndoles recomendaciones, música de su elección y un ambiente agradable dentro del vehículo, que le proporcionará la oportunidad de disfrutar, aprender y crear un vínculo con nuestro servicio perdurable y que estamos seguros que lo repetirá en cada visita a la isla."
    ],
    "discoverHeading": "\nDescubre los mejores lugares de Cuba",
    "discoverButton": " DESTINOS"
  },
  en: {
    "title": "Services | Cuban Trip Experience",
    "hero": "Services",
    "vehiclesHeading": "Types of Vehicles",
    "tabs": [
      " Standards",
      "Vans",
      " Classics"
    ],
    "vehicles": [
      {
        "title": "Standard",
        "description": "Discover the comfort and efficiency of our standard 4-door taxi. Perfect for short trips in the city or for transfers to the airport. Enjoy a safe and comfortable ride with our fleet of modern and well-maintained taxis."
      },
      {
        "title": "Vans",
        "description": "Are you traveling in a group? Our taxi van is ideal for you. With capacity for up to 9 passengers, it is perfect for family or business excursions. Enjoy a spacious and comfortable trip with our taxi van service."
      },
      {
        "title": "Clasic",
        "description": "Do you want to experience the charm of Cuba in a unique way? Our classic taxi is perfect for you. Travel in an old car restored and conditioned for tourism. Discover the history and beauty of Cuba in an unforgettable trip in our classic taxi."
      }
    ],
    "ctaHeading": "WE TAKE YOU ON TIME TO THE RIGHT PLACE",
    "ctaButton": "BOOK NOW",
    "proHeading": "Professionalism!",
    "paragraphs": [
      "Our drivers are true connoisseurs of their work and will be at your service to satisfy your needs to travel to the sites of history, culture and traditions that you request, allowing you to fulfill your desire to experience the very essence of the island.",
      "Our taxis are carefully maintained and equipped to provide maximum comfort during the journey. In addition, our drivers are highly trained professionals who will offer a safe and quiet trip, guaranteeing arrival at your destination without worries.",
      "We adapt to your preferences and needs, offering you recommendations, music of your choice, and a pleasant atmosphere inside the vehicle, which will provide you with the opportunity to enjoy, learn, and create a bond with our enduring service that we are sure you will repeat on each visit to the island."
    ],
    "discoverHeading": "Discover the bests places in Cuba",
    "discoverButton": " DESTINATIONS"
  },
  ru: {
    "title": "Yслуги | Cuban Trip Experience",
    "hero": "\nУслуги",
    "vehiclesHeading": "Типы транспортных средств",
    "tabs": [
      " Стандарт",
      " фургон",
      " классический"
    ],
    "vehicles": [
      {
        "title": "стандартная тележка",
        "description": "Откройте для себя комфорт и эффективность нашего стандартного 4-дверного такси. Идеально подходит для коротких поездок по городу или для трансфера в аэропорт. Наслаждайтесь безопасной и комфортной поездкой с нашим парком современных и ухоженных такси."
      },
      {
        "title": " фургон",
        "description": "Вы путешествуете в группе? Наше такси идеально подходит для вас. Вместимостью до 9 пассажиров, он идеально подходит для семейных или деловых поездок. Наслаждайтесь широкой и комфортной поездкой с нашей службой такси."
      },
      {
        "title": "Классический",
        "description": "Хотите испытать очарование Кубы уникальным способом? Наше классическое такси идеально подходит для вас. Путешествие на старой машине, отреставрированной и приспособленной для туризма. Откройте для себя историю и красоту Кубы в незабываемой поездке на нашем классическом такси."
      }
    ],
    "ctaHeading": "МЫ ДОСТАВИМ ВАС СОВРЕМЕННО В НУЖНОЕ МЕСТО",
    "ctaButton": "ЗАБРОНИРУЙТЕ СЕЙЧАС",
    "proHeading": "Профессионализм!",
    "paragraphs": [
      "Наши водители являются настоящими знатоками своей работы и будут к вашим услугам, чтобы удовлетворить ваши потребности в поездках по местам истории, культуры и традиций, которые вы запрашиваете, что позволит вам исполнить ваше желание испытать самую суть острова.",
      "Наши такси тщательно обслуживаются и оборудованы для обеспечения максимального комфорта во время поездки. Кроме того, наши водители являются высококвалифицированными профессионалами, которые предложат вам безопасную и спокойную поездку, гарантируя прибытие в пункт назначения без забот.",
      "Мы адаптируемся к вашим предпочтениям и потребностям, предлагая вам рекомендации, музыку по вашему выбору и приятную атмосферу внутри автомобиля, что даст вам возможность наслаждаться, учиться и создавать связь с нашим постоянным обслуживанием, которое, мы уверены, вы будете повторять при каждом посещении острова."
    ],
    "discoverHeading": "\n\nОткройте для себя лучшие места на Кубе",
    "discoverButton": " НАПРАВЛЕНИЯ"
  },
};
