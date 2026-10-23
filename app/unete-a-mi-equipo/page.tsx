import type { Metadata } from "next";
import Header from "@/components/Header";
import JoinHero from "@/components/Join/JoinHero";
import ForWho from "@/components/Join/ForWho";
import Includes from "@/components/Join/Includes";
import JoinSteps from "@/components/Join/JoinSteps";
import Pricing from "@/components/Join/Pricing";
import Faq from "@/components/Join/Faq";
import JoinCta from "@/components/Join/JoinCta";
import { OG_IMAGE } from "@/lib/site";

const TITLE = "Únete a mi equipo de agentes de viaje";
const DESCRIPTION =
  "Certifícate como agente de viajes y opera tu propia agencia con acompañamiento desde cero: capacitación, proveedores globales y comisiones en dólares.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/unete-a-mi-equipo" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/unete-a-mi-equipo",
    type: "website",
    locale: "es_MX",
    // Mientras no exista la foto del hero de esta página, la general.
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

/** Página de reclutamiento. Solo se enlaza desde el footer (no desde el nav). */
export default function UneteAMiEquipoPage() {
  return (
    <>
      {/* Sin props: header fijo en estado final; sus anclas llevan a /#… */}
      <Header />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <JoinHero />
        <ForWho />
        <Includes />
        <JoinSteps />
        <Pricing />
        <Faq />
        <JoinCta />
      </main>
    </>
  );
}
