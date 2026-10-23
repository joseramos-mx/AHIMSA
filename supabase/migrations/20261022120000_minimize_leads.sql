-- Minimización de datos en public.leads.
--  1. Ya no se guarda el user agent del navegador.
--  2. purge_lead_data(): borra el hash de IP después de 24 horas (solo se
--     usa para el límite de 5 envíos en 10 minutos) y elimina solicitudes
--     de más de 2 años que no se convirtieron en cliente.
--     [Confirmar el plazo de 2 años: debe coincidir con el aviso de privacidad.]

alter table public.leads drop column if exists user_agent;

create or replace function public.purge_lead_data()
returns void
language sql
security definer
set search_path = public
as $$
  update public.leads
     set ip_hash = null
   where ip_hash is not null
     and created_at < now() - interval '24 hours';

  delete from public.leads
   where created_at < now() - interval '2 years'
     and status <> 'cliente';
$$;

-- Solo el service role puede ejecutarla.
revoke all on function public.purge_lead_data() from public, anon, authenticated;

-- Ejecución diaria automática con pg_cron (actívalo en Supabase:
-- Database → Extensions → pg_cron) y luego corre:
--   select cron.schedule('purge-lead-data', '0 3 * * *', 'select public.purge_lead_data()');
