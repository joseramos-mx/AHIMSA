export type Certification = {
  src: string;
  /** Marca/operador que otorgó el certificado. */
  issuer: string;
  /** Nombre del programa (aparece debajo del thumbnail). */
  program: string;
  /** Alt text accesible: emisor + programa, para lectores de pantalla. */
  alt: string;
};

/**
 * Certificaciones personales de Fátima Nieto, emitidas por operadores
 * y academias de la industria del viaje.
 *
 * Los PNG viven en /public/certificaciones/. Para añadir una nueva:
 *  1. Pon el archivo en esa carpeta con nombre kebab-case.
 *  2. Agrega el objeto { src, issuer, program, alt } al array.
 *
 * El componente <Certifications> muestra el array completo en un grid.
 * El orden del array determina el orden visual.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    src: "/certificaciones/xcaret-xpert.png",
    issuer: "Xcaret",
    program: "Xpert Program",
    alt: "Certificado Xcaret Xpert Program otorgado a Fátima Nieto",
  },
  {
    src: "/certificaciones/universal-orlando-especialista.png",
    issuer: "Universal Orlando",
    program: "Especialista UniversalANDU",
    alt: "Certificado Universal Orlando Especialista UniversalANDU",
  },
  {
    src: "/certificaciones/disney-adventures.png",
    issuer: "Disney",
    program: "Explore Adventures by Disney",
    alt: "Certificado Disney College of Knowledge — Adventures by Disney",
  },
  {
    src: "/certificaciones/palace-pro-agents.png",
    issuer: "The Palace Company",
    program: "Pro Agents · Palace Specialist",
    alt: "Certificado The Palace Company Pro Agents Palace Specialist",
  },
  {
    src: "/certificaciones/rail-europe-trenitalia.png",
    issuer: "Rail Europe",
    program: "Módulo Trenitalia",
    alt: "Certificado Rail Europe módulo Trenitalia",
  },
  {
    src: "/certificaciones/rail-europe-sncf.png",
    issuer: "Rail Europe",
    program: "Módulo SNCF",
    alt: "Certificado Rail Europe módulo SNCF",
  },
  {
    src: "/certificaciones/exoticca-agentes.png",
    issuer: "Exoticca",
    program: "Capacitación para Agentes",
    alt: "Certificado Exoticca Capacitación para Agentes de Viajes",
  },
  {
    src: "/certificaciones/tbo-academy-business.png",
    issuer: "TBO Academy",
    program: "Travel Planning Business",
    alt: "Certificado TBO Academy Travel Planning Business Course",
  },
  {
    src: "/certificaciones/tbo-academy-italy.png",
    issuer: "TBO Academy",
    program: "Italy Destination",
    alt: "Certificado TBO Academy Italy Destination Course",
  },
  {
    src: "/certificaciones/archer-evolution-travel-101.png",
    issuer: "Archer / Evolution Travel Academy",
    program: "Travel 101",
    alt: "Certificado Archer Travel y Evolution Travel Academy Travel 101",
  },
];
