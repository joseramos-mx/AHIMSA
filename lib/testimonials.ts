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
  /** Texto del cliente, tal como lo escribió (solo se corrige ortografía). */
  quote: string;
  /** Nombre o usuario con el que el cliente aceptó aparecer. */
  name: string;
  /** Opcionales: se muestran solo si se conocen. No inventarlos. */
  city?: string;
  destination?: string;
  nicheSlug?: NicheSlug;
  /** De dónde viene (p. ej. "Instagram"). */
  source?: string;
  /** Foto 4:5 en /public/media/testimonials/ (mín. ~1200px de alto). Sin
   *  foto, el slide muestra un panel con una comilla decorativa. */
  image?: string;
  /** Ej. "Ana y su familia frente al Coliseo en Roma". */
  imageAlt?: string;
  /** true solo cuando el cliente ya dio permiso y el texto es definitivo. */
  published: boolean;
};

/*
 * Transcritos de historias de Instagram de clientes (octubre 2026). Ajustes
 * permitidos aplicados: acentos y signos de apertura, "Amisha" → "Ahimsa",
 * sin emojis; @ahimsa.travel escrito como "Ahimsa Travel" o omitido donde
 * solo era la etiqueta del agradecimiento. Antes de publicar:
 *  - confirmar el permiso de cada cliente (y cómo quiere aparecer su
 *    nombre: hoy dice su usuario de Instagram),
 *  - los que dicen "[Nombre]" venían sin autor visible en la captura,
 *  - el de lorena.romero menciona a @pawismn (otra persona): confirmar.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ig-paris-familia",
    quote:
      "@fatu.ab es sumamente profesional y atenta, estuvo al pendiente de nosotros antes y durante todo nuestro viaje en París. Sin duda volveremos a viajar con ellos.",
    name: "[Nombre]",
    destination: "París",
    nicheSlug: "family-europe",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-viaje-familiar",
    quote:
      "Excelente experiencia con Ahimsa Travel. Organizó todo nuestro viaje familiar a la perfección, desde los vuelos, hospedajes, traslados y los lugares que queríamos conocer. No tuvimos que preocuparnos por nada.",
    name: "[Nombre]",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-lorena-romero",
    quote:
      "Viajar con Ahimsa Travel fue la mejor decisión, Faty se encargó de absolutamente todo, mientras yo solo me dediqué a disfrutar, descansar y ser bonita junto con @pawismn. Gracias por hacer mis vacaciones tan fáciles y perfectas. ¡Súper recomendados!",
    name: "@lorena.romero.5832343",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-dayanjair",
    quote:
      "Para viajecitos cool les recomiendo este perfil. Siempre nos ayudan a encontrar las mejores opciones. Súper de confianza.",
    name: "@dayanjair",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-san-dymart",
    quote: "¡Recomendado! Persona de súper confianza y experta.",
    name: "@san_dymart",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-jessii-paam",
    quote:
      "Gracias por todas las atenciones y recomendaciones… disfrutamos mucho este viaje.",
    name: "@jessii_paam",
    source: "Instagram",
    published: false,
  },
  {
    id: "ig-mensaje-regreso",
    quote:
      "Mil gracias por todo el apoyo y asesoría. Todos muy felices con el servicio que ofreces con tu agencia.",
    name: "[Nombre]",
    source: "mensaje directo",
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
