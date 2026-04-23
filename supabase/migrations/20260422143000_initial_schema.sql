create extension if not exists "pgcrypto";

create type public.user_role as enum ('artisan', 'inspector', 'lab_agent', 'admin');
create type public.request_status as enum (
  'draft', 'submitted', 'under_admin_review', 'pending_documents',
  'field_inspection_scheduled', 'field_inspection_done',
  'lab_testing_scheduled', 'lab_testing_done', 'pending_decision',
  'approved_for_payment', 'payment_pending', 'payment_confirmed',
  'certified', 'rejected', 'suspended', 'revoked', 'expired'
);
create type public.payment_status as enum ('created', 'pending', 'confirmed', 'failed', 'cancelled', 'refunded');
create type public.certificate_status as enum ('valid', 'suspended', 'revoked', 'expired');
create type public.recommendation as enum ('approve', 'reject', 'needs_more_information');

create table public.roles (
  name public.user_role primary key,
  description text not null
);

insert into public.roles (name, description) values
  ('artisan', 'Producteur artisanal'),
  ('inspector', 'Inspecteur terrain'),
  ('lab_agent', 'Agent laboratoire'),
  ('admin', 'Administrateur')
on conflict do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'artisan',
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artisan_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  public_display_name text,
  national_id text,
  address text,
  city text,
  country text not null default 'RDC',
  allow_public_producer_name boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  registration_number text,
  address text not null,
  city text,
  country text not null default 'RDC',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  parent_id uuid references public.product_categories(id) on delete set null,
  is_active boolean not null default true
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  workshop_id uuid references public.workshops(id) on delete set null,
  name text not null,
  category text not null,
  subcategory text,
  description text not null,
  raw_materials text,
  manufacturing_process text,
  origin text,
  usage text,
  dimensions text,
  weight text,
  submission_state text not null default 'draft' check (submission_state in ('draft', 'submitted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'document')),
  bucket text not null,
  path text not null,
  title text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.certification_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  status public.request_status not null default 'draft',
  admin_comment text,
  submitted_at timestamptz,
  approved_for_payment_at timestamptz,
  final_decision_at timestamptz,
  final_decision_by uuid references public.profiles(id) on delete set null,
  final_decision_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id)
);

create table public.request_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  from_status public.request_status,
  to_status public.request_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  comment text,
  created_at timestamptz not null default now()
);

create table public.request_documents (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  bucket text not null default 'documents',
  path text not null,
  is_required boolean not null default false,
  is_verified boolean not null default false,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

create table public.inspection_missions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  inspector_id uuid not null references public.profiles(id) on delete restrict,
  scheduled_at timestamptz not null,
  location text,
  status text not null default 'scheduled' check (status in ('scheduled', 'done', 'cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspection_reports (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null unique references public.inspection_missions(id) on delete cascade,
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  inspector_id uuid not null references public.profiles(id) on delete restrict,
  observations text not null,
  recommendation public.recommendation not null,
  signature text,
  offline_payload jsonb,
  submitted_at timestamptz not null default now()
);

create table public.lab_tests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  lab_agent_id uuid references public.profiles(id) on delete set null,
  test_type text not null,
  measured_value text,
  is_compliant boolean,
  observations text,
  recommendation public.recommendation,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'done', 'cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lab_attachments (
  id uuid primary key default gen_random_uuid(),
  lab_test_id uuid not null references public.lab_tests(id) on delete cascade,
  bucket text not null default 'lab-reports',
  path text not null,
  title text,
  created_at timestamptz not null default now()
);

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  status public.payment_status not null default 'created',
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'USD',
  method text,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.certification_requests(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  certificate_number text not null unique,
  public_code text not null unique,
  status public.certificate_status not null default 'valid',
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  pdf_bucket text not null default 'certificates',
  pdf_path text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.qr_records (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid not null unique references public.certificates(id) on delete cascade,
  public_code text not null unique,
  verification_url text not null,
  qr_bucket text,
  qr_path text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  channel text not null default 'in_app',
  read_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table public.public_verification_logs (
  id uuid primary key default gen_random_uuid(),
  public_code text,
  certificate_number text,
  result text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create view public.public_certificate_verification as
select
  c.public_code,
  c.certificate_number,
  c.status,
  c.issued_at,
  c.expires_at,
  p.name as product_name,
  p.category,
  case when ap.allow_public_producer_name then coalesce(ap.public_display_name, w.name, pr.full_name) else null end as producer_public_name
from public.certificates c
join public.products p on p.id = c.product_id
join public.profiles pr on pr.id = c.artisan_id
left join public.artisan_profiles ap on ap.user_id = c.artisan_id
left join public.workshops w on w.id = p.workshop_id;

create index products_artisan_idx on public.products(artisan_id);
create index requests_artisan_status_idx on public.certification_requests(artisan_id, status);
create index request_history_request_idx on public.request_status_history(request_id, created_at desc);
create index documents_request_idx on public.request_documents(request_id);
create index missions_inspector_idx on public.inspection_missions(inspector_id, scheduled_at);
create index lab_tests_agent_idx on public.lab_tests(lab_agent_id, status);
create index certificates_public_code_idx on public.certificates(public_code);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger artisan_profiles_updated_at before update on public.artisan_profiles for each row execute function public.set_updated_at();
create trigger workshops_updated_at before update on public.workshops for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger requests_updated_at before update on public.certification_requests for each row execute function public.set_updated_at();
create trigger missions_updated_at before update on public.inspection_missions for each row execute function public.set_updated_at();
create trigger lab_tests_updated_at before update on public.lab_tests for each row execute function public.set_updated_at();
create trigger payments_updated_at before update on public.payment_transactions for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'artisan')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.owns_product(product_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.products where id = product_uuid and artisan_id = auth.uid())
$$;

create or replace function public.can_access_request(request_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.certification_requests where id = request_uuid and artisan_id = auth.uid())
    or exists(select 1 from public.inspection_missions where request_id = request_uuid and inspector_id = auth.uid())
    or exists(select 1 from public.lab_tests where request_id = request_uuid and lab_agent_id = auth.uid())
    or public.is_admin()
$$;
