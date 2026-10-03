/* ==========================================================================
 *  SOLO TESTIMONIOS REALES CON PERMISO DEL CLIENTE.
 *  NO INVENTAR NI EDITAR EL SENTIDO DE LO QUE DIJO EL CLIENTE.
 *
 *  - Pide autorización por escrito para publicar su texto, nombre y foto.
 *  - Puedes corregir ortografía, pero no cambiar lo que quiso decir.
 *  - Mientras `published` sea false, el testimonio solo se ve en desarrollo
 *    (con la etiqueta "Borrador"); en producción no aparece.
 * ========================================================================== */

import type { NicheSlug } from "./niches";

export type Testimonial = {
  id: string;
  /** Texto del cliente, 2 a 4 líneas. */
  quote: string;
  name: string;
  city: string;
  destination: string;
  nicheSlug: NicheSlug;
  /** Foto 4:5 en /public/media/testimonials/ (mín. ~1200px de alto). */
  image: string;
  /** Ej. "Ana y su familia frente al Coliseo en Roma". */
  imageAlt: string;
  /** true solo cuando el cliente ya dio permiso y el texto es definitivo. */
  published: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "placeholder-1",
    quote: "[Testimonio real del cliente, 2 a 4 líneas]",
    name: "[Nombre]",
    city: "[Ciudad]",
    destination: "[Destino]",
    nicheSlug: "family-europe",
    image: "/media/testimonials/testimonio-1.jpg",
    imageAlt: "[Nombre] y su familia frente al Coliseo en Roma",
    published: false,
  },
  {
    id: "placeholder-2",
    quote: "[Testimonio real del cliente, 2 a 4 líneas]",
    name: "[Nombre]",
    city: "[Ciudad]",
    destination: "[Destino]",
    nicheSlug: "family-europe",
    image: "/media/testimonials/testimonio-2.jpg",
    imageAlt: "[Nombre] y su familia paseando junto al Sena en París",
    published: false,
  },
  {
    id: "placeholder-3",
    quote: "[Testimonio real del cliente, 2 a 4 líneas]",
    name: "[Nombre]",
    city: "[Ciudad]",
    destination: "[Destino]",
    nicheSlug: "magic-families",
    image: "/media/testimonials/testimonio-3.jpg",
    imageAlt: "[Nombre] y sus hijos en un parque de atracciones en Orlando",
    published: false,
  },
  {
    id: "placeholder-4",
    quote: "[Testimonio real del cliente, 2 a 4 líneas]",
    name: "[Nombre]",
    city: "[Ciudad]",
    destination: "[Destino]",
    nicheSlug: "legacy-journeys",
    image: "/media/testimonials/testimonio-4.jpg",
    imageAlt: "[Nombre] y su pareja al atardecer en Santorini",
    published: false,
  },
];

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Testimonios a mostrar: en producción solo los publicados; en desarrollo
 * todos (los no publicados se marcan como "Borrador"). Primero los de
 * family-europe y después el orden del array.
 */
export function getVisibleTestimonials(): Testimonial[] {
  const visible = IS_PRODUCTION
    ? TESTIMONIALS.filter((t) => t.published)
    : TESTIMONIALS;
  return [
    ...visible.filter((t) => t.nicheSlug === "family-europe"),
    ...visible.filter((t) => t.nicheSlug !== "family-europe"),
  ];
}

/**
 * ¿Hay testimonios para mostrar? Decide si se renderiza la sección y si
 * aparece el link "Testimonios" del nav. En producción exige al menos uno
 * con published: true.
 */
export function hasPublishedTestimonials(): boolean {
  return getVisibleTestimonials().length > 0;
}
