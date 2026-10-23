/*
 * Términos y condiciones.
 *
 * TEXTO PROVISIONAL: debe validarlo un abogado o la responsable del negocio
 * (en México, los servicios de agencias de viajes se rigen por la Ley
 * Federal de Protección al Consumidor y la NOM-010-TUR). Reemplaza cada
 * [texto entre corchetes].
 */
import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Condiciones para usar el sitio y contratar servicios de viaje con ${LEGAL.tradeName}.`,
  alternates: { canonical: "/terminos-y-condiciones" },
};

const L = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="underline underline-offset-2 hover:text-accent-dark">
    {children}
  </Link>
);

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Quiénes somos",
    body: [
      `${LEGAL.responsible} (“${LEGAL.tradeName}”) diseña y organiza viajes a la medida. Actuamos como agencia de viajes intermediaria entre tú y los proveedores de servicios turísticos (aerolíneas, hoteles, operadores, navieras, parques y aseguradoras), en afiliación con ${LEGAL.backingCompany}.`,
      `Contacto: ${LEGAL.email} · WhatsApp ${LEGAL.whatsapp} · ${LEGAL.address}.`,
    ],
  },
  {
    id: "uso-del-sitio",
    title: "Uso de este sitio",
    body: [
      "La información del sitio (destinos, itinerarios de ejemplo, fotos y descripciones) es orientativa. Los precios, la disponibilidad y las condiciones definitivas son las que aparecen en tu cotización por escrito.",
      "Enviar el formulario de contacto no te obliga a contratar ni genera ningún cargo.",
    ],
  },
  {
    id: "cotizaciones",
    title: "Cotizaciones",
    body: [
      <LegalList
        key="cotizaciones-lista"
        items={[
          "Cada cotización indica los servicios incluidos y no incluidos, su precio total y su vigencia de [número] días.",
          "Los precios están sujetos a disponibilidad hasta que la reserva se confirme y pueden variar por el tipo de cambio cuando estén en otra moneda.",
          "Una cotización no garantiza lugares ni tarifas hasta que se confirma la reserva y se realiza el pago correspondiente.",
        ]}
      />,
    ],
  },
  {
    id: "reservas-pagos",
    title: "Reservas y pagos",
    body: [
      <LegalList
        key="pagos-lista"
        items={[
          "La reserva se confirma por escrito (correo o WhatsApp) una vez recibido el anticipo o pago que se indique en tu cotización.",
          "Formas de pago aceptadas: [transferencia, tarjeta, etc.].",
          "Los saldos deben cubrirse en las fechas indicadas; si no, los proveedores pueden cancelar la reserva y aplicar sus penalidades.",
          "Recibirás los comprobantes y documentos de viaje (vouchers, boletos, confirmaciones) antes de tu salida.",
        ]}
      />,
    ],
  },
  {
    id: "intermediario",
    title: "Nuestro papel como intermediarios",
    body: [
      "Los servicios los presta cada proveedor bajo sus propias condiciones (por ejemplo, políticas de equipaje, horarios, cambios y cancelaciones), que te compartiremos antes de que contrates.",
      "Te acompañamos y gestionamos con los proveedores cualquier incidencia, pero no somos responsables de retrasos, cancelaciones, sobreventas o cambios decididos por ellos, ni de causas de fuerza mayor (clima, desastres naturales, conflictos, disposiciones de autoridades).",
    ],
  },
  {
    id: "documentacion",
    title: "Documentación y requisitos de viaje",
    body: [
      "Cada viajero es responsable de contar con pasaporte vigente, visas, permisos de salida de menores, vacunas y cualquier otro requisito del destino y de los países de conexión. Te orientamos sobre lo que suele pedirse, pero los requisitos los define cada país y pueden cambiar.",
      "Los nombres de las reservas deben coincidir exactamente con los documentos de identidad; correcciones posteriores pueden tener costo.",
    ],
  },
  {
    id: "seguro",
    title: "Seguro de viaje",
    body: [
      "Te recomendamos contratar un seguro de viaje con cobertura médica y de cancelación. Si decides no contratarlo, asumes los gastos que podrían haber estado cubiertos.",
    ],
  },
  {
    id: "cambios-cancelaciones",
    title: "Cambios y cancelaciones",
    body: [
      <>
        Las condiciones para cambios, cancelaciones y reembolsos están en nuestra{" "}
        <L href="/politica-de-reembolsos">política de reembolsos</L>.
      </>,
    ],
  },
  {
    id: "agentes",
    title: "Programa de agentes",
    body: [
      <>
        Si te unes al programa de agentes desde{" "}
        <L href="/unete-a-mi-equipo">Únete a mi equipo</L>, aplican además las condiciones del plan que elijas, que te compartiremos por escrito antes de inscribirte. Los ingresos dependen de las ventas de cada agente: no se garantizan ganancias.
      </>,
    ],
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual",
    body: [
      `El logotipo, los textos, las fotografías y el diseño de este sitio pertenecen a ${LEGAL.tradeName} o a sus autores y no pueden usarse sin autorización. Las marcas de terceros mencionadas pertenecen a sus titulares.`,
    ],
  },
  {
    id: "datos",
    title: "Datos personales",
    body: [
      <>
        Tratamos tus datos conforme a nuestro <L href="/aviso-de-privacidad">aviso de privacidad</L>.
      </>,
    ],
  },
  {
    id: "quejas",
    title: "Dudas, quejas y ley aplicable",
    body: [
      `Si tienes una duda o inconformidad, escríbenos a ${LEGAL.email}; te responderemos lo antes posible. También puedes acudir a la Procuraduría Federal del Consumidor (Profeco).`,
      "Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a los tribunales competentes de [ciudad], salvo lo que disponga la ley a favor del consumidor.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={<p>Estas son las reglas claras de cómo trabajamos juntos. Si algo no queda claro, pregúntanos antes de contratar.</p>}
      sections={SECTIONS}
    />
  );
}
