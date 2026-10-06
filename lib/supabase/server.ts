import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase SOLO de servidor, con la service role key (salta RLS).
 * Las variables no llevan el prefijo NEXT_PUBLIC_, así que Next nunca las
 * incluye en el bundle del cliente. Importar únicamente desde Server
 * Actions o Route Handlers.
 */
if (typeof window !== "undefined") {
  throw new Error("lib/supabase/server.ts solo puede usarse en el servidor.");
}

let admin: SupabaseClient | null = null;

/** null si faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
