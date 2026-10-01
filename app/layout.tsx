import type { Metadata, Viewport } from "next";
import { Playfair_Display, Figtree } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="es" className={`${playfair.variable} ${figtree.variable}`}>
      <body className="font-figtree bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
