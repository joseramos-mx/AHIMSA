/**
 * Contenido de /unete-a-mi-equipo (reclutamiento de agentes de viaje).
 */

/**
 * Número de proveedores. Confirmar cifra vigente y usar la misma en todo el
 * sitio (también la usa lib/how-we-work.ts en la landing).
 */
export const PROVIDERS_COUNT = 130;

export const JOIN_HERO = {
  eyebrow: "Únete a mi equipo",
  title: "Convierte tu pasión por viajar en tu propio negocio",
  text: "Certifícate como agente de viajes y aprende a operar tu agencia con acompañamiento desde cero.",
  /** Foto 4:5. Si falta, se ve un bloque con el nombre del archivo. */
  image: "/media/join/hero.jpg",
};

export const FOR_WHO = {
  title: "¿Es para ti?",
  text: "Si siempre eres quien busca destinos, arma itinerarios y organiza las vacaciones de tu familia y amigos, esto es para ti. No necesitas experiencia previa: yo te acompaño para que aprendas cómo funciona el negocio.",
};

export type IncludeIcon = "anywhere" | "providers" | "dollar" | "training" | "support";

export const INCLUDES: { icon: IncludeIcon; title: string; text: string }[] = [
  {
    icon: "anywhere",
    title: "Trabaja desde donde quieras",
    text: "Organiza tus tiempos y vive la libertad de trabajar mientras viajas.",
  },
  {
    icon: "providers",
    title: `Más de ${PROVIDERS_COUNT} proveedores`,
    text: "Hoteles, aerolíneas, tours, cruceros y más a nivel global.",
  },
  {
    icon: "dollar",
    title: "Comisiones en dólares",
    text: "Generas ingresos por cada reserva que realices.",
  },
  {
    icon: "training",
    title: "Capacitación desde cero",
    text: "Certificación, entrenamientos y herramientas para empezar bien.",
  },
  {
    icon: "support",
    title: "Acompañamiento en todo el proceso",
    text: "No empiezas sola ni solo: te guío en tus primeras ventas.",
  },
];

export const JOIN_STEPS = [
  {
    number: "01",
    title: "Platicamos",
    text: "Te cuento cómo funciona y resolvemos tus dudas, sin compromiso.",
  },
  {
    number: "02",
    title: "Eliges tu plan",
    text: "Escoges el plan que mejor se adapta a ti.",
  },
  {
    number: "03",
    title: "Te certificas",
    text: "Tomas la certificación y la capacitación a tu ritmo.",
  },
  {
    number: "04",
    title: "Tus primeras ventas",
    text: "Cotizas y reservas tus primeros viajes con mi acompañamiento.",
  },
];

/* ==========================================================================
 *  CONFIRMAR PRECIOS Y CONDICIONES VIGENTES CON EVOLUTION ANTES DE PUBLICAR.
 *
 *  Con published: false el plan solo se ve en desarrollo (marcado
 *  "Borrador"). Si ningún plan está publicado, en producción se muestra
 *  solo PRICING_FALLBACK y el botón de WhatsApp.
 * ========================================================================== */
export type Plan = {
  name: string;
  enrollment: string;
  /** Precio mensual sin "al mes" (la UI lo agrega siempre). */
  monthly: string;
  /** Nota del precio, p. ej. región. */
  monthlyNote?: string;
  commission: string;
  published: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "EvoBasics",
    enrollment: "[Confirmar]",
    monthly: "69.99 USD",
    commission: "Recibes el 50% de la comisión",
    published: false,
  },
  {
    name: "EvoEssentials",
    enrollment: "[Confirmar]",
    monthly: "79.99 USD",
    monthlyNote: "México y LATAM",
    commission: "Recibes el 80% de la comisión",
    published: false,
  },
];

export const PRICING = {
  title: "Costos claros, sin letras chiquitas",
  /** Se muestra en producción si ningún plan está publicado. "al mes" va
   *  incluido a propósito. */
  fallback: "Planes desde 69.99 USD al mes",
  finePrint:
    "La comisión es un porcentaje de lo que el proveedor paga por cada reserva, no del precio total del viaje. Sin plazos forzosos.",
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** En producción solo los planes publicados; en desarrollo todos. */
export function getVisiblePlans(): Plan[] {
  return IS_PRODUCTION ? PLANS.filter((p) => p.published) : PLANS;
}

/** Cómo mencionar a la empresa que respalda la operación. Confirmar. */
export const BACKING_COMPANY = "[Archer Travel Group / Evolution]";

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Necesito experiencia?",
    answer:
      "No. Recibes capacitación desde cero y acompañamiento en tus primeras ventas.",
  },
  {
    question: "¿Tengo que reclutar personas?",
    answer:
      "No. Invitar a otras personas es completamente opcional. Puedes dedicarte solo a vender viajes.",
  },
  {
    question: "¿Cuánto puedo ganar?",
    answer:
      "Depende de cuánto vendas y del tipo de viajes. No hay ingresos garantizados: tu resultado depende de tu trabajo.",
  },
  {
    question: "¿Puedo cancelar?",
    answer: "Sí, no hay plazos forzosos.",
  },
  {
    question: "¿Quién respalda la operación?",
    answer: `Trabajo afiliada a ${BACKING_COMPANY}, que da la certificación, el acceso a proveedores y el pago de comisiones.`,
  },
];

export const JOIN_CTA = {
  title: "¿Quieres formar parte de mi equipo?",
  formLabel: "Prefiero llenar un formulario",
  disclaimer:
    "Los ingresos dependen de las ventas de cada agente. No se garantizan ganancias.",
};
