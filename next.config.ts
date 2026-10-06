import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
