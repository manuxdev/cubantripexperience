import cienfuegos from "../../assets/pages/destinations/cienfuegos.webp";
import havana from "../../assets/pages/destinations/havana.webp";
import matanzas from "../../assets/pages/destinations/matanzas.webp";
import pinarDelRio from "../../assets/pages/destinations/pinar-del-rio.webp";
import santiagoCuba from "../../assets/pages/destinations/santiago-cuba.webp";
import trinidad from "../../assets/pages/destinations/trinidad.webp";
import { routes } from "../routes";

export const intro = {
  title: "Destinations",
  body: "Here you will find valuable information about the culture, history and tourist attractions of the largest island in the Caribbean.",
};

export const popularPlacesTitle = "Popular Places";

/**
 * Source order, preserved: Pinar del Río through Santiago de Cuba. The source
 * Cienfuegos and Santiago cards linked to broken paths; both are corrected to the
 * retained routes here.
 */
export const popularPlaces = [
  {
    title: "Pinar del Río",
    body: "Located at the western end of the island of Cuba, the province of Pinar del Río is a jewel that combines the richness of its natural environment with a fascinating history that goes back centuries. Known as the cradle of the best tobacco in the world, this region offers its visitors a landscape of unique beauty and an authentic atmosphere that makes them fall in love from the first moment.",
    href: routes.pinarDelRio,
    image: pinarDelRio,
    alt: "Viñales Valley, Pinar del Río",
  },
  {
    title: "Matanzas",
    body: "Is a city located on the north coast of Cuba, founded in 1693. During the Spanish colonial era, Matanzas became an important economic center thanks to sugar production and maritime trade. The city was also an important cultural and literary center in the 19th century, known as “The Athens of Cuba”. Today, Matanzas is a popular tourist destination thanks to its colonial architecture, its rich cultural life, and its proximity to beautiful beaches.",
    href: routes.matanzas,
    image: matanzas,
    alt: "Matanzas destination",
  },
  {
    title: "Havana",
    body: "Havana is the capital of Cuba and one of the oldest cities in America. It was founded in 1519 by the Spanish and became an important commercial and military center during the colonial era. In the 20th century, Havana became a cultural and political center of the region, and was the scene of important events such as the Cuban Revolution in 1959. The city has rich spanish colonial architecture, as well as important historical monuments such as El Malecón, La Plaza de la Revolución and El Castillo del Morro.",
    href: routes.havana,
    image: havana,
    alt: "Old Havana",
  },
  {
    title: "Trinidad",
    body: "Trinidad is a colonial city located on the southern coast of Cuba, founded in 1514. During colonial times, the city became a major center of sugar production and slavery, and has many well-preserved colonial houses and museums displaying the city history. Today, Trinidad is a popular tourist destination due to its colonial architecture, nearby beaches, and lively cultural life.",
    href: routes.trinidad,
    image: trinidad,
    alt: "Trinidad, Cuba",
  },
  {
    title: "Cienfuegos",
    body: "Cienfuegos is a city on the southern coast of Cuba, founded in 1819 by French colonists. During the 19th and 20th centuries it became an important commercial and industrial port thanks to the production of sugar. The city is famous for its neoclassical architecture, its rich cultural history, its annual carnival, and its nearby beaches. Today, it is a popular tourist destination in Cuba, attractive for its cultural heritage and natural beauty.",
    href: routes.cienfuegos,
    image: cienfuegos,
    alt: "Cienfuegos, Cuba",
  },
  {
    title: "Santiago de Cuba",
    body: "Santiago de Cuba is the second largest city in Cuba, located on the east coast of the island. It was founded in 1515 by the Spanishs and became an important economic and military center during the colonial era. The city is known for its music, carnival and historical importance in the fight for Cuban independence. Santiago has several historical monuments, such as El Castillo del Morro, Santa Ifigenia Cemetery and the Moncada Barracks, where the Cuban Revolution began.",
    href: routes.santiagoDeCuba,
    image: santiagoCuba,
    alt: "Santiago de Cuba",
  },
];
