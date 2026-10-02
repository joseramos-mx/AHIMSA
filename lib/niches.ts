export type Niche = {
  slug: string;
  name: string;
  description: string;
  image: string;
  alt: string;
};

/**
 * Las imágenes de cada nicho viven en /public/media/niches/
 * y deben coincidir con el nombre del archivo indicado abajo.
 *
 * IMPORTANTE: la imagen de "Magic Families" NO debe mostrar
 * personajes ni logotipos de marcas (Disney, Universal, etc.) por
 * motivos de derechos de uso. Usa una foto genérica de familia en
 * un parque / montaña rusa / castillo sin marcas visibles.
 *
 * Para agregar un nicho nuevo basta con añadir un objeto a este
 * array. Las secciones responsivas (grid y carrusel móvil) se
 * reajustan solas.
 */
export const NICHES: Niche[] = [
  {
    slug: "family-europe",
    name: "Family Europe",
    description:
      "Circuitos armados o itinerarios a tu medida por París, Roma, Madrid y más, pensados para viajar en familia.",
    image: "/media/niches/family-europe.jpg",
    alt: "Columnas del Foro Romano y cúpulas de iglesias bajo un cielo azul en Roma.",
  },
  {
    slug: "magic-families",
    name: "Magic Families",
    description:
      "Orlando, Anaheim y Hawái. Parques, hoteles temáticos y todo resuelto para que los niños solo vivan la magia.",
    image: "/media/niches/magic-families.jpg",
    alt: "Rueda de la fortuna y montaña rusa iluminadas al anochecer, reflejadas en el lago de un parque de atracciones.",
  },
  {
    slug: "premium-resorts",
    name: "Premium Family Resorts",
    description:
      "Todo incluido de lujo en el Caribe, con suites, albercas infinitas y conciertos sin salir del hotel.",
    image: "/media/niches/premium-resorts.jpg",
    alt: "Terrazas blancas de un hotel en Santorini con alberca privada y camastros sobre el acantilado.",
  },
  {
    slug: "legacy-journeys",
    name: "Legacy Journeys",
    description:
      "XV años, bodas y lunas de miel. Viajes para celebrar los momentos que se recuerdan toda la vida.",
    image: "/media/niches/legacy-journeys.jpg",
    alt: "Cena romántica en la playa bajo un toldo con luces y velas, entre palmeras al anochecer.",
  },
];
