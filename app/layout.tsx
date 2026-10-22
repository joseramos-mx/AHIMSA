import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import FooterCurtain from "@/components/Footer/FooterCurtain";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { FOUNDER, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { CONTACT_EMAIL, SOCIAL_LINKS, isRealUrl } from "@/lib/footer";
import { WHATSAPP_NUMBER } from "@/lib/contact";

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
  // Marca personal: el nombre de Fátima va en el título de todas las páginas.
  title: {
    default: `${SITE_NAME} · ${FOUNDER.fullName}, travel planner`,
    template: `%s | ${SITE_NAME} · ${FOUNDER.fullName}`,
  },
  description: `${FOUNDER.fullName}, ${FOUNDER.role.toLowerCase()}, diseña viajes a la medida por Europa para familias y amigos: itinerarios personalizados, los mejores hoteles y acompañamiento antes, durante y después del viaje.`,
  applicationName: SITE_NAME,
  authors: [{ name: FOUNDER.fullName }],
  creator: FOUNDER.fullName,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: `${SITE_NAME} · ${FOUNDER.fullName}`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${FOUNDER.fullName}, fundadora de ${SITE_NAME}, en París` }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

/** Datos estructurados: la agencia y su fundadora (Google, previews). */
const SAME_AS = SOCIAL_LINKS.filter((s) => isRealUrl(s.href)).map((s) => s.href);
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#agencia`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo-total-color.svg`,
      image: `${SITE_URL}${OG_IMAGE}`,
      email: CONTACT_EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      sameAs: SAME_AS,
      founder: { "@id": `${SITE_URL}/#fundadora` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#fundadora`,
      name: FOUNDER.fullName,
      jobTitle: FOUNDER.role,
      image: `${SITE_URL}${FOUNDER.photo}`,
      worksFor: { "@id": `${SITE_URL}/#agencia` },
      sameAs: SAME_AS,
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <FooterCurtain footer={<Footer />}>{children}</FooterCurtain>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
