/**
 * Destinations-index headings for the three editions, read out of each page's
 * Elementor JSON. Leading whitespace is the source's own.
 */
import type { SiteLang } from "../i18n/site";

export const DESTINATIONS_INDEX: Record<
  SiteLang,
  { title: string; hero: string; intro: string; popular: string }
> = {
  es: {
    title: "Destinos | Cuban Trip Experience",
    hero: "Destinos",
    intro: "Aquí encontrará valiosa información sobre la cultura, la historia y los atractivos turísticos de la isla más grande del Caribe.",
    popular: "Lugares Populares",
  },
  en: {
    title: "Destinations | Cuban Trip Experience",
    hero: "Destinations",
    intro: "Here you will find valuable information about the culture, history and tourist attractions of the largest island in the Caribbean.",
    popular: "Popular Places",
  },
  ru: {
    title: "Направления | Cuban Trip Experience",
    hero: "\nНаправления",
    intro: "\nЗдесь вы найдете ценную информацию о культуре, истории и туристических достопримечательностях самого большого острова Карибского моря.",
    popular: "\nпопулярные места",
  },
};
