/**
 * Contenido de la sección "Cómo trabajamos" (#como-trabajamos).
 */

import { PROVIDERS_COUNT } from "./join";

/** Nombre de la fundadora. Se usa en el título y en el alt de la foto. */
export const FOUNDER_NAME = "Fátima";

/** Foto de perfil (proporción 4:5). Si falta, se ve un bloque con el nombre
 *  del archivo en su lugar. */
export const FOUNDER_PHOTO = "/media/about/foto-perfil.jpg";

// TODO: texto provisional — reemplazar por la historia real de la fundadora.
export const ABOUT_TEXT =
  `Llevo años recorriendo Europa y planeando viajes para familias que quieren vivirla sin estrés. Fundé Ahimsa con una idea simple: que cada viaje se diseñe alrededor de las personas que lo van a vivir, no al revés. Trabajo con más de ${PROVIDERS_COUNT} proveedores internacionales y una red de agentes en todo el mundo, pero cada itinerario lo armo yo, a mano.`;

/** Datos cortos debajo de la historia. */
export const ABOUT_FACTS = [
  "Europa es mi especialidad",
  `Más de ${PROVIDERS_COUNT} proveedores`,
  "Te acompaño en todo el viaje",
];

export const STEPS_TITLE = "Así diseñamos tu viaje";
export const STEPS_INTRO =
  "Cuatro pasos y un solo objetivo: que tú solo te preocupes por disfrutar.";
export const STEPS_CTA = { label: "Empecemos con el paso 1", href: "/contacto" };

export type Step = {
  number: string;
  title: string;
  text: string;
};

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Platiquemos",
    text: "Me cuentas qué sueñas, con quién viajas, tus fechas y tu presupuesto. Sin compromiso.",
  },
  {
    number: "02",
    title: "Diseño tu itinerario",
    text: "Te presento una propuesta con hoteles, traslados y experiencias pensadas para tu familia, y la ajustamos juntos hasta que sea exactamente lo que quieres.",
  },
  {
    number: "03",
    title: "Reservo todo",
    text: "Vuelos, hoteles, entradas y traslados confirmados, organizados en un solo lugar.",
  },
  {
    number: "04",
    title: "Te acompaño",
    text: "Antes de salir te doy mis tips para moverte allá. Durante el viaje estoy disponible por WhatsApp. Y al volver, me cuentas cómo te fue.",
  },
];
