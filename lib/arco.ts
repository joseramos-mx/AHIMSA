/** Tipos de solicitud de derechos ARCO (formulario de /derechos-arco). */
export const ARCO_TYPES = [
  { value: "cancelacion", label: "Eliminar mis datos (cancelación)" },
  { value: "acceso", label: "Saber qué datos tienen de mí (acceso)" },
  { value: "rectificacion", label: "Corregir mis datos (rectificación)" },
  { value: "oposicion", label: "Que dejen de usar mis datos para algo (oposición)" },
  { value: "revocacion", label: "Revocar mi consentimiento" },
] as const;

export type ArcoState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Para conservar lo escrito si hay errores. */
  values?: Record<string, string>;
};
