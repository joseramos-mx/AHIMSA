import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // URLs de los anuncios de Google Ads que no existen como páginas. Son
  // temporales (307) para poder cambiar el destino; la query (gclid, utm_*)
  // pasa al destino.
  async redirects() {
    return [
      { source: "/viajes/empresariales", destination: "/contacto?tipo=empresa", permanent: false },
      { source: "/viajes/familiares", destination: "/#viajes", permanent: false },
      { source: "/resort_cruceros/vacaciones", destination: "/contacto?tipo=premium-resorts", permanent: false },
    ];
  },
  images: {
    // SVGs del logo viven en /public y son de confianza (los exportamos
    // nosotros). Sin esto, next/image rechaza los SVG por default.
    // La CSP restringe scripts dentro del SVG como medida de seguridad.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
