import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** La landing es la página principal; /unete-a-mi-equipo va con prioridad
 *  media para no competir con ella. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/unete-a-mi-equipo`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.6 },
    ...[
      "/aviso-de-privacidad",
      "/terminos-y-condiciones",
      "/politica-de-reembolsos",
      "/derechos-arco",
    ].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
