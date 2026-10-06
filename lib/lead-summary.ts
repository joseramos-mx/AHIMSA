import {
  KIND_OPTIONS,
  INTEREST_OPTIONS,
  MONTH_OPTIONS,
  SERVICE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  labelOf,
  type LeadFormValues,
} from "./lead-schema";

/** "europa-clasica" → "Europa clasica" (hasta tener el catálogo de circuitos). */
export function circuitLabel(slug: string) {
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Etiqueta "Te interesa: …" del servicio o circuito que viene en la URL. */
export function interestTagLabel(v: Pick<LeadFormValues, "service" | "circuit">) {
  if (v.circuit) return circuitLabel(v.circuit);
  if (v.service) return labelOf(SERVICE_OPTIONS, v.service);
  return null;
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Resumen corto de la solicitud para el mensaje prellenado de WhatsApp del
 * estado de éxito (tipo, interés o destino, fechas y viajeros).
 */
export function buildLeadSummary(v: LeadFormValues): string {
  const firstName = v.name.trim().split(/\s+/)[0];
  const lines = [
    `Hola${firstName ? `, soy ${firstName}` : ""}. Acabo de enviar una solicitud en tu página.`,
    `• ${labelOf(KIND_OPTIONS, v.kind)}`,
  ];
  const tag = interestTagLabel(v);
  if (tag) lines.push(`• Me interesa: ${tag}`);

  if (v.kind === "trip") {
    if (v.interests.length) {
      lines.push(`• ${v.interests.map((i) => labelOf(INTEREST_OPTIONS, i)).join(", ")}`);
    }
    if (v.destination.trim()) lines.push(`• Destino: ${v.destination.trim()}`);
    if (v.dateMode === "exact" && v.departDate && v.returnDate) {
      lines.push(`• Fechas: ${formatDate(v.departDate)} al ${formatDate(v.returnDate)}`);
    } else if (v.approxMonth || v.approxYear) {
      const month = v.approxMonth ? labelOf(MONTH_OPTIONS, v.approxMonth) : "";
      lines.push(`• Fechas: ${[month, v.approxYear].filter(Boolean).join(" ")}`);
    } else {
      lines.push("• Fechas por definir");
    }
    const travelers = [plural(v.adults, "adulto", "adultos")];
    if (v.children > 0) travelers.push(plural(v.children, "menor", "menores"));
    lines.push(`• ${travelers.join(" y ")}`);
  } else if (v.kind === "business") {
    if (v.company.trim()) lines.push(`• Empresa: ${v.company.trim()}`);
    if (v.teamSize) lines.push(`• ${labelOf(TEAM_SIZE_OPTIONS, v.teamSize)} personas al año`);
  } else if (v.location.trim()) {
    lines.push(`• Desde: ${v.location.trim()}`);
  }
  return lines.join("\n");
}
