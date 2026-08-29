import { routes } from "../routes";

export { spanishHome } from "../../i18n/content/es/home";

// Existing English-home exports are retained because the root route consumes them.
export const hero = {
  title: "Cuban Trip Experience",
  paragraphs: [
    "Discover the beauty of Cuba with our taxi service.",
    "Tour the island with comfort and safety.",
  ],
};

export const groupSize = {
  title: "Any Group Size, Any Distance.",
  body: "No matter the size of your group or the distance you need to travel, our taxis are ready to take you where you need to go. From short trips to long we have a variety of vehicles to adapt to your needs.",
  cta: { label: "View Services", href: routes.services },
};

export const whyUs = {
  title: "WHY ARE WE THE BEST?",
  cards: [
    { title: "Quality Trip", body: "We have many years of experience, command of languages and knowledge of the best routes, thus offering a unique experience." },
    { title: "National Coverage", body: "Find with us the possibility of reaching any corner of the country, providing a reliable and comfortable service for your journeys throughout the nation." },
    { title: "Cuban Essence", body: "Get to know the true essence of Cuba. Our drivers will immerse you in the culture, traditions and warmth of the Cuban people, ensuring an authentic and enriching experience on each journey." },
  ],
};

export const destinationIntro = {
  title: "Discover the best destination for your holiday",
  body: "Cuba is a country full of natural, cultural and historical wonders. Its beaches with crystalline waters, mountains, colonial cities, music and dance have made it one of the most popular tourist destinations in the Caribbean.",
};

export const bestPlaces = {
  title: "Best Places to Visit",
  body: "Best places to visit and spend a pleasant vacation in Cuba",
  cards: [
    { title: "Pinar del Río", body: "Tobacco, mogotes, beaches. Exuberant nature, World Heritage Site, Caribbean authenticity, fascinating culture.", href: routes.pinarDelRio },
    { title: "Matanzas", body: "Spectacular beaches, warm weather, varied tourist activities and great hospitality.", href: routes.matanzas },
    { title: "Havana", body: "Capital of Cuba, colonial history, iconic architecture, vibrant culture, music and captivating beaches.", href: routes.havana },
    { title: "Trinidad", body: "Colonial architecture, traditional music, beautiful beaches and natural parks.", href: routes.trinidad },
    { title: "Cienfuegos", body: "Cuban city with colonial architecture, bay and rich culture. Pearl of the South, World Heritage Site.", href: routes.cienfuegos },
    { title: "Santiago de Cuba", body: "Vibrant and historic city. Musical richness, colonial architecture and cradle of the Cuban revolution.", href: routes.santiagoDeCuba },
  ],
};
