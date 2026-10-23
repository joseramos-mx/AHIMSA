/**
 * Datos legales compartidos por las páginas de aviso de privacidad,
 * términos, reembolsos y derechos ARCO.
 *
 * TEXTOS PROVISIONALES: el contenido legal debe validarlo un abogado o la
 * responsable del negocio antes de considerarse definitivo. Reemplaza cada
 * [texto entre corchetes].
 */
import { CONTACT_EMAIL } from "./footer";
import { BACKING_COMPANY } from "./join";
import { FOUNDER, SITE_NAME, SITE_URL } from "./site";

export const LEGAL = {
  /** Responsable del tratamiento. TODO: confirmar nombre legal completo
   *  (o razón social) y RFC si aplica. */
  responsible: `${FOUNDER.fullName}, que opera bajo el nombre comercial ${SITE_NAME}`,
  tradeName: SITE_NAME,
  /** TODO: domicilio para oír y recibir notificaciones (obligatorio en el
   *  aviso de privacidad integral). */
  address: "[Domicilio completo para recibir notificaciones]",
  email: CONTACT_EMAIL,
  whatsapp: "+52 556 188 8805",
  site: SITE_URL,
  /** Empresa con la que opera afiliada (proveedores, pagos, certificación). */
  backingCompany: BACKING_COMPANY,
  /** Fecha de la última actualización de los textos legales. */
  updatedAt: "22 de octubre de 2026",
  /** Plazo de respuesta a solicitudes ARCO (la ley marca un máximo de 20
   *  días hábiles). */
  arcoResponseDays: 20,
};

/** Páginas legales (footer, sitemap). */
export const LEGAL_LINKS = [
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Política de reembolsos", href: "/politica-de-reembolsos" },
  { label: "Eliminar mis datos", href: "/derechos-arco" },
];
