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
    {
      url: `${SITE_URL}/aviso-de-privacidad`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
