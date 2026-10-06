/**
 * Datos de contacto compartidos (CTA, footer, /unete-a-mi-equipo).
 *
 * WHATSAPP_NUMBER: formato internacional sin "+", espacios ni guiones
 * (+52 556 188 8805 → "525561888805").
 */
export const WHATSAPP_NUMBER = "525561888805";

/** Link de WhatsApp con un mensaje prellenado. */
export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Mensaje prellenado general (landing, footer). */
export const WHATSAPP_MESSAGE = "Hola, vi tu página y quiero diseñar un viaje.";
export const WHATSAPP_URL = whatsappUrl(WHATSAPP_MESSAGE);

/** Mensaje prellenado de /unete-a-mi-equipo. */
export const WHATSAPP_AGENT_MESSAGE =
  "Hola, vi tu página y quiero saber cómo ser agente de viajes.";
export const WHATSAPP_AGENT_URL = whatsappUrl(WHATSAPP_AGENT_MESSAGE);

/** Tiempo de respuesta prometido en /contacto ("Te contacto en …"). */
export const RESPONSE_TIME = "menos de 24 horas";
