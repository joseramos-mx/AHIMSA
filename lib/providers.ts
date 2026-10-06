export type Provider = {
  src: string;
  alt: string;
};

/**
 * Logos de proveedores globales con los que opera Ahimsa Travel.
 *
 * El `alt` es la marca comercial reconocible — fue derivado del
 * nombre de archivo. Si alguno quedó mal (hay varios con nombres
 * genéricos tipo `images.png` o `logo.png`), edítalo aquí.
 *
 * Para quitar un proveedor: borra la línea.
 * Para añadir: pon el archivo en /public/logos-proveedores/ y
 * agrega un objeto { src, alt } al array.
 *
 * El componente <Providers> muestra TODO el array en un marquee
 * de dos filas (la mitad arriba, la mitad abajo, en sentidos
 * opuestos). El orden determina qué fila le toca a cada logo.
 */
export const PROVIDERS: Provider[] = [
  { src: "/logos-proveedores/American-Airlines-Logo.png", alt: "American Airlines" },
  { src: "/logos-proveedores/logo-Aeromexico-Vacations.webp", alt: "Aeroméxico Vacations" },
  { src: "/logos-proveedores/delta vacations.png", alt: "Delta Vacations" },
  { src: "/logos-proveedores/alg vacations.png", alt: "ALG Vacations" },
  { src: "/logos-proveedores/Classic-Vacations.jpg", alt: "Classic Vacations" },
  { src: "/logos-proveedores/europe express.avif", alt: "Europe Express" },
  { src: "/logos-proveedores/Disney_logo.png", alt: "Disney" },
  { src: "/logos-proveedores/universal studios.webp", alt: "Universal Studios" },
  { src: "/logos-proveedores/Grupo Xcaret Logo Hor.png", alt: "Grupo Xcaret" },
  { src: "/logos-proveedores/Hard_rock_stadium_florida_logo.svg.webp", alt: "Hard Rock Stadium" },
  { src: "/logos-proveedores/barcelo.png", alt: "Barceló" },
  { src: "/logos-proveedores/RIU_Hotels_logo.svg", alt: "RIU Hotels" },
  { src: "/logos-proveedores/sandals.png", alt: "Sandals Resorts" },
  { src: "/logos-proveedores/Club_Med_logo.svg", alt: "Club Med" },
  { src: "/logos-proveedores/lomas travel.png", alt: "Lomas Travel" },
  { src: "/logos-proveedores/azabache.png", alt: "Azabache" },
  { src: "/logos-proveedores/Carnival Cruise Line Logo_546b4934-4026-4c91-bee0-23009835cbf5-prv.jpg", alt: "Carnival Cruise Line" },
  { src: "/logos-proveedores/Royal-Cribbean-logo.png", alt: "Royal Caribbean" },
  { src: "/logos-proveedores/MSC_Cruises_Logo.png", alt: "MSC Cruises" },
  { src: "/logos-proveedores/Princess_Cruises-Logo.png", alt: "Princess Cruises" },
  { src: "/logos-proveedores/Azamara-Cruises-Logo.webp", alt: "Azamara Cruises" },
  { src: "/logos-proveedores/Celestyal-Cruises_new-logo-e1605189003184.png", alt: "Celestyal Cruises" },
  { src: "/logos-proveedores/virgin voyages.webp", alt: "Virgin Voyages" },
  { src: "/logos-proveedores/Ama-logo-gold.jpg", alt: "AmaWaterways" },
  { src: "/logos-proveedores/international cruises.png", alt: "International Cruises" },
  { src: "/logos-proveedores/expeditions_logo.png", alt: "Expeditions" },
  { src: "/logos-proveedores/Trafalgar_Logo.jpg", alt: "Trafalgar" },
  { src: "/logos-proveedores/Contiki-logo-clean-v2.svg.png", alt: "Contiki" },
  { src: "/logos-proveedores/costs saver.jpg", alt: "Costsaver" },
  { src: "/logos-proveedores/G-Adventures-logo.webp", alt: "G Adventures" },
  { src: "/logos-proveedores/gate-1-travel-logo.png", alt: "Gate 1 Travel" },
  { src: "/logos-proveedores/6a7ab816a07b897565418cca_6a7ab816cda068f890eed801_rail-europe-creator-ugc-logo-v4.png", alt: "Rail Europe" },
  { src: "/logos-proveedores/civitatits.png", alt: "Civitatis" },
  { src: "/logos-proveedores/viator.png", alt: "Viator" },
  { src: "/logos-proveedores/tourradar.png", alt: "TourRadar" },
  { src: "/logos-proveedores/expedia_taap_primarypng.avif", alt: "Expedia TAAP" },
  { src: "/logos-proveedores/bedsonline.jpg", alt: "Bedsonline" },
  { src: "/logos-proveedores/petrabax-logo-new.gif", alt: "Petrabax" },
  { src: "/logos-proveedores/agentcars.jpg", alt: "AgentCars" },
  { src: "/logos-proveedores/terrawind.png", alt: "Terrawind Global Protection" },
  { src: "/logos-proveedores/roomres.png", alt: "RoomRes" },
  { src: "/logos-proveedores/instant.png", alt: "Instant" },
  { src: "/logos-proveedores/golden+tickets+Logo-01.webp", alt: "Golden Tickets" },
  { src: "/logos-proveedores/ps-ProfitAgility-logo-no-672x148.png", alt: "ProfitAgility" },
  { src: "/logos-proveedores/matta.png", alt: "MATTA" },
  { src: "/logos-proveedores/Logo_Creatur_Viajes_color-672x372.png", alt: "Creatur Viajes" },
  { src: "/logos-proveedores/logo-rmt-2023.png", alt: "RMT" },
  { src: "/logos-proveedores/logo-imp.webp", alt: "IMP" },
  { src: "/logos-proveedores/logo-black.png", alt: "Proveedor" },
  { src: "/logos-proveedores/logo.png", alt: "Proveedor" },
  { src: "/logos-proveedores/images.png", alt: "Proveedor" },
];
