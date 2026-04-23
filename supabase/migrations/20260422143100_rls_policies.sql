alter table public.profiles enable row level security;
alter table public.artisan_profiles enable row level security;
alter table public.workshops enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.certification_requests enable row level security;
alter table public.request_status_history enable row level security;
alter table public.request_documents enable row level security;
alter table public.inspection_missions enable row level security;
alter table public.inspection_reports enable row level security;
alter table public.lab_tests enable row level security;
alter table public.lab_attachments enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.certificates enable row level security;
alter table public.qr_records enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.public_verification_logs enable row level security;

create policy "profiles own or admin read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "artisan profile own admin" on public.artisan_profiles for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "workshops own admin" on public.workshops for all using (artisan_id = auth.uid() or public.is_admin()) with check (artisan_id = auth.uid() or public.is_admin());
create policy "categories read authenticated" on public.product_categories for select to authenticated using (true);
create policy "categories admin write" on public.product_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "products role read" on public.products for select using (
  artisan_id = auth.uid()
  or public.is_admin()
  or exists(select 1 from public.inspection_missions m join public.certification_requests r on r.id = m.request_id where r.product_id = products.id and m.inspector_id = auth.uid())
  or exists(select 1 from public.lab_tests lt where lt.product_id = products.id and lt.lab_agent_id = auth.uid())
);
create policy "products artisan insert" on public.products for insert with check (artisan_id = auth.uid());
create policy "products artisan update draft" on public.products for update using (artisan_id = auth.uid() or public.is_admin()) with check (artisan_id = auth.uid() or public.is_admin());

create policy "product media accessible" on public.product_media for select using (artisan_id = auth.uid() or public.is_admin() or public.owns_product(product_id));
create policy "product media owner write" on public.product_media for insert with check (artisan_id = auth.uid() or public.is_admin());
create policy "product media owner update" on public.product_media for update using (artisan_id = auth.uid() or public.is_admin()) with check (artisan_id = auth.uid() or public.is_admin());

create policy "requests role read" on public.certification_requests for select using (public.can_access_request(id));
create policy "requests artisan insert" on public.certification_requests for insert with check (artisan_id = auth.uid() and public.owns_product(product_id));
create policy "requests artisan admin update" on public.certification_requests for update using (artisan_id = auth.uid() or public.is_admin()) with check (artisan_id = auth.uid() or public.is_admin());

create policy "history request access read" on public.request_status_history for select using (public.can_access_request(request_id));
create policy "history authenticated insert" on public.request_status_history for insert with check (public.can_access_request(request_id));

create policy "documents request access read" on public.request_documents for select using (public.can_access_request(request_id));
create policy "documents artisan write" on public.request_documents for insert with check (artisan_id = auth.uid() or public.is_admin());
create policy "documents admin verify" on public.request_documents for update using (artisan_id = auth.uid() or public.is_admin()) with check (artisan_id = auth.uid() or public.is_admin());

create policy "missions assigned or admin read" on public.inspection_missions for select using (inspector_id = auth.uid() or public.is_admin());
create policy "missions admin write" on public.inspection_missions for all using (public.is_admin()) with check (public.is_admin());

create policy "reports assigned or admin read" on public.inspection_reports for select using (inspector_id = auth.uid() or public.is_admin());
create policy "reports assigned insert" on public.inspection_reports for insert with check (inspector_id = auth.uid() or public.is_admin());
create policy "reports assigned update" on public.inspection_reports for update using (inspector_id = auth.uid() or public.is_admin()) with check (inspector_id = auth.uid() or public.is_admin());

create policy "lab assigned admin read" on public.lab_tests for select using (lab_agent_id = auth.uid() or public.is_admin());
create policy "lab admin insert" on public.lab_tests for insert with check (public.is_admin());
create policy "lab assigned update" on public.lab_tests for update using (lab_agent_id = auth.uid() or public.is_admin()) with check (lab_agent_id = auth.uid() or public.is_admin());

create policy "lab attachments read" on public.lab_attachments for select using (
  public.is_admin() or exists(select 1 from public.lab_tests lt where lt.id = lab_attachments.lab_test_id and lt.lab_agent_id = auth.uid())
);
create policy "lab attachments write" on public.lab_attachments for insert with check (
  public.is_admin() or exists(select 1 from public.lab_tests lt where lt.id = lab_attachments.lab_test_id and lt.lab_agent_id = auth.uid())
);

create policy "payments own admin read" on public.payment_transactions for select using (artisan_id = auth.uid() or public.is_admin());
create policy "payments own create" on public.payment_transactions for insert with check (artisan_id = auth.uid() or public.is_admin());
create policy "payments admin update" on public.payment_transactions for update using (public.is_admin()) with check (public.is_admin());

create policy "certificates own admin read" on public.certificates for select using (artisan_id = auth.uid() or public.is_admin());
create policy "certificates admin write" on public.certificates for all using (public.is_admin()) with check (public.is_admin());

create policy "qr own admin read" on public.qr_records for select using (
  public.is_admin() or exists(select 1 from public.certificates c where c.id = qr_records.certificate_id and c.artisan_id = auth.uid())
);
create policy "qr admin write" on public.qr_records for all using (public.is_admin()) with check (public.is_admin());

create policy "notifications own" on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications own update" on public.notifications for update using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "notifications admin insert" on public.notifications for insert with check (public.is_admin());

create policy "audit admin read" on public.audit_logs for select using (public.is_admin());
create policy "audit authenticated insert" on public.audit_logs for insert with check (auth.uid() is not null);
create policy "public verification insert" on public.public_verification_logs for insert with check (true);

grant select on public.public_certificate_verification to anon, authenticated;
