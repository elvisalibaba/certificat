alter table public.profiles
  add column if not exists preferred_language text not null default 'fr',
  add column if not exists position_title text,
  add column if not exists ministry_department text,
  add column if not exists last_login_at timestamptz;

alter table public.artisan_profiles
  add column if not exists gender text check (gender in ('female', 'male', 'other', 'not_specified')),
  add column if not exists birth_date date,
  add column if not exists nationality text default 'Congolaise',
  add column if not exists province text,
  add column if not exists territory text,
  add column if not exists commune text,
  add column if not exists craft_card_number text,
  add column if not exists professional_experience_years int check (professional_experience_years >= 0),
  add column if not exists craft_specialty text,
  add column if not exists cooperative_name text,
  add column if not exists legal_representative_name text,
  add column if not exists public_phone text,
  add column if not exists public_email text;

alter table public.workshops
  add column if not exists province text,
  add column if not exists territory text,
  add column if not exists commune text,
  add column if not exists neighborhood text,
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists legal_status text,
  add column if not exists tax_number text,
  add column if not exists rccm_number text,
  add column if not exists employee_count int default 0 check (employee_count >= 0),
  add column if not exists women_employee_count int default 0 check (women_employee_count >= 0),
  add column if not exists youth_employee_count int default 0 check (youth_employee_count >= 0),
  add column if not exists production_capacity text,
  add column if not exists equipment_summary text,
  add column if not exists hygiene_measures text;

alter table public.products
  add column if not exists local_name text,
  add column if not exists brand_name text,
  add column if not exists product_code text,
  add column if not exists batch_number text,
  add column if not exists annual_production_volume text,
  add column if not exists unit_price numeric(12,2),
  add column if not exists currency text default 'USD',
  add column if not exists target_market text,
  add column if not exists packaging_description text,
  add column if not exists shelf_life text,
  add column if not exists quality_standard_claimed text,
  add column if not exists environmental_impact text,
  add column if not exists safety_information text;

alter table public.certification_requests
  add column if not exists request_number text unique,
  add column if not exists priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  add column if not exists risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high')),
  add column if not exists assigned_admin_id uuid references public.profiles(id) on delete set null,
  add column if not exists document_checklist jsonb not null default '{}'::jsonb,
  add column if not exists missing_documents text[],
  add column if not exists ministry_reference text;

alter table public.request_documents
  add column if not exists document_number text,
  add column if not exists issued_by text,
  add column if not exists issued_at date,
  add column if not exists expires_at date,
  add column if not exists checksum text;

alter table public.inspection_missions
  add column if not exists mission_number text unique,
  add column if not exists visit_type text not null default 'initial' check (visit_type in ('initial', 'follow_up', 'surprise', 'renewal')),
  add column if not exists expected_duration_minutes int,
  add column if not exists safety_notes text;

alter table public.inspection_reports
  add column if not exists hygiene_score int check (hygiene_score between 0 and 100),
  add column if not exists traceability_score int check (traceability_score between 0 and 100),
  add column if not exists production_score int check (production_score between 0 and 100),
  add column if not exists corrective_actions text,
  add column if not exists next_visit_recommended boolean default false;

alter table public.lab_tests
  add column if not exists sample_reference text,
  add column if not exists sample_received_at timestamptz,
  add column if not exists test_method text,
  add column if not exists unit text,
  add column if not exists threshold_value text,
  add column if not exists performed_at timestamptz,
  add column if not exists validated_by uuid references public.profiles(id) on delete set null,
  add column if not exists validated_at timestamptz;

alter table public.payment_transactions
  add column if not exists invoice_number text unique,
  add column if not exists payer_name text,
  add column if not exists payer_phone text,
  add column if not exists receipt_path text;

alter table public.certificates
  add column if not exists issuing_authority text not null default 'Ministere des PME',
  add column if not exists signed_by_name text,
  add column if not exists signed_by_title text,
  add column if not exists legal_basis text,
  add column if not exists renewal_of_certificate_id uuid references public.certificates(id) on delete set null;

create table if not exists public.ministry_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.document_requirements (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  document_type text not null,
  description text,
  is_required boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category, document_type)
);

create table if not exists public.certification_rules (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  rule_code text not null,
  title text not null,
  description text not null,
  severity text not null default 'major' check (severity in ('minor', 'major', 'critical')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category, rule_code)
);

create table if not exists public.admin_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.certification_requests(id) on delete cascade,
  decision text not null check (decision in ('request_documents', 'approve_payment', 'approve_certification', 'reject', 'suspend', 'revoke', 'expire')),
  decided_by uuid references public.profiles(id) on delete set null,
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.ministry_settings enable row level security;
alter table public.document_requirements enable row level security;
alter table public.certification_rules enable row level security;
alter table public.admin_decisions enable row level security;

drop policy if exists "settings admin read" on public.ministry_settings;
create policy "settings admin read" on public.ministry_settings for select using (public.is_admin());
drop policy if exists "settings admin write" on public.ministry_settings;
create policy "settings admin write" on public.ministry_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "requirements authenticated read" on public.document_requirements;
create policy "requirements authenticated read" on public.document_requirements for select to authenticated using (is_active = true or public.is_admin());
drop policy if exists "requirements admin write" on public.document_requirements;
create policy "requirements admin write" on public.document_requirements for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rules authenticated read" on public.certification_rules;
create policy "rules authenticated read" on public.certification_rules for select to authenticated using (is_active = true or public.is_admin());
drop policy if exists "rules admin write" on public.certification_rules;
create policy "rules admin write" on public.certification_rules for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "decisions request access read" on public.admin_decisions;
create policy "decisions request access read" on public.admin_decisions for select using (public.can_access_request(request_id));
drop policy if exists "decisions admin insert" on public.admin_decisions;
create policy "decisions admin insert" on public.admin_decisions for insert with check (public.is_admin());

create index if not exists artisan_profiles_province_idx on public.artisan_profiles(province);
create index if not exists workshops_province_idx on public.workshops(province);
create index if not exists products_category_idx on public.products(category);
create index if not exists requests_priority_idx on public.certification_requests(priority, risk_level);
create index if not exists requests_number_idx on public.certification_requests(request_number);
create index if not exists admin_decisions_request_idx on public.admin_decisions(request_id, created_at desc);

insert into public.ministry_settings (setting_key, setting_value, description) values
  ('institution', '{"name":"Ministere des PME et Artisanat","agency":"Agence Nationale de Certification Artisanale","country":"Republique Democratique du Congo","capital":"Kinshasa","currency":"USD"}', 'Identite institutionnelle'),
  ('certification_fee', '{"amount":50,"currency":"USD"}', 'Frais de certification par defaut'),
  ('certificate_validity_months', '24', 'Duree de validite standard')
on conflict (setting_key) do update set setting_value = excluded.setting_value, updated_at = now();

insert into public.document_requirements (category, document_type, description) values
  ('general', 'identity_document', 'Piece d identite du responsable'),
  ('general', 'workshop_registration', 'Preuve d existence de l atelier'),
  ('general', 'technical_sheet', 'Fiche technique du produit'),
  ('agro-artisanal', 'hygiene_certificate', 'Attestation ou note sur les mesures d hygiene'),
  ('textile', 'raw_material_origin', 'Justificatif d origine des matieres premieres')
on conflict (category, document_type) do nothing;

insert into public.certification_rules (category, rule_code, title, description, severity) values
  ('general', 'TRACE-001', 'Tracabilite minimale', 'Le produit doit disposer d une description claire des matieres premieres et du procede.', 'major'),
  ('general', 'DOC-001', 'Dossier documentaire complet', 'Toutes les pieces obligatoires doivent etre fournies et verifiees.', 'critical'),
  ('agro-artisanal', 'HYG-001', 'Mesures d hygiene', 'Les conditions de production doivent respecter les exigences d hygiene applicables.', 'critical')
on conflict (category, rule_code) do nothing;
