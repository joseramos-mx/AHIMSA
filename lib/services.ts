import type { TripType } from "./trip-types";

export type Service = {
  /** También es el "tipo" que recibe /contacto. */
  slug: Extract<TripType, "cruceros" | "eventos" | "otros">;
  name: string;
  description: string;
  /** Imagen que sigue al cursor (desktop). */
  image: string;
};

/**
 * Servicios adicionales ("También te ayudo con").
 *
 * IMPORTANTE: las imágenes deben mostrar destinos genéricos, sin logos de
 * navieras, artistas, equipos ni ligas deportivas.
 *
 * Para un servicio nuevo: agrega su slug a TripType en lib/trip-types.ts
 * (con su etiqueta en TRIP_TYPES), amplía el tipo `slug` de arriba y añade
 * aquí el objeto con su imagen en /public/media/services/.
 */
export const SERVICES: Service[] = [
  {
    slug: "cruceros",
    name: "Cruceros",
    description:
      "Caribe, Alaska y Europa, con la naviera que mejor le quede a tu familia.",
    image: "/media/services/cruceros.jpg",
  },
  {
    slug: "eventos",
    name: "Conciertos y partidos",
    description:
      "Boletos para eventos en México y el extranjero, con viaje incluido si lo necesitas.",
    image: "/media/services/eventos.jpg",
  },
  {
    slug: "otros",
    name: "Otros destinos",
    description: "¿Tienes otro lugar en mente? Cuéntame y lo vemos juntos.",
    image: "/media/services/otros-destinos.jpg",
  },
];

/**
 * Imagen opcional de la tarjeta "Para empresas" (16:9). Cuando subas
 * public/media/services/empresas.jpg, cambia esto a
 * "/media/services/empresas.jpg". Con null la tarjeta va sin imagen.
 */
export const BUSINESS_IMAGE: string | null = null;

/** Puntos de la tarjeta "Para empresas". */
export const BUSINESS_FEATURES = [
  "Viajes de negocio",
  "Congresos y convenciones",
  "Team building",
  "Viajes de incentivo",
];
