drop policy if exists "profiles self insert" on public.profiles;

create policy "profiles self insert"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());
