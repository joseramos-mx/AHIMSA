/**
 * URL pública del sitio (metadataBase, Open Graph y sitemap).
 * TODO: confirmar el dominio definitivo; en Vercel se puede definir
 * NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahimsa.travel";

export const SITE_NAME = "Ahimsa Travel";

/** Quién está detrás de la marca (marca personal: SEO, botón de WhatsApp). */
export const FOUNDER = {
  /** Nombre completo, tal como aparece en el logo. */
  fullName: "Fátima Nieto",
  /** Cómo se presenta en el sitio ("Escríbele a Fátima"). */
  firstName: "Fátima",
  role: "Travel planner certificada",
  /** Foto 4:5 ("Cómo trabajamos") y avatar cuadrado (botón de WhatsApp). */
  photo: "/media/about/foto-perfil.jpg",
  avatar: "/media/about/avatar.jpg",
};

/** Imagen para compartir en redes (1200×630), con su foto y el logo. */
export const OG_IMAGE = "/og.jpg";
