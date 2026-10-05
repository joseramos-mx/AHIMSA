/**
 * Contenido del footer.
 */

export const FOOTER_CLOSING = {
  title: "¿Lista tu próxima aventura? Empecemos a diseñarla.",
  cta: { label: "Cotiza tu viaje", href: "/contacto" },
};

// TODO: reemplazar por el correo y horario reales.
export const CONTACT_EMAIL = "[correo@ahimsa.travel]";
export const CONTACT_HOURS = "[Horario de atención]";

export const FOOTER_TAGLINE = "Viajes que inspiran";

/** Link extra al final de "Explora" (no va en el nav principal). */
export const JOIN_LINK = { label: "Únete a mi equipo", href: "/unete-a-mi-equipo" };

export type SocialLink = {
  network: string;
  handle: string;
  /** URL real (https://…). Mientras sea un placeholder entre corchetes el
   *  link no aparece en producción (en desarrollo se marca "Borrador"). */
  href: string;
};

export const INSTAGRAM: SocialLink = {
  network: "Instagram",
  handle: "@ahimsa.travel",
  href: "https://www.instagram.com/ahimsa.travel/",
};

export const SOCIAL_LINKS: SocialLink[] = [
  INSTAGRAM,
  {
    network: "TikTok",
    handle: "@ahimsaatravel",
    href: "https://www.tiktok.com/@ahimsaatravel",
  },
  // TODO: URL real de la página de Facebook.
  { network: "Facebook", handle: "Ahimsa Travel", href: "[URL de Facebook]" },
];

export const isRealUrl = (href: string) => /^https?:\/\//.test(href);

export type Credential = {
  /** Texto tal como debe aparecer (sin logos). */
  label: string;
  published: boolean;
};

/*
 * Mostrar solo credenciales que Archer autorice explícitamente.
 *
 * Con published: false solo se ven en desarrollo (marcadas "Borrador");
 * en producción no aparecen. Si ninguna está publicada, la columna
 * "Respaldo" no se renderiza.
 */
export const CREDENTIALS: Credential[] = [
  { label: "[Credencial o certificación 1]", published: false },
  { label: "[Asociación o membresía]", published: false },
  { label: "[Seguro o respaldo de operador]", published: false },
];

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** En producción solo las publicadas; en desarrollo todas. */
export function getVisibleCredentials(): Credential[] {
  return IS_PRODUCTION ? CREDENTIALS.filter((c) => c.published) : CREDENTIALS;
}
