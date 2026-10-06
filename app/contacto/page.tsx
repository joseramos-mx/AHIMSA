import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import ContactView from "@/components/Contact/ContactView";

export const metadata: Metadata = {
  title: "Contacto | Ahimsa Travel",
  description:
    "Cuéntame tu viaje, el de tu empresa o si quieres ser agente de viajes. Te contacto en menos de 24 horas.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      {/* Sin props: header fijo en estado final; sus anclas llevan a /#… */}
      <Header />
      {/* ContactView lee ?tipo, ?servicio y ?circuito con useSearchParams. */}
      <Suspense fallback={<main className="min-h-screen bg-cream" />}>
        <ContactView />
      </Suspense>
    </>
  );
}
