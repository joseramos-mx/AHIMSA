/**
 * Aviso por correo de cada lead nuevo, vía la API REST de Resend (sin SDK).
 * Solo servidor: usa RESEND_API_KEY.
 *
 * Variables:
 *  - RESEND_API_KEY      (obligatoria para enviar)
 *  - LEADS_EMAIL_TO      destino; por defecto el correo público del sitio
 *  - LEADS_EMAIL_FROM    remitente; por defecto "onboarding@resend.dev", que
 *                        solo entrega al correo dueño de la cuenta de Resend.
 *                        Para otro destino, verifica un dominio en Resend y
 *                        usa algo como "Ahimsa Travel <avisos@tudominio.com>".
 */
import { CONTACT_EMAIL } from "@/lib/footer";
import {
  BUDGET_RANGES,
  BUSINESS_TRIP_OPTIONS,
  CONTACT_PREFERENCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  FREQUENCY_OPTIONS,
  HEARD_FROM_OPTIONS,
  INTEREST_OPTIONS,
  KIND_OPTIONS,
  MONTH_OPTIONS,
  OCCASION_OPTIONS,
  SERVICE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  labelOf,
  type LeadData,
  type LeadPriority,
} from "@/lib/lead-schema";
import { circuitLabel } from "@/lib/lead-summary";

const DEFAULT_FROM = "Ahimsa Travel <onboarding@resend.dev>";
/** Base de la API; solo se cambia para pruebas locales. */
const RESEND_API_URL = process.env.RESEND_API_URL || "https://api.resend.com";

export const isLeadEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

type Row = [label: string, value: string];

/** Filas legibles (etiqueta, valor) del lead; omite lo vacío. */
function leadRows(d: LeadData, priority: LeadPriority): Row[] {
  const digits = d.whatsapp.replace(/\D/g, "");
  const rows: Row[] = [
    ["Tipo", labelOf(KIND_OPTIONS, d.kind)],
    ["Prioridad", priority],
    ["Nombre", d.name],
    ["WhatsApp", `${d.phoneCode} ${digits}`],
    ["Correo", d.email],
    ["Prefiere contacto por", labelOf(CONTACT_PREFERENCE_OPTIONS, d.contactPreference)],
  ];
  if (d.service) rows.push(["Servicio", labelOf(SERVICE_OPTIONS, d.service)]);
  if (d.circuit) rows.push(["Circuito", circuitLabel(d.circuit)]);

  if (d.kind === "trip") {
    rows.push(["Tipo de viaje", d.interests.map((i) => labelOf(INTEREST_OPTIONS, i)).join(", ")]);
    if (d.destination) rows.push(["Destino en mente", d.destination]);
    if (d.dateMode === "exact") {
      rows.push(["Fechas", `${formatDate(d.departDate)} al ${formatDate(d.returnDate)}`]);
    } else {
      const approx = [d.approxMonth && labelOf(MONTH_OPTIONS, d.approxMonth), d.approxYear]
        .filter(Boolean)
        .join(" ");
      rows.push(["Fechas", approx ? `Aproximadas: ${approx}` : "Aún no sabe"]);
    }
    if (d.nights) rows.push(["Noches", String(d.nights)]);
    const kids = d.children
      ? `, ${d.children} menor(es) de ${d.childAges.map((a) => (a === "0" ? "<1" : a)).join(", ")} años`
      : "";
    rows.push(["Viajeros", `${d.adults} adulto(s)${kids}`]);
    if (d.occasion) rows.push(["Ocasión", labelOf(OCCASION_OPTIONS, d.occasion)]);
    if (d.budget) rows.push(["Presupuesto por persona", labelOf(BUDGET_RANGES, d.budget)]);
    if (d.idea) rows.push(["Su idea", d.idea]);
  } else if (d.kind === "business") {
    rows.push(["Empresa", d.company]);
    if (d.role) rows.push(["Cargo", d.role]);
    if (d.teamSize) rows.push(["Personas al año", labelOf(TEAM_SIZE_OPTIONS, d.teamSize)]);
    if (d.tripTypes.length) {
      rows.push(["Tipo de viajes", d.tripTypes.map((t) => labelOf(BUSINESS_TRIP_OPTIONS, t)).join(", ")]);
    }
    if (d.frequency) rows.push(["Frecuencia", labelOf(FREQUENCY_OPTIONS, d.frequency)]);
    if (d.comments) rows.push(["Comentarios", d.comments]);
  } else {
    rows.push(["Ciudad y país", d.location]);
    if (d.experience) rows.push(["Experiencia en turismo", labelOf(EXPERIENCE_OPTIONS, d.experience)]);
    if (d.heardFrom) rows.push(["Cómo se enteró", labelOf(HEARD_FROM_OPTIONS, d.heardFrom)]);
    if (d.wantToSell) rows.push(["Qué quiere vender", d.wantToSell]);
  }

  if (d.sourcePath) rows.push(["Página de origen", d.sourcePath]);
  const utm = [d.utm.source, d.utm.medium, d.utm.campaign].filter(Boolean).join(" / ");
  if (utm) rows.push(["UTM", utm]);
  return rows;
}

export function buildLeadEmail(d: LeadData, priority: LeadPriority) {
  const kind = labelOf(KIND_OPTIONS, d.kind);
  const flag = priority === "alta" ? "[Prioridad alta] " : "";
  const subject = `${flag}Nueva solicitud: ${kind} · ${d.name}`;
  const rows = leadRows(d, priority);
  const waLink = `https://wa.me/${d.phoneCode.replace(/\D/g, "")}${d.whatsapp.replace(/\D/g, "")}`;

  const text = [
    `Nueva solicitud desde la página (${kind}).`,
    "",
    ...rows.map(([l, v]) => `${l}: ${v}`),
    "",
    `Escribirle por WhatsApp: ${waLink}`,
    "Responde a este correo para contestarle directo.",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#F3EEE6;font-family:Arial,Helvetica,sans-serif;color:#111111">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7A5A33">Ahimsa Travel · Nueva solicitud</p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:normal">${escapeHtml(kind)} · ${escapeHtml(d.name)}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#ffffff">
      ${rows
        .map(
          ([l, v]) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;font-size:13px;color:#555;vertical-align:top;width:38%">${escapeHtml(l)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;font-size:15px;white-space:pre-wrap">${escapeHtml(v)}</td>
      </tr>`
        )
        .join("")}
    </table>
    <p style="margin:24px 0 0">
      <a href="${waLink}" style="display:inline-block;background:#111111;color:#F3EEE6;text-decoration:none;padding:12px 20px;font-size:14px">Escribirle por WhatsApp</a>
    </p>
    <p style="margin:16px 0 0;font-size:13px;color:#555">Responde a este correo para contestarle directo a ${escapeHtml(d.email)}.</p>
  </div>
</body></html>`;

  return { subject, html, text };
}

/** Envía el aviso. Devuelve true si Resend lo aceptó. Nunca lanza. */
export async function sendLeadEmail(
  d: LeadData,
  priority: LeadPriority,
  idempotencyKey?: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[leads] RESEND_API_KEY no está configurada; no se envió el correo");
    return false;
  }
  const { subject, html, text } = buildLeadEmail(d, priority);
  try {
    const res = await fetch(`${RESEND_API_URL}/emails`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: process.env.LEADS_EMAIL_FROM || DEFAULT_FROM,
        to: [process.env.LEADS_EMAIL_TO || CONTACT_EMAIL],
        reply_to: d.email,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[leads] Resend respondió", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[leads] no se pudo enviar el correo", error);
    return false;
  }
}
