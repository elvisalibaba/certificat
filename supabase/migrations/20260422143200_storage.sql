insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('product-images', 'product-images', false, 10485760, array['image/png','image/jpeg','image/webp']),
  ('product-videos', 'product-videos', false, 104857600, array['video/mp4','video/webm']),
  ('documents', 'documents', false, 20971520, array['application/pdf','image/png','image/jpeg','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('certificates', 'certificates', false, 10485760, array['application/pdf','image/png']),
  ('inspection-media', 'inspection-media', false, 20971520, array['image/png','image/jpeg','image/webp']),
  ('lab-reports', 'lab-reports', false, 20971520, array['application/pdf','image/png','image/jpeg'])
on conflict (id) do nothing;

create policy "artisan product image uploads" on storage.objects for insert to authenticated with check (
  bucket_id in ('product-images','product-videos','documents')
  and split_part(name, '/', 1) = 'artisan'
  and split_part(name, '/', 2) = auth.uid()::text
);

create policy "artisan own storage read" on storage.objects for select to authenticated using (
  (
    bucket_id in ('product-images','product-videos','documents')
    and split_part(name, '/', 1) = 'artisan'
    and split_part(name, '/', 2) = auth.uid()::text
  )
  or public.is_admin()
);

create policy "inspection assigned storage" on storage.objects for all to authenticated using (
  bucket_id = 'inspection-media'
  and (
    public.is_admin()
    or exists(select 1 from public.inspection_missions m where m.id::text = split_part(name, '/', 2) and m.inspector_id = auth.uid())
  )
) with check (
  bucket_id = 'inspection-media'
  and (
    public.is_admin()
    or exists(select 1 from public.inspection_missions m where m.id::text = split_part(name, '/', 2) and m.inspector_id = auth.uid())
  )
);

create policy "lab assigned storage" on storage.objects for all to authenticated using (
  bucket_id = 'lab-reports'
  and (
    public.is_admin()
    or exists(select 1 from public.lab_tests lt where lt.id::text = split_part(name, '/', 2) and lt.lab_agent_id = auth.uid())
  )
) with check (
  bucket_id = 'lab-reports'
  and (
    public.is_admin()
    or exists(select 1 from public.lab_tests lt where lt.id::text = split_part(name, '/', 2) and lt.lab_agent_id = auth.uid())
  )
);

create policy "certificate owner admin read" on storage.objects for select to authenticated using (
  bucket_id = 'certificates'
  and (
    public.is_admin()
    or exists(select 1 from public.certificates c where c.id::text = split_part(name, '/', 2) and c.artisan_id = auth.uid())
  )
);

create policy "certificate admin write" on storage.objects for all to authenticated using (
  bucket_id = 'certificates' and public.is_admin()
) with check (
  bucket_id = 'certificates' and public.is_admin()
);
