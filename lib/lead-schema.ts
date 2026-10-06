/**
 * Esquemas del formulario de /contacto. Se usan en el cliente (React Hook
 * Form) y otra vez en el servidor (Server Action): nunca confiar solo en
 * la validación del navegador.
 */
import { z } from "zod";
import { NICHES } from "./niches";
import { BUSINESS_FEATURES, SERVICES } from "./services";
import type { TripType } from "./lead-types";

type Option<V extends string = string> = { readonly value: V; readonly label: string };

/** Valores de una lista de opciones como tupla para z.enum. */
function valuesOf<V extends string>(options: readonly Option<V>[]) {
  return options.map((o) => o.value) as [V, ...V[]];
}

/** Enum opcional: "" significa "sin respuesta". */
function optionalEnum<V extends string>(options: readonly Option<V>[]) {
  return z.union([z.enum(valuesOf(options)), z.literal("")]);
}

export const labelOf = (options: readonly Option[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

/* ------------------------------------------------------------------ */
/* Opciones (editables)                                                */
/* ------------------------------------------------------------------ */

export type LeadKind = "trip" | "business" | "agent";

export const KIND_OPTIONS: Option<LeadKind>[] = [
  { value: "trip", label: "Quiero viajar" },
  { value: "business", label: "Viaje de empresa" },
  { value: "agent", label: "Quiero ser agente" },
];

export type Interest = Exclude<TripType, "empresa">;

/** Tipos de viaje: los 4 nichos + los servicios adicionales. */
export const INTEREST_OPTIONS: Option<Interest>[] = [
  ...NICHES.map((n) => ({ value: n.slug, label: n.name })),
  ...SERVICES.map((s) => ({ value: s.slug, label: s.name })),
];

/** Parámetro ?servicio= (viene de la sección de Europa). */
export const SERVICE_OPTIONS: Option<"bespoke" | "circuito">[] = [
  { value: "bespoke", label: "Itinerario personalizado" },
  { value: "circuito", label: "Circuito" },
];

export const OCCASION_OPTIONS = [
  { value: "familia", label: "Vacaciones en familia" },
  { value: "xv", label: "XV años" },
  { value: "boda", label: "Boda o luna de miel" },
  { value: "aniversario", label: "Aniversario" },
  { value: "otra", label: "Otra" },
] as const;

/**
 * Presupuesto aproximado POR PERSONA, en MXN. Para cambiar los rangos edita
 * las etiquetas; `value` es lo que se guarda en Supabase (si cambias un
 * value, los leads anteriores conservan el viejo).
 */
export const BUDGET_RANGES = [
  { value: "lt-20k", label: "Menos de $20,000 MXN" },
  { value: "20k-40k", label: "$20,000 a $40,000 MXN" },
  { value: "40k-70k", label: "$40,000 a $70,000 MXN" },
  { value: "gt-70k", label: "Más de $70,000 MXN" },
  { value: "platicar", label: "Prefiero platicarlo" },
] as const;

export const TEAM_SIZE_OPTIONS = [
  { value: "1-10", label: "1 a 10" },
  { value: "11-50", label: "11 a 50" },
  { value: "50+", label: "Más de 50" },
] as const;

export const BUSINESS_TRIP_OPTIONS: Option[] = BUSINESS_FEATURES.map((f) => ({
  value: f,
  label: f,
}));

export const FREQUENCY_OPTIONS = [
  { value: "ocasional", label: "Ocasional" },
  { value: "mensual", label: "Mensual" },
  { value: "semanal", label: "Semanal" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
] as const;

export const HEARD_FROM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "recomendacion", label: "Recomendación" },
  { value: "otro", label: "Otro" },
] as const;

export const CONTACT_PREFERENCE_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada" },
  { value: "correo", label: "Correo" },
] as const;

export const MONTH_OPTIONS: Option[] = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
].map((m, i) => ({ value: String(i + 1), label: m }));

/* ------------------------------------------------------------------ */
/* Esquemas                                                            */
/* ------------------------------------------------------------------ */

const text = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`);

const commonShape = {
  name: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  phoneCode: z.string().trim().regex(/^\+\d{1,3}$/, "Lada inválida (ej. +52)"),
  whatsapp: z.string().trim().min(1, "Escribe tu WhatsApp").max(24),
  email: z.string().trim().min(1, "Escribe tu correo").email("Revisa tu correo").max(160),
  contactPreference: z.enum(valuesOf(CONTACT_PREFERENCE_OPTIONS)),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Necesitas aceptar el aviso de privacidad" }),
  }),
  /** Honeypot: siempre vacío para humanos. */
  website: z.string().max(200),
  /** Milisegundos entre la carga del formulario y el envío (reloj del cliente). */
  elapsedMs: z.number().int().nonnegative(),
  service: optionalEnum(SERVICE_OPTIONS),
  circuit: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9-]*$/, "Circuito inválido"),
  utm: z.object({
    source: text(100),
    medium: text(100),
    campaign: text(100),
  }),
  sourcePath: text(300),
};

const tripSchema = z.object({
  ...commonShape,
  kind: z.literal("trip"),
  interests: z
    .array(z.enum(valuesOf(INTEREST_OPTIONS)))
    .min(1, "Elige al menos un tipo de viaje"),
  destination: text(120),
  dateMode: z.enum(["exact", "flexible"]),
  departDate: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
  returnDate: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/),
  approxMonth: z.string().regex(/^(\d{1,2})?$/),
  approxYear: z.string().regex(/^(\d{4})?$/),
  /** null = sin definir. */
  nights: z.number().int().min(1).max(30).nullable(),
  adults: z.number().int().min(1, "Al menos 1 adulto").max(20),
  children: z.number().int().min(0).max(10),
  /** Una edad (0 a 17, como texto del select) por cada menor. */
  childAges: z.array(z.string()),
  occasion: optionalEnum(OCCASION_OPTIONS),
  budget: optionalEnum(BUDGET_RANGES),
  idea: text(1000),
});

const businessSchema = z.object({
  ...commonShape,
  kind: z.literal("business"),
  company: z.string().trim().min(2, "Escribe el nombre de la empresa").max(120),
  role: text(120),
  teamSize: optionalEnum(TEAM_SIZE_OPTIONS),
  tripTypes: z.array(z.enum(valuesOf(BUSINESS_TRIP_OPTIONS))),
  frequency: optionalEnum(FREQUENCY_OPTIONS),
  comments: text(1000),
});

const agentSchema = z.object({
  ...commonShape,
  kind: z.literal("agent"),
  location: z.string().trim().min(3, "Escribe tu ciudad y país").max(120),
  experience: optionalEnum(EXPERIENCE_OPTIONS),
  heardFrom: optionalEnum(HEARD_FROM_OPTIONS),
  wantToSell: text(300),
});

const todayIso = () => new Date().toISOString().slice(0, 10);

export const leadSchema = z
  .discriminatedUnion("kind", [tripSchema, businessSchema, agentSchema])
  .superRefine((d, ctx) => {
    // WhatsApp: 10 dígitos en México; formato internacional (E.164, máx.
    // 15 dígitos con la lada) en otros países.
    const digits = d.whatsapp.replace(/\D/g, "");
    const codeDigits = d.phoneCode.replace(/\D/g, "").length;
    if (d.phoneCode === "+52") {
      if (digits.length !== 10) {
        ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Escribe tu número a 10 dígitos" });
      }
    } else if (digits.length < 6 || digits.length + codeDigits > 15) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Revisa tu número" });
    }

    if (d.kind === "trip") {
      if (d.dateMode === "exact") {
        if (!d.departDate) {
          ctx.addIssue({ code: "custom", path: ["departDate"], message: "Elige la fecha de salida" });
        } else if (d.departDate < todayIso()) {
          ctx.addIssue({ code: "custom", path: ["departDate"], message: "La fecha ya pasó" });
        }
        if (!d.returnDate) {
          ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Elige la fecha de regreso" });
        } else if (d.departDate && d.returnDate < d.departDate) {
          ctx.addIssue({ code: "custom", path: ["returnDate"], message: "El regreso debe ser después de la salida" });
        }
      }
      for (let i = 0; i < d.children; i++) {
        const age = Number(d.childAges[i]);
        if (d.childAges[i] === undefined || d.childAges[i] === "" || !(age >= 0 && age <= 17)) {
          ctx.addIssue({ code: "custom", path: ["childAges", i], message: "Indica la edad" });
        }
      }
    }
  });

export type LeadData = z.output<typeof leadSchema>;

/** Valores del formulario: todos los campos de los tres tipos (los comunes se
 *  conservan al cambiar de tipo; el esquema descarta los que no aplican). */
export type LeadFormValues = { kind: LeadKind } & Omit<z.input<typeof tripSchema>, "kind" | "privacy"> &
  Omit<z.input<typeof businessSchema>, "kind" | "privacy"> &
  Omit<z.input<typeof agentSchema>, "kind" | "privacy"> & { privacy: boolean };

export function defaultLeadValues(
  init: Partial<Pick<LeadFormValues, "kind" | "interests" | "service" | "circuit">>
): LeadFormValues {
  return {
    kind: init.kind ?? "trip",
    name: "",
    phoneCode: "+52",
    whatsapp: "",
    email: "",
    contactPreference: "whatsapp",
    privacy: false,
    website: "",
    elapsedMs: 0,
    service: init.service ?? "",
    circuit: init.circuit ?? "",
    utm: { source: "", medium: "", campaign: "" },
    sourcePath: "",
    interests: init.interests ?? [],
    destination: "",
    dateMode: "flexible",
    departDate: "",
    returnDate: "",
    approxMonth: "",
    approxYear: "",
    nights: null,
    adults: 2,
    children: 0,
    childAges: [],
    occasion: "",
    budget: "",
    idea: "",
    company: "",
    role: "",
    teamSize: "",
    tripTypes: [],
    frequency: "",
    comments: "",
    location: "",
    experience: "",
    heardFrom: "",
    wantToSell: "",
  };
}

export type LeadPriority = "alta" | "media" | "normal";

/** alta: viaje con Family Europe o itinerario bespoke; media: empresa. */
export function leadPriority(d: LeadData): LeadPriority {
  if (d.kind === "trip" && (d.interests.includes("family-europe") || d.service === "bespoke")) {
    return "alta";
  }
  return d.kind === "business" ? "media" : "normal";
}
