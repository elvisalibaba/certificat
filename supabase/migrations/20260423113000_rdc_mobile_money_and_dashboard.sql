alter table public.artisan_profiles
  alter column country set default 'RDC';

alter table public.workshops
  alter column country set default 'RDC';

update public.artisan_profiles
set country = 'RDC'
where country is null or lower(country) in ('nigeria', 'congo', 'congo-brazzaville', 'republique du congo');

update public.workshops
set country = 'RDC'
where country is null or lower(country) in ('nigeria', 'congo', 'congo-brazzaville', 'republique du congo');

alter table public.payment_transactions
  add column if not exists mobile_money_operator text,
  add column if not exists mobile_money_phone text,
  add column if not exists checkout_channel text not null default 'mobile_money',
  add column if not exists reconciliation_status text not null default 'unmatched'
    check (reconciliation_status in ('unmatched', 'matched', 'disputed')),
  add column if not exists reconciliation_note text;

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  country text not null default 'RDC',
  currency text not null default 'USD',
  is_mobile_money boolean not null default true,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.payment_methods enable row level security;

drop policy if exists "payment methods authenticated read" on public.payment_methods;
create policy "payment methods authenticated read"
on public.payment_methods for select to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "payment methods admin write" on public.payment_methods;
create policy "payment methods admin write"
on public.payment_methods for all
using (public.is_admin())
with check (public.is_admin());

insert into public.payment_methods (code, label, metadata) values
  ('airtel_money_cd', 'Airtel Money RDC', '{"prefixes":["99","97","98"],"simulation":true}'),
  ('orange_money_cd', 'Orange Money RDC', '{"prefixes":["84","85","89"],"simulation":true}'),
  ('mpesa_cd', 'M-Pesa RDC', '{"prefixes":["81","82","83"],"simulation":true}'),
  ('afrimoney_cd', 'Afrimoney RDC', '{"prefixes":["90","91"],"simulation":true}')
on conflict (code) do update set
  label = excluded.label,
  metadata = excluded.metadata,
  is_active = true;

insert into public.ministry_settings (setting_key, setting_value, description) values
  ('institution', '{"name":"Ministere des PME et Artisanat","agency":"Agence Nationale de Certification Artisanale","country":"Republique Democratique du Congo","capital":"Kinshasa","currency":"USD"}', 'Identite institutionnelle RDC'),
  ('mobile_money_simulation', '{"enabled":true,"operators":["Airtel Money RDC","Orange Money RDC","M-Pesa RDC","Afrimoney RDC"],"defaultAmount":50,"currency":"USD"}', 'Configuration de simulation Mobile Money')
on conflict (setting_key) do update set
  setting_value = excluded.setting_value,
  description = excluded.description,
  updated_at = now();

create index if not exists payment_transactions_reconciliation_idx
  on public.payment_transactions(reconciliation_status, status, created_at desc);

create index if not exists payment_transactions_mobile_money_idx
  on public.payment_transactions(mobile_money_operator, mobile_money_phone);
