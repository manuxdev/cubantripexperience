import classic from "../../assets/pages/services/classic.webp";
import standard from "../../assets/pages/services/standard.webp";
import van from "../../assets/pages/services/van.webp";
import { routes } from "../routes";

export const intro = {
  title: "Services",
  description:
    "Standard, van and classic taxi services across Cuba, with experienced drivers and carefully maintained vehicles.",
};

export const vehiclesTitle = "Types of Vehicles";

export const vehicles = [
  {
    title: "Standard",
    body: "Discover the comfort and efficiency of our standard 4-door taxi. Perfect for short trips in the city or for transfers to the airport. Enjoy a safe and comfortable ride with our fleet of modern and well-maintained taxis.",
    image: standard,
    alt: "Standard four-door taxi",
    width: 417,
    height: 230,
  },
  {
    title: "Vans",
    body: "Are you traveling in a group? Our taxi van is ideal for you. With capacity for up to 9 passengers, it is perfect for family or business excursions. Enjoy a spacious and comfortable trip with our taxi van service.",
    image: van,
    alt: "Taxi van for groups of up to nine passengers",
    width: 543,
    height: 260,
  },
  {
    title: "Clasic",
    body: "Do you want to experience the charm of Cuba in a unique way? Our classic taxi is perfect for you. Travel in an old car restored and conditioned for tourism. Discover the history and beauty of Cuba in an unforgettable trip in our classic taxi.",
    image: classic,
    alt: "Restored classic car used as a taxi in Havana",
    width: 468,
    height: 246,
  },
];

export const punctuality = { title: "WE TAKE YOU ON TIME TO THE RIGHT PLACE" };

export const professionalism = {
  title: "Professionalism!",
  paragraphs: [
    "Our drivers are true connoisseurs of their work and will be at your service to satisfy your needs to travel to the sites of history, culture and traditions that you request, allowing you to fulfill your desire to experience the very essence of the island.",
    "Our taxis are carefully maintained and equipped to provide maximum comfort during the journey. In addition, our drivers are highly trained professionals who will offer a safe and quiet trip, guaranteeing arrival at your destination without worries.",
    "We adapt to your preferences and needs, offering you recommendations, music of your choice, and a pleasant atmosphere inside the vehicle, which will provide you with the opportunity to enjoy, learn, and create a bond with our enduring service that we are sure you will repeat on each visit to the island.",
  ],
};

export const destinationsCta = {
  title: "Discover the bests places in Cuba",
  label: "DESTINATIONS",
  href: routes.destinations,
};
