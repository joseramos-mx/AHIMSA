/*
 * Derechos ARCO y eliminación de datos.
 * TEXTO PROVISIONAL: debe validarlo un abogado o la responsable del negocio.
 */
import type { Metadata } from "next";
import Link from "next/link";
import ArcoForm from "@/components/ArcoForm";
import LegalPage, { LegalList, type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Derechos ARCO y eliminación de datos",
  description: "Pide acceder, corregir o eliminar tus datos personales, o revocar tu consentimiento.",
  alternates: { canonical: "/derechos-arco" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "que-puedes-pedir",
    title: "Qué puedes pedir",
    body: [
      <LegalList
        key="arco-lista"
        items={[
          <><strong className="font-medium">Acceso:</strong> saber qué datos tuyos tenemos y para qué los usamos.</>,
          <><strong className="font-medium">Rectificación:</strong> corregir datos inexactos o incompletos.</>,
          <><strong className="font-medium">Cancelación:</strong> que eliminemos tus datos.</>,
          <><strong className="font-medium">Oposición:</strong> que dejemos de usarlos para una finalidad.</>,
          <><strong className="font-medium">Revocación:</strong> retirar el consentimiento que nos diste.</>,
        ]}
      />,
    ],
  },
  {
    id: "como-funciona",
    title: "Cómo funciona",
    body: [
      `Envía el formulario de abajo o escribe a ${LEGAL.email}. Te responderemos en un máximo de ${LEGAL.arcoResponseDays} días hábiles y, si procede, aplicaremos el cambio dentro de los 15 días hábiles siguientes.`,
      "Para proteger tu información, podemos pedirte que confirmes tu identidad (por ejemplo, respondiendo desde el mismo correo o teléfono con el que nos contactaste) antes de entregar o eliminar datos.",
      "Si eliminamos tus datos, borraremos tu solicitud y tus mensajes de nuestros sistemas. Solo conservaremos lo que la ley nos obligue a guardar (por ejemplo, comprobantes fiscales de un viaje contratado).",
    ],
  },
  {
    id: "mas-informacion",
    title: "Más información",
    body: [
      <>
        Consulta nuestro{" "}
        <Link href="/aviso-de-privacidad" className="underline underline-offset-2 hover:text-accent-dark">
          aviso de privacidad
        </Link>{" "}
        para saber qué datos recabamos y con quién los compartimos.
      </>,
    ],
  },
];

export default function DerechosArcoPage() {
  return (
    <LegalPage
      title="Derechos ARCO y eliminación de datos"
      intro={<p>Puedes pedir en cualquier momento que te digamos qué datos tenemos, que los corrijamos o que los eliminemos. Es gratis y sencillo.</p>}
      sections={SECTIONS}
    >
      <ArcoForm />
    </LegalPage>
  );
}
