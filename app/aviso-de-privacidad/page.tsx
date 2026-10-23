/*
 * Aviso de privacidad integral (México).
 *
 * TEXTO PROVISIONAL: debe validarlo un abogado o la responsable del negocio.
 * Refleja lo que el sitio hace HOY (formulario de /contacto, Supabase,
 * Resend, n8n, Vercel). Si cambia lo que se recaba o con quién se comparte,
 * actualiza este texto y la fecha en lib/legal.ts.
 */
import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalList, type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Cómo ${LEGAL.tradeName} recaba, usa y protege tus datos personales, y cómo ejercer tus derechos ARCO.`,
  alternates: { canonical: "/aviso-de-privacidad" },
  robots: { index: true, follow: true },
};

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="underline underline-offset-2 hover:text-accent-dark">
    {children}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Quién es responsable de tus datos",
    body: [
      `${LEGAL.responsible} (en adelante, “${LEGAL.tradeName}”), con domicilio en ${LEGAL.address}, es responsable del tratamiento de tus datos personales.`,
      <>
        Para cualquier tema relacionado con tus datos puedes escribir a{" "}
        <A href={`mailto:${LEGAL.email}`}>{LEGAL.email}</A> o por WhatsApp al {LEGAL.whatsapp}.
      </>,
    ],
  },
  {
    id: "datos",
    title: "Qué datos recabamos",
    body: [
      "Solo pedimos lo necesario para responder tu solicitud y, si decides contratar, organizar tu viaje.",
      <LegalList
        key="datos-lista"
        items={[
          <><strong className="font-medium">Contacto:</strong> nombre, WhatsApp, correo electrónico y el medio por el que prefieres que te contactemos.</>,
          <><strong className="font-medium">Si quieres viajar:</strong> tipo de viaje, destino, fechas o mes aproximado, noches, número de adultos y menores, edad de los menores, ocasión, presupuesto aproximado y lo que nos quieras contar de tu idea.</>,
          <><strong className="font-medium">Si es un viaje de empresa:</strong> nombre de la empresa, tu cargo, cuántas personas viajan, tipo y frecuencia de los viajes y tus comentarios.</>,
          <><strong className="font-medium">Si quieres ser agente:</strong> ciudad y país, si tienes experiencia en turismo, cómo te enteraste y qué te gustaría vender.</>,
          <><strong className="font-medium">Datos técnicos mínimos:</strong> la página desde la que llegaste, los parámetros de campaña de la liga (por ejemplo, utm_source) y una huella cifrada e irreversible de tu dirección IP que solo sirve para evitar envíos masivos y se borra a las 24 horas. No guardamos tu dirección IP ni datos de tu navegador.</>,
          <><strong className="font-medium">Si contratas un viaje:</strong> los datos que pidan los proveedores para emitir tus reservas (por ejemplo, nombre como aparece en el pasaporte, fecha de nacimiento, número de pasaporte o datos de facturación). Estos se piden directamente en ese momento, no en este sitio.</>,
        ]}
      />,
      "No solicitamos datos sensibles en el formulario. Si para tu viaje nos compartes información de salud (por ejemplo, alergias o necesidades de movilidad), solo la usaremos para organizarlo y te pediremos tu consentimiento expreso en ese momento. Los datos de menores de edad deben proporcionarlos su madre, padre o tutor.",
    ],
  },
  {
    id: "finalidades",
    title: "Para qué los usamos",
    body: [
      "Usamos tus datos para estas finalidades, necesarias para darte el servicio:",
      <LegalList
        key="finalidades-lista"
        items={[
          "Responder tu solicitud y contactarte por el medio que elegiste.",
          "Preparar cotizaciones y propuestas de itinerario.",
          "Reservar y dar seguimiento a los servicios que contrates (vuelos, hoteles, traslados, entradas, seguros, etc.).",
          "Acompañarte antes, durante y después del viaje.",
          "Emitir comprobantes y cumplir obligaciones legales y fiscales.",
          "Si te interesa ser agente, darte información sobre el programa.",
        ]}
      />,
      "No usamos tus datos para publicidad, perfiles comerciales ni ninguna otra finalidad secundaria. Si algún día quisiéramos hacerlo, te pediríamos tu consentimiento por separado.",
    ],
  },
  {
    id: "compartir",
    title: "Con quién los compartimos",
    body: [
      "Para operar este sitio usamos proveedores de tecnología que tratan tus datos únicamente por nuestra cuenta y bajo nuestras instrucciones. Algunos tienen servidores fuera de México:",
      <LegalList
        key="encargados-lista"
        items={[
          "Vercel: hospedaje del sitio web.",
          "Supabase: base de datos donde se guardan las solicitudes.",
          "Resend: envío del aviso por correo de cada solicitud.",
          "n8n: automatización interna para dar seguimiento a las solicitudes.",
          "Google (Gmail): buzón de correo donde recibimos y respondemos tus mensajes.",
        ]}
      />,
      `Si contratas un viaje, compartiremos los datos necesarios con los proveedores que lo hacen posible (aerolíneas, hoteles, operadores, navieras, aseguradoras) y con ${LEGAL.backingCompany}, empresa con la que operamos para reservas y pagos. Estas transferencias son necesarias para cumplir lo que contrataste, por lo que no requieren tu consentimiento adicional. También podemos compartir datos cuando una autoridad competente lo requiera conforme a la ley.`,
      "Nunca vendemos ni rentamos tus datos.",
    ],
  },
  {
    id: "arco",
    title: "Tus derechos ARCO y cómo ejercerlos",
    body: [
      "Tienes derecho a Acceder a tus datos, Rectificarlos si son inexactos, Cancelarlos (pedir que los eliminemos) y Oponerte a su uso. También puedes revocar tu consentimiento o pedir que limitemos su uso.",
      <>
        Para hacerlo, usa el formulario de{" "}
        <Link href="/derechos-arco" className="underline underline-offset-2 hover:text-accent-dark">
          derechos ARCO y eliminación de datos
        </Link>{" "}
        o escribe a <A href={`mailto:${LEGAL.email}`}>{LEGAL.email}</A>. Tu solicitud debe incluir tu nombre, el correo o teléfono con el que nos contactaste, qué derecho quieres ejercer y, si es posible, una descripción de los datos de que se trata.
      </>,
      `Para proteger tu información, podemos pedirte que confirmes tu identidad antes de responder. Te responderemos en un máximo de ${LEGAL.arcoResponseDays} días hábiles y, si procede, haremos efectivo el cambio dentro de los 15 días hábiles siguientes.`,
    ],
  },
  {
    id: "cookies",
    title: "Cookies y tecnologías de rastreo",
    body: [
      "Este sitio no usa cookies de publicidad ni de analítica, ni herramientas de rastreo de terceros. Las tipografías se sirven desde nuestro propio sitio, sin contactar a otros servidores.",
      "Tu navegador puede guardar archivos temporales (caché) para que el sitio cargue más rápido; no contienen datos personales y puedes borrarlos desde la configuración de tu navegador.",
      "Si en el futuro incorporamos herramientas de analítica o cookies no esenciales, actualizaremos este aviso y te pediremos tu consentimiento antes de activarlas.",
    ],
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo los conservamos",
    body: [
      <LegalList
        key="conservacion-lista"
        items={[
          "La huella cifrada de tu IP se borra a las 24 horas.",
          "Las solicitudes que no se convierten en un viaje se conservan hasta 2 años desde el último contacto y después se eliminan. [Confirmar plazo]",
          "Los datos de viajes contratados se conservan el tiempo que exijan las obligaciones fiscales y legales aplicables.",
        ]}
      />,
      "Puedes pedir que eliminemos tus datos antes, salvo los que estemos obligados a conservar por ley.",
    ],
  },
  {
    id: "seguridad",
    title: "Cómo los protegemos",
    body: [
      "El sitio usa conexión cifrada (HTTPS). La base de datos no tiene acceso público: solo el servidor del sitio puede escribir y leer las solicitudes, con credenciales que nunca se exponen en el navegador. El acceso a tus datos está limitado a quien atiende tu solicitud.",
    ],
  },
  {
    id: "cambios",
    title: "Cambios a este aviso",
    body: [
      "Si modificamos este aviso, publicaremos la versión actualizada en esta página con su fecha de actualización. Si el cambio afecta finalidades que requieran tu consentimiento, te lo pediremos de nuevo.",
      "Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir a la autoridad competente en materia de protección de datos personales.",
    ],
  },
];

export default function AvisoDePrivacidadPage() {
  return (
    <LegalPage
      title="Aviso de privacidad"
      intro={<p>Tu información es tuya. Aquí te explicamos, en palabras simples, qué datos pedimos, para qué y cómo puedes controlarlos.</p>}
      sections={SECTIONS}
    />
  );
}
