import { NICHES, type NicheSlug } from "./niches";

/** Valores válidos del parámetro "tipo" de /contacto. */
export type TripType = NicheSlug | "empresa" | "cruceros" | "eventos" | "otros";

export type TripTypeOption = { value: TripType; label: string };

/** Opciones para el formulario de contacto. Los nichos salen de
 *  lib/niches.ts para no duplicarlos. */
export const TRIP_TYPES: TripTypeOption[] = [
  ...NICHES.map((n) => ({ value: n.slug, label: n.name })),
  { value: "empresa", label: "Viaje de empresa" },
  { value: "cruceros", label: "Crucero" },
  { value: "eventos", label: "Concierto o partido" },
  { value: "otros", label: "Otro destino" },
];

/** Link a /contacto con el tipo de viaje preseleccionado. */
export function contactHref(type: TripType) {
  return `/contacto?tipo=${type}`;
}
