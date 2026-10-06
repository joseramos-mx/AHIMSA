import { NICHES, type NicheSlug } from "./niches";

/**
 * Valores válidos del parámetro "tipo" de /contacto: tipos de viaje y
 * otros motivos de contacto (p. ej. ser agente).
 */
export type TripType = NicheSlug | "empresa" | "cruceros" | "eventos" | "otros";
export type LeadType = TripType | "agente";

export type LeadTypeOption = { value: LeadType; label: string };

/** Opciones para el formulario de contacto (en este orden). Los nichos
 *  salen de lib/niches.ts para no duplicarlos. */
export const LEAD_TYPES: LeadTypeOption[] = [
  ...NICHES.map((n) => ({ value: n.slug, label: n.name })),
  { value: "empresa", label: "Viaje de empresa" },
  { value: "cruceros", label: "Crucero" },
  { value: "eventos", label: "Concierto o partido" },
  { value: "otros", label: "Otro destino" },
  { value: "agente", label: "Quiero ser agente de viajes" },
];

/** Para el formulario: valida el ?tipo= de la URL (si no, sin preselección). */
export function parseLeadType(value: string | null | undefined): LeadType | null {
  return LEAD_TYPES.some((t) => t.value === value) ? (value as LeadType) : null;
}

/** Link a /contacto con el tipo preseleccionado. */
export function contactHref(type: LeadType) {
  return `/contacto?tipo=${type}`;
}

/** Estado inicial del formulario de /contacto a partir de la URL. */
export type ContactParams = {
  kind: "trip" | "business" | "agent";
  interests: Exclude<TripType, "empresa">[];
  service: "bespoke" | "circuito" | "";
  circuit: string;
};

/**
 * ?tipo=empresa → empresa; ?tipo=agente → agente; cualquier otro tipo de
 * viaje → "Quiero viajar" con ese interés marcado; sin tipo → viajar.
 * ?servicio=bespoke|circuito y ?circuito=slug se conservan aparte.
 */
export function parseContactParams(params: {
  get(name: string): string | null;
}): ContactParams {
  const tipo = parseLeadType(params.get("tipo"));
  const servicio = params.get("servicio");
  const circuito = (params.get("circuito") ?? "").toLowerCase();
  return {
    kind: tipo === "empresa" ? "business" : tipo === "agente" ? "agent" : "trip",
    interests: tipo && tipo !== "empresa" && tipo !== "agente" ? [tipo] : [],
    service: servicio === "bespoke" || servicio === "circuito" ? servicio : "",
    circuit: /^[a-z0-9-]{1,80}$/.test(circuito) ? circuito : "",
  };
}
