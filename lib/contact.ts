/**
 * Datos de contacto compartidos (CTA y, a futuro, el botón flotante).
 *
 * WHATSAPP_NUMBER: formato internacional sin "+", espacios ni guiones.
 * Ej. México móvil: 52 + 10 dígitos → "5215512345678" o "525512345678".
 * TODO: reemplazar por el número real.
 */
export const WHATSAPP_NUMBER = "520000000000";

/** Mensaje prellenado al abrir el chat. */
export const WHATSAPP_MESSAGE = "Hola, vi tu página y quiero diseñar un viaje.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;
