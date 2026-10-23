/*
 * Política de cambios, cancelaciones y reembolsos.
 *
 * TEXTO PROVISIONAL: debe validarlo un abogado o la responsable del negocio.
 * Reemplaza cada [texto entre corchetes] con las condiciones reales.
 */
import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de reembolsos",
  description: `Cómo funcionan los cambios, cancelaciones y reembolsos de los viajes organizados por ${LEGAL.tradeName}.`,
  alternates: { canonical: "/politica-de-reembolsos" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "principio",
    title: "Cómo funcionan los reembolsos",
    body: [
      "Cada servicio de tu viaje (vuelo, hotel, tour, crucero, entradas) tiene sus propias reglas de cambio y cancelación, que fija el proveedor. Antes de que pagues te diremos cuáles son reembolsables, cuáles tienen penalidad y cuáles no admiten reembolso, para que decidas con toda la información.",
      "Cuando un reembolso procede, lo gestionamos nosotros con el proveedor: tú no tienes que hacer trámites por tu cuenta.",
    ],
  },
  {
    id: "cargo-servicio",
    title: "Cargo por servicio",
    body: [
      "[Indicar si existe un cargo por diseño o gestión del viaje, su monto y si es reembolsable o no. Si no hay cargo por servicio, decirlo aquí.]",
    ],
  },
  {
    id: "cancelacion-viajero",
    title: "Si tú cancelas",
    body: [
      <LegalList
        key="cancelacion-lista"
        items={[
          "Solicita la cancelación por escrito (correo o WhatsApp) lo antes posible: mientras antes avises, menores suelen ser las penalidades.",
          "Se aplicarán las penalidades de cada proveedor según la fecha de cancelación.",
          "Las tarifas marcadas como no reembolsables no se devuelven, aunque en algunos casos pueden convertirse en crédito para un viaje futuro.",
        ]}
      />,
    ],
  },
  {
    id: "cambios",
    title: "Cambios de fechas, nombres o servicios",
    body: [
      "Los cambios están sujetos a disponibilidad y pueden generar diferencias de tarifa o cargos del proveedor. Te los confirmaremos antes de aplicarlos.",
    ],
  },
  {
    id: "cancelacion-proveedor",
    title: "Si el proveedor cancela o hay causas de fuerza mayor",
    body: [
      "Si un proveedor cancela un servicio, o el viaje no puede realizarse por causas ajenas a ti (clima, desastres naturales, disposiciones de autoridades), te ayudaremos a obtener el reembolso, el crédito o la alternativa que ofrezca el proveedor según sus políticas.",
    ],
  },
  {
    id: "plazos",
    title: "Plazos y forma de reembolso",
    body: [
      "Los reembolsos se hacen por el mismo medio de pago que utilizaste, en un plazo de [número] días hábiles a partir de que recibamos el reembolso del proveedor. Los tiempos de cada proveedor pueden variar; te mantendremos al tanto.",
    ],
  },
  {
    id: "seguro",
    title: "Seguro de cancelación",
    body: [
      "Te recomendamos contratar un seguro de viaje con cobertura de cancelación: puede cubrir penalidades por motivos como enfermedad o emergencias familiares.",
    ],
  },
  {
    id: "agentes",
    title: "Programa de agentes",
    body: [
      "Los planes del programa de agentes no tienen plazos forzosos: puedes cancelar cuando quieras. [Indicar si la inscripción y las mensualidades ya pagadas son reembolsables y en qué casos.]",
    ],
  },
  {
    id: "solicitar",
    title: "Cómo solicitar un cambio o reembolso",
    body: [
      <>
        Escribe a{" "}
        <a href={`mailto:${LEGAL.email}`} className="underline underline-offset-2 hover:text-accent-dark">
          {LEGAL.email}
        </a>{" "}
        o por WhatsApp al {LEGAL.whatsapp} con tu nombre, las fechas de tu viaje y qué necesitas. Te confirmaremos por escrito las condiciones que aplican antes de hacer cualquier movimiento.
      </>,
      <>
        Consulta también nuestros{" "}
        <Link href="/terminos-y-condiciones" className="underline underline-offset-2 hover:text-accent-dark">
          términos y condiciones
        </Link>
        .
      </>,
    ],
  },
];

export default function ReembolsosPage() {
  return (
    <LegalPage
      title="Política de reembolsos"
      intro={<p>Sin letras chiquitas: así funcionan los cambios, cancelaciones y reembolsos de tu viaje.</p>}
      sections={SECTIONS}
    />
  );
}
