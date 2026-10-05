/*
 * Texto provisional. El contenido legal debe redactarlo o validarlo un
 * abogado o la responsable del negocio.
 *
 * Estructura basada en los apartados de un aviso de privacidad integral
 * (LFPDPPP, México). Reemplaza cada [texto entre corchetes].
 */
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Ahimsa Travel",
  robots: { index: true, follow: true },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Identidad y domicilio del responsable",
    body: [
      "[Nombre o razón social del responsable], con domicilio en [domicilio completo], es responsable del tratamiento de tus datos personales.",
      "[Datos de contacto del área o persona encargada de datos personales: correo y teléfono].",
    ],
  },
  {
    title: "Datos personales que recabamos",
    body: [
      "[Categorías de datos: identificación, contacto, datos de viaje (pasaporte, fechas, acompañantes), datos de facturación y pago].",
      "[Indicar si se recaban datos sensibles o de menores de edad y cómo se obtiene el consentimiento expreso].",
    ],
  },
  {
    title: "Finalidades del tratamiento",
    body: [
      "[Finalidades primarias, necesarias para el servicio: cotizar, reservar y dar seguimiento a tu viaje].",
      "[Finalidades secundarias, que no son necesarias para el servicio (p. ej. envío de promociones), y el mecanismo para negarte a ellas].",
    ],
  },
  {
    title: "Transferencias de datos",
    body: [
      "[Terceros nacionales o extranjeros a quienes se transfieren datos (aerolíneas, hoteles, operadores, aseguradoras) y la finalidad de cada transferencia].",
      "[Indicar qué transferencias requieren tu consentimiento].",
    ],
  },
  {
    title: "Derechos ARCO y cómo ejercerlos",
    body: [
      "Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales, así como a Oponerte a su tratamiento (derechos ARCO).",
      "[Procedimiento: medio para presentar la solicitud, información y documentos que debe contener, plazos de respuesta y medios para entregarla].",
    ],
  },
  {
    title: "Revocación del consentimiento",
    body: [
      "[Cómo revocar el consentimiento otorgado para el tratamiento de tus datos y cómo limitar su uso o divulgación].",
    ],
  },
  {
    title: "Uso de cookies y tecnologías de rastreo",
    body: [
      "[Qué cookies, web beacons u otras tecnologías se usan en este sitio, qué datos obtienen, con qué finalidad y cómo deshabilitarlas].",
    ],
  },
  {
    title: "Cambios al aviso de privacidad",
    body: [
      "[Cómo se darán a conocer las modificaciones o actualizaciones de este aviso].",
    ],
  },
  {
    title: "Fecha de última actualización",
    body: ["[Día de mes de año]"],
  },
];

export default function AvisoDePrivacidadPage() {
  return (
    <>
      <Header />
      <main className="bg-cream px-6 pb-24 pt-32 text-ink md:px-10 lg:pb-32 lg:pt-40">
        <article className="mx-auto max-w-[720px] font-figtree text-[17px] leading-[1.7]">
          <h1 className="font-fraunces text-[40px] font-light leading-[1.1] lg:text-[56px]">
            Aviso de privacidad
          </h1>
          {SECTIONS.map((section) => (
            <section key={section.title} className="mt-12">
              <h2 className="font-fraunces text-[26px] font-light leading-tight lg:text-[30px]">
                {section.title}
              </h2>
              {section.body.map((p) => (
                <p key={p} className="mt-4 text-ink/85">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
