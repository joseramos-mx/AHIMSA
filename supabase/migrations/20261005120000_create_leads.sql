-- Leads del formulario de /contacto.
-- Solo el service role (Server Action) lee y escribe: RLS activado y sin
-- políticas públicas, así que anon/authenticated no tienen acceso.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('trip', 'business', 'agent')),
  priority text not null check (priority in ('alta', 'media', 'normal')),
  name text not null,
  whatsapp text not null,
  email text not null,
  contact_preference text,
  interests text[],
  service text,
  circuit text,
  -- Campos específicos de cada tipo (fechas, viajeros, empresa, etc.).
  payload jsonb not null default '{}'::jsonb,
  source_path text,
  -- utm_source / utm_medium / utm_campaign si venían en la URL.
  utm jsonb,
  -- SHA-256 de la IP con sal (IP_HASH_SALT); nunca la IP en claro.
  ip_hash text,
  user_agent text,
  status text not null default 'nuevo'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_kind_idx on public.leads (kind);
create index if not exists leads_ip_hash_idx on public.leads (ip_hash);

alter table public.leads enable row level security;
-- Sin "create policy": ningún rol público puede leer ni escribir.
