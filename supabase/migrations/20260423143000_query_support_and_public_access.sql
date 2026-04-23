-- Support des requetes imbriquees utilisees par les dashboards artisan/admin.
-- Ces contraintes rendent les relations PostgREST explicites si la base cloud a ete creee partiellement.

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'artisan_profiles_user_id_fkey'
      and conrelid = 'public.artisan_profiles'::regclass
  ) then
    alter table public.artisan_profiles
      add constraint artisan_profiles_user_id_fkey
      foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'certification_requests_product_id_fkey'
      and conrelid = 'public.certification_requests'::regclass
  ) then
    alter table public.certification_requests
      add constraint certification_requests_product_id_fkey
      foreign key (product_id) references public.products(id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'payment_transactions_request_id_fkey'
      and conrelid = 'public.payment_transactions'::regclass
  ) then
    alter table public.payment_transactions
      add constraint payment_transactions_request_id_fkey
      foreign key (request_id) references public.certification_requests(id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'certificates_product_id_fkey'
      and conrelid = 'public.certificates'::regclass
  ) then
    alter table public.certificates
      add constraint certificates_product_id_fkey
      foreign key (product_id) references public.products(id) on delete cascade;
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.public_certificate_verification to anon, authenticated;

drop policy if exists "public verification logs anon insert" on public.public_verification_logs;
create policy "public verification logs anon insert"
on public.public_verification_logs for insert to anon, authenticated
with check (true);

drop policy if exists "certificates public pdf read" on storage.objects;
create policy "certificates public pdf read"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'certificates'
  and exists (
    select 1
    from public.certificates c
    where c.pdf_path = storage.objects.name
      and c.status = 'valid'
  )
);

drop policy if exists "certificate service role write" on storage.objects;
create policy "certificate service role write"
on storage.objects for all to authenticated
using (bucket_id = 'certificates' and public.is_admin())
with check (bucket_id = 'certificates' and public.is_admin());

create index if not exists artisan_profiles_user_id_idx on public.artisan_profiles(user_id);
create index if not exists payment_transactions_request_idx on public.payment_transactions(request_id);
create index if not exists certificates_product_idx on public.certificates(product_id);
