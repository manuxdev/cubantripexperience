/**
 * Destination detail content, in source landmark order. Images resolve through a
 * single eager glob so each landmark only carries its own file name.
 */
import type { ImageMetadata } from "@astrojs/image/dist/vite-plugin-astro-image";

const media = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/pages/*/*.webp",
  { eager: true }
);

export type Landmark = {
  title: string;
  body: string;
  image: ImageMetadata;
  alt: string;
};

export type DestinationPage = {
  slug: string;
  title: string;
  landmarks: Landmark[];
};

const image = (slug: string, name: string): ImageMetadata =>
  media[`../../assets/pages/${slug}/${name}.webp`].default;

export const destinationPages: DestinationPage[] = [
  {
    slug: "pinar-del-rio",
    title: "Pinar del Río",
    landmarks: [
      {
        title: "Viñales",
        body: "Located in an impressive valley surrounded by mogotes, unique rock formations, Viñales is one of the most outstanding tourist destinations in the province. Nature lovers can explore its extensive tobacco plantations and enjoy excursions to the nearby caves and mogotes.",
        image: image("pinar-del-rio", "vinales"),
        alt: "Viñales, Pinar del Río",
      },
      {
        title: "Terrazas",
        body: "This ecological and cultural project is a haven of peace located in the Sierra del Rosario mountains. It offers a unique experience with trails, waterfalls, natural pools and a vibrant artistic community. In addition, sustainable tourism and environmental conservation are promoted.",
        image: image("pinar-del-rio", "terrazas"),
        alt: "Terrazas, Pinar del Río",
      },
      {
        title: "Soroa",
        body: "Known as “Cuba’s rainbow,” Soroa is famous for its lush gardens and waterfalls. The Soroa Botanical Garden houses an impressive collection of tropical plants and native species. It is also an excellent place for hiking and enjoying nature.",
        image: image("pinar-del-rio", "soroa"),
        alt: "Soroa, Pinar del Río",
      },
      {
        title: "Indian Cave",
        body: "Located near Viñales, the Cueva del Indio is an underground wonder that offers a boat tour through an underground river. Visitors can explore its impressive rock formations and view ancient petroglyphs, remnants of the Aboriginal presence.",
        image: image("pinar-del-rio", "indian-cave"),
        alt: "Indian Cave, Pinar del Río",
      },
      {
        title: "Levisa Fell",
        body: "This small paradise key is located on the north coast of Pinar del Río. Its white sand beaches and crystal clear waters make it the perfect place to dive, snorkel and relax under the Caribbean sun. It is a natural paradise that offers tranquility and an unforgettable beach experience.",
        image: image("pinar-del-rio", "levisa-fell"),
        alt: "Levisa Fell, Pinar del Río",
      },
    ],
  },
  {
    slug: "matanzas",
    title: "Matanzas",
    landmarks: [
      {
        title: "Sauto Theater",
        body: "This neoclassical theater was built at the end of the 19th century and is considered one of the most beautiful in Cuba. It offers a wide variety of shows, from opera and ballet to concerts and plays.",
        image: image("matanzas", "sauto-theater"),
        alt: "Sauto Theater, Matanzas",
      },
      {
        title: "Liberty Park",
        body: "This park is a popular place to relax and enjoy nature. It has a large number of trees and green areas, as well as a central fountain. It is also a popular place for cultural events and festivals.",
        image: image("matanzas", "liberty-park"),
        alt: "Liberty Park, Matanzas",
      },
      {
        title: "Canimar River",
        body: "This river meanders through a beautiful natural landscape and is ideal for boat or kayak excursions. Visitors can enjoy the natural beauty of the region and explore the nearby caves and waterfalls.",
        image: image("matanzas", "canimar-river"),
        alt: "Canimar River, Matanzas",
      },
      {
        title: "Saturn Cave",
        body: "This underground cave has a lake of crystal clear water and it is ideal for diving and snorkelling. Visitors can explore the lake’s rock formations and rich marine life.",
        image: image("matanzas", "saturn-cave"),
        alt: "Saturn Cave, Matanzas",
      },
      {
        title: "Varadero Beach",
        body: "Varadero Beach is one of the most popular tourist destinations in Cuba. The beach has crystal clear waters and white sands, as well as a large number of hotels, restaurants and water activities.",
        image: image("matanzas", "varadero-beach"),
        alt: "Varadero Beach, Matanzas",
      },
    ],
  },
  {
    slug: "havana",
    title: "Havana",
    landmarks: [
      {
        title: "Old Havana",
        body: "The historic center of the city is one of the most visited places by tourists due to its impressive colonial architecture, squares, cobbled streets and historic buildings such as the Havana Cathedral, the Castillo de la Real Fuerza and the Plaza of weapons.",
        image: image("havana", "old-havana"),
        alt: "Old Havana, Havana",
      },
      {
        title: "El Malecon",
        body: "This coastal avenue is a popular place to walk and enjoy the view of the sea and the city. It is especially popular at night, when it is full of people who come to enjoy the sea breeze and the relaxed atmosphere.",
        image: image("havana", "el-malecon"),
        alt: "El Malecon, Havana",
      },
      {
        title: "The Capitol",
        body: "This impressive structure was built in the 1920s and is one of the most iconic buildings in the city. Today it is the headquarters of the Cuban Academy of Sciences and is a popular place to take photos and enjoy the architecture.",
        image: image("havana", "the-capitol"),
        alt: "The Capitol, Havana",
      },
      {
        title: "The Colon Cemetery",
        body: "This cemetery is one of the largest and oldest in Latin America and has a large number of impressive tombs and monuments. It is a popular place to explore the history and culture of the city.",
        image: image("havana", "the-colon-cemetery"),
        alt: "The Colon Cemetery, Havana",
      },
      {
        title: "El Morro and La Cabaña",
        body: "These two fortresses are impressive structures that date back to colonial times. They are a popular place to enjoy panoramic views of the city and the sea, especially at sunset.",
        image: image("havana", "el-morro-and-la-cabana"),
        alt: "El Morro and La Cabaña, Havana",
      },
    ],
  },
  {
    slug: "trinidad",
    title: "Trinidad",
    landmarks: [
      {
        title: "The Main Square",
        body: "This is the main square of the city and is one of the most emblematic places in Trinidad. Here are some of the most important colonial buildings in the city, such as the Brunet Palace and the Manaca-Iznaga Tower.",
        image: image("trinidad", "the-main-square"),
        alt: "The Main Square, Trinidad",
      },
      {
        title: "Valley of the Sugar Mills",
        body: "This valley is a UNESCO World Heritage Site and is an important place in the history of the sugar industry in Cuba. Tourists can visit the old haciendas and sugar mills to learn about the history of this industry and enjoy the natural beauty of the area.",
        image: image("trinidad", "valley-of-the-sugar-mills"),
        alt: "Valley of the Sugar Mills, Trinidad",
      },
      {
        title: "Ancon Beach",
        body: "This beach is one of the most popular in the Trinidad region due to its beautiful white sand and crystal clear waters. Tourists can enjoy activities such as snorkeling, diving, and sport fishing.",
        image: image("trinidad", "ancon-beach"),
        alt: "Ancon Beach, Trinidad",
      },
      {
        title: "The Church of the Holy Trinity",
        body: "This church is one of the oldest in Cuba and is known for its impressive architecture and its silver altar. Visitors can admire the beauty of the church and learn about its history and its importance in the religious life of the city.",
        image: image("trinidad", "the-church-of-the-holy-trinity"),
        alt: "The Church of the Holy Trinity, Trinidad",
      },
      {
        title: "The Romantic Museum",
        body: "This museum is located in a restored colonial house and tells the story of the daily life of the rich families of the city in the 19th century. Visitors can view furniture, personal items, and artwork from the period.",
        image: image("trinidad", "the-romantic-museum"),
        alt: "The Romantic Museum, Trinidad",
      },
    ],
  },
  {
    slug: "cienfuegos",
    title: "Cienfuegos",
    landmarks: [
      {
        title: "El Malecon",
        body: "This is a popular and beautiful boardwalk along the Cienfuegos coast. It is a perfect place to walk, enjoy the view of the sea and relax.",
        image: image("cienfuegos", "el-malecon"),
        alt: "El Malecon, Cienfuegos",
      },
      {
        title: "The Thomas Terry Theater",
        body: "This theater is an impressive historical building that was built in the 19th century. It offers a wide variety of music and dance shows.",
        image: image("cienfuegos", "the-thomas-terry-theater"),
        alt: "The Thomas Terry Theater, Cienfuegos",
      },
      {
        title: "The Purest Conception Cathedral",
        body: "This cathedral is an impressive architectural structure dating from the 19th century. It is one of the most emblematic places in Cienfuegos.",
        image: image("cienfuegos", "the-purest-conception-cathedral"),
        alt: "The Purest Conception Cathedral, Cienfuegos",
      },
      {
        title: "The Valley Palace",
        body: "This is a beautiful palace built in the Moorish style, with impressive decoration and a panoramic view of the ocean.",
        image: image("cienfuegos", "the-valley-palace"),
        alt: "The Valley Palace, Cienfuegos",
      },
      {
        title: "El Nicho",
        body: "El Nicho is a natural spot in the mountains near Cienfuegos, Cuba, known for its beautiful waterfalls and nature trails. It is an ideal destination for bird watching, hiking, swimming and for those who want to enjoy the natural beauty of the area.",
        image: image("cienfuegos", "el-nicho"),
        alt: "El Nicho, Cienfuegos",
      },
    ],
  },
  {
    slug: "santiago-cuba",
    title: "Santiago de Cuba",
    landmarks: [
      {
        title: "Catedral de Santiago de Cuba",
        body: "It is an impressive cathedral located in the center of Santiago de Cuba. It is one of the oldest buildings in the city and is known for its impressive architecture. It is a popular place to visit and take pictures.",
        image: image("santiago-cuba", "catedral-de-santiago-de-cuba"),
        alt: "Catedral de Santiago de Cuba, Santiago de Cuba",
      },
      {
        title: "The Great Stone",
        body: "It is a huge rock located on top of a mountain in the Sierra Maestra. You can reach the top by hiking, and from there you have an impressive panoramic view of the region.",
        image: image("santiago-cuba", "the-great-stone"),
        alt: "The Great Stone, Santiago de Cuba",
      },
      {
        title: "Castillo de San Pedro de la Roca del Morro",
        body: "It is an old Spanish castle located in the port of Santiago de Cuba. It was built in the 17th century to protect the city from pirates and corsairs. Today, it is a museum that offers panoramic views of the port and the city.",
        image: image("santiago-cuba", "castillo-de-san-pedro-de-la-roca-del-morro"),
        alt: "Castillo de San Pedro de la Roca del Morro, Santiago de Cuba",
      },
      {
        title: "Sierra Maestra",
        body: "It is a mountain range located in the southeast of Cuba. It is known for its historical importance during the Cuban Revolution, as it was the place where Fidel Castro established his base of operations. It is a popular destination for nature and history lovers.",
        image: image("santiago-cuba", "sierra-maestra"),
        alt: "Sierra Maestra, Santiago de Cuba",
      },
      {
        title: "El Salto del Caburni",
        body: "It is a beautiful waterfall located in the mountains near Santiago de Cuba. It can be reached by hiking through the tropical jungle. It is a popular attraction for nature lovers and those looking for an adventure.",
        image: image("santiago-cuba", "el-salto-del-caburni"),
        alt: "El Salto del Caburni, Santiago de Cuba",
      },
    ],
  },
];
