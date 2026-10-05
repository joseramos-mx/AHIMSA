import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import FooterCurtain from "@/components/Footer/FooterCurtain";
import { SITE_URL } from "@/lib/site";

// Fuente variable (todos los pesos; el sitio usa light/300 en la serif) con
// eje de tamaño óptico (opsz), que ajusta el dibujo al tamaño del texto.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  // Base para las URLs absolutas de Open Graph, canonical y sitemap.
  metadataBase: new URL(SITE_URL),
  title: "AHIMSA — Viajes a medida en Europa",
  description:
    "Agencia de viajes especializada en Europa bespoke. Itinerarios a la medida, los mejores hoteles y acompañamiento antes, durante y después de tu viaje.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3EEE6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${figtree.variable}`}>
      <body className="font-figtree bg-cream text-ink antialiased">
        <FooterCurtain footer={<Footer />}>{children}</FooterCurtain>
      </body>
    </html>
  );
}
